
const request = require("supertest");
const { app, server, closeServer } = require("../../index");
const { Interviewer } = require("../../models");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
jest.mock('sequelize');

// Mock Interviewer model
jest.mock("../../models", () => ({
    sequelize: {
        authenticate: jest.fn(),
        sync: jest.fn().mockResolvedValue(),
        define: jest.fn(),
    },
    Interviewer: {
        create: jest.fn(),
        findOne: jest.fn(),
    },
}));

describe("Auth Routes", () => {

    afterEach(() => {
        jest.clearAllMocks();
    });

    beforeAll(() => {
        testServer = app.listen(3001);
    });

    afterAll(() => {
        testServer.close();
        closeServer();
    });

    describe("POST /signup", () => {
        it("should register a new user", async () => {
            const mockUser = { id: 1, name: "John Doe", email: "john@example.com", password: "hashedpassword", designation: "Manager", business_area_id: "123e4567-e89b-12d3-a456-426614174000", employee_id: "EMP123" };
            Interviewer.create.mockResolvedValue(mockUser);
            bcrypt.hash = jest.fn().mockResolvedValue("hashedpassword");

            const res = await request(testServer)
                .post("/api/auth/signup")
                .send({ name: "John Doe", email: "john@example.com", password: "password", designation: "Manager", business_area_id: "123e4567-e89b-12d3-a456-426614174000", employee_id: "EMP123" });

            expect(res.statusCode).toBe(201);
            expect(res.body.message).toBe("User registered successfully");
            expect(Interviewer.create).toHaveBeenCalledWith(expect.objectContaining({ name: "John Doe", email: "john@example.com" }));
        });

        it("should return 400 if validation fails", async () => {
            const res = await request(testServer)
                .post("/api/auth/signup")
                .send({ name: "", email: "invalidemail", password: "123", employee_id: "" }); // Invalid payload

            expect(res.statusCode).toBe(400);
            expect(res.body.errors).toBeDefined();
        });

        it("should return 400 if user already exists", async () => {
            Interviewer.findOne.mockResolvedValue({ id: 1, email: "john@example.com" });

            const res = await request(testServer)
                .post("/api/auth/signup")
                .send({ name: "John Doe", email: "john@example.com", password: "password", designation: "Manager", business_area_id: "123e4567-e89b-12d3-a456-426614174000", employee_id: "EMP123" });

            expect(res.statusCode).toBe(400);
            expect(res.body.message).toBe("User already exists with this email");
        });
    });

    describe("POST /login", () => {
        it("should login a user", async () => {
            const mockUser = { id: 1, name: "John Doe", email: "john@example.com", password: "hashedpassword" };
            Interviewer.findOne.mockResolvedValue(mockUser);
            bcrypt.compare = jest.fn().mockResolvedValue(true);
            jwt.sign = jest.fn().mockReturnValue("token");

            const res = await request(testServer)
                .post("/api/auth/login")
                .send({ email: "john@example.com", password: "password" });

            expect(res.statusCode).toBe(200);
            expect(res.body.message).toBe("Login successful");
            expect(res.body.token).toBe("token");
        });

        it("should return 400 if validation fails", async () => {
            const res = await request(testServer)
                .post("/api/auth/login")
                .send({ email: "invalidemail", password: "" }); // Invalid payload

            expect(res.statusCode).toBe(400);
            expect(res.body.errors).toBeDefined();
        });

        it("should return 400 if credentials are invalid", async () => {
            Interviewer.findOne.mockResolvedValue(null);

            const res = await request(testServer)
                .post("/api/auth/login")
                .send({ email: "john@example.com", password: "password" });

            expect(res.statusCode).toBe(400);
            expect(res.body.message).toBe("Invalid credentials");
        });
    });

    describe("POST /logout", () => {
        it("should logout a user", async () => {
            const res = await request(testServer).post("/api/auth/logout");

            expect(res.statusCode).toBe(200);
            expect(res.body.message).toBe("Logout successful");
        });
    });
});
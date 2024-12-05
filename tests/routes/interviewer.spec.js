const request = require("supertest");
const { app, server, closeServer } = require("../../index");
const { Interviewer } = require("../../models");
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
        findAll: jest.fn(),
        findByPk: jest.fn(),
    },
}));

describe("Interviewer Routes", () => {

    afterEach(() => {
        jest.clearAllMocks();
    });

    beforeAll(() => {
        testServer = app.listen(3005);
    });

    afterAll(() => {
        testServer.close();
        closeServer();
    });

    describe("POST /interviewers", () => {
        it("should create a new interviewer", async () => {
            const mockInterviewer = { name: "John Doe", email: "john@example.com", designation: "Manager", business_area_id: "123e4567-e89b-12d3-a456-426614174000" };
            Interviewer.create.mockResolvedValue(mockInterviewer);

            const res = await request(testServer)
                .post("/api/interviewers")
                .send(mockInterviewer);

            expect(res.statusCode).toBe(201);
            expect(res.body.message).toBe("Interviewer created successfully");
            expect(Interviewer.create).toHaveBeenCalledWith(mockInterviewer);
        });

        it("should return 400 if validation fails", async () => {
            const res = await request(testServer)
                .post("/api/interviewers")
                .send({ name: "" }); // Invalid payload

            expect(res.statusCode).toBe(400);
            expect(res.body.error).toBe('"name" is not allowed to be empty');
        });
    });

    describe("GET /interviewers", () => {
        it("should return all interviewers", async () => {
            const mockInterviewers = [{ id: 1, name: "John Doe", email: "john@example.com", designation: "Manager", business_area_id: "123e4567-e89b-12d3-a456-426614174000" }];
            Interviewer.findAll.mockResolvedValue(mockInterviewers);

            const res = await request(testServer).get("/api/interviewers");

            expect(res.statusCode).toBe(200);
            expect(res.body).toEqual(mockInterviewers);
        });
    });

    describe("GET /interviewers/:id", () => {
        it("should return an interviewer by ID", async () => {
            const mockInterviewer = { id: 1, name: "John Doe", email: "john@example.com", designation: "Manager", business_area_id: "123e4567-e89b-12d3-a456-426614174000" };
            Interviewer.findByPk.mockResolvedValue(mockInterviewer);

            const res = await request(testServer).get("/api/interviewers/1");

            expect(res.statusCode).toBe(200);
            expect(res.body).toEqual(mockInterviewer);
        });

        it("should return 404 if interviewer not found", async () => {
            Interviewer.findByPk.mockResolvedValue(null);

            const res = await request(testServer).get("/api/interviewers/999");

            expect(res.statusCode).toBe(404);
            expect(res.body.message).toBe("Interviewer not found");
        });
    });

    describe("PUT /interviewers/:id", () => {
        it("should update an interviewer by ID", async () => {
            const mockInterviewer = { name: "John Doe", email: "john@example.com", designation: "Manager", business_area_id: "123e4567-e89b-12d3-a456-426614174000" };
            Interviewer.findByPk.mockResolvedValue(mockInterviewer);
            mockInterviewer.update = jest.fn().mockResolvedValue(mockInterviewer);

            const res = await request(testServer)
                .put("/api/interviewers/1")
                .send({
                    name: "Jane Doe",
                    email: "jane@example.com",
                    designation: "Manager",
                    business_area_id: "123e4567-e89b-12d3-a456-426614174000"
                });

            expect(res.statusCode).toBe(200);
            expect(res.body.message).toBe("Interviewer updated successfully");
        });

        it("should return 404 if interviewer not found", async () => {
            Interviewer.findByPk.mockResolvedValue(null);

            const res = await request(testServer)
                .put("/api/interviewers/999")
                .send({
                    name: "Jane Doe",
                    email: "jane@example.com",
                    designation: "Manager",
                    business_area_id: "123e4567-e89b-12d3-a456-426614174000"

                });

            expect(res.statusCode).toBe(404);
            expect(res.body.message).toBe("Interviewer not found");
        });
    });

    describe("DELETE /interviewers/:id", () => {
        it("should delete an interviewer by ID", async () => {
            const mockInterviewer = { id: 1, name: "John Doe", email: "john@example.com", designation: "Manager", business_area_id: "123e4567-e89b-12d3-a456-426614174000" };
            Interviewer.findByPk.mockResolvedValue(mockInterviewer);
            mockInterviewer.destroy = jest.fn().mockResolvedValue();

            const res = await request(testServer).delete("/api/interviewers/1");

            expect(res.statusCode).toBe(200);
            expect(res.body.message).toBe("Interviewer deleted successfully");
        });

        it("should return 404 if interviewer not found", async () => {
            Interviewer.findByPk.mockResolvedValue(null);

            const res = await request(testServer).delete("/api/interviewers/999");

            expect(res.statusCode).toBe(404);
            expect(res.body.message).toBe("Interviewer not found");
        });
    });
});

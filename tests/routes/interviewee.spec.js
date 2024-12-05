const request = require("supertest");
const { app, server, closeServer } = require("../../index");
const { Interviewee } = require("../../models");
jest.mock('sequelize');

// Mock Interviewee model
jest.mock("../../models", () => ({
    sequelize: {
        authenticate: jest.fn(),
        sync: jest.fn().mockResolvedValue(),
        define: jest.fn(),
    },
    Interviewee: {
        create: jest.fn(),
        findAll: jest.fn(),
        findByPk: jest.fn(),
    },
}));

describe("Interviewee Routes", () => {

    afterEach(() => {
        jest.clearAllMocks();
    });

    beforeAll(() => {
        testServer = app.listen(3004);
    });

    afterAll(() => {
        testServer.close();
        closeServer();
    });

    describe("POST /interviewees", () => {
        it("should create a new interviewee", async () => {
            const mockInterviewee = { name: "Jane Doe", email: "jane@example.com", resume: "resume.pdf", comments: "No comments" };
            Interviewee.create.mockResolvedValue(mockInterviewee);

            const res = await request(testServer)
                .post("/api/interviewees")
                .send(mockInterviewee);

            expect(res.statusCode).toBe(201);
            expect(res.body.message).toBe("Interviewee created successfully");
            expect(Interviewee.create).toHaveBeenCalledWith(mockInterviewee);
        });

        it("should return 400 if validation fails", async () => {
            const res = await request(testServer)
                .post("/api/interviewees")
                .send({ name: "" }); // Invalid payload

            expect(res.statusCode).toBe(400);
            expect(res.body.error).toBe('"name" is not allowed to be empty');
        });
    });

    describe("GET /interviewees", () => {
        it("should return all interviewees", async () => {
            const mockInterviewees = [{ id: 1, name: "Jane Doe", email: "jane@example.com", resume: "resume.pdf", comments: "No comments" }];
            Interviewee.findAll.mockResolvedValue(mockInterviewees);

            const res = await request(testServer).get("/api/interviewees");

            expect(res.statusCode).toBe(200);
            expect(res.body).toEqual(mockInterviewees);
        });
    });

    describe("GET /interviewees/:id", () => {
        it("should return an interviewee by ID", async () => {
            const mockInterviewee = { id: 1, name: "Jane Doe", email: "jane@example.com", resume: "resume.pdf", comments: "No comments" };
            Interviewee.findByPk.mockResolvedValue(mockInterviewee);

            const res = await request(testServer).get("/api/interviewees/1");

            expect(res.statusCode).toBe(200);
            expect(res.body).toEqual(mockInterviewee);
        });

        it("should return 404 if interviewee not found", async () => {
            Interviewee.findByPk.mockResolvedValue(null);

            const res = await request(testServer).get("/api/interviewees/999");

            expect(res.statusCode).toBe(404);
            expect(res.body.message).toBe("Interviewee not found");
        });
    });

    describe("PUT /interviewees/:id", () => {
        it("should update an interviewee by ID", async () => {
            const mockInterviewee = { name: "Jane Doe", email: "jane@example.com", resume: "resume.pdf", comments: "No comments" };
            Interviewee.findByPk.mockResolvedValue(mockInterviewee);
            mockInterviewee.update = jest.fn().mockResolvedValue(mockInterviewee);

            const res = await request(testServer)
                .put("/api/interviewees/1")
                .send({
                    name: "John Doe", email: "John@example.com",
                    resume: "resume.pdf",
                    comments: "No comments"
                });

            expect(res.statusCode).toBe(200);
            expect(res.body.message).toBe("Interviewee updated successfully");
        });

        it("should return 404 if interviewee not found", async () => {
            Interviewee.findByPk.mockResolvedValue(null);

            const res = await request(testServer)
                .put("/api/interviewees/999")
                .send({
                    name: "John Doe",
                    email: "John@example.com",
                    resume: "resume.pdf",
                    comments: "No comments"
                });

            expect(res.statusCode).toBe(404);
            expect(res.body.message).toBe("Interviewee not found");
        });
    });

    describe("DELETE /interviewees/:id", () => {
        it("should delete an interviewee by ID", async () => {
            const mockInterviewee = { id: 1, name: "Jane Doe", email: "jane@example.com", resume: "resume.pdf", comments: "No comments" };
            Interviewee.findByPk.mockResolvedValue(mockInterviewee);
            mockInterviewee.destroy = jest.fn().mockResolvedValue();

            const res = await request(testServer).delete("/api/interviewees/1");

            expect(res.statusCode).toBe(200);
            expect(res.body.message).toBe("Interviewee deleted successfully");
        });

        it("should return 404 if interviewee not found", async () => {
            Interviewee.findByPk.mockResolvedValue(null);

            const res = await request(testServer).delete("/api/interviewees/999");

            expect(res.statusCode).toBe(404);
            expect(res.body.message).toBe("Interviewee not found");
        });
    });
});

const request = require("supertest");
const { app, server, closeServer } = require("../../index");
const { Job } = require("../../models");
jest.mock('sequelize');

// Mock Job model
jest.mock("../../models", () => ({
    sequelize: {
        authenticate: jest.fn(),
        sync: jest.fn().mockResolvedValue(),
        define: jest.fn(),
    },
    Job: {
        create: jest.fn(),
        findAll: jest.fn(),
        findByPk: jest.fn(),
    },
}));

describe("Job Routes", () => {

    afterEach(() => {
        jest.clearAllMocks();
    });

    beforeAll(() => {
        testServer = app.listen(3999);
    });

    afterAll(() => {
        testServer.close();
        closeServer();
    });

    describe("POST /jobs", () => {
        it("should create a new job", async () => {
            const mockJob = { id: 1, title: "Developer", description: "Writes code" };
            Job.create.mockResolvedValue(mockJob);

            const res = await request(testServer)
                .post("/api/jobs")
                .send({ title: "Developer", description: "Writes code" });

            expect(res.statusCode).toBe(201);
            expect(res.body.message).toBe("Job created successfully");
            expect(Job.create).toHaveBeenCalledWith({
                title: "Developer",
                description: "Writes code",
            });
        });

        it("should return 400 if validation fails", async () => {
            const res = await request(testServer)
                .post("/api/jobs")
                .send({ title: "" }); // Invalid payload

            expect(res.statusCode).toBe(400);
            expect(res.body.error).toBe('"title" is not allowed to be empty');
        });
    });

    describe("GET /jobs", () => {
        it("should return all jobs", async () => {
            const mockJobs = [{ id: 1, title: "Developer", description: "Writes code" }];
            Job.findAll.mockResolvedValue(mockJobs);

            const res = await request(testServer).get("/api/jobs");

            expect(res.statusCode).toBe(200);
            expect(res.body).toEqual(mockJobs);
        });
    });

    describe("GET /jobs/:id", () => {
        it("should return a job by ID", async () => {
            const mockJob = { id: 1, title: "Developer", description: "Writes code" };
            Job.findByPk.mockResolvedValue(mockJob);

            const res = await request(testServer).get("/api/jobs/1");

            expect(res.statusCode).toBe(200);
            expect(res.body).toEqual(mockJob);
        });

        it("should return 404 if job not found", async () => {
            Job.findByPk.mockResolvedValue(null);

            const res = await request(testServer).get("/api/jobs/999");

            expect(res.statusCode).toBe(404);
            expect(res.body.message).toBe("Job not found");
        });
    });

    describe("PUT /jobs/:id", () => {
        it("should update a job by ID", async () => {
            const mockJob = { id: 1, title: "Developer", description: "Writes code" };
            Job.findByPk.mockResolvedValue(mockJob);
            mockJob.update = jest.fn().mockResolvedValue(mockJob);

            const res = await request(testServer)
                .put("/api/jobs/1")
                .send({ title: "Senior Developer", description: "Leads team" });

            expect(res.statusCode).toBe(200);
            expect(res.body.message).toBe("Job updated successfully");
        });

        it("should return 404 if job not found", async () => {
            Job.findByPk.mockResolvedValue(null);

            const res = await request(testServer)
                .put("/api/jobs/999")
                .send({ title: "Senior Developer" });

            expect(res.statusCode).toBe(404);
            expect(res.body.message).toBe("Job not found");
        });
    });

    describe("DELETE /jobs/:id", () => {
        it("should delete a job by ID", async () => {
            const mockJob = { id: 1, title: "Developer", description: "Writes code" };
            Job.findByPk.mockResolvedValue(mockJob);
            mockJob.destroy = jest.fn().mockResolvedValue();

            const res = await request(testServer).delete("/api/jobs/1");

            expect(res.statusCode).toBe(200);
            expect(res.body.message).toBe("Job deleted successfully");
        });

        it("should return 404 if job not found", async () => {
            Job.findByPk.mockResolvedValue(null);

            const res = await request(testServer).delete("/api/jobs/999");

            expect(res.statusCode).toBe(404);
            expect(res.body.message).toBe("Job not found");
        });
    });
});

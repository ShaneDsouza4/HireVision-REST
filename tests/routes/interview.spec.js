const request = require("supertest");
const { app, server, closeServer } = require("../../index");
const { Interview, Interviewer, Interviewee, Job, BusinessArea, Tag, InterviewTag } = require("../../models");
jest.mock('sequelize');

// Mock models
jest.mock("../../models", () => ({
    sequelize: {
        authenticate: jest.fn(),
        sync: jest.fn().mockResolvedValue(),
        define: jest.fn(),
    },
    Interview: {
        create: jest.fn(),
        findAll: jest.fn(),
        findByPk: jest.fn(),
    },
    Interviewer: {
        findAll: jest.fn(),
    },
    Interviewee: {
        findByPk: jest.fn(),
    },
    Job: {
        findByPk: jest.fn(),
    },
    BusinessArea: {
        findByPk: jest.fn(),
    },
    Tag: {
        findAll: jest.fn(),
    },
    InterviewTag: {
        findAll: jest.fn(),
    },
}));

describe("Interview Routes", () => {

    afterEach(() => {
        jest.clearAllMocks();
    });

    beforeAll(() => {
        testServer = app.listen(3003);
    });

    afterAll(() => {
        testServer.close();
        closeServer();
    });

    describe("POST /interviews", () => {
        it("should create a new interview", async () => {
            const mockInterview = { interviewer: ["123e4567-e89b-12d3-a456-426614174000"], date_time: "2023-10-10T10:00:00Z" };
            Interview.create.mockResolvedValue(mockInterview);

            const res = await request(testServer)
                .post("/api/interviews")
                .send(mockInterview);

            expect(res.statusCode).toBe(201);
            expect(res.body.message).toBe("Interview created successfully");
            expect(Interview.create).toHaveBeenCalledWith(mockInterview);
        });

        it("should return 400 if validation fails", async () => {
            const res = await request(testServer)
                .post("/api/interviews")
                .send({ date_time: "" }); // Invalid payload

            expect(res.statusCode).toBe(400);
            expect(res.body.error).toBe('\"interviewer\" is required');
        });
    });

    describe("GET /interviews", () => {
        it("should return all interviews", async () => {
            const mockInterviews = [{ id: 1, interviewer: ["123e4567-e89b-12d3-a456-426614174000"], date_time: "2023-10-10T10:00:00Z" }];
            Interview.findAll.mockResolvedValue(mockInterviews);

            const res = await request(testServer).get("/api/interviews");

            expect(res.statusCode).toBe(200);
            expect(res.body.interviews).toEqual(mockInterviews);
        });
    });

    describe("GET /interviews/:id", () => {
        it("should return an interview by ID", async () => {
            const mockInterview = { interviewer: ["123e4567-e89b-12d3-a456-426614174000"], date_time: "2023-10-10T10:00:00Z" };
            Interview.findByPk.mockResolvedValue({ dataValues: mockInterview });
            Interviewer.findAll.mockResolvedValue([{ id: "123e4567-e89b-12d3-a456-426614174000", name: "John Doe" }]);
            Interviewee.findByPk.mockResolvedValue({ id: "123e4567-e89b-12d3-a456-426614174000", name: "Jane Doe" });
            Job.findByPk.mockResolvedValue({ id: "123e4567-e89b-12d3-a456-426614174000", title: "Software Engineer" });
            BusinessArea.findByPk.mockResolvedValue({ id: "123e4567-e89b-12d3-a456-426614174000", name: "Finance" });
            InterviewTag.findAll.mockResolvedValue([{ tag_id: "123e4567-e89b-12d3-a456-426614174000" }]);
            Tag.findAll.mockResolvedValue([{ id: "123e4567-e89b-12d3-a456-426614174000", tag_name: "Technology" }]);

            const res = await request(testServer).get("/api/interviews/1");

            expect(res.statusCode).toBe(200);
            expect(res.body.interview).toEqual(expect.objectContaining({ dataValues: mockInterview }));
        });
    });

    describe("PUT /interviews/:id", () => {
        it("should update an interview by ID", async () => {
            const mockInterview = { id: 1, interviewer: ["123e4567-e89b-12d3-a456-426614174000"], date_time: "2023-10-10T10:00:00Z" };
            Interview.findByPk.mockResolvedValue(mockInterview);
            mockInterview.update = jest.fn().mockResolvedValue(mockInterview);

            const res = await request(testServer)
                .put("/api/interviews/1")
                .send({ date_time: "2023-10-11T10:00:00Z" });

            expect(res.statusCode).toBe(200);
            expect(res.body.message).toBe("Interview updated successfully");
        });

        it("should return 404 if interview not found", async () => {
            Interview.findByPk.mockResolvedValue(null);

            const res = await request(testServer)
                .put("/api/interviews/999")
                .send({ date_time: "2023-10-11T10:00:00Z" });

            expect(res.statusCode).toBe(404);
            expect(res.body.message).toBe("Interview not found");
        });
    });

    describe("DELETE /interviews/:id", () => {
        it("should delete an interview by ID", async () => {
            const mockInterview = { id: 1, interviewer: ["123e4567-e89b-12d3-a456-426614174000"], date_time: "2023-10-10T10:00:00Z" };
            Interview.findByPk.mockResolvedValue(mockInterview);
            mockInterview.destroy = jest.fn().mockResolvedValue();

            const res = await request(testServer).delete("/api/interviews/1");

            expect(res.statusCode).toBe(200);
            expect(res.body.message).toBe("Interview deleted successfully");
        });

        it("should return 404 if interview not found", async () => {
            Interview.findByPk.mockResolvedValue(null);

            const res = await request(testServer).delete("/api/interviews/999");

            expect(res.statusCode).toBe(404);
            expect(res.body.message).toBe("Interview not found");
        });
    });

    describe("POST /interviews/filteredInterview", () => {
        it("should return filtered interviews", async () => {
            const mockInterviews = [{ id: 1, interviewer: ["123e4567-e89b-12d3-a456-426614174000"], date_time: "2023-10-10T10:00:00Z" }];
            Interview.findAll.mockResolvedValue(mockInterviews);

            const res = await request(testServer)
                .post("/api/interviews/filteredInterview")
                .send({ from: "2023-10-01", to: "2023-10-31" });

            expect(res.statusCode).toBe(200);
            expect(res.body.interviews).toEqual(mockInterviews);
        });
    });
});

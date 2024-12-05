const request = require("supertest");
const { app, server, closeServer } = require("../../index");
const { Tag } = require("../../models");
jest.mock('sequelize');

// Mock Tag model
jest.mock("../../models", () => ({
    sequelize: {
        authenticate: jest.fn(),
        sync: jest.fn().mockResolvedValue(),
        define: jest.fn(),
    },
    Tag: {
        create: jest.fn(),
        findAll: jest.fn(),
        findByPk: jest.fn(),
    },
}));

describe("Tag Routes", () => {

    afterEach(() => {
        jest.clearAllMocks();
    });

    beforeAll(() => {
        testServer = app.listen(3007);
    });

    afterAll(() => {
        testServer.close();
        closeServer();
    });

    describe("POST /tags", () => {
        it("should create a new tag", async () => {
            const mockTag = { id: 1, tag_name: "Technology" };
            Tag.create.mockResolvedValue(mockTag);

            const res = await request(testServer)
                .post("/api/tags")
                .send({ tag_name: "Technology" });

            expect(res.statusCode).toBe(201);
            expect(res.body.message).toBe("Tag created successfully");
            expect(Tag.create).toHaveBeenCalledWith({
                tag_name: "Technology",
            });
        });

        it("should return 400 if validation fails", async () => {
            const res = await request(testServer)
                .post("/api/tags")
                .send({ tag_name: "" }); // Invalid payload

            expect(res.statusCode).toBe(400);
            expect(res.body.error).toBe('"tag_name" is not allowed to be empty');
        });
    });

    describe("GET /tags", () => {
        it("should return all tags", async () => {
            const mockTags = [{ id: 1, tag_name: "Technology" }];
            Tag.findAll.mockResolvedValue(mockTags);

            const res = await request(testServer).get("/api/tags");

            expect(res.statusCode).toBe(200);
            expect(res.body).toEqual(mockTags);
        });
    });

    describe("GET /tags/:id", () => {
        it("should return a tag by ID", async () => {
            const mockTag = { id: 1, tag_name: "Technology" };
            Tag.findByPk.mockResolvedValue(mockTag);

            const res = await request(testServer).get("/api/tags/1");

            expect(res.statusCode).toBe(200);
            expect(res.body).toEqual(mockTag);
        });

        it("should return 404 if tag not found", async () => {
            Tag.findByPk.mockResolvedValue(null);

            const res = await request(testServer).get("/api/tags/999");

            expect(res.statusCode).toBe(404);
            expect(res.body.message).toBe("Tag not found");
        });
    });

    describe("PUT /tags/:id", () => {
        it("should update a tag by ID", async () => {
            const mockTag = { id: 1, tag_name: "Technology" };
            Tag.findByPk.mockResolvedValue(mockTag);
            mockTag.update = jest.fn().mockResolvedValue(mockTag);

            const res = await request(testServer)
                .put("/api/tags/1")
                .send({ tag_name: "Science" });

            expect(res.statusCode).toBe(200);
            expect(res.body.message).toBe("Tag updated successfully");
        });

        it("should return 404 if tag not found", async () => {
            Tag.findByPk.mockResolvedValue(null);

            const res = await request(testServer)
                .put("/api/tags/999")
                .send({ tag_name: "Science" });

            expect(res.statusCode).toBe(404);
            expect(res.body.message).toBe("Tag not found");
        });
    });

    describe("DELETE /tags/:id", () => {
        it("should delete a tag by ID", async () => {
            const mockTag = { id: 1, tag_name: "Technology" };
            Tag.findByPk.mockResolvedValue(mockTag);
            mockTag.destroy = jest.fn().mockResolvedValue();

            const res = await request(testServer).delete("/api/tags/1");

            expect(res.statusCode).toBe(200);
            expect(res.body.message).toBe("Tag deleted successfully");
        });

        it("should return 404 if tag not found", async () => {
            Tag.findByPk.mockResolvedValue(null);

            const res = await request(testServer).delete("/api/tags/999");

            expect(res.statusCode).toBe(404);
            expect(res.body.message).toBe("Tag not found");
        });
    });
});

const request = require("supertest");
const { app, server, closeServer } = require("../../index");
const { BusinessArea } = require("../../models");
jest.mock('sequelize');

// Mock BusinessArea model
jest.mock("../../models", () => ({
    sequelize: {
        authenticate: jest.fn(),
        sync: jest.fn().mockResolvedValue(),
        define: jest.fn(),
    },
    BusinessArea: {
        create: jest.fn(),
        findAll: jest.fn(),
        findByPk: jest.fn(),
    },
}));

describe("BusinessArea Routes", () => {

    afterEach(() => {
        jest.clearAllMocks();
    });

    beforeAll(() => {
        testServer = app.listen(3002);
    });

    afterAll(() => {
        testServer.close();
        closeServer();
    });

    describe("POST /businessAreas", () => {
        it("should create a new business area", async () => {
            const mockBusinessArea = { id: 1, name: "Finance" };
            BusinessArea.create.mockResolvedValue(mockBusinessArea);

            const res = await request(testServer)
                .post("/api/businessAreas")
                .send({ name: "Finance" });

            expect(res.statusCode).toBe(201);
            expect(res.body.message).toBe("Business Area created successfully");
            expect(BusinessArea.create).toHaveBeenCalledWith({ name: "Finance" });
        });

        it("should return 400 if validation fails", async () => {
            const res = await request(testServer)
                .post("/api/businessAreas")
                .send({ name: "" }); // Invalid payload

            expect(res.statusCode).toBe(400);
            expect(res.body.error).toBe('"name" is not allowed to be empty');
        });
    });

    describe("GET /businessAreas", () => {
        it("should return all business areas", async () => {
            const mockBusinessAreas = [{ id: 1, name: "Finance" }];
            BusinessArea.findAll.mockResolvedValue(mockBusinessAreas);

            const res = await request(testServer).get("/api/businessAreas");

            expect(res.statusCode).toBe(200);
            expect(res.body).toEqual(mockBusinessAreas);
        });
    });

    describe("GET /businessAreas/:id", () => {
        it("should return a business area by ID", async () => {
            const mockBusinessArea = { id: 1, name: "Finance" };
            BusinessArea.findByPk.mockResolvedValue(mockBusinessArea);

            const res = await request(testServer).get("/api/businessAreas/1");

            expect(res.statusCode).toBe(200);
            expect(res.body.businessArea).toEqual(mockBusinessArea);
        });

        it("should return 404 if business area not found", async () => {
            BusinessArea.findByPk.mockResolvedValue(null);

            const res = await request(testServer).get("/api/businessAreas/999");

            expect(res.statusCode).toBe(404);
            expect(res.body.message).toBe("Business Area not found");
        });
    });

    describe("PUT /businessAreas/:id", () => {
        it("should update a business area by ID", async () => {
            const mockBusinessArea = { name: "Finance" };
            BusinessArea.findByPk.mockResolvedValue(mockBusinessArea);
            mockBusinessArea.update = jest.fn().mockResolvedValue(mockBusinessArea);

            const res = await request(testServer)
                .put("/api/businessAreas/1")
                .send({
                    name: "Human Resources",

                });

            expect(res.statusCode).toBe(200);
            expect(res.body.message).toBe("Business Area updated successfully");
        });

        it("should return 404 if business area not found", async () => {
            BusinessArea.findByPk.mockResolvedValue(null);

            const res = await request(testServer)
                .put("/api/businessAreas/999")
                .send({ name: "Human Resources" });

            expect(res.statusCode).toBe(404);
            expect(res.body.message).toBe("Business Area not found");
        });
    });

    describe("DELETE /businessAreas/:id", () => {
        it("should delete a business area by ID", async () => {
            const mockBusinessArea = { id: 1, name: "Finance" };
            BusinessArea.findByPk.mockResolvedValue(mockBusinessArea);
            mockBusinessArea.destroy = jest.fn().mockResolvedValue();

            const res = await request(testServer).delete("/api/businessAreas/1");

            expect(res.statusCode).toBe(200);
            expect(res.body.message).toBe("Business Area deleted successfully");
        });

        it("should return 404 if business area not found", async () => {
            BusinessArea.findByPk.mockResolvedValue(null);

            const res = await request(testServer).delete("/api/businessAreas/999");

            expect(res.statusCode).toBe(404);
            expect(res.body.message).toBe("Business Area not found");
        });
    });
});

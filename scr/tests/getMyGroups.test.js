const request = require("supertest");
const baseUrl = "http://localhost:8080";

describe("GET /group/get", () => {
    it("should return all groups", async () => {
            request(baseUrl)
            .get("/group/allGroups")
            .expect('Content-Type', /json/)
            .then( (res) => {
                expect(res.statusCode).toBe(200);
            })
    });
});
/*
describe("POST /api/product/create", () => {
    test("should create a product", async () => {
        return request(app)
            .post("/api/product/create")
            .set('Authorization', 'Bearer TOKEN')
            .send(reqaddProduct)
            .expect(201)
            .then(({body})=>{
            productId = body.data.productId
            })
    });
});*/
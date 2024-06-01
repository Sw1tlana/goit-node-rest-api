import 'dotenv/config';
import mongoose from 'mongoose';
import app from "../../app";
import  User from "../../models/users.js";
import supertest from 'supertest';

mongoose.set("strictQuery", false);
const DB_URI = process.env.DB_URI;

describe("Login", () => {
 beforeAll(async () => {
        try {
           await mongoose.connect(DB_URI);
        } catch (err) {
            process.exit(1);
        }
    });

    afterAll(async () => {
        await mongoose.disconnect();
    });

    test("Login succesful", async () => {
        const response = await supertest(app)
            .post("/users/login")
            .send({
               password: "2353465",
               email: "swer.in@gmail.com"
            });

        expect(response.statusCode).toBe(200);
        expect(response.body.token).toBeDefined();
        expect(response.body.user.email).toBe("swer.in@gmail.com");
    });

    test("Login unsuccessful", async () => {
        const response = await supertest(app)
            .post("/users/login")
            .send({
                password: "123534657",
                email: "swer.in@gmail.com"
            });
        expect(response.statusCode).toBe(401);
    });
});

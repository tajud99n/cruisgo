// Packages
const request = require("supertest");
const expect = require("expect");
const { ObjectID } = require("mongodb");


// Custom modules
const { app } = require("../../app");
const { seedCars, cars, categories } = require('../seeds/seed');
const { User } = require('../../models/user');


beforeEach(seedCars);

describe('feat/car', () => {
    let token;
    beforeEach(() => {
        const user = { _id: ObjectID().toHexString(), permissions: ["create", "read", "update", "delete"] };
        token = new User(user).generateAuthToken();
    });

    describe('GET: all cars', () => {
        it('should return all cars', (done) => {
            request(app)
                .get('/api/cars')
                .expect(200)
                .expect(res => {
                    expect(res.body[0]).toHaveProperty('name');
                })
                .end(done);
        });
    });

    describe('POST: create a car', () => {
        it('should create a new car when an authenticated user with permission to create try to create', (done) => {
            const car = {
                name: "Nissan",
                numberInStock: 5,
                dailyRentalRate: 40,
                categoryId: categories[1]._id.toHexString(),
                details: { brand: "Ford", model: "2015", color: "orange" }
            };

            request(app)
                .post('/api/cars')
                .set('x-auth-token', token)
                .send(car)
                .expect(201)
                .expect(res => {
                    expect(res.body).toHaveProperty('_id');
                    expect(res.body).toHaveProperty('name');
                    expect(res.body.details).toHaveProperty('color');
                })
                .end(done);
        });

        it('should return 400 if required fields are missing', (done) => {
            const car = {};

            request(app)
                .post('/api/cars')
                .set('x-auth-token', token)
                .send(car)
                .expect(400)
                .end(done);
        });

        it('should return 400 if category doesnt exist', (done) => {
            const car = {
                name: "Nissan",
                numberInStock: 5,
                dailyRentalRate: 40,
                categoryId: new ObjectID().toHexString(),
                details: { brand: "Ford", model: "2015", color: "orange" }
            };

            request(app)
                .post('/api/cars')
                .set('x-auth-token', token)
                .send(car)
                .expect(400)
                .end(done);
        });
        
        it('should return 400 if required fields are missing', (done) => {
            const car = {};

            request(app)
                .post('/api/cars')
                .set('x-auth-token', token)
                .send(car)
                .expect(400)
                .end(done);
        });
    });

    describe('GET:id car', () => {
        it('should return a car when given a valid Id', (done) => {
            request(app)
                .get(`/api/cars/${cars[0]._id.toHexString()}`)
                .set('x-auth-token', token)
                .expect(200)
                .expect(res => {
                    expect(res.body).toHaveProperty('_id');
                    expect(res.body._id).toBe(cars[0]._id.toHexString());
                    expect(res.body.category).toHaveProperty('name');
                })
                .end(done);
        });

        it('should return 400 when given an invalid Id', (done) => {
            request(app)
                .get('/api/cars/1234')
                .set('x-auth-token', token)
                .expect(400)
                .end(done);
        });
        
        it('should return 400 when given an valid Id that does not exist', (done) => {
            const Id = new ObjectID().toHexString();

            request(app)
                .get(`/api/cars/${Id}`)
                .set('x-auth-token', token)
                .expect(404)
                .end(done);
        });
    });

    describe('PUT:id car', () => {
        it('should update a car with a valid ObjectID', (done) => {

            request(app)
                .put(`/api/cars/${cars[0]._id.toHexString()}`)
                .set('x-auth-token', token)
                .send({name : "updatedCar"})
                .expect(204)
                .end(done);
        });
    });

    describe("DELETE:id car", () => {
        it("should delete a car", done => {

            request(app)
                .delete(`/api/cars/${cars[0]._id.toHexString()}`)
                .set('x-auth-token', token)
                .expect(202)
                .end(done);
        });

        it('should return a 404 if car is not found', done => {
            const carID = new ObjectID().toHexString();

            request(app)
                .delete(`/api/cars/${carID}`)
                .set('x-auth-token', token)
                .expect(404)
                .end(done);
        });

        it('should return a 404 if car id is not valid', done => {
            request(app)
                .delete('/api/cars/12345')
                .set('x-auth-token', token)
                .expect(404)
                .end(done);
        });
    });
});
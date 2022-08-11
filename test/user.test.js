const request = require('supertest');
const app = require('../app');
const mongoose = require('mongoose');
const User = require('../models/User');

const user1 = {
    email: 'preprod@gail.com',
    password: '123456'
}

beforeEach(async () => {
    await User.deleteMany({})
    await User(user1).save()
});

afterAll(done => {
    // Closing the DB connection allows Jest to exit successfully.
    mongoose.connection.close()
    done()
  })

test('should sign up User', async () => {
    await request(app).post('/api/user/register')
    .send({
        email: 'test@gmail.com',
        password: '123456'
    })
    .expect(201)
});

test('should login User', async () => {
    await request(app).post('/api/user/login')
    .send({
        email: user1.email,
        password: user1.password
    })
});




const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../DBexpressServer');

let server;

jest.setTimeout(20000); 

beforeAll(async () => {
    const MONGO_URI = 'mongodb+srv://ikmclassof22:test@cluster0.vtg6m.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';
    try {
        await mongoose.connect(MONGO_URI);
        console.log('Database connected successfully');
    } catch (err) {
        console.error('Database connection failed:', err);
        throw err; 
    }
    server = app.listen(0, () => {
        console.log(`Test server running on port ${server.address().port}`);
    }); 
});

afterAll(async () => {
    if (server && server.close) {
        await new Promise(resolve => server.close(resolve));
    }

    if (mongoose.connection.readyState === 1) {
        const collections = Object.keys(mongoose.connection.collections);
        for (const collection of collections) {
            await mongoose.connection.collections[collection].deleteMany({});
        }
        await mongoose.disconnect();
    }
});

describe('POST /', () => {
    it('should save content to a file, save data to MongoDB, and return the content', async () => {
        const response = await request(app)
            .post('/')
            .send({ content: 'Chicken on Me' })
            .set('Content-Type', 'application/json');
        expect(response.status).toBe(200);
        expect(response.text).toBe('Chicken on Me');
    });

    it('should return 400 if content field is missing', async () => {
        const response = await request(app)
            .post('/')
            .send({})
            .set('Content-Type', 'application/json');
        expect(response.status).toBe(400);
        expect(response.text).toBe('Content field is required');
    });
});
const request = require('supertest');
const fs = require('fs');
const mongoose = require('mongoose');
const app = require('../server');


const testFilePath = './content.txt';


beforeAll(async () => {
    const MONGO_URI = 'mongodb+srv://ikmclassof22:test@cluster0.vtg6m.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';
    await mongoose.connect(MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });
});


afterAll(async () => {
    if (fs.existsSync(testFilePath)) {
        fs.unlinkSync(testFilePath);
    }

    
    await mongoose.connection.db.dropDatabase();
    await mongoose.disconnect();
});

describe('POST /', () => {
    it('should save content to a file, save data to MongoDB, and return the content', async () => {
        const testContent = 'Hello from the test!';
        const requestBody = {
            content: testContent,
            extraField: 'Additional data for testing',
        };

        const response = await request(app)
            .post('/')
            .send(requestBody)
            .set('Content-Type', 'application/json');

        expect(response.status).toBe(200);
        expect(response.text).toBe(testContent);

        const fileContent = fs.readFileSync(testFilePath, 'utf-8');
        expect(fileContent).toBe(testContent);

        const savedData = await mongoose.connection.collection('datas').findOne({ content: testContent });
        expect(savedData).not.toBeNull();
        expect(savedData.content).toBe(testContent);
        expect(savedData.otherFields.extraField).toBe('Additional data for testing');
    });

    it('should return 400 if content field is missing', async () => {
        const response = await request(app)
            .post('/')
            .send({ extraField: 'No content provided' })
            .set('Content-Type', 'application/json');

        expect(response.status).toBe(400);
        expect(response.text).toBe('Content field is required');
    });
});
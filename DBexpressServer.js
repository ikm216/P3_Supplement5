/**
 * A simple Express server that handles GET and POST requests,
 * saves content to a file, and stores content in a MongoDB database.
 */

const express = require('express');
const fs = require('fs');
const { MongoClient } = require('mongodb');

const app = express();
app.use(express.json()); 

const uri = 'mongodb+srv://ikmclassof22:test@cluster0.vtg6m.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';
const client = new MongoClient(uri);
const dbName = 'testDatabase';
const collectionName = 'testCollection';

/**
 * GET /
 * Root endpoint that provides a welcome message.
 */
app.get('/', (req, res) => {
    res.send('Welcome to the DB Express Server! Use POST / to send content.');
});

/**
 * POST /
 * Endpoint to handle JSON content:
 * - Writes the content to a local file `content.txt`.
 * - Stores the content in a MongoDB database.
 *
 * @body {string} content - The content to be saved.
 * @returns {string} - The saved content or an error message.
 */
app.post('/', async (req, res) => {
    const { content } = req.body;

    if (!content) {
        return res.status(400).send('Content field is required');
    }

    fs.writeFileSync('content.txt', content);

    try {
        await client.connect();
        const db = client.db(dbName);
        const collection = db.collection(collectionName);

        await collection.insertOne({ content });

        res.send(content);
    } catch (err) {
        console.error('Database error:', err);
        res.status(500).send('Internal Server Error');
    } finally {
        await client.close();
    }
});


const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

module.exports = app;
// const express = require('express');
// const fs = require('fs');
// const { MongoClient } = require('mongodb');

// const app = express();
// app.use(express.json());


// const uri = 'mongodb+srv://ikmclassof22:test@cluster0.vtg6m.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';
// const client = new MongoClient(uri);
// const dbName = 'testDatabase';
// const collectionName = 'testCollection';

// app.get('/', (req, res) => {
//     res.send('Welcome to the DB Express Server! Use POST / to send content.');
// });


// app.post('/', async (req, res) => {
//     const { content } = req.body;

//     if (!content) {
//         return res.status(400).send('Content field is required');
//     }

    
//     fs.writeFileSync('content.txt', content);

//     try {
        
//         await client.connect();
//         const db = client.db(dbName);
//         const collection = db.collection(collectionName);
//         await collection.insertOne({ content });

//         res.send(content);
//     } catch (err) {
//         console.error('Database error:', err);
//         res.status(500).send('Internal Server Error');
//     } finally {
//         await client.close();
//     }
// });

// const PORT = 3000;
// app.listen(PORT, () => {
//     console.log(`Server is running on http://localhost:${PORT}`);
// });

// module.exports = app;
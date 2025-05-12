const express = require('express');
var cors = require('cors');
const app = express();
const port = 3000;

// These lines will be explained in detail later in the unit
app.use(express.json());// process json
app.use(express.urlencoded({ extended: true })); 
app.use(cors());
// These lines will be explained in detail later in the unit

const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb+srv://CQUpass:admin@cluster0.pvzye.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri);

// Global for general use
var collection;

async function connectDB() {
  
	try {
	  await client.connect();
	  console.log("Connected to MongoDB Atlas\n");

	  const db = client.db("myDatabase"); 
	  collection = db.collection("myCollection"); 
    } catch (error) {
	  console.error("MongoDB connection error:", error + "\n");
    }
}

connectDB();


app.get('/', (req, res) => {
  res.send('Hello World!');
})

 
app.get('/getData', async function (req, res) {
  
    console.log("GET request received");  
       
    try {
		const result = collection.find({});
		let docs = await result.toArray();
		console.log("Document(s) retrieved: " + JSON.stringify(docs) + " \n");
		res.status(200).send(docs);
	} catch (err) {
		res.status(500).json({ message: "Server error", error: err });
	}

});


app.post('/postData', async function (req, res) {
    
    console.log("POST request received : " + JSON.stringify(req.body)); 
    
	try {
        let result = await collection.insertOne(req.body); 
	  	console.log("Document uploaded, inserted id: " + result.insertedId + "\n"); 
		res.status(200).send(result);
	} catch (err) {
		res.status(500).json({ message: "Server error", error: err });
	}
});

  
app.delete('/deleteData', async function (req, res) {

	console.log("DELETE request received : " + JSON.stringify(req.body));

	try {
	    let result = await collection.deleteMany(req.body);
		console.log("Document(s) deleted, deleted count: " + result.deletedCount + "\n"); 
		res.status(200).send(result);
	
	} catch (err) {
		res.status(500).json({ message: "Server error", error: err });
	}
 
});


app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`); 
});

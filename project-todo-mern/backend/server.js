const express = require("express");
const app = express();
const { MongoClient, ObjectId } = require("mongodb");
const PORT = 4000;
const cors = require('cors')
let db;

let connectionString = `mongodb://localhost:27017/crud`;
app.use(cors({
	origin:"http://localhost:3000"
}))
app.use(express.json());

const todoRoutes = express.Router();

todoRoutes.route("/").get(function (req, res) {
	db.collection("todos")
		.find()
		.toArray(function (err, items) {
			res.send(items);
		});
});

todoRoutes.route("/:id").get(function (req, res) {
	let id = req.params.id;
	db.collection("todos")
		.find({ _id: id })
		.toArray(function (err, items) {
			res.send(items);
		});
});

todoRoutes.route("/add").post(function (req, res) {
	db.collection("todos").insertOne(req.body, function (err, info) {
		res.json(info);
	});
});

todoRoutes.route("/update/:id").put(function (req, res) {
	db.collection("todos").findOneAndUpdate(
		{ _id: new ObjectId(req.params.id) },
		{
			$set: {
				todo_description: req.body.todo_description,
				todo_responsible: req.body.todo_responsible,
				todo_priority: req.body.todo_priority,
				todo_complete: req.body.todo_complete,
			},
		},
		function () {
			res.send("Success updated!");
		},
	);
});

todoRoutes.route("/delete/:id").delete(function (req, res) {
	db.collection("todos").deleteOne(
		{ _id: new ObjectId(req.params.id) },
		function () {
			res.send("Successfully deleted!");
		},
	);
});

app.use("/todos", todoRoutes);

MongoClient.connect(
	connectionString,
	{ useNewUrlParser: true },
	(error, client) => {
		if (error) {
			return console.log("Connection failed for some reason");
		}
		console.log("Connection established - All well");
		db = client.db("crud");
		app.listen(PORT, function () {
			console.log("Server is running on Port: " + PORT);
		});
	},
);
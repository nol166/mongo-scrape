const mongodb = require("mongodb");
const MongoClient = mongodb.MongoClient;
const uri = process.env.MONGODB_URI || "mongodb://localhost:27017";

exports.client = new MongoClient(uri, { useNewUrlParser: true });

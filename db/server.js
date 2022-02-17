const { client } = require("./connection");

client.connect((err) => 
  err? console.log(err): console.log("Connected to MongoDB"))
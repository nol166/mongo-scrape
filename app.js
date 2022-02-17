const axios = require("axios");
const yargs = require("yargs");
const { client } = require("./db/connection");

// get the command line arguments
yargs
  .scriptName("mongodb-scraper")
  .usage("$0 <cmd> [args]")
  .command(
    "scrape",
    "Scrape an API",
    (yargs) => {
      yargs.option("url", {
        alias: "u",
        describe: "The URL to scrape",
        type: "string",
        demandOption: true,
      });
      // flag for count
      yargs.option("count", {
        alias: "c",
        describe: "The number of records to scrape",
        type: "number",
        default: 10,
      });
      // db name
      yargs.option("db", {
        alias: "d",
        describe: "The database to store the data in",
        type: "string",
        default: "scrape",
        demandOption: true,
      });
      // collection name
      yargs.option("collection", {
        alias: "col",
        describe: "The collection to store the data in",
        type: "string",
        default: "scrape_test",
        demandOption: true,
      });
    },
    (argv) => {
      console.log("Scraping: ", argv.url);
      axios
        .get(argv.url)
        .then((response) => {
          // console.log(response.data)
          response.data.forEach((element) => console.log(element));

          // connect to the database
          client.connect((err) => {
            if (err) {
              console.log(err);
            } else {
              console.log("Connected to MongoDB!");
              const db = client.db(argv.d);
              console.log("🚀 - file: app.js - line 57 - client.connect - db", argv.db)
              const collection = db.collection(argv.collection);
              console.log("🚀 - file: app.js - line 59 - client.connect - collection", argv.collection)

              // insert the data into the database
              collection.insertMany(response.data, (err, result) => {
                if (err) {
                  console.log(err);
                } else {
                  console.log(`Inserted ${result.insertedCount} documents`);
                }
              });
            }
            // stop the connection to the database
          });
        })
        .catch((error) => {
          console.log("Error: ", error);
        });
    }
  )
  .help().argv;

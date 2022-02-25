#!/usr/bin/env node
const axios = require("axios");
const yargs = require("yargs");
const { client } = require("./db/connection");

// if no command line arguments are passed, show help for the "scrape" command
if (process.argv.length === 2) {
  yargs.showHelp();
}

yargs
  .scriptName("mongodb-scrape")
  .usage("$0 <cmd> [args]")
  .command(
    "scrape",
    "Scrape an API",
    (yargs) => {
      // if no arguments are passed, show help
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
      yargs.option("headers", {
        alias: "h",
        describe: "The headers to use for the request",
        type: "string",
        default: "{}",
        demandOption: false,
      });
      // params
      yargs.option("params", {
        alias: "p",
        describe: "The params to use for the request",
        type: "string",
        default: "{}",
        demandOption: false,
      });
    },
    (argv) => {
      console.log("Scraping: ", argv.url);
      axios
        .get(argv.url)
        .then((response) => {
          console.log(response.data);
          if (response.data.length > 0) {
            console.log("Response data is empty - no data to store");
            response.data.forEach((element) => console.log(element));
            process.exit(0);
          }

          // connect to the database
          client.connect((err) => {
            if (err) {
              console.log(err);
            } else {
              console.log("Connected to MongoDB!");
              const db = client.db(argv.d);
              console.log(
                "🚀 - file: app.js - line 57 - client.connect - db",
                argv.db
              );
              const collection = db.collection(argv.collection);
              console.log(
                "🚀 - file: app.js - line 59 - client.connect - collection",
                argv.collection
              );

              // insert the data into the database
              collection.insertMany(
                response.data.results || response.data,
                (err, result) => {
                  if (err) {
                    console.log(err);
                  } else {
                    console.log(`Inserted ${result.insertedCount} documents`);
                  }
                }
              );
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

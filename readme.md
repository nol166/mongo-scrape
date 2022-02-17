# mongo-scrape

CLI tool for scraping data and injecting it into a MongoDB collection.

1. [Installation](#installation)

Clone the repo, and run `yarn` to install the dependencies.

2. [Usage](#usage)

```sh
mongodb-scraper scrape

Scrape an API

Options:
      --version            Show version number                         [boolean]
      --help               Show help                                   [boolean]
  -u, --url                The URL to scrape                 [string] [required]
  -c, --count              The number of records to scrape[number] [default: 10]
      --collection, --col  The collection to store the data in
                                    [string] [required] [default: "scrape_test"]
```

4. [Examples](#examples)

```
node app scrape -u https://jsonplaceholder.typicode.com/users -c 10 -d users -col scrape_test
```
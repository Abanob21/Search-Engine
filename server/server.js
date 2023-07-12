const { parse } = require('node-html-parser');
const { Client } = require('@elastic/elasticsearch')
const express = require('express');
const app = express();
const cors = require('cors');
const fs = require('fs');
const port = 4000;

app.use(cors());

const client = new Client({
  node: 'http://localhost:9200'
});

// Post request will receive data from search form and return results
app.get('/search/:searchString', async (req, res) => {
  let searchString = ""

  if (req.params) {
    searchString = req.params.searchString;
  }

  const results = await client.search({
    index: 'pages',
    query: {
      match: {
        content: searchString
      }
    }
  });

  res.json(results.hits.hits);
});

async function indexPages() {
  let exists = await client.indices.exists({index: 'pages'})

  if (exists)
    await deletePages();

  await client.indices.create({
    index: 'pages',
  });

  fs.readdirSync("../data").forEach( async (file) =>  {
    let documentString = fs.readFileSync("../data/" + file, {encoding: "utf8"});
    let root = parse(documentString);
    let titleElements = root.getElementsByTagName("title");
    let title = "";
    if (titleElements[0]) {
      title = titleElements[0].innerHTML;
    }
    else {
      title = file;
    }

    let headElements = root.getElementsByTagName("head");

    if (headElements[0]) {
      root = root.removeChild(headElements[0]);
    }

    let docBody = root.toString();

    await client.index({
      index: 'pages',
      document: {
        title: title,
        content: docBody,
      }
    });
  });

  console.log("Done loading");

  client.indices.refresh({ index: 'pages' });
}

async function deletePages() {
  await client.indices.delete({
    index: 'pages',
  });
}

indexPages();

app.listen(port, () => {
  console.log(`Success! Your application is running on port ${port}.`);
});


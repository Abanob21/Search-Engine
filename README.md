# Install

## Elastic Search

1. Download elastic search
https://www.elastic.co/downloads/elasticsearch

2. Run elastic search for initial setup
Run bin/elasticsearch (or bin\elasticsearch.bat on Windows)

3. Configure security (or disable it)
Set xpack.security.enabled to false in config/elasticsearch.yml

## NodeJS

1. cd server
2. npm install
3. npm start server.js

## React

1. cd client
2. npm install
3. npm start

## Add data to data folder

The program will parse html files for <title> tags and body

# Architecture


## Frontend
React is used for the frontend client which interacts with the nodejs server. The frontend contains a form that sends a get request with a search string parameter to the backend.

The main code is held in client/src/App.js
This file contains the fetch request and logic for rendering the results in a custom <SearchResult /> component.

## Backend
The backend is built using nodejs and bridges between the client and elasticsearch. We use express to setup routing, and use elasticsearch-js to interact with the elasticsearch instance.

Most of the code is held in server.js

The backend has an indexpage function which checks whether an index already exists and creates it. It then opens the data directory and indexes all the files with elasticsearch. 

Finally it runs the webserver for responding to get requests from the frontend. 

## Elasticsearch

Holds the data for our parsed web pages.

We use the search api to look for pages matching the user's search query.

// app.js
const sls = require('serverless-http');
const bodyParser = require('body-parser');
const express = require('express');
const cors = require('cors');
const app = express();
const Sentry = require('@sentry/node');

const JSON = require('circular-json');

const Pageres = require('pageres');
const path = require('path')
const getColors = require('get-image-colors')

const MetaInspector = require('node-metainspector');

Sentry.init({ dsn: '' });

app.use(bodyParser.json({ strict: false }));

app.use(cors());

app.use(Sentry.Handlers.requestHandler());

let corsList = [
  "localhost:3023",
];

app.all('*', function(req, res, next) {
  if (req.headers.origin) {
    let originCheck = corsList.indexOf(req.headers.origin) > -1;
    console.log('Request Origin: ' + req.headers.origin);
    
    console.log(originCheck);

    if (originCheck) {
      res.status(400).json({ error: `Denied` });
    } else {
      next();
    }
  } else {
    console.log(req.headers.origin);
    res.status(400).json({ error: `Denied` });
  }
});

// get meta data
// http://localhost:3000/getMetaData/https%3A%2F%2Fgoogle.com
app.get('/getMetaData/', function(req, res) {
  res.status(400).json({ error: `Please pass a company URL` });
});
app.get('/getMetaData/:url/', function(req, res) {
  const companyURL = req.params.url;
  if (companyURL) {
    let companyDetailsArray =[];

    var client = new MetaInspector(decodeURIComponent(companyURL), { timeout: 5000 });
 
    client.on("fetch", function(){
      let retrievedCompanyDetailsArray = [
        {'url': client.url},
        {'scheme': client.scheme},
        {'host': client.host},
        {'rootUrl': client.rootUrl},
        {'title': client.title},
        {'author': client.author},
        {'keywords': client.keywords},
        {'charset': client.charset},
        {'description': client.description},
        {'image': client.image},
        {'ogTitle': client.ogTitle},
        {'ogDescription': client.ogDescription},
        {'ogType': client.ogType},
        {'ogUpdatedTime': client.ogUpdatedTime},
        {'ogLocale': client.ogLocale},
      ]

      companyDetailsArray.push(retrievedCompanyDetailsArray);

      res.status(200).json({ status: 'success', data: companyDetailsArray });
    });
    
    client.on("error", function(err){
      res.status(400).json({ error: `Error: ` + err + ' from ' + companyURL })
    });
    
    client.fetch();

  } else {
    res.status(400).json({ error: `Please pass a company URL` });
  }
});

// get images data
// http://localhost:3000/getImages/https%3A%2F%2Fgoogle.com
app.get('/getImages/', function(req, res) {
  res.status(400).json({ error: `Please pass a company URL` });
});
app.get('/getImages/:url/', function(req, res) {
  const companyURL = req.params.url;
  if (companyURL) {
    let companyDetailsArray =[];

    var client = new MetaInspector(decodeURIComponent(companyURL), { timeout: 5000 });
 
    client.on("fetch", function(){
      let retrievedCompanyDetailsArray = [
        {'images': client.images}
      ]

      companyDetailsArray.push(retrievedCompanyDetailsArray);

      companyDetailsArray = JSON.stringify(companyDetailsArray);

      res.status(200).json({ status: 'success', data: companyDetailsArray });
    });
    
    client.on("error", function(err){
      res.status(400).json({ error: `Error: ` + err })
    });
    
    client.fetch();

  } else {
    res.status(400).json({ error: `Please pass a company URL` });
  }
});

// get meta data
// http://localhost:3000/getLinks/https%3A%2F%2Fgoogle.com
app.get('/getLinks/', function(req, res) {
  res.status(400).json({ error: `Please pass a company URL` });
});
app.get('/getLinks/:url/', function(req, res) {
  const companyURL = req.params.url;
  if (companyURL) {
    let companyDetailsArray =[];

    var client = new MetaInspector(decodeURIComponent(companyURL), { timeout: 5000 });
 
    client.on("fetch", function(){
      let retrievedCompanyDetailsArray = [
        {'links': client.links}
      ]

      companyDetailsArray.push(retrievedCompanyDetailsArray);

      companyDetailsArray = JSON.stringify(companyDetailsArray);

      res.status(200).json({ status: 'success', data: companyDetailsArray });
    });
    
    client.on("error", function(err){
      res.status(400).json({ error: `Error: ` + err })
    });
    
    client.fetch();

  } else {
    res.status(400).json({ error: `Please pass a company URL` });
  }
});

// get meta data
// http://localhost:3000/getFeeds/https%3A%2F%2Fgoogle.com
app.get('/getFeeds/', function(req, res) {
  res.status(400).json({ error: `Please pass a company URL` });
});
app.get('/getFeeds/:url/', function(req, res) {
  const companyURL = req.params.url;
  if (companyURL) {
    let companyDetailsArray =[];

    var client = new MetaInspector(decodeURIComponent(companyURL), { timeout: 5000 });
 
    client.on("fetch", function(){
      let retrievedCompanyDetailsArray = [
        {'feeds': client.feeds}
      ]

      companyDetailsArray.push(retrievedCompanyDetailsArray);

      companyDetailsArray = JSON.stringify(companyDetailsArray);

      res.status(200).json({ status: 'success', data: companyDetailsArray });
    });
    
    client.on("error", function(err){
      res.status(400).json({ error: `Error: ` + err })
    });
    
    client.fetch();

  } else {
    res.status(400).json({ error: `Please pass a company URL` });
  }
});

// get website screen
// http://localhost:3000/getWebScreen/https%3A%2F%2Fgoogle.com
app.get('/getWebScreen/', function(req, res) {
  res.status(400).json({ error: `Please pass a company URL` });
});
app.get('/getWebScreen/:url/', function(req, res) {
  const companyURL = req.params.url;
  if (companyURL) {
    (async () => {
      let imageData = await new Pageres({delay: 2})
        .src(decodeURIComponent(companyURL), ['1024x768'], {crop: true})
        .run();

      res.status(200).json({ status: 'success', data: imageData });
    })();

  } else {
    res.status(400).json({ error: `Please pass a company URL` });
  }
});

// get colours
// http://localhost:3000/getCompColors/https%3A%2F%2Fgoogle.com
app.get('/getCompColors/', function(req, res) {
  res.status(400).json({ error: `Please pass a company URL` });
});
app.get('/getCompColors/:url/', function(req, res) {
  const companyURL = req.params.url;
  if (companyURL) {
    (async () => {
      let imageData = await new Pageres({delay: 2})
        .src(decodeURIComponent(companyURL), ['1024x768'], {crop: true})
        .run();
      
      getColors(imageData[0], 'image/png').then(colors => {
        // `colors` is an array of color objects

        res.status(200).json({ status: 'success', data: colors });
      })
    })();

  } else {
    res.status(400).json({ error: `Please pass a company URL` });
  }
});

// Error check
app.get('/debug-sentry', function mainHandler(req, res) {
  throw new Error('Hey! This is an error');
});

// Health check
app.get('/health', function mainHandler(req, res) {
  res.status(200).json({ status: 'success', data: 'All is fine.' });
});

// The error handler must be before any other error middleware and after all controllers
app.use(Sentry.Handlers.errorHandler());

// Optional fallthrough error handler
app.use(function onError(err, req, res, next) {
  // The error id is attached to `res.sentry` to be returned
  // and optionally displayed to the user for support.
  res.statusCode = 500;
  res.end(res.sentry + "\n");
});

module.exports.server = sls(app);

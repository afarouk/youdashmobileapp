const express = require('express');
require('dotenv').config({ path: '.env' });
const app = express();
const port = process.env.PORT || 3000;
const path = require('path');
const editJsonFile = require('edit-json-file');

const { log } = require('./src/logger');
const {
  getSiteletteData,
  getFile
} = require('./src/services.js');

/* @weisk 2021/04/03: disable all cache on dev */
const { NODE_ENV } = process.env;
if (NODE_ENV && NODE_ENV === 'development') {
  app.set('etag', false);
  app.use((req, res, next) => res.set('Cache-Control', 'no-store'));
}


app.get('/manifest.json', function (request, res) {
  const { url } = request.query;
  log(`Load manifest for: ${url}`, 2);
  try {
    const filePath = path.resolve(__dirname, '../build', 'manifest.json');
    if (!url) {
      return res.sendFile(filePath);
    }

    let file = editJsonFile(filePath);
    file.set('start_url', decodeURIComponent(url)); //request.originalUrl
    res.json(file.toObject());
  } catch (error) {
    return res.send(error);
  }
});



// static conf
const buildpath = path.resolve(__dirname, '../build');
app.use(express.static(buildpath));

async function requestHandler(request, res, next) {
  const { urlKey } = request.params;
  log(`${urlKey} page visited.`, 2);
  log(`\t${request.originalUrl}`);
  log(`\t${JSON.stringify(request.params)}`);
  log(`\t${JSON.stringify(request.query)}`);
  log(`\t${request.url}`);

  const filePath = path.resolve(__dirname, '../build', 'index.html');
  // if (!filePath) {
  //   notFoundHandler(request, res);
  // }
  try {
    const { data: siteletteData } = await getSiteletteData(urlKey, request.query);
    if (siteletteData) {
      res.send(await getFile(filePath, siteletteData, urlKey, request.query));
    }
  } catch (err) {
    let msg = `Error ${err.code}\n\turl: ${err.config.url}\n\tisAxiosError: ${err.isAxiosErr}`;
    log(msg, 4);
    // const filePath = path.resolve(__dirname, '../build', 'index.html');
    res.status(500);
  }
}

app.get('/:urlKey/order-status*', requestHandler);
app.get('/:urlKey/order-details', requestHandler);
app.get('/:urlKey/help*', requestHandler);
app.get('/:urlKey/terms*', requestHandler);
app.get('/:urlKey/order-history', requestHandler);
app.get('/:urlKey/user-settings', requestHandler);
app.get('/:urlKey/p/*', requestHandler);
app.get('/:urlKey/', requestHandler);




app.listen(port, () => log(`Listening on port ${port}`, 1));


// can get rid of??

/*app.get('*.json', function (req, res) {
  console.(`json file ${req.originalUrl}`);
  const filePath = path.resolve(__dirname, '../build', req.originalUrl);
  res.sendFile(filePath);
});*/
//need to serve manifest.json properly and prevent app.get('*'...) below to handle it

app.get('*', (request, response) => {
  log(request.originalUrl, 1);
  log(request.params);
  const filePath = path.resolve(__dirname, '../build', 'index.html');
  response.sendFile(filePath);
});

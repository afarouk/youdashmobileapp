const express = require('express');
require('dotenv').config({ path: '.env' });
const app = express();
const port = process.env.PORT || 3000;
const path = require('path');
const fs = require('fs');
const axios = require('axios');
const editJsonFile = require('edit-json-file');
const serialize = require('serialize-javascript');
const endpoints = {
  getSiteletteData: `/apptsvc/rest/sasl/getCatalogAndSiteletteDataModelByURLkey`
};
//should goes before app.use*
app.get('/manifest.json', function (request, res) {
  const { url } = request.query;
  console.log(`Load manifest for: ${url}`);
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
app.use(express.static(path.resolve(__dirname, '../build')));

async function getSiteletteData(urlKey, query = {}) {
  const { server, demo } = query;

  const baseUrl = server
      ? `http://${server}`
      : `https://${demo && demo === 'true' ? 'simfel.com' : 'communitylive.ws'}`;
  // console.log(`${baseUrl}${endpoints.getSiteletteData}?urlKey=${urlKey}`);
  return axios.get(`${baseUrl}${endpoints.getSiteletteData}?urlKey=${urlKey}`);
}

async function readFile(filePath, siteletteData, urlKey, query) {
  return new Promise((resolve, reject) => {
    fs.readFile(filePath, 'utf8', function (err, fileData) {
      if (err) {
        console.log(err);
        reject(err);
      }
      const { sasl } = siteletteData.siteletteDataModel;
      if (sasl) {
        const { ogTags, appleTouchIcon192URL } = sasl;
        if (ogTags) {
          fileData = fileData.replace(/\__OG_TITLE__/g, ogTags.title);
          fileData = fileData.replace(/\__OG_DESCRIPTION__/g, ogTags.description);
          fileData = fileData.replace(/\__OG_IMAGE__/g, ogTags.image);
        }
        if (appleTouchIcon192URL) {
          fileData = fileData.replace(/\__LINK_ICON_192__/g, appleTouchIcon192URL);
          fileData = fileData.replace(/\__LINK_APPLE_TOUCH_ICON__/g, appleTouchIcon192URL);
        }
        if (urlKey && query) {
          let queryString = '';
          if (query && Object.keys(query).length) {
            Object.keys(query).map((key) => {
              queryString += `${!queryString ? `${urlKey}/?` : '&'}${key}=${query[key]}`;
            });
          }
          fileData = fileData.replace(
              /\/manifest.json/g,
              `/manifest.json?url=${encodeURIComponent(queryString)}`
          );
        }
      }

      fileData = fileData.replace(
          /\window.__SASL_DATA__/g,
          `window.__SASL_DATA__ = ${serialize(siteletteData, { isJSON: true })}`
      );
      // replace the special strings with server generated strings
      resolve(fileData);
    });
  });
}

async function requestHandler(request, res) {
  const { urlKey } = request.params;
  console.log(`${urlKey} page visited.`);
  console.log(request.originalUrl);
  console.log(request.params);
  console.log(request.query);
  console.log(request.url);
  const filePath = path.resolve(__dirname, '../build', 'index.html');
  try {
    const { data: siteletteData } = await getSiteletteData(urlKey, request.query);
    if (siteletteData) {
      res.send(await readFile(filePath, siteletteData, urlKey, request.query));
    }
  } catch (e) {
    console.log(e);
    // const filePath = path.resolve(__dirname, '../build', 'index.html');

    res.sendFile(path.resolve(__dirname, './', '404.html'));
  }
}
/*app.get('*.json', function (req, res) {
  console.log(`json file ${req.originalUrl}`);
  const filePath = path.resolve(__dirname, '../build', req.originalUrl);
  res.sendFile(filePath);
});*/
//need to serve manifest.json properly and prevent app.get('*'...) below to handle it

app.get('/:urlKey/order-status*', requestHandler);
app.get('/:urlKey/order-details', requestHandler);
app.get('/:urlKey/help*', requestHandler);
app.get('/:urlKey/terms*', requestHandler);
app.get('/:urlKey/order-history', requestHandler);
app.get('/:urlKey/user-settings', requestHandler);
app.get('/:urlKey/p/*', requestHandler);
app.get('/:urlKey/', requestHandler);

/*app.get('*', function (request, response) {
  console.log(request.originalUrl);
  console.log(request.params);
  const filePath = path.resolve(__dirname, '../build', 'index.html');
  response.sendFile(filePath);
});*/

app.listen(port, () => console.log(`Listening on port ${port}`));

const axios = require('axios');
const { log } = require('./logger');
const fs = require('fs');
const serialize = require('serialize-javascript');

const endpoints = {
  getSiteletteData: `/apptsvc/rest/sasl/getCatalogAndSiteletteDataModelByURLkey`
};

module.exports = {
  getSiteletteData,
  getFile
};

async function getSiteletteData(urlKey, query = {}) {
  const { server, demo } = query;

  const baseUrl = server
      ? `http://${server}`
      : `https://${demo && demo === 'true' ? 'chalkboardsdemo.dev' : 'communitylive.ws'}`;

  const finalUrl = `${baseUrl}${endpoints.getSiteletteData}?urlKey=${urlKey}`;
  log(finalUrl, 2);
  return axios.get(finalUrl);
}

async function getFile(filePath, siteletteData, urlKey, query) {
  return new Promise((resolve, reject) => {
    fs.readFile(filePath, 'utf8', function (err, fileData) {
      if (err) {
        log(err, 4);
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

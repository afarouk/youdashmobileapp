import axios from 'axios';
import { getQueryStringParams } from '../utils/helpers';

const urlParams = getQueryStringParams();
const server = urlParams.get('server');
const demo = urlParams.get('demo');
export const multientry = urlParams.get('multientry');
const throwError = urlParams.has('throw') && urlParams.get('throw') === 'true' ? 'throw=true' : '';
export const isDemo = demo === 'true';
const baseUrl = server
    ? `http://${server}`
    : `https://${isDemo ? 'simfel.com' : 'communitylive.ws'}`;

const request = axios.create({
    baseURL: baseUrl
});
request.interceptors.request.use(
  (config) => {
    // Do something before request is sent
    if (config.url) {
      config.url = config.url.indexOf('?') !== -1
        ? `${config.url}&${throwError}`
        : `${config.url}?${throwError}`;
    }

    return config;
  },
  (error) => {
    // Do something with request error
    return Promise.reject(error);
  }
);
//TODO: remove in production
request.interceptors.response.use(
    (response) => {
        // Do something with response data
        return response;
    },
    (error) => {
        // Do something with response error
        return Promise.reject(error?.response?.data?.error?.message);
    }
);
export {
    request,
    demo
}
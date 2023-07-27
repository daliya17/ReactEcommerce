import fetch from 'isomorphic-fetch';
import { cloneDeep } from 'lodash';

let domain = process.env.REACT_APP_API_DOMAIN || '';
let endPointPrefix = process.env.PUBLIC_URL || '';

/**
 * make the actual api call
 * @param {object} endpoint - endpoint & method
 * @param {object} args - paramters to be passed
 * @param {object} headers - request headers
 */
function apiCall(endpoint, args, headers) {
  let url = endpoint.url;

  // get absolute url if necessary
  url = getAbsoluteUrl(url);

  const method = endpoint.method;

  // add default headers
  headers = headers || {};
  headers = {
    ...getDefaultHeaders(method),
    ...headers
  };

  let options = {
    method,
    headers,
    // to allow the cookies to be sent
    credentials: 'same-origin'
  };

  // Add request body
  if (method.toUpperCase() === 'GET') {
    url += constructQueryParams(args);
  } else {
    options.body = JSON.stringify(args);
  }

  return fetch(url, options).then(response => {
    // resolve successful response
    if (response.status && response.status.toString().match(/^2\d+/)) {
      const contentType = response.headers.get('content-type');
      // resolve json content
      if (contentType && contentType.indexOf('application/json') >= 0) {
        return response.json();
      }
      // non json content
      else {
        return response.text();
      }
    }
    // reject other responses
    throw response;
  });
}

/**
 * Returns the default headers based on the request method
 * @param {string} method - request method
 */
function getDefaultHeaders(method) {
  const headers = {
    Accept: process.env.NODE_ENV === 'development' ? '*' : 'application/json'
  };

  if (method.toUpperCase() !== 'GET') {
    headers['Content-Type'] = 'application/json';
  }

  return headers;
}

/**
 * make get request to a RESTful web service
 * @param {object} endpoint
 * @param {object} args
 * @param {object} headers
 */
function get(endpoint, args, headers) {
  if (!endpoint) return;

  if (typeof endpoint === 'string') {
    endpoint = {
      url: endpoint
    };
  }

  endpoint.method = 'GET';

  return apiCall(endpoint, args || {}, headers || {});
}

/**
 * make a post request to a RESTful web service
 * @param {object} endpoint
 * @param {object} args
 * @param {object} headers
 */
function post(endpoint, args, headers) {
  if (!endpoint) return;

  if (typeof endpoint === 'string') {
    endpoint = {
      url: endpoint
    };
  }

  endpoint.method = 'POST';

  return apiCall(endpoint, args || {}, headers || {});
}

/**
 * make a put request to a RESTful web service to update the data
 * @param {object} endpoint
 * @param {object} args
 * @param {object} headers
 */
function put(endpoint, args, headers) {
  if (!endpoint) return;

  if (typeof endpoint === 'string') {
    endpoint = {
      url: endpoint
    };
  }

  endpoint.method = 'PUT';

  return apiCall(endpoint, args || {}, headers || {});
}

/**
 * make a patch request to a RESTful web service to update the data
 * @param {object} endpoint
 * @param {object} args
 * @param {object} headers
 */
function patch(endpoint, args, headers) {
  if (!endpoint) return;

  if (typeof endpoint === 'string') {
    endpoint = {
      url: endpoint
    };
  }

  endpoint.method = 'PATCH';

  return apiCall(endpoint, args || {}, headers || {});
}

/**
 * make a patch request to a RESTful web service to update the data
 * @param {object} endpoint
 * @param {object} args
 * @param {object} headers
 */
function deleteRequest(endpoint, args, headers) {
  if (!endpoint) return;

  if (typeof endpoint === 'string') {
    endpoint = {
      url: endpoint
    };
  }

  endpoint.method = 'DELETE';

  return apiCall(endpoint, args || {}, headers || {});
}

/**
 * append the domain name and endpoint prefix if there are any
 * @param {object} endpoint
 */
function getAbsoluteUrl(url) {
  return domain + endPointPrefix + url;
}

/**
 * Function to frame the endpoint with URI
 * @param {string} endpoint
 * @param {object} args
 */
function replaceUrlParams(endpoint, args, deleteSubstitution = true) {
  args = cloneDeep(args);

  let substitutions = endpoint.match(/\{\w+\}/g);
  if (substitutions && substitutions.length > 0) {
    substitutions.forEach(function(element) {
      let key = element.replace(/\{|\}/g, '');
      endpoint = endpoint.replace(element, args[key]);

      if (deleteSubstitution) delete args[key];
    }, this);
  }

  return endpoint;
}

// Construct query params for get request
function constructQueryParams(params) {
  if (Object.keys(params).length === 0) return '';

  const str = `?${Object.keys(params)
    .map(propname =>
      [propname, toParamValue(params[propname])]
        .map(encodeURIComponent)
        .join('=')
    )
    .join('&')}`;
  return str;
}

function toParamValue(value) {
  return value === undefined || value === null ? '' : value;
}

export default {
  get,
  post,
  put,
  patch,
  deleteRequest,
  replaceUrlParams,
  constructQueryParams
};

const http = require('http');
const url = require('url');

module.exports = http.createServer((req, res) => {

    var service = require('./service.js');
    const reqUrl = url.parse(req.url, true);

    // GET Endpoint
    if (reqUrl.pathname == '/listRecipes' && req.method === 'GET') {
        console.log('Request Type:' +
            req.method + ' Endpoint: ' +
            reqUrl.pathname);

        service.listRecipes(req, res);
    }

    // POST Endpoint
   else if (reqUrl.pathname == '/addRecipe' && req.method === 'POST') {
    console.log('Request Type:' +
        req.method + ' Endpoint: ' +
        reqUrl.pathname);
        service.addRecipe(req, res);
  }

    // POST Endpoint
    else if (reqUrl.pathname == '/removeRecipe' && req.method === 'DELETE') {
        console.log('Request Type:' +
            req.method + ' Endpoint: ' +
            reqUrl.pathname);
        service.removeRecipe(req, res);
    }

    // POST Endpoint
    else if (reqUrl.pathname == '/updateRecipe' && req.method === 'POST') {
        console.log('Request Type:' +
            req.method + ' Endpoint: ' +
            reqUrl.pathname);
        service.updateRecipe(req, res);
    }


    // GET Endpoint
   else if (reqUrl.pathname == '/sample' && req.method === 'GET') {
        console.log('Request Type:' +
            req.method + ' Endpoint: ' +
            reqUrl.pathname);

        service.sampleRequest(req, res);

        // POST Endpoint
    } else if (reqUrl.pathname == '/test' && req.method === 'POST') {
        console.log('Request Type:' +
            req.method + ' Endpoint: ' +
            reqUrl.pathname);

        service.testRequest(req, res);

    } else {
        console.log('Request Type:' +
            req.method + ' Invalid Endpoint: ' +
            reqUrl.pathname);

        service.invalidRequest(req, res);

    }
});
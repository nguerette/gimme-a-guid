const crypto = require('crypto');

const createSimpleServer = (port, handler) => http.createServer((request, response) => {
  const chunks = [];
  request.on('data', chunks.push.bind(chunks));
  request.on('end', () => {
    Promise.resolve(handler({request, response, body: chunks.join('')}))
      .then(() => response.finished || response.end());
  });
}).listen(port);

const hex = n => crypto.randomBytes(n/2).toString('hex');

const newApp = port => createSimpleServer(port, ({response}) => new Promise(resolve => {
  response.setHeader('Content-Type', 'text/html; charset=utf-8');
  response.setHeader('Refresh', String(24 * 60 * 60));
  response.setHeader('Connection', 'close');
  response.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  response.setHeader('Expires', '0');
  response.setHeader('Pragma', 'no-cache');
  response.setHeader('Surrogate-Control', 'no-store');
  response.setHeader('X-Powered-By', 'the folly of man');
  response.end(
    '<!doctype html>\n' +
    '<html lang=en>\n' +
    '<head>\n' +
    '  <meta charset=utf-8>\n' +
    '  <link rel="icon" href="data:image/png;base64," />\n' +
    "  <title>Here's your guid</title>\n" +
    '  <style type="text/css">\n' +
    '    body {margin: 0;}\n' +
    '    main {\n' +
    '      position: absolute;\n' +
    '      width: 100%;\n' +
    '      text-align: center;\n' +
    '      top: 50%;\n' +
    '      transform: translateY(-50%);\n' +
    '      font-size: 48px;\n' +
    '      font-family: monospace;\n' +
    '    }\n' +
    '    footer {\n' +
    '      position: absolute;\n' +
    '      left: 0;\n' +
    '      bottom: 0;\n' +
    '    }\n' +
    '  </style>\n' +
    '</head>\n' +
    '<body>\n' +
    `<main>${hex(8)}-${hex(4)}-${hex(4)}-${hex(4)}-${hex(12)}</main>\n` +
    '<footer>\n' +
    '  Hosted on <a href="https://run.pivotal.io">Pivotal Web Services</a>.\n' +
    '  <a href="https://github.com/nguerette/gimme-a-guid">Source code</a>\n' +
    '</footer>\n' +
    '</body>\n' +
    '</html>'
  );
  resolve();
}));

module.exports = {newApp};

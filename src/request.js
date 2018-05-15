'use strict';
import https from 'https';
import querystring from 'querystring';

export default function request({method, host, path, qs, agent}) {
  const options = {
    host,
    method,
    path: `${path}?${querystring.stringify(qs)}`
        .replace(/\%3A/g, ':')
        .replace(/\%2C/g, ',')
        .replace(/\%2B/g, '+'),
  };

  if (agent) options.agent = agent;

  return new Promise((resolve, reject) => {
    const req = https.request(options, (res) => {
      let chunk = '';

      res.on('data', (data) => {
        chunk += data;
      });

      res.on('end', () => {
        resolve(chunk.toString('utf8'));
      });
    });

    req.on('error', (e) => {
      reject(e);
    });

    req.end();
  });
}

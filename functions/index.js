// modules
const functions = require('firebase-functions');
const express = require('express');
const cors = require('cors');

// constants
const ALLOWED_ORIGINS =
  process.env.NODE_ENV === 'development'
    ? [/localhost/, /192.168.1.1/, /127.0.0.1/, /0.0.0.0/]
    : [/tremplin2020\.cemurmurefestival\.(com|fr)/];

// new express app instance
const app = express();

// cors with origin validation
app.use(cors({ methods: 'POST', origin: ALLOWED_ORIGINS }));

// extra host origin validation (on other methods than OPTIONS)
function hostValidation(hosts) {
  return (req, res, next) => {
    const origin = req.headers.origin;
    const validOrigin = hosts.reduce(
      (valid, host) => valid || new RegExp(host).test(origin),
      false
    );
    if (validOrigin) next();
    else res.status(403).send('Forbidden');
  };
}
app.use(hostValidation(ALLOWED_ORIGINS));

app.post('/', (req, res) => {
  console.log('sendMail', req.body);
  res.status(204).end();
});

// initialize app on cloud functions
exports.sendVoteEmail = functions.region('europe-west1').https.onRequest(app);


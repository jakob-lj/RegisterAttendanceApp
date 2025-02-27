
require('dotenv')

const API_KEY = process.env.MG_API_KEY
const DOMAIN = process.env.MG_EMAIL

const mailgun = require('mailgun-js')({apiKey: API_KEY, domain: DOMAIN, host: 'api.eu.mailgun.net'});

const send = (email, subject, text) => {
    const data = {
      from: 'Jakob <me@jakoblj.com>',
      to: email,
      subject: subject,
      text: text
    };
    
    mailgun.messages().send(data, (error, body) => {
    console.log(error)
      console.log(body);
    });

}

module.exports = send
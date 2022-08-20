const sgMail = require('@sendgrid/mail')
const config = require('../config')

const SENDGRID_FROM = "jinfengliu106@gmail.com";

const sendgrid = {
  send: (to, subject, text, html) => {
    sgMail.setApiKey(config.sendgrid_api_key);
    return sgMail.send( {
        from: SENDGRID_FROM,
        to,
        subject,
        text,
        html
    });
  }
};

module.exports = sendgrid;

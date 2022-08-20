const config = require('../config')
const kickbox_client =  require('kickbox').client(config.kickbox_api_key).kickbox();

const kickbox = {
  checkValid: (email) => {
    const p = new Promise((resolve, reject) => {
      kickbox_client.verify(email, {timeout: 1000}, (err, res) => {
        if (err) reject(err)
        else resolve(res.body)
      });
    })

    return p
    
  }
};

module.exports = kickbox;

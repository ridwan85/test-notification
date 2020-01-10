// Download the helper library from https://www.twilio.com/docs/node/install
// Your Account Sid and Auth Token from twilio.com/console
// DANGER! This is insecure. See http://twil.io/secure
const accountSid = process.env.TWILLIO_SID;
const authToken = process.env.TWILLIO_AUTH_TOKEN;
const client = require('twilio')(accountSid, authToken);

export async function sendSms(from, to, msg) {
  try {
    client.messages
      .create({
        body: `"${msg}"`,
        from: `"${from}"`,
        to: `"${to}"`
      })
      .then(message => console.log(message.sid));
  } catch (err) {
    throw new Error(err);
  }
}

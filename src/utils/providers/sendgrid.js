/* eslint-disable no-console */
// using Twilio SendGrid's v3 Node.js Library
// https://github.com/sendgrid/sendgrid-nodejs
import sgMail from "@sendgrid/mail";
import { findOneById, findOneAndUpdate } from "../database/mongodb";
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

export async function sendEmail(email, subject, content) {
  const msg = {
    to: `${email}`,
    from: "test@example.com",
    subject: `${subject}`,
    html: `${content}`
  };

  return sgMail
    .send(msg)
    .then(result => {
      return result[0];
    })
    .catch(error => {
      console.log(error);
      return new Error(error);
    });
}

export async function processWebhook(event) {
  switch (event.event) {
    case "delivered": {
      //handle when mail status is delivered
      let smtp_id;
      smtp_id = event.sg_message_id;
      ///strip string to match data in db
      smtp_id = smtp_id.slice(0, smtp_id.indexOf("."));
      const result = await findOneById(
        "Notifications",
        "notificationSendId",
        smtp_id
      );
      if (result) {
        const _id = result._id;
        await findOneAndUpdate("Notifications", _id, {
          notificationStatus: "SENT"
        });
      }

      break;
    }

    default:
      break;
  }
}

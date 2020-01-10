/* eslint-disable no-console */
import mailgun from "mailgun-js";
import { findOneById, findOneAndUpdate } from "../database/mongodb";
const DOMAIN = "sandboxc0cca107a76d49c7838f371df8a2102d.mailgun.org";
const mg = mailgun({ apiKey: process.env.MAILGUN_API_KEY, domain: DOMAIN });

export async function sendEmail(email, subject, content) {
  const msg = {
    to: `${email}`,
    from: "me@samples.mailgun.org",
    subject: `${subject}`,
    html: `${content}`
  };

  return mg
    .messages()
    .send(msg)
    .then(result => {
      //remove `<>` from the string
      let strId = result.id;
      strId = strId.replace(/</g, "");
      strId = strId.replace(/>/g, "");
      //then replace the value
      result.id = strId;
      return result;
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
      smtp_id = event.message.headers.to["message-id"];
      console.log(smtp_id);
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

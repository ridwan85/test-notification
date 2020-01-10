import express from "express";
import { config } from "dotenv";
import {
  sendEmail as sgMail,
  processWebhook as sgWebHook
} from "../utils/providers/sendgrid";
import {
  sendEmail as mailGun,
  processWebhook as mailGunWebHook
} from "../utils/providers/mailgun";
import { sendSms } from "../utils/providers/twillio";
import {
  create,
  find,
  deleteAll,
  findByField
} from "../utils/database/mongodb";
import multer from "multer";

const router = express.Router();
config();

router.post("/email/webhook/:provider", multer().none(), (req, res, next) => {
  switch (req.params.provider) {
    case "mailgun":
      {
        const event = req.body["event-data"];
        //process webhook
        mailGunWebHook(event);
      }
      break;

    default: {
      const events = req.body;
      events.forEach(function(event) {
        ///process webhook
        sgWebHook(event);
      });
    }
  }
});

router.post("/email/:provider", async (req, res, next) => {
  try {
    const params = req.body;
    let mailResponse;
    switch (req.params.provider) {
      case "mailgun":
        mailResponse = await mailGun(
          params.receiverEmail,
          params.notificationSubject,
          params.notificationMessage
        );
        params.notificationSendId = mailResponse.id;
        break;
      default:
        mailResponse = await sgMail(
          params.receiverEmail,
          params.notificationSubject,
          params.notificationMessage
        );
        params.notificationSendId = mailResponse.headers["x-message-id"];
    }

    await create(params, "Notifications");

    return res.json({
      statusCode: 200,
      message: "Email is currently in delivery"
    });
  } catch (err) {
    return res.json({
      statusCode: 500,
      message: "Some error has occured",
      error: err.message
    });
  }
});

router.post("/sms/:provider", async (req, res, next) => {
  try {
    const params = req.body;
    const senderPhoneNumber = "+19174773626"; // harcoded as for the sake of demo.
    switch (req.params.provider) {
      case "twillio":
        sendSms(
          senderPhoneNumber,
          params.receiverPhoneNumber,
          params.notificationMessage
        );
        break;
      default:
        sendSms(
          senderPhoneNumber,
          params.receiverPhoneNumber,
          params.notificationMessage
        );
    }
    await create(params, "Notifications");
    return res.json({
      statusCode: 200,
      message: "SMS is currently in delivery"
    });
  } catch (err) {
    return res.json({
      statusCode: 500,
      message: "Some error has occured",
      error: err.message
    });
  }
});

/****** get logs routes ******/
router.get("/all", async (req, res) => {
  try {
    const results = await find("Notifications");
    return res.json(results);
  } catch (err) {
    return res.json({
      statusCode: 500,
      message: "Some error has occured",
      error: err.message
    });
  }
});

router.get("/logs", async (req, res) => {
  const params = [];
  for (const key in req.query) {
    params.push({
      key: key,
      value: req.query[key]
    });
  }
  try {
    const results = await findByField(
      "Notifications",
      params.key,
      params.value
    );
    return res.json(results);
  } catch (err) {
    return res.json({
      statusCode: 500,
      message: "Some error has occured",
      error: err.message
    });
  }
});

///debug to clear data only -dev mode
router.get("/delete", async (req, res) => {
  const result = deleteAll("Notifications");
  return res.send(result);
});
module.exports = router;

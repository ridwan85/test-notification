import mongoose, { Schema } from "mongoose";

const NotificationSchema = new Schema({
  receiverEmail: String,
  receiverPhoneNumber: String, // with country code
  notificationMessage: String, //
  notificationSubject: String,
  notificationStatus: {
    type: String,
    enum: ["FAIL", "READ", "SENT", "SENDING"],
    default: "SENDING"
  }, // Sent, Read, Fail, Sending
  notificationError: String, // could be json response maybe need to parse
  notificationProvider: String, // nexmo, mailgun, sendgrid .. etc
  notificationChannel: String, // SMS, email, whatsapp , web push notification
  notificationSendId: String,
  createdAt: { type: Date, default: Date.now() },
  updatedAt: { type: Date, default: Date.now() },
  createdBy: String
});

mongoose.model("Notifications", NotificationSchema);

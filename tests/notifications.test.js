"use strict";
require("dotenv").config();
const chai = require("chai");
const testData = require("./testdata.json");
const url = "http://localhost:3000/";
const request = require("supertest")(url);
const should = require("chai").should();

describe("Test api endpoints", () => {
  // Tests
  it("Returns all notifications", done => {
    request
      .get("notifications/all")
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        should.exist(res.body);
        done();
      });
  });

  it("Returns notification data by collection field", done => {
    request
      .get("notifications/logs?notificationChannel='email'")
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        should.exist(res.body);
        done();
      });
  });

  it("Send email using sendgrid", done => {
    request
      .post("notifications/email/sendgrid")
      .send(testData.emailData)
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        should.exist(res.body);
        done();
      });
  });

  it("Send sms using twillio", done => {
    request
      .post("notifications/sms/twillio")
      .send(testData.smsData)
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        should.exist(res.body);
        done();
      });
  });
});

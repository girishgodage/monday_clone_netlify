const express = require("express");
const serverless = require("serverless-http");
const axios = require("axios").default;
const cors = require("cors");
require("dotenv").config();

const bodyParser = require("body-parser");

const TOKEN = process.env.ADMIN_USER_TOKEN;
const baseURL = process.env.BASE_API;

console.log(TOKEN, baseURL);

const app = express();
const router = express.Router();

app.use(cors());
app.use(bodyParser.json());

// endpoint to collections task
const newCollection = "/api/rest/v2/namespaces/tickets/collections";
const collectionTask = "/api/rest/v2/namespaces/tickets/collections/task";

const createRequest = axios.create({
  baseURL: baseURL,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
    "X-Cassandra-Token": TOKEN,
  },
  timeout: 1000,
});

router.post(`/v1/tickets`, async (req, res) => {
  const { data } = req.body;

  try {
    var response = await createRequest.post(`${collectionTask}`, data);
    res.status(200).send(response.data);
  } catch (error) {
    res.status(500).send({ err: error });
  }
});

router.get("/v1/tickets", async (req, res) => {
  try {
    var response = await createRequest.get(`${collectionTask}?page-size=20`);
    res.status(200).send(response.data);
  } catch (error) {
    res.status(500).send({ err: error });
  }
});

router.get("/v1/tickets/:id", async (req, res) => {
  try {
    var response = await createRequest.get(
      `${collectionTask}/${req.params.id}`
    );
    res.status(200).send(response.data);
  } catch (error) {
    res.status(500).send({ err: error });
  }
});

router.delete("/v1/tickets/:id", async (req, res) => {
  try {
    var response = await createRequest.delete(
      `${collectionTask}/${req.params.id}`
    );
    res.status(200).send(response.data);
  } catch (error) {
    res.status(500).send({ err: error });
  }
});

router.put("/v1/tickets/:id", async (req, res) => {
  try {
    var response = await createRequest.put(
      `${collectionTask}/${req.params.id}`,
      req.body.data
    );
    res.status(200).send(response.data);
  } catch (error) {
    res.status(500).send({ err: error });
  }
});

app.use(`/.netlify/functions/api`, router);
//app.use(`/`, router);

module.exports = app;
module.exports.handler = serverless(app);

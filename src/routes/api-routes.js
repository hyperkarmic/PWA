const express = require("express");
const router = express.Router();
const Transaction = require("../models/transaction.js");

const postTransactions = ({ body }, res) => {
  Transaction.create(body)
    .then((dbTransaction) => {
      res.json(dbTransaction);
    })
    .catch((err) => {
      res.status(404).json(err);
    });
};
const postBulkTransactions = ({ body }, res) => {
  Transaction.insertMany(body)
    .then((dbTransaction) => {
      res.json(dbTransaction);
    })
    .catch((err) => {
      res.status(404).json(err);
    });
};
const getTransactions = (req, res) => {
  console.log("hello, Im working");
  Transaction.find({})
    .sort({ date: -1 })
    .then((dbTransaction) => {
      res.json(dbTransaction);
    })
    .catch((err) => {
      res.status(404).json(err);
    });
};

router.get("/api/transaction", getTransactions);
router.post("/api/transaction", postTransactions);
router.post("/api/transaction/bulk", postBulkTransactions);

module.exports = router;

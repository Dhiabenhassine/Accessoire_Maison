const express = require("express");
const router = express.Router();
const Auth = require("./Controller/Authentication");
const Product = require("./Controller/ProductsController");

module.exports = () => {
  router.post("/Authentication/register", async (req, res) => {
    try {
      await Auth.register(req, res);
    } catch (err) {
      console.log(err);
      res.status(500).json({ message: "Server error" });
    }
  });
  router.post("/Authentication/login", async (req, res) => {
    try {
      await Auth.login(req, res);
    } catch (err) {
      return res.status(401).json({ message: "Error server" });
    }
  });
  router.post("/Products/Insert", async (req, res) => {
    try {
      await Product.insert(req, res);
    } catch (err) {
      console.error(err);
      return res.status(500).send(`Error server`);
    }
  });
  router.get("/Products/SelectAllProducts", async (req, res) => {
    try {
      await Product.selectProduct(req, res);
    } catch (err) {
      console.log(err);
      return res.status(500).json({ message: "Error server" });
    }
  });
  router.post("/Products/selectProductByID", async (req, res) => {
    try {
      await Product.selectProductByID(req, res);
    } catch (err) {
      return res.status(400).json({ message: "Invalid ID." });
    }
  });
  router.post("/Products/UpdateProducts", async (req, res) => {
    try {
      await Product.updateProduct(req, res);
    } catch (err) {
      return res.status(400).json({ message: "Failed to update the product" });
    }
  });
  router.post("/Products/DeleteProducts", async (req, res) => {
    try {
      await Product.deleteProduct(req, res);
    } catch (err) {
      return res.status(400).json({
        message: "The id is invalid or does not exist in our database.",
      });
    }
  });
  return router;
};

const express = require("express");
const router = express.Router();
const Auth = require("./Controller/Authentication");
const Product = require("./Controller/ProductsController");
const Commentaire = require("./Controller/CommentaireController");
const Panier = require("./Controller/PanierController");
const Reduction = require("./Controller/ReductionController");
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
  router.get("/Products/selectVedette", async (req, res) => {
    try {
      await Product.selectVedette(req, res);
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
  router.post("/Commentaire/Insert", async (req, res) => {
    try {
      await Commentaire.insertCommentaire(req, res);
    } catch (err) {
      console.log("Erreur d'insertion de commentaire");
      return res.status(400).json({
        message: "The id is invalid or does not exist in our database.",
      });
    }
  });
  router.post("/Commentaire/getAllCommentsByProducts", async (req, res) => {
    try {
      await Commentaire.getAllCommentsByProducts(req, res);
    } catch (err) {
      return res.status(500).send();
    }
  });
  router.post("/Commentaire/updateCommentById", async (req, res) => {
    try {
      await Commentaire.updateCommentById(req, res);
    } catch (err) {
      return res
        .status(400)
        .json({ message: "Impossible de mettre à jour le commentaire." });
    }
  });
  router.post("/Commentaire/deleteCommentaire", async (req, res) => {
    try {
      await Commentaire.deleteCommentaire(req, res);
    } catch (e) {
      return res.status(400).json({
        message: "Le commentaire n'a pas été trouvé ou est déjà supprimé",
      });
    }
  });
  router.post("/Panier/insertPanier", async (req, res) => {
    try {
      await Panier.insertPanier(req, res);
    } catch (err) {
      res.status(500).send("server error");
    }
  });
  router.post("/Panier/selectPanierByID", async (req, res) => {
    try {
      await Panier.selectPanierByID(req, res);
    } catch (e) {
      console.log(e);
      res.status(400).json({ message: "le panier demandé n'existe pas" });
    }
  });
  router.post("/Panier/updatePanierByID", async (req, res) => {
    try {
      await Panier.updatePanierByID(req, res);
    } catch (err) {
      res
        .status(400)
        .json({ message: "Erreur lors de la mise à jour du panier" });
    }
  });
  router.post("/Panier/deletePanier", async (req, res) => {
    try {
      await Panier.deletePanier(req, res);
    } catch (err) {
      res.status(400).json({
        message:
          "Le panier que vous essayez de supprimer ne peut être supprimé car il contient des produits.",
      });
    }
  });
  router.post("/Reduction/updateReduction", async (req, res) => {
    try {
      await Reduction.updateReduction(req, res);
    } catch (err) {
      res
        .status(400)
        .json({ message: "La réduction n'a pas pu être modifiée." });
    }
  });
  router.post("/Reduction/deleteReduction", async (req, res) => {
    try {
      await Reduction.deleteReduction(req, res);
    } catch (err) {
      res.status(500).send("Une erreur est survenue");
    }
  });
  return router;
};

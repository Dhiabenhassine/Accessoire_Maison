const sequelize = require("../DataBase");

const insertCommentaire = async (req, res) => {
  try {
    const Commentaire = req.body.Commentaire;

    if (!Commentaire) {
      return res.status(400).json("Invalid Commentaire");
    }

    const { ID_Product, Note, Avis } = Commentaire;

    if (!ID_Product) {
      return res.status(400).send("Invalid ID_Product");
    }

    const queryCommentaire = `INSERT INTO Commentaires (ID_Product, Note, Avis)
        VALUES (:ID_Product, :Note, :Avis)`;

    const resultCommentaire = await sequelize.query(queryCommentaire, {
      replacements: {
        ID_Product,
        Note: Commentaire.Note || 0,
        Avis: Commentaire.Avis || 0,
      },
    });

    return res.status(200).send("Commentaire added successfully!");
  } catch (err) {
    console.error("Error: ", err);
    res.status(500).json({ message: "An error occurred" });
  }
};
const getAllCommentsByProducts = async (req, res) => {
  try {
    const { ID_Product } = req.body;

    if (!ID_Product) {
      return res.status(400).send("Invalid ID_Product");
    }

    const queryGetAllCommentsByProducts = `SELECT * FROM Commentaires WHERE ID_Product = :ID_Product 
    AND (Status = 'created' OR Status = 'updated')`;

    const results = await sequelize.query(queryGetAllCommentsByProducts, {
      replacements: { ID_Product },
      type: sequelize.QueryTypes.SELECT,
    });

    return res.status(200).send(results);
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "An error occurred" });
  }
};
const updateCommentById = async (req, res) => {
  try {
    const { ID_Commentaire, Note, Avis } = req.body.Commentaire;
    if (!ID_Commentaire || (Note === undefined && Avis === undefined)) {
      return res
        .status(400)
        .send("Invalid Commentaire ID or missing Note/Avis");
    }

    const queryUpdateComment = `
    UPDATE  Commentaires
    SET   ${Avis !== undefined ? "Avis = :Avis," : ""} 
    ${Note !== undefined ? "Note = :Note," : ""}
    Status = 'updated'
    WHERE ID_Commentaire = :ID_Commentaire
      `;

    const resultUpdateComment = await sequelize.query(queryUpdateComment, {
      replacements: {
        ID_Commentaire,
        Note,
        Avis,
      },
    });

    return res.status(200).send("Comment updated successfully!");
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "An error occurred" });
  }
};
const deleteCommentaire = async (req, res) => {
  try {
    const { ID_Commentaire } = req.body;
    if (!ID_Commentaire) {
      return res.status(400).send("Missing comment id");
    }

    const queryCommentaire = `SELECT * FROM Commentaires WHERE ID_Commentaire=:ID_Commentaire`;

    // Use sequelize.query to fetch data from the database
    const commentaires = await sequelize.query(queryCommentaire, {
      replacements: { ID_Commentaire },
      type: sequelize.QueryTypes.SELECT,
    });

    // Check if the comment exists
    if (commentaires && commentaires.length > 0) {
      const queryUpdateCommentaire = `UPDATE Commentaires SET Status='deleted' WHERE ID_Commentaire=:ID_Commentaire`;

      // Use sequelize.query to update the comment status
      const resultDelete = await sequelize.query(queryUpdateCommentaire, {
        replacements: { ID_Commentaire },
        type: sequelize.QueryTypes.UPDATE,
      });

      if (resultDelete[1] === 1) {
        return res
          .status(200)
          .send(`The comment with the id ${ID_Commentaire} has been deleted`);
      } else {
        return res
          .status(404)
          .send("The comment does not exist or is already deleted");
      }
    } else {
      return res
        .status(404)
        .send("The comment does not exist or is already deleted");
    }
  } catch (e) {
    console.log(e);
    res.status(500).json({ message: "An error occurred" });
  }
};

module.exports = {
  insertCommentaire,
  getAllCommentsByProducts,
  updateCommentById,
  deleteCommentaire,
};

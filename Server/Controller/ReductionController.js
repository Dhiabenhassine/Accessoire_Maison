const sequelize = require("../DataBase");
const updateReduction = async (req, res) => {
  try {
    const { ID_Reduction, Valeur } = req.body;

    if (!ID_Reduction || !Valeur) {
      return res.status(400).json({
        message: "Invalid request! Please provide all required fields.",
      });
    }

    const queryReduction = `
        UPDATE Reduction
        SET Status = 'updated',
            Valeur = :Valeur
        WHERE ID_Reduction = :ID_Reduction
      `;

    const resultUpdate = await sequelize.query(queryReduction, {
      replacements: {
        ID_Reduction: ID_Reduction,
        Valeur: Valeur,
      },
      type: sequelize.QueryTypes.UPDATE,
    });

    if (resultUpdate[1] === 0) {
      return res.status(404).json({ message: "Reduction not found" });
    }

    res.status(200).json({ message: "Reduction updated successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
};
const deleteReduction = async (req, res) => {
  try {
    const { ID_Reduction } = req.body;

    if (!ID_Reduction) {
      return res
        .status(400)
        .json({ message: "Invalid request! ID_Reduction is missing." });
    }

    const queryReduction = `
        SELECT *
        FROM Reduction
        WHERE ID_Reduction = :ID_Reduction
      `;

    const resultQuery = await sequelize.query(queryReduction, {
      replacements: { ID_Reduction: ID_Reduction },
      type: sequelize.QueryTypes.SELECT,
    });

    if (resultQuery.length === 0) {
      return res.status(404).json({ message: "Reduction not found" });
    }

    const queryDelete = `
        UPDATE Reduction
        SET  Status = 'deleted'
        WHERE ID_Reduction = :ID_Reduction
      `;

    const resultDelete = await sequelize.query(queryDelete, {
      replacements: { ID_Reduction: ID_Reduction },
      type: sequelize.QueryTypes.UPDATE,
    });

    res.status(200).send("Delete Success");
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = { updateReduction, deleteReduction };

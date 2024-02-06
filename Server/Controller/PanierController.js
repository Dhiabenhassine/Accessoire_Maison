const sequelize = require("../DataBase");

const insertPanier = async (req, res) => {
  try {
    const { ID_Product, ID_Reduction, quantity } = req.body.Panier;
    if (!ID_Product || !quantity) {
      return res.status(401).json({ msg: "You must fill in all the fields" });
    }

    // Fetch product details including price
    const queryProduct = `
      SELECT *
      FROM Products
      WHERE ID_Product = :ID_Product
    `;

    const resultProduct = await sequelize.query(queryProduct, {
      replacements: {
        ID_Product: ID_Product,
      },
      type: sequelize.QueryTypes.SELECT,
    });

    if (resultProduct.length === 0) {
      return res.status(404).json({ msg: "Product not found" });
    }

    const productPrice = resultProduct[0].Price;

    const queryPanier = `
      INSERT INTO Panier (ID_Product, ID_Reduction, quantity, Price)
      VALUES (:ID_Product, :ID_Reduction, :quantity, :Price)
    `;

    const resultPanier = await sequelize.query(queryPanier, {
      replacements: {
        ID_Product: ID_Product,
        ID_Reduction: ID_Reduction || null,
        quantity: quantity,
        Price: productPrice,
      },
    });

    res.status(200).send("Cart item inserted");
  } catch (err) {
    console.log("Error inserting into the cart: " + err);
    res.status(501).json({ message: "Server error" });
  }
};
const selectPanierByID = async (req, res) => {
  try {
    const { ID_Panier } = req.body;

    const queryPanier = `SELECT * FROM Panier WHERE ID_Panier = :ID_Panier`;

    const resultQuery = await sequelize.query(queryPanier, {
      replacements: {
        ID_Panier: ID_Panier,
      },
      type: sequelize.QueryTypes.SELECT,
    });

    if (resultQuery.length === 0) {
      return res.status(404).json({ message: "Panier not found" });
    }

    res.status(200).send({ resultQuery });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "An error occurred while trying to get data from the database",
    });
  }
};
const updatePanierByID = async (req, res) => {
  try {
    const { ID_Panier, quantity } = req.body;

    if (!ID_Panier || !quantity) {
      return res
        .status(400)
        .json({ message: "ID_Panier and quantity are required fields" });
    }

    const queryUpdatePanier = `
        UPDATE Panier
        SET quantity = :quantity,
        Status = 'Updated'
        WHERE ID_Panier = :ID_Panier
    
      `;

    const resultUpdatePanier = await sequelize.query(queryUpdatePanier, {
      replacements: {
        ID_Panier: ID_Panier,
        quantity: quantity,
      },
      type: sequelize.QueryTypes.UPDATE,
    });

    if (resultUpdatePanier[1] === 0) {
      return res.status(404).json({ message: "Panier not found" });
    }

    res.status(200).json({ message: "Panier updated successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "An error occurred while trying to update data in the database",
    });
  }
};
const deletePanier = async (req, res) => {
  try {
    const { ID_Panier } = req.body;

    if (!ID_Panier) {
      return res
        .status(400)
        .json({ message: "Invalid request! ID_Panier is missing." });
    }

    const queryPanier = `
        SELECT * 
        FROM Panier 
        WHERE ID_Panier = :ID_Panier
      `;

    const resultQuery = await sequelize.query(queryPanier, {
      replacements: { ID_Panier: ID_Panier },
      type: sequelize.QueryTypes.SELECT,
    });

    if (resultQuery.length === 0) {
      return res.status(404).json({ message: "Panier not found" });
    }

    const queryDelete = `
        UPDATE Panier 
        SET Status = 'deleted'
        WHERE ID_Panier = :ID_Panier
      `;

    const resultDelete = await sequelize.query(queryDelete, {
      replacements: { ID_Panier: ID_Panier },
      type: sequelize.QueryTypes.UPDATE,
    });

    res.status(200).send("Delete Success");
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal server error" });
  }
};
module.exports = {
  insertPanier,
  selectPanierByID,
  updatePanierByID,
  deletePanier,
};

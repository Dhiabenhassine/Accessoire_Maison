const sequelize = require("../DataBase");

const insert = async (req, res) => {
  try {
    const { ID_User, NameProduct, Price, Description, Stock_Qte, TypeProduct } =
      req.body.product;

    const images = req.body.images;
    const Valeur = req.body.reduction;

    if (
      ID_User &&
      NameProduct &&
      Price &&
      Description &&
      Stock_Qte &&
      Valeur &&
      TypeProduct &&
      images.length > 0
    ) {
      const queryInsert = `
          INSERT INTO Products (ID_User, NameProduct, Price, Description, Stock_Qte, TypeProduct)
          VALUES (:ID_User, :NameProduct, :Price, :Description, :Stock_Qte, :TypeProduct)
        `;
      const resultQueryInsert = await sequelize.query(queryInsert, {
        replacements: {
          ID_User: ID_User,
          NameProduct: NameProduct,
          Price: Price,
          Description: Description,
          Stock_Qte: parseInt(Stock_Qte),
          TypeProduct: TypeProduct,
        },
        type: sequelize.QueryTypes.INSERT,
      });
      const queryReduction = `INSERT INTO Reduction (ID_Product,Valeur)
VALUES (:ID_Product,:Valeur)
`;
      const resultReduction = await sequelize.query(queryReduction, {
        replacements: {
          ID_Product: resultQueryInsert[0],
          Valeur: Valeur,
        },
        type: sequelize.QueryTypes.INSERT,
      });
      if (resultQueryInsert && resultQueryInsert[1] === 1) {
        const ID_Product = resultQueryInsert[0];

        for (let image of images) {
          const queryImages = `
              INSERT INTO Images (Urlimage, ID_Product) VALUES (:Urlimage, :ID_Product)
            `;
          const [result] = await sequelize.query(queryImages, {
            replacements: {
              Urlimage: image.URLimage,
              ID_Product: ID_Product,
            },
            type: sequelize.QueryTypes.INSERT,
          });
        }

        return res.status(200).send("Product Inserted");
      } else {
        return res.status(500).send("Error inserting product");
      }
    } else {
      return res.status(406).send("Missing Arguments");
    }
  } catch (err) {
    console.error(err);
    return res.status(500).send({ error: "Internal Server Error" });
  }
};
const selectProduct = async (req, res) => {
  try {
    const queryProduct = `
      SELECT Products.NameProduct, 
      Products.Price, 
      Products.Description, 
      Products.Stock_Qte,
      Images.URLimage
      FROM Products
      JOIN Images ON Products.ID_Product  = Images.ID_Product
      `;
    const result = await sequelize.query(queryProduct, {
      type: sequelize.QueryTypes.SELECT,
    });
    var products = result;
    s;
    if (products.length > 0) {
      res.status(200).json({ products });
    } else {
      res.status(404).send("Product Not Found");
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};
const selectProductByID = async (req, res) => {
  try {
    const { ID_Product } = req.body;

    if (ID_Product) {
      const [Product] = await sequelize.query(
        `SELECT  * FROM Products WHERE ID_Product='${ID_Product}' AND Status = 'Visible'`
      );

      const [images] = await sequelize.query(
        `SELECT * FROM images WHERE ID_Product='${ID_Product}'`,
        { replacements: { id: ID_Product } }
      );

      if (Product.length > 0 && images.length > 0) {
        return res.status(200).json({
          Product: Product[0],
          images: images,
        });
      } else {
        return res.status(404).json({ message: "Product Not Found" });
      }
    } else {
      return res.status(406).json({ message: "Missing Arguments" });
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};
const updateProduct = async (req, res) => {
  try {
    const {
      ID_Product,
      NameProduct,
      Price,
      Description,
      Stock_Qte,
      TypeProduct,
    } = req.body.product;

    const images = req.body.images;

    if (
      ID_Product &&
      NameProduct &&
      Price &&
      Description &&
      Stock_Qte &&
      TypeProduct &&
      images.length > 0
    ) {
      const queryUpdate = `
            UPDATE Products 
            SET 
              NameProduct = :NameProduct,
              Price = :Price,
              Description = :Description,
              Stock_Qte = :Stock_Qte,
              TypeProduct = :TypeProduct
            WHERE 
              ID_Product = :ID_Product
          `;

      const resultQueryUpdate = await sequelize.query(queryUpdate, {
        replacements: {
          ID_Product: ID_Product,
          NameProduct: NameProduct,
          Price: Price,
          Description: Description,
          Stock_Qte: parseInt(Stock_Qte),
          TypeProduct: TypeProduct,
        },
        type: sequelize.QueryTypes.UPDATE,
      });

      if (resultQueryUpdate && resultQueryUpdate[1] === 1) {
        // Update successful, now update images
        await sequelize.query(
          `DELETE FROM Images WHERE ID_Product='${ID_Product}'`
        );

        for (let image of images) {
          const queryImages = `
                INSERT INTO Images (Urlimage, ID_Product) VALUES (:Urlimage, :ID_Product)
              `;
          await sequelize.query(queryImages, {
            replacements: {
              Urlimage: image.URLimage,
              ID_Product: ID_Product,
            },
            type: sequelize.QueryTypes.INSERT,
          });
        }

        return res.status(200).send("Product Updated");
      } else {
        return res.status(500).send("Error updating product");
      }
    } else {
      return res.status(406).send("Missing Arguments");
    }
  } catch (err) {
    console.error(err);
    return res.status(500).send({ error: "Internal Server Error" });
  }
};
const deleteProduct = async (req, res) => {
  try {
    const { ID_Product, ID_User } = req.body;

    if (ID_Product && ID_User) {
      const product = await sequelize.query(
        "SELECT * FROM Products WHERE ID_Product = :ID_Product",
        {
          replacements: { ID_Product: ID_Product },
          type: sequelize.QueryTypes.SELECT,
        }
      );

      if (product && product.length > 0) {
        const productID_User = product[0].ID_User;

        if (ID_User === productID_User) {
          const queryUpdate = `
              UPDATE Products SET Status = 'Deleted'
              WHERE ID_Product = :ID_Product`;

          await sequelize.query(queryUpdate, {
            replacements: { ID_Product: ID_Product },
            type: sequelize.QueryTypes.UPDATE,
          });

          res.status(200).json({ message: "Deleted successfully" });
        } else {
          // Sending a 403 status if the user doesn't have permission
          res.status(403).send("Permission denied.");
        }
      } else {
        // Sending a 404 status if the product is not found
        res.status(404).send("Product not found");
      }
    } else {
      // Sending a 400 status if either ID_Product or ID_User is missing
      res.status(400).send("Bad request. ID_Product and ID_User are required.");
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  insert,
  selectProduct,
  selectProductByID,
  updateProduct,
  deleteProduct,
};

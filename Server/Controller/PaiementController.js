const axios = require("axios");
const sequelize = require("../DataBase");
const authToken = "65c0ce8f43e3d4fae6fc856d:3bgXgpnM9dUGy7gVFoi9PQ8Y";

const InitPayment = async (req, res) => {
  try {
    const { ID_Facture, User_id } = req.body;
    if ((ID_Facture, User_id)) {
      const queryFactureInfos = `
    SELECT * FROM Facture 
    JOIN Commande ON Facture.ID_Commande = Commande.ID_Commande
    JOIN Users ON  Users.User_id  = Commande.User_id 
    WHERE ID_Facture=$ID_Facture;
    AND Commande.Status = 'created'
    AND  Users.User_id='${User_id}'
    `;
      let resultFactureInfos = await sequelize.query(queryFactureInfos, {
        type: sequelize.QueryTypes.SELECT,
      });
      if (resultFactureInfos && resultFactureInfos.length > 0) {
        resultFactureInfos = resultFactureInfos[0];
        const apiUrl =
          "https://api.konnect.network/api/v2/payments/init-payment";
        const montantapayer = parseInt(resultFactureInfos.Total);
        const requestBody = {
          receiverWalletId: "5f7a209aeb3f76490ac4a3d1",
          token: "TND",
          amount: montantapayer,
          type: "immediate",
          description: "Accessoires Maison" + ID_Facture,
          acceptedPaymentMethods: ["wallet", "bank_card", "e-DINAR"],
          lifespan: 10,
          checkoutForm: true,
          addPaymentFeesToAmount: true,
          firstName: resultFactureInfos.Prenom,
          lastName: resultFactureInfos.Nom,
          phoneNumber: resultFactureInfos.Mobile,
          email: resultFactureInfos.Email,
          orderId: ID_Facture,
          silentWebhook: true,
          successUrl: "http://localhost/AccessoireMaison/api/payment-success",
          failUrl: "http://localhost/AccessoireMaison/api/payment-failure",
          theme: "light",
        };
        const headers = {
          "Content-Type": "application/json",
          "x-api-key": `${authToken}`,
        };
        const response = await axios.post(apiUrl, requestBody, { headers });
        if (response.data.payUrl && response.data.paymentRef) {
          const InitPayment = await sequelize.query(
            `INSERT INTO Paiement (ID_Facture , TypeDePaiement , MoyenDePaiement , Ref_Paiement , Passerelle ,Montant ) VALUES ( :ID_Facture , :TypeDePaiement , :MoyenDePaiement , :Ref_Paiement , :Passerelle , :Montant )`,
            {
              replacements: {
                ID_Facture: ID_Facture,
                TypeDePaiement: "TPE",
                MoyenDePaiement: "TPE",
                Ref_Paiement: response.data.paymentRef,
                Montant: montantapayer,
                Passerelle: "",
              },
              type: sequelize.QueryTypes.INSERT,
            }
          );
          res.status(200).json(response.data);
        } else {
          // Sending a 500 status if the API response is unexpected
          res.status(500).json({ error: "Réponse inattendue de l'API" });
        }
      } else {
        // Sending a 404 status if the facture is not found

        res.status(404).send("Facture Introuvable ! ");
      }
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Error in InitPayment" });
  }
};
const VerifyPayment = async (req, res) => {
  try {
    const { Ref_Paiement } = req.body;
    if (Ref_Paiement) {
      const paiementIn = await sequelize.query(
        `
            SELECT Facture.ID_Commande, Commande.Status
            FROM Paiement 
            JOIN Facture ON Paiement.ID_Facture= Facture.ID_Facture
            JOIN Commande ON Facture.ID_Commande =  Commande.ID_Commande
            WHERE Paiement.Ref_Paiement = :Ref_Paiement
            `,
        { replacements: { Ref_Paiement: Ref_Paiement } },
        { type: sequelize.QueryTypes.SELECT }
      );
      if (paiementIn && paiementIn.length > 0) {
        const ResultPaiementInfos = paiementIn[0];
        const apiUrl =
          "https://api.konnect.network/api/v2/payments/" + Ref_Paiement;
        const response = await axios.get(apiUrl);
        if (response.status === 200) {
          console.log(response.data);
        } else {
          // Sending a 404 status if the payment is not found
          res.status(404).send("Payment not found");
        }
        if (response.data.payment.status !== ResultPaiementInfos.Status) {
          const UpdatePayementStatus = await sequelize.query(
            `UPDATE Paiement SET  Statut = :Statut WHERE Ref_Paiement = :Ref_Paiement`,
            {
              replacements: {
                Statut: response.data.payment.status,
                Ref_Paiement: Ref_Paiement,
              },
              type: sequelize.QueryTypes.UPDATE,
            }
          );
          const UpdateBookingStatus = await sequelize.query(
            `UPDATE ReservationsBiens SET  Statut = :Statut WHERE ID_Reservation = :ID_Reservation`,
            {
              replacements: {
                Statut:
                  ResultPaiementInfos.Statut == "PremierePartiePaye"
                    ? "PayeEnTotalite"
                    : "PremierePartiePaye",
                ID_Reservation: ResultPaiementInfos.ID_Reservation,
              },
              type: sequelize.QueryTypes.UPDATE,
            }
          );
          res.status(200).json(response.data);
        } else {
          // Sending a 500 status if the API response is unexpected
          res.status(500).json({ error: "Réponse inattendue de l'API" });
        }
      } else {
        // Sending a 404 status if the facture is not found
        res.status(404).send("Facture Introuvable ! ");
      }
    }
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ message: "Erreur dans la vérification du paiement." });
  }
};
module.exports = { InitPayment, VerifyPayment, InitLastPaiement };

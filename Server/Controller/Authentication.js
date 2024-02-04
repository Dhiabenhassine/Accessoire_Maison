const sequelize = require("../DataBase");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

// Function for user login authentication
const login = async (req, res) => {
  try {
    // Retrieve user information from the request body
    const { email, password } = req.body;

    // Check if email and password are provided
    if (email && password) {
      // Query to retrieve user information from the database based on email
      const userResult = await sequelize.query(
        `SELECT User_id, Nom, Prenom, Email, typeClient, Moderation, Mobile, Password FROM Users WHERE Email = '${email}' AND Moderation != 'banned' LIMIT 1`
      );

      // Extract user information from the query result
      const user = userResult[0][0];

      // Check if the user exists
      if (!user || Object.keys(user).length === 0) {
        return res.status(404).send("User Not found!");
      }

      // Compare the provided password with the hashed password in the database
      const isPasswordCorrect = await bcrypt.compare(password, user.Password);

      // If the password is correct, generate a JWT token
      if (isPasswordCorrect) {
        const secretKey = process.env.JWT_SECRET || "key";
        const token = jwt.sign({ id: user.User_id }, secretKey, {
          expiresIn: "3h",
        });

        // Respond with user information and token
        res.status(200).json({
          user: {
            User_id: user.User_id,
            Nom: user.Nom,
            Prenom: user.Prenom,
            Email: user.Email,
            typeClient: user.typeClient,
            Moderation: user.Moderation,
            Mobile: user.Mobile,
          },
          token,
        });
      } else {
        // Return an error if the password is incorrect
        res.status(401).send("Incorrect Password");
      }
    } else {
      // Return an error if email or password is missing
      res.status(400).send("Missing Email or Password");
    }
  } catch (err) {
    // Handle server errors by returning a 500 status code
    console.error(err);
    res.status(500).send("Server error");
  }
};

// Function for user registration
const register = async (req, res) => {
  try {
    // Retrieve user registration information from the request body
    const { prenom, nom, email, mobile, password } = req.body;

    // Check if all required fields are provided
    if (prenom && nom && email && mobile && password) {
      // Query to check if the email or mobile number is already registered
      const query = `SELECT COUNT(*) AS count FROM Users WHERE Email = :email OR Mobile = :mobile`;
      const countemailandphone = await sequelize.query(query, {
        type: sequelize.QueryTypes.SELECT,
        replacements: {
          email: email,
          mobile: mobile,
        },
      });
      const selectcount = countemailandphone[0]["count"];

      // If the email or mobile number is not already registered, proceed with registration
      if (selectcount === 0) {
        // Hash the user's password using bcrypt
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // Query to insert user registration details into the database
        const queryregisteraccount = `INSERT INTO Users (Prenom, Nom, Email, Password, Mobile)
        VALUES (:prenom, :nom, :email, :password, :mobile)`;

        // Execute the registration query
        const resregisteraccount = await sequelize.query(queryregisteraccount, {
          type: sequelize.QueryTypes.INSERT,
          replacements: {
            prenom: prenom,
            nom: nom,
            email: email,
            password: hashedPassword,
            mobile: mobile,
          },
        });

        // Respond with a success message
        res.status(200).send("Account Registered");
      } else {
        // Return an error if the email or phone number is already registered
        res.status(406).send("Email or phone already registered!");
      }
    } else {
      // Return an error if any of the required arguments is missing
      return res.status(406).send("Missing Arguments");
    }
  } catch (err) {
    // Handle server errors by returning a 500 status code
    console.error(err);
    res.status(500).send("Server error");
  }
};

module.exports = {
  register,
  login,
};

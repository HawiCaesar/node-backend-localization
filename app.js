
import express from "express";
import bcrypt from "bcryptjs";
import { connect } from "./config/database";
import { User } from './model/user'
import { auth } from "./middleware/auth";
import { i18next, i18nextMiddleware } from './i18n'

import dotenv from 'dotenv'
dotenv.config()
import jwt from 'jsonwebtoken'

connect()
const app = express();

app.use(express.json());

app.use(
   i18nextMiddleware.handle(i18next, {
        ignoreRoutes: ['/foo'] // or function(req, res, options, i18next) { /* return true to ignore */ }
    })
)

app.use((req, res, next) => {
  
  const allowedOrigins = ['http://localhost:3000'];
  const origin = req.headers.origin;
  console.log(origin,'########')
  // if (allowedOrigins.includes(origin)) {
  //      res.setHeader('Access-Control-Allow-Origin', origin);
  // }
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');
  return next();
});


// Register
app.post("/register", async (req, res) => {
// our register logic goes here...
try {
    // Get user input
    const { first_name, last_name, email, password } = req.body;

    // Validate user input
    if (!(email && password && first_name && last_name)) {
      return res.status(400).send(req.t('register.allRequired'));
    }

    // check if user already exist
    // Validate if user exist in our database
    const oldUser = await User.findOne({ email: email.toLowerCase() });


    if (oldUser) {
      return res.status(409).send(req.t('register.existingUser'));
    }

    //Encrypt user password
    const encryptedPassword = await bcrypt.hash(password, 10);

    // Create user in our database
    const user = await User.create({
      first_name,
      last_name,
      email: email.toLowerCase(), // sanitize: convert email to lowercase
      password: encryptedPassword,
    });

    // Create token
    const token = jwt.sign(
        { user_id: user._id, email },
        process.env.TOKEN_KEY,
        {
          expiresIn: "2h",
        }
      );
      // save user token
      user.token = token;
  
      // return new user
      res.status(201).json(user);
    } catch (err) {
      console.log(err);
    }
});

// Login
app.post("/login", async (req, res) => {
// our login logic goes here
try {
    // Get user input
    const { email, password } = req.body;

    // Validate user input
    if (!(email && password)) {
      res.status(400).send(req.t('register.allRequired'));
    }
    // Validate if user exist in our database
    const user = await User.findOne({ email: email.toLowerCase() });

    if (user && (await bcrypt.compare(password, user.password))) {
      // Create token
      const token = jwt.sign(
        { user_id: user._id, email },
        process.env.TOKEN_KEY,
        {
          expiresIn: "2h",
        }
      );

        // save user token
        user.token = token;

        // user
        res.status(200).json(user);
      }
      res.status(400).send(req.t('login.invalid'));
    } catch (err) {
      console.log(err);
    }
});

app.get("/welcome", auth, (req, res) => {
    res.status(200).send(`${req.t('welcome')} 🙌 `);
  });

app.get("/status", auth, (req, res) => {

  console.log('****')

  res.status(200).send({loggedIn: true, user: req.user.user_id})
})

export default app
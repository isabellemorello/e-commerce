const express = require("express");
const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const router = express.Router();

// Va a prendere la chiave segreta scritta nel file .env
const tokenJwt = process.env.JWT_TOKEN;

// Definisco lo schema per la collezione "users"
const userSchema = new mongoose.Schema({
  nome: {
    type: String,
    required: true,
    trim: true,
  },
  cognome: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    validate: (value) => {
      if (!validator.isEmail(value)) {
        throw new Error({ error: "Invalid Email address" });
      }
    },
  },
  password: {
    type: String,
    required: true,
    minLength: 8,
  },
  tokens: [
    // chiave tokens
    {
      token: {
        type: String,
        required: true,
      },
    },
  ],
  città: {
    type: String,
    required: true,
    trim: true,
  },
  indirizzo: {
    type: String,
    required: true,
    trim: true,
  },
  telefono: Number,
});

// La password deve essere criptata prima di fare save()
userSchema.pre("save", async function (next) {
  const user = this;
  if (user.isModified("password")) {
    // se la password viene modificata...
    user.password = await bcrypt.hash(user.password, 10); // ...viene criptata
  }
  next();
});

// Ogni volta che viene creato un utente viene chiamata la funzione che genera il token jwt e che ritorna il token
userSchema.methods.generateAuthToken = async function () {
  const user = this;
  // funzione jwt per definire il token jwt, passandogli il payload (_id) e la chiave segreta (tokenJwt)
  const token = jwt.sign({ _id: user._id }, tokenJwt); // nuovo token
  user.tokens = user.tokens.concat({ token }); // Concateno la chiave "tokens" di userSchema con il nuovo token creato
  await user.save();
  return token;
};

// Funzione per cercare l'utente tramite email e password
// statics di mongoose per definire una funzione statica
userSchema.statics.findByCredentials = async function (email, password) {
  const user = await User.findOne({ email });
  if (!user) {
    throw new Error({ error: "Le credenziali non sono valide." });
  }
  // Comparo la password inserita dall'utente con quella presente nel db
  const isPasswordMatch = await bcrypt.compare(password, user.password);
  if (!isPasswordMatch) {
    throw new Error({ error: "Le credenziali non sono valide." });
  }
  return user;
};

// Creo un modello che fa riferimento a userSchema
const User = mongoose.model("User", userSchema);

// **********************************************************************************

// Per creare un nuovo utente
router.post("/users", async function (req, res) {
  // Create a new user
  try {
    const user = new User(req.body);
    await user.save();
    const token = await user.generateAuthToken();
    res.status(201).send({ user, token });
  } catch (error) {
    res.status(400).send(error);
  }
});

// Per fare login
router.post("/users/login", async function (req, res) {
  try {
    const { email, password } = req.body;
    const user = await User.findByCredentials(email, password); // ricerca dell'utente tramite email e password
    if (!user) {
      return res.status(401).send({
        error: "Login fallito! Controlla le credenziali di autenticazione.",
      });
    }
    const token = await user.generateAuthToken(); // se trova l'utente genera un nuovo token
    res.send({ user, token });
  } catch (error) {
    res.status(400).send(error);
  }
});

// Middleware per la comunicazione DB-WEB APP per fare i controlli prima che la richiesta arrivi al server
// Per verificare che la persona che sta cercando di accedere alla risorsa, abbia di fatto l'autorizzazione
const auth = async function (req, res, next) {
  // Prendo il token della sessione dall'header ("Authorization") della richiesta
  const token = req.header("Authorization").replace("Bearer ", ""); // Rimpiazzo la keyword Baerer con una stringa vuota
  // Decodifica del token
  const data = jwt.verify(token, tokenJwt); // verifico che il mio token salvato in .env sia in grado di generare il token
  try {
    const user = await User.findOne({ _id: data._id, "tokens.token": token }); // Cerco un utente che ha quel token
    if (!user) {
      throw new Error();
    }
    req.user = user;
    req.token = token;
    next();
  } catch (error) {
    res.status(401).send({
      error: "Non hai l'autorizzazione per accedere a questa risorsa",
    });
  }
};

// Viene passato l'auth token quando richiedo di accedere a "/users/me"
router.get("/users/me", auth, async function (req, res) {
  // View logged in user profile
  res.send(req.user);
});

// Per fare il logout (viene cancellato il token)
router.post("/users/me/logout", auth, async (req, res) => {
  // Log user out of the application
  try {
    req.user.tokens = req.user.tokens.filter((token) => {
      return token.token != req.token;
    });
    await req.user.save();
    res.send();
  } catch (error) {
    res.status(500).send(error);
  }
});

// Per fare il logout da tutti i dispositiiv (vengono cancellati tutti i token)
router.post("/users/me/logoutall", auth, async (req, res) => {
  // Log user out of all devices
  try {
    req.user.tokens.splice(0, req.user.tokens.length);
    await req.user.save();
    res.send();
  } catch (error) {
    res.status(500).send(error);
  }
});

// **********************************************************************************
module.exports = router;
module.exports = User;

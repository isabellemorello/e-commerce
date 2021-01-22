// Importando con Node.js
const express = require("express"); // server http che intercetta le chiamate
const bodyParser = require("body-parser"); // per ottenere i dati inseriti con metodo post
const mongoose = require("mongoose"); // per il colegamento al database MongoDB

const app = express();

app.set("view engine", "ejs"); // per fare templating

app.use(bodyParser.urlencoded({ extended: true })); // per usare body-parser
app.use(express.static("public")); // serve il contenuto statico (non cambia da una richiesta all'altra) della cartella public
const pass = "UniPordenone";
const dbName = "ecommerceDB";

// Avvia la connessione a MongoDB utilizzando mongoose
mongoose.connect(
  "mongodb+srv://isabellemichelle:" +
    pass +
    "@applicazioniweb.hmyhw.mongodb.net/" +
    dbName +
    "?retryWrites=true&w=majority",
  { useNewUrlParser: true, useUnifiedTopology: true },
  function (err) {
    if (err) {
      console.log(err);
    } else {
      console.log("Successfully connected to DB");
    }
  }
);

// Creo lo schema della collezione "catalogo"
const catalogoSchema = new mongoose.Schema({
  codice: String,
  nomeProdotto: String,
  materiale: String,
  colore: String,
  prezzo: Number,
  dettagli: String,
  image: String,
  quantity: { type: Number, min: 1 },
  taglia: [
    {
      extraSmall: String,
      small: String,
      medium: String,
      large: String,
      extraLarge: String,
    },
  ],
});
// Creo un modello che fa riferimento a catalogoSchema
const Catalogo = mongoose.model("Catalogo", catalogoSchema);

// Creo lo schema della collezione "users"
const userSchema = new mongoose.Schema({
  nome: String,
  cognome: String,
  email: String,
  username: String,
  password: String,
  città: String,
  indirizzo: String,
  telefono: Number,
});
// Creo un modello che fa riferimento a userSchema
const User = mongoose.model("User", userSchema);

// Chiamata get
app.get("/", function (req, res) {
  Catalogo.find({}, function (err, foundItems) {
    res.render("home", { catalogo: foundItems });
  });
});

app.get("/prodotti/:itemId", function (req, res) {
  Catalogo.findOne({ _id: req.params.itemId }, function (err, foundOneItem) {
    if (foundOneItem) {
      res.render("scheda-prodotto", { prodotto: foundOneItem });
    } else {
      res.send("No articles matching that title was found");
    }
  });
});

// app.get("/prodotti/:customNameItem", function (req, res) {
//   const customNameItem = req.params.customNameItem;
//   Catalogo.findOne(
//     { nomeProdotto: customNameItem },
//     function (err, foundOneItem) {
//       if (!err) {
//         if (!foundOneItem) {
//           console.log("This page doesn't exist");
//         }
//       } else {
//         res.render("prodotti", { prodotti: foundOneItem });
//         console.log("GREAT JOB! Exists");
//       }

// if (foundOneItem) {
//   res.render("prodotti", { prodotti: foundOneItem });
// } else {
//   res.send(err);
// }

//     }
//   );
// });

app.get("/contatti", function (req, res) {
  res.sendFile(__dirname + "/contatti.html");
});

app.get("/login", function (req, res) {
  res.sendFile(__dirname + "/login.html");

  // const login = req.params.login;
  // User.findOne({nome: login}, function(err, foundName){
  //     if(!err) {
  //         console.log(foundName);
  //     } else {
  //         console.log(err);
  //     }
  // });
  // res.sendFile(__dirname + "/login.html");
});

app.post("/login", function (req, res) {
  const email = req.body.email;
  const password = req.body.password;

  const user = User.find({}, function (err) {
    if (err) {
      console.log(err);
    } else {
      if (email === user && password === user) {
        console.log("Bravo la mail è giusta");
      }
    }
  });
  res.redirect("/login");
});

// Chiamata post
app.post("/resgister", function (req, res) {
  const nome = req.body.nome; // sto andando a prende il contenuto dell'input che ha come nome nome
  const cognome = req.body.cognome;
  const email = req.body.email;
  const username = req.body.username;
  const password = req.body.password;
  const città = req.body.citta;
  const indirizzo = req.body.indirizzo;
  const telefono = req.body.telefono;

  // Per fare una specie di codifica di Hash
  function hashPassword(passwordHash) {
    const result = "";
    const characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    const charactersLenght = characters.length;
    for (var i = 0; i < passwordHash; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLenght));
    }
    return result;
  }

  // hashPassword(password.length);

  const user1 = new User({
    nome: nome,
    cognome: cognome,
    email: email,
    username: username,
    password: password,
    città: città,
    indirizzo: indirizzo,
    telefono: telefono,
  });

  user1.save();
  //console.log(nome + " " + cognome + email + "\n " + username + "\n " + password + "\n " + città + "\n " + indirizzo + "\n " + telefono );
  res.redirect("/contatti");
});

app.post("/contatti", function (req, res) {
  res.redirect("/");
});

// Avviare la connessione alla porta 3000
app.listen(3000, function (err) {
  if (err) {
    console.log(err);
  } else {
    console.log("Server is running on port 3000");
  }
});

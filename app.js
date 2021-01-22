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

const catalogo1 = new Catalogo({
  codice: "SKI-01",
  nomeProdotto: "Minigonna english style",
  materiale: "Composizione: Lana, Fodera: 98% poliestere, 2% elastan",
  colore: "Blu",
  prezzo: 59.99,
  dettagli: "Chiusura: Cerniera, Fantasia: Principe di Galles",
  image: "/images/gonna.jpg",
  quantity: "",
  taglia: [
    {
      extraSmall: "XS",
      small: "S",
      medium: "M",
      large: "L",
      extraLarge: "XL",
    },
  ],
});

const catalogo2 = new Catalogo({
  codice: "SWE-01",
  nomeProdotto: "Maglione - Classic",
  materiale: "Composizione: 80% acrilica, 20% poliestere, Materiale: Maglia",
  colore: "Verde",
  prezzo: 35.99,
  dettagli: "Scollo: Tondo, Fantasia: Monocromo",
  image: "/images/maglione1.png",
  quantity: "",
  taglia: [
    {
      extraSmall: "XS",
      small: "S",
      medium: "M",
      large: "L",
      extraLarge: "XL",
    },
  ],
});

const catalogo3 = new Catalogo({
  codice: "SWE-02",
  nomeProdotto: "Maglione - Classic",
  materiale: "Composizione: 80% acrilica, 20% poliestere, Materiale: Maglia",
  colore: "Rosa antico",
  prezzo: 35.99,
  dettagli: "Scollo: Tondo, Fantasia: Monocromo",
  image: "/images/maglione2.png",
  quantity: "",
  taglia: [
    {
      extraSmall: "XS",
      small: "S",
      medium: "M",
      large: "L",
      extraLarge: "XL",
    },
  ],
});

const catalogo4 = new Catalogo({
  codice: "SNE-01",
  nomeProdotto: "Sneakers basse",
  materiale: "Pelle e tessuto",
  colore: "Black",
  prezzo: 79.99,
  dettagli: "Punta: Tonda, Chiusura: Lacci, Tipo di tacco: Senza tacco",
  image: "/images/sneakers.png",
  quantity: "",
  taglia: [
    {
      extraSmall: "XS",
      small: "S",
      medium: "M",
      large: "L",
      extraLarge: "XL",
    },
  ],
});

const catalogo5 = new Catalogo({
  codice: "HEE-01",
  nomeProdotto: "Decolleté",
  materiale:
    "Materiale parte superiore: Finta pelle di alta qualità, Rivestimento: Finta pelle / Tessuto, Soletta: Similpelle, Suola: Materiale sintetico, Fodera: Senza fodera, Materiale: Fintapelle",
  colore: "Oro",
  prezzo: 45.99,
  dettagli:
    "Punta: A punta, Tipo di tacco: Tacco a spillo, Chiusura: Fibia, Fantasia: Monocromo",
  image: "/images/sandali.jpg",
  quantity: "",
  taglia: [
    {
      extraSmall: "XS",
      small: "S",
      medium: "M",
      large: "L",
      extraLarge: "XL",
    },
  ],
});

const catalogo6 = new Catalogo({
  codice: "SWE-03",
  nomeProdotto: "Maglione - Righe",
  materiale: "Composizione: 75% acrilica, 25% nylon, Materiale: Maglia",
  colore: "Grigio chiaro e blu",
  prezzo: 32.99,
  dettagli: "Scollo: Tondo, Fantasia: Righe",
  image: "/images/maglione3.jpg",
  quantity: "",
  taglia: [
    {
      extraSmall: "XS",
      small: "S",
      medium: "M",
      large: "L",
      extraLarge: "XL",
    },
  ],
});

const catalogo7 = new Catalogo({
  codice: "BAG-01",
  nomeProdotto: "Borsa a tracolla",
  materiale: "Materiale esterno: Fintapelle, Materiale della fodera: Tessuto",
  colore: "Argento e rosso",
  prezzo: 22.99,
  dettagli:
    "Scomparti: Scomparto cellulare, Chiusura: Chiusura a scatto, Fantasia: Bicolore",
  image: "/images/borsa.jpg",
  quantity: "",
  taglia: [
    {
      extraSmall: "XS",
      small: "S",
      medium: "M",
      large: "L",
      extraLarge: "XL",
    },
  ],
});

const catalogo8 = new Catalogo({
  codice: "EYE-01",
  nomeProdotto: "Occhiali da sole",
  materiale: "Plastica",
  colore: "Nero e fucsia",
  prezzo: 23.99,
  dettagli:
    "Forma occhiali: Cat eye, Fantasia: Bicolore, Colore delle lenti: Scuro, Protezione UV: sì, Portaocchiali: Sacchetto ",
  image: "/images/occhiali.jpg",
  quantity: "",
  taglia: [
    {
      extraSmall: "XS",
      small: "S",
      medium: "M",
      large: "L",
      extraLarge: "XL",
    },
  ],
});

const catalogo9 = new Catalogo({
  codice: "JEA-01",
  nomeProdotto: "Shorts di jeans",
  materiale: "Composizione: 100% cotone, Materiale: Jeans",
  colore: "Light-blue denim",
  prezzo: 19.99,
  dettagli:
    "Tipo di motivo: Colore unico, Tipo: Taglio dritto, Dettaglio: Strappato - Tasche, Chiusura: Bottone + Cerniera",
  image: "/images/pantaloncini.jpg",
  quantity: "",
  taglia: [
    {
      extraSmall: "XS",
      small: "S",
      medium: "M",
      large: "L",
      extraLarge: "XL",
    },
  ],
});

Catalogo.insertMany(
  [
    catalogo1,
    catalogo2,
    catalogo3,
    catalogo4,
    catalogo5,
    catalogo6,
    catalogo7,
    catalogo8,
    catalogo9,
  ],
  function (err) {
    if (err) {
      console.log(err);
    } else {
      console.log("Successfully saved to catalogos");
    }
  }
);

// Chiamata get
app.get("/", function (req, res) {
  Catalogo.find({}, function (err, foundItems) {
    res.render("home", { catalogo: foundItems });
  });
});

app.get("/prodotti", function (req, res) {
  res.render("prodotti");
});

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
app.post("/", function (req, res) {
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

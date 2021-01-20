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

// Creare un modello che fa riferimento a userSchema
const User = mongoose.model("User", userSchema);

// Creo una variabile che utilizza userSchema per inserire i dati nel DB
const user1 = new User({
  nome: "Isabelle",
  cognome: "Morello",
  email: "ciao@gmail.com",
  username: "isabellemorello",
  password: "unipordenone",
  città: "Gorizia",
  indirizzo: "via a caso",
  telefono: 9839475433,
});

const user2 = new User({
  nome: "Elena",
  cognome: "Del Bianco",
  email: "ciao@gmail.com",
  username: "isabellemorello",
  password: "unipordenone",
  città: "Gorizia",
  indirizzo: "via a caso",
  telefono: 9839475433,
});

// User.insertMany([user1, user2], function(err){
//     if(err) {
//                 console.log(err);
//             } else {
//                 console.log("Succesfully deleted to userDB");
//             }
// });



// Chiamata get
app.get("/", function (req, res) {
  res.sendFile(__dirname + "/index.html");
});

app.get("/contatti", function (req, res) {
  res.sendFile(__dirname + "/contatti.html");
});

app.get("/login", function(req, res){
    res.sendFile(__dirname + "/login.html")

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

app.post("/login", function(req, res) {
    const email = req.body.email;
    const password = req.body.password;

    const user = User.find({}, function(err){
        if(err){
            console.log(err);
        } else {
            if(email === user && password === user){
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
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    const charactersLenght = characters.length;
    for(var i=0; i<passwordHash; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLenght));
    }
    return result;
};

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

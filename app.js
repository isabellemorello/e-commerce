// Importando con Node.js
const express = require("express"); // server http che intercetta le chiamate
const bodyParser = require("body-parser"); // per ottenere i dati inseriti con metodo post
const mongoose = require("mongoose"); // per il colegamento al database MongoDB

const app = express();

app.set("view engine", "ejs"); // per fare templating

app.use(bodyParser.urlencoded({extended: true})); // per usare body-parser
app.use(express.static("public")); // serve il contenuto statico (non cambia da una richiesta all'altra) della cartella public
const password = "UniPordenone";
const dbName = "ecommerceDB";

// Avvia la connessione a MongoDB utilizzando mongoose
mongoose.connect("mongodb+srv://isabellemichelle:" + password + "@applicazioniweb.hmyhw.mongodb.net/" + dbName + "?retryWrites=true&w=majority", {useNewUrlParser: true, useUnifiedTopology: true}, function(err){
    if(err) {
        console.log(err);
    } else {
        console.log("Successfully connected to DB")
    }
});

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

const catalogoSchema = new mongoose.Schema({
    nomeProdotto: String,
    prezzo: Number,
    valuta: String,
    image: String,
    quantity: {type: Number, min: 1},
    colore: String,
    taglia: String,
    materiale: String,
});

const Catalogo = mongoose.model("Catalogo", catalogoSchema);

const catalogo1 = new Catalogo({
    nomeProdotto: "Jeans corto",
    prezzo: 19,
    valuta: "EUR",
    image: "/images/pantaloncini.jpg",
    quantity: "",
    colore: "Blu",
    taglia: "S, M, L, XL",
    materiale: "Jeans",
})

const catalogo2 = new Catalogo({
    nomeProdotto: "Gonna",
    prezzo: 19,
    valuta: "EUR",
    image: "",
    quantity: "",
    colore: "Nero check cozzese",
    taglia: "S, M, L, XL",
    materiale: "lana",
}) 

// Catalogo.insertMany([catalogo1, catalogo2], function(err){
//         if(err) {
//                     console.log(err);
//                 } else {
//                     console.log("Succesfully saved to userDB");
//                 }
//     });

// Chiamata get
app.get("/", function(req, res){
    res.sendFile(__dirname + "/index.html");
});

app.get("/contatti", function(req, res){
    res.sendFile(__dirname + "/contatti.html");
});

// Chiamata post
app.post("/", function(req, res){
    res.redirect("/contatti");
    });

app.post("/contatti", function(req,res){
    res.redirect("/");
});

// Avviare la connessione alla porta 3000
app.listen(3000, function(err){
    if(err) {
        console.log(err);
    } else {
        console.log("Server is running on port 3000");

    }
});
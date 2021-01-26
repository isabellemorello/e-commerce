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

//Creo lo schema della collezione "carrello"
const carrelloSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: User }, // ref = riferimento all'utente
  articolo: { type: mongoose.Schema.Types.ObjectId, ref: Catalogo }, // ref = riferimento all'articolo nel catalogo
  quantity: Number,
});
// Creo un modello che fa riferimento a userSchema
const Carrello = mongoose.model("Carrello", carrelloSchema);

// const carrello1 = Carrello({
//   user: user2,
//   articolo: catalogo1,
//   quantity: 1,
//   prezzo: 34,
// });
// carrello1.save();

// //RESTful API per la Home
app.route("/").get(function (req, res) {
  Catalogo.find({}, function (err, foundItems) {
    res.render("home", { catalogo: foundItems });
  });
});

//RESTful API per la Scheda Prodotti
// Vado a pescare i parametri di ogni singolo prodotto nel database attraverso
// l'id per fargli apparire così nella scheda prodotto
app.route("/prodotti/:itemId").get(async function (req, res) {
  // Catalogo.findOne({ _id: req.params.itemId }, function (err, foundOneItem) {
  //   if (foundOneItem) {
  //     res.render("scheda-prodotto", { prodotto: foundOneItem, user: });
  //   } else {
  //     res.send("No articles matching that title was found");
  //   }
  // });
  // Javascript aspetta che termini questa promise e il valore che torna è il valore di ritorno della promise
  const foundOneCatalogItem = await Catalogo.findOne({
    _id: req.params.itemId, // gli viene passato l'id come path parameter
  }).exec();

  const foundOneUser = await User.findOne({
    _id: "6006bb17e2122594c3500a6d",
  }).exec();

  if (foundOneCatalogItem && foundOneUser) {
    res.render("scheda-prodotto", {
      prodotto: foundOneCatalogItem,
      user: foundOneUser,
    });
  } else {
    res.send("No articles matching that title was found");
  }

  // const promise = new Promise(function (resolve) {
  //   setTimeout(function () {
  //     resolve("isabelle");
  //   }, 1000);
  // });

  // promise
  //   .then(function (value) {
  //     console.log(value);
  //   })
  //   .catch(function (error) {
  //     console.log(error);
  //   });
});
//   carrello1.save(function (err) {
//     if (err) {
//       console.log(err);
//     } else {
//       console.log("Articolo aggiunto al Carrello");
//     }
//   });
//   res.render("carrello");
// });

app
  .route("/carrello")
  .get(async function (req, res) {
    const foundCarrello = await Carrello.find({}).exec();

    if (foundCarrello) {
      const items = [];
      for await (const cartItem of foundCarrello) {
        const item = await Catalogo.findOne({ _id: cartItem.articolo }).exec();
        items.push(item);
      }

      res.render("carrello", { cartItems: items });
    } else {
      res.send("Non ci sono articoli nel carrello");
    }
  })
  .post(async function (req, res) {
    const { userId, prodottoId } = req.body;

    // Aspettiamo che venga creato il documento passato alla create()
    await Carrello.create({
      user: userId,
      articolo: prodottoId,
      quantity: 1,
    });

    // e poi facciamo il redirect verso il path /carrello
    res.redirect("/carrello");
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
app
  .route("/register")
  .get(function (req, res) {
    res.render("registrazione");
  })
  .post(function (req, res) {
    const nome = req.body.nome; // sto andando a prende il contenuto dell'input che ha come nome nome
    const cognome = req.body.cognome;
    const email = req.body.email;
    const username = req.body.username;
    const password = req.body.password;
    const città = req.body.citta;
    const indirizzo = req.body.indirizzo;
    const telefono = req.body.telefono;

    // Per fare una specie di codifica di Hash
    // function hashPassword(passwordHash) {
    //   const result = "";
    //   const characters =
    //     "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    //   const charactersLenght = characters.length;
    //   for (var i = 0; i < passwordHash; i++) {
    //     result += characters.charAt(Math.floor(Math.random() * charactersLenght));
    //   }
    //   return result;
    // }

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

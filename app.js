const express = require("express");
const app = express();
const port = 8080;

const admin = require("firebase-admin");
const serviceAccount = require("./ServiceAccountKey.json");

const bodyParser = require('body-parser');
const { firestore } = require("firebase-admin");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});
const db = admin.firestore();

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});

app.use(express.json())

app.put("/colour", (req, res) => {
  console.log(JSON.stringify(req.body))
  const getTile = async () => {
    return {
      hex: req.body.hex,
      location: new admin.firestore.Firestore.GeoPoint(req.body.location.latitude, req.body.location.longitude),
      uid: req.body.user
    };
  };

  getTile().then((result) => {
      return db.collection("tiles").add(result);
    })
    .catch((error) => console.error(error))
    .then(() => {
      res.send("new tile added!");
    });
});


/* this is the stuff that works
app.get("/new_quote", (req, res) => {

  const getQuote = async () => {
    return {
      quote: "Hello world!",
      author: "every single programmer ever"
    }
  }

  getQuote().then(result => {
    return db.collection('quotes').doc('test').set(result)
  }).catch(error => console.error(error))

  res.send("Sure")
})

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.get("/new_quote", (req, res) => {

  const getQuote = async () => {
    return {
      quote: "Hello world!",
      author: "every single programmer ever"
    }
  }

  getQuote().then(result => {
    return db.collection('quotes').doc('test').set(result)
  }).catch(error => console.error(error))

  res.send("Sure")
})
*/

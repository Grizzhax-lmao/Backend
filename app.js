const express = require("express");
const { firestore } = require("firebase-admin");
const app = express();
const port = 8080;

const admin = require("firebase-admin");

admin.initializeApp({
  credential: admin.credential.applicationDefault()
  // credential: admin.credential.cert(key)
});

const db = admin.firestore();

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});

app.use(express.json())

app.post("/createUser", (req, res) => {
  // the authentication stuff:
  const {uid} = req.body;

  const additionalClaims = {
    premiumAccount: true
  }

  admin.auth().createCustomToken(uid, additionalClaims)
    .then((customToken) => {
      res.json({jwt: customToken})
    })
    .catch((error) => {
      console.log("error creating token:", error)
    })

})

app.put("/colour", (req, res) => {
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

app.post("/colour", (req, res) => {

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
})

app.get("/tiles", async (req, res) => {
  const { userLocation, locationThreshold } = req.body;

  const tiles = [];

  const snapshot = await db.collection('tiles').get();

  snapshot.forEach((doc) => {
    tiles.push({
      id: doc.id,
      ...doc.data()
    })
  });

  // Keren will filter the tiles based on _latitude and _longitude

  res.json({
    tiles
  })
})
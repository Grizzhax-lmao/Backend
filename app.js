const express = require("express");
const app = express();
const port = 8080;

const admin = require("firebase-admin");
const serviceAccount = require("./ServiceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});

app.use(express.json());

app.put("/colour", (req, res) => {
  // console.log(JSON.stringify(req.body));

  const getTile = async () => {
    return {
      hex: req.body.hex,
      location: new admin.firestore.Firestore.GeoPoint(
        req.body.location.latitude,
        req.body.location.longitude
      ),
      uid: req.body.user,
    };
  };

  getTile()
    .then((result) => {
      return db.collection("tiles").add(result);
    })
    .catch((error) => console.error(error))
    .then(() => {
      res.send("new tile added!");
    });
});

/* not sure if this works
function calculateLongitude(userLat, kilometres) {
  var differenceLongitude = 2*Math.asin(Math.sqrt(Math.pow(kilometres/(Math.cos(userLat)), 2))*Math.pow(Math.sin(1/(2*6367.5)),2));
  return differenceLongitude;
}
*/

app.get("/nearby", (req, res) => {
  // console.log(JSON.stringify(req.body));

  const userLong = req.body.location.longitude;
  const userLat = req.body.location.latitude;

  const latitudeThreshold = 1 / 111; //km
  const longitudeThreshold = 1000 / (111320 * Math.cos(userLat)); //m

  var northwest = new admin.firestore.Firestore.GeoPoint(
    userLat - latitudeThreshold,
    userLong - longitudeThreshold
  );
  var southeast = new admin.firestore.Firestore.GeoPoint(
    userLat + latitudeThreshold,
    userLong + longitudeThreshold
  );

  // construct the Firestore query
  let query = db.collection("tiles")
    .where("location", ">=", northwest)
    .where("location", "<=", southeast);

  // return a Promise that fulfills with the locations
  return query
    .get()
    .then((snapshot) => {
      const allLocs = []; // used to hold all the loc data
      snapshot.forEach((loc) => {
        // get the data
        const data = loc.data();
        // add to the array
        allLocs.push(data);
      });
      res.json({ allLocs });
    })
    .catch((err) => {
      return new Error("Error while retrieving events");
    });
});

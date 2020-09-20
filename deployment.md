In order to deploy...
Switch to grizzhacks5 project
(`gcloud config set `)
Run `gcloud builds submit --tag gcr.io/grizzhacks5/backend-api`
That built the docker image

Now run and deploy the docker image:
Run `gcloud run deploy --image gcr.io/grizzhacks5/backend-api`

**Important Note:**
In app.js, the credential part on line 8 needs to be toggled.
cert(key) for local testing, applicationDefault() for the deployment

API Documentation:
GET /tiles -> returns the all the tiles (Keren, here is where you would perhaps reduce the # of tiles shown) line 76

POST /colour -> posts a tile: { 
    "hex": "e9c46a",
    "location":{
        "latitude": 0.0,
        "longitude": 0.0
    },
    "user": "23145jdksfmbfdkmr" 
}

PUT /colour -> exact same as above
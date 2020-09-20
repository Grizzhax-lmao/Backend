In order to deploy...
Switch to grizzhacks5 project
(`gcloud config set `)
Run `gcloud builds submit --tag gcr.io/grizzhacks5/backend-api`
That built the docker image

Now run and deploy the docker image:
Run `gcloud run deploy --image gcr.io/grizzhacks5/backend-api`
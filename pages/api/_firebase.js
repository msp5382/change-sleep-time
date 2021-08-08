import admin from "firebase-admin";

export default () => {
  if (admin.apps.length === 0) {
    admin.initializeApp({
      credential: admin.credential.cert({
        type: "service_account",
        project_id: "change-sleep-time",
        private_key_id: process.env.KEY_ID,
        private_key: process.env.PRIVATE_KEY,
        client_email:
          "firebase-adminsdk-i2313@change-sleep-time.iam.gserviceaccount.com",
        client_id: "105269768773853738095",
        auth_uri: "https://accounts.google.com/o/oauth2/auth",
        token_uri: "https://oauth2.googleapis.com/token",
        auth_provider_x509_cert_url:
          "https://www.googleapis.com/oauth2/v1/certs",
        client_x509_cert_url:
          "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-i2313%40change-sleep-time.iam.gserviceaccount.com",
      }),
      databaseURL: "https://vercel-serverless.firebaseio.com",
    });
  }
};

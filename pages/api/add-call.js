import init from "./_firebase";
import admin from "firebase-admin";
init();
export default function callAPI(req, res) {
  const db = admin.firestore();
  const ref = db.collection("calls").doc(req.body.time);
  ref.get().then(async (doc) => {
    if (doc.exists) {
      await ref.set({ queue: [...doc.data().queue, req.body.phone] });
    } else {
      await ref.set({ queue: [req.body.phone] });
    }
    res.status(200).json({
      phone: req.body.phone,
      status: "saved",
    });
  });
}

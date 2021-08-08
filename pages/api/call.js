import init from "./_firebase";
import admin from "firebase-admin";
init();

const accountSid = process.env.SID;
const authToken = process.env.TOKEN;
const client = require("twilio")(accountSid, authToken);

const verifyPhone = (phone) => {
  return (
    phone.split("").slice(0, 3).join("") == "+66" &&
    /^[0-9]{11}$/.test(phone.replace("+", ""))
  );
};

const wake = async (to) => {
  if (!verifyPhone("+66" + to.slice(1, 10))) {
    return;
  }

  return client.calls.create({
    twiml: "<Response><Say>Wake Up!</Say></Response>",
    to: "+66" + to.slice(1, 10),
    from: "+18302436115",
  });
};

const timeRound = (time) => {
  if (Math.abs(parseInt(time) - 0) < 10) {
    return "00";
  }
  if (Math.abs(parseInt(time) - 30) < 10) {
    return "30";
  }
  return "not-match";
};

export default function callAPI(req, res) {
  if (req.headers.key != process.env.API_KEY) {
    res.status(403).send();
  }
  const time = new Date()
    .toLocaleTimeString("th", {
      timeZone: "Asia/Jakarta",
    })
    .split(":");
  const date = new Date()
    .toLocaleDateString("th", {
      timeZone: "Asia/Jakarta",
    })
    .split("/")[0];
  // const time = ["7", "33", "00"];
  // const date = ["9"];

  console.log(time, date);

  const round = timeRound(time[1]);
  console.log("round", round);

  if (round === "not-match") {
    res.send();
    return;
  }
  if (!["6", "7", "8", "9", "10", "11", "18"].includes(time[0])) {
    res.send();
    return;
  }

  const pathStr = date + "*" + time[0] + ":" + round;

  const db = admin.firestore();
  const ref = db.collection("calls").doc(pathStr);
  ref.get().then(async (doc) => {
    if (doc.exists) {
      const queue = doc.data();
      res.status(200).json({ ...queue });

      console.log(
        await Promise.all(
          queue.queue.map((q) => {
            console.log("wake", q);
            return wake(q);
          })
        )
      );

      console.log("wake done");

      ref.delete();
    }
  });
}

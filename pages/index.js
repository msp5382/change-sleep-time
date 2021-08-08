import axios from "axios";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";

export default function Home() {
  const router = useRouter();
  const [hour, setHour] = useState("");
  const [min, setMin] = useState("");
  const [phone, setPhone] = useState("");
  const [isSave, setIsSave] = useState(false);
  const saveHandler = async () => {
    const date = new Date()
      .toLocaleDateString("th", {
        timeZone: "Asia/Jakarta",
      })
      .split("/")[0];
    const path = 1 + parseInt(date) + "*" + hour + ":" + min;

    if (!/^[0-9]{10}$/.test(phone)) {
      alert("เบอร์ผิดค้าบ");
      return;
    }
    if (hour == "") {
      alert("ใส่ชั่วโมงด้วยค้าบ");
      return;
    }
    if (min == "") {
      alert("ใส่นาทีด้วยค้าบ");
      return;
    }
    const lastSaved = JSON.parse(localStorage.getItem("change-sleep-time")) ?? {
      data: [],
    };

    if (
      lastSaved.data.filter((d) => {
        return d.phone == phone && d.path.split("*")[0] == 1 + parseInt(date);
      }).length > 0
    ) {
      alert("คุณเพิ่งตั้งปลุกไป");
      return;
    }

    const { data } = await axios.post("/api/add-call", {
      time: path,
      phone: phone,
    });
    if (data.status == "saved") {
      setIsSave(true);
      localStorage.setItem(
        "change-sleep-time",
        JSON.stringify({
          data: [...lastSaved.data, { path: path, phone: phone }],
        })
      );
    }
  };
  return (
    <div className="w-screen h-screen bg-yellow-100 pt-12 overflow-scroll">
      <div className="max-w-lg mx-auto w-full pl-2 pr-2">
        <div className="bg-white p-5 rounded-lg shadow-lg">
          <div className="text-2xl font-bold ">ปรับเวลานอน!</div>
          <div className="text-sm ">
            อยากปรับเวลานอน แต่ปรับไม่ได้? เรียนเช้า แต่ไม่มีคนโทรปลุก?{" "}
            ให้เราโทรปลุกสิ!
          </div>
          <div className="mt-1 mb-3 h-0 w-full border"></div>
          {isSave ? (
            <>
              <div className="text-lg font-bold">
                บันทึกแล้ว พรุ่งนี้เจอกัน!
              </div>
              <div className="border p-3">
                <div className="text-sm">พรุ่งนี้เราจะโทรหา : {phone}</div>
                <div className="text-sm">
                  เวลา : {hour}:{min}
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="my-1">
                <label className="block text-sm font-medium text-gray-700">
                  โทรตอนไหน?
                </label>
                <div className="mt-1 flex">
                  <select
                    onChange={(e) => setHour(e.target.value)}
                    className="mr-2 shadow-sm focus:ring-yellow-500 focus:border-yellow-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  >
                    <option value="">ชั่วโมง</option>
                    <option value="6">6</option>
                    <option value="7">7</option>
                    <option value="8">8</option>
                    <option value="9">9</option>
                    <option value="10">10</option>
                    <option value="11">11</option>
                  </select>
                  <div className="mt-1">:</div>
                  <select
                    onChange={(e) => setMin(e.target.value)}
                    className="ml-2 shadow-sm focus:ring-yellow-500 focus:border-yellow-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  >
                    <option value="">นาที</option>
                    <option value="00">00</option>
                    <option value="30">30</option>
                  </select>
                </div>
              </div>
              <div className="my-2">
                <label className="block text-sm font-medium text-gray-700">
                  โทรเบอร์อะไร?
                </label>
                <div className="mt-1">
                  <input
                    onChange={(e) => setPhone(e.target.value)}
                    value={phone}
                    type="text"
                    className="shadow-sm focus:ring-yellow-500 focus:border-yellow-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    placeholder="0812345678"
                  />
                </div>
              </div>
              <div className="text-sm text-gray-500">
                ระบบจะโทรพรุ่งนี้ จากเบอร์{" "}
                <a className="underline" href="tel:+18302436115">
                  +18302436115
                </a>{" "}
                (โทรจากต่างประเทศ) และเป็นระบบอัตโนมัติ คุยด้วยไม่ได้น้า
              </div>
              <div className="flex justify-end">
                <button
                  onClick={saveHandler}
                  type="button"
                  className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md shadow-sm text-white bg-yellow-600 hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
                >
                  บันทึก!
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

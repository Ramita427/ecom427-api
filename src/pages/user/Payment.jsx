import React, { useState, useEffect } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import { payment } from "../../api/stripe";
import useEcomStore from "../../store/ecom-store";
import CheckoutForm from "../../components/CheckoutForm";

let stripePromise;
try {
  const pk = import.meta.env.VITE_STRIPE_PK || "pk_test_mock_key_if_empty";
  stripePromise = loadStripe(pk);
} catch (err) {
  console.error("Stripe init error:", err);
}

const Payment = () => {
  const token = useEcomStore((s) => s.token);
  const [clientSecret, setClientSecret] = useState("");
  const [debugMessage, setDebugMessage] = useState("เริ่มต้นโหลดคอมโพเนนต์...");

  useEffect(() => {
    setDebugMessage("กำลังเริ่มยิง API ไปหาหลังบ้าน...");
    
    payment(token)
      .then((res) => {
        console.log("ผลลัพธ์จากหลังบ้าน:", res);
        if (res.data && res.data.clientSecret) {
          setClientSecret(res.data.clientSecret);
          setDebugMessage("ได้รับ clientSecret สำเร็จ!");
        } else {
          setDebugMessage("หลังบ้านตอบกลับมาสำเร็จ แต่ไม่มีคีย์ clientSecret");
        }
      })
      .catch((err) => {
        console.error("ยิง API พัง:", err);
        setDebugMessage(`ยิง API ไม่สำเร็จ: ${err.message}`);
      });
  }, []);

  const appearance = { theme: "stripe" };
  const loader = "auto";

  return (
    <div className="p-10 max-w-xl mx-auto bg-white shadow rounded mt-10">
      <h2 className="text-xl font-bold mb-4">หน้าต่างตรวจสอบสถานะการชำระเงิน</h2>
      <div className="bg-gray-100 p-3 rounded mb-4 text-sm text-gray-700">
        <strong>สถานะระบบ:</strong> {debugMessage}
      </div>

      {clientSecret ? (
        <Elements options={{ clientSecret, appearance, loader }} stripe={stripePromise}>
          <CheckoutForm />
        </Elements>
      ) : (
        <p className="text-xs text-amber-600">⚠️ กำลังรอคอยการเชื่อมต่อเพื่อเปิดฟอร์ม Stripe...</p>
      )}
    </div>
  );
};

export default Payment;
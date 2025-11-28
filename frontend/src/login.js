import { useState } from "react";
import { auth, RecaptchaVerifier, signInWithPhoneNumber } from "./firebase";

export default function Login({ onLogin }) {
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [confirmObj, setConfirmObj] = useState(null);

  const sendOtp = async () => {
    window.recaptchaVerifier = new RecaptchaVerifier(
      "recaptcha-container",
      { size: "invisible" },
      auth
    );

    const confirmation = await signInWithPhoneNumber(
      auth,
      "+91" + phone,
      window.recaptchaVerifier
    );

    setConfirmObj(confirmation);
    alert("OTP sent!");
  };

  const verifyOtp = async () => {
    const result = await confirmObj.confirm(otp);
    const user = result.user;
    onLogin(user.phoneNumber); // Send number to parent
  };

  return (
    <div>
      <h2>Login with OTP</h2>
      <input
        placeholder="Enter mobile number"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
      />

      <button onClick={sendOtp}>Send OTP</button>

      <div id="recaptcha-container"></div>

      {confirmObj && (
        <>
          <input
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
          />
          <button onClick={verifyOtp}>Verify OTP</button>
        </>
      )}
    </div>
  );
}

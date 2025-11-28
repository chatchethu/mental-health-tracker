import { useState } from "react";
import Login from "./login";
import Profile from "./Profile";

export default function App() {
  const [userPhone, setUserPhone] = useState(null);

  return (
    <>
      {userPhone ? (
        <Profile phone={userPhone} />
      ) : (
        <Login onLogin={setUserPhone} />
      )}
    </>
  );
}

import { useState, useEffect } from "react";

export default function Profile({ phone }) {
  const [profile, setProfile] = useState({
    name: "",
    age: "",
    gender: "",
  });

  useEffect(() => {
    const saved = localStorage.getItem("profile_" + phone);
    if (saved) setProfile(JSON.parse(saved));
  }, [phone]);

  const saveProfile = () => {
    localStorage.setItem("profile_" + phone, JSON.stringify(profile));
    alert("Profile saved!");
  };

  return (
    <div>
      <h2>Welcome {phone}</h2>
      <input
        placeholder="Name"
        value={profile.name}
        onChange={(e) => setProfile({ ...profile, name: e.target.value })}
      />

      <input
        placeholder="Age"
        value={profile.age}
        onChange={(e) => setProfile({ ...profile, age: e.target.value })}
      />

      <select
        value={profile.gender}
        onChange={(e) => setProfile({ ...profile, gender: e.target.value })}
      >
        <option value="">Select Gender</option>
        <option>Male</option>
        <option>Female</option>
      </select>

      <button onClick={saveProfile}>Save Profile</button>
    </div>
  );
}

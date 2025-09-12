import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { auth, db } from './firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import { doc, getDoc } from 'firebase/firestore';

import LoginPage from "./pages/LoginPage";
import OnboardingPage from "./components/OnboardingPage";
import ProfilePage from "./pages/ProfilePage";

function App() {
  const [user, loading] = useAuthState(auth);
  const [hasProfile, setHasProfile] = useState(false);
  const [profileLoading, setProfileLoading] = useState(true);

  useEffect(() => {
    const checkUserProfile = async () => {
      if (user) {
        const docRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(docRef);

        // Check if the document exists AND contains a 'personalDetails' object with a 'name' field
        if (docSnap.exists() && docSnap.data()?.personalDetails?.name) {
          setHasProfile(true);
        } else {
          setHasProfile(false);
        }
      }
      setProfileLoading(false);
    };

    if (user) {
      checkUserProfile();
    } else {
      setProfileLoading(false);
    }
  }, [user]);

  if (loading || profileLoading) {
    return <div>Loading...</div>;
  }

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/onboarding" element={user ? (hasProfile ? <Navigate to="/profile" /> : <OnboardingPage />) : <Navigate to="/login" />} />
        <Route path="/profile" element={user ? (hasProfile ? <ProfilePage /> : <Navigate to="/onboarding" />) : <Navigate to="/login" />} />
        <Route path="/" element={user ? (hasProfile ? <Navigate to="/profile" /> : <Navigate to="/onboarding" />) : <Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;
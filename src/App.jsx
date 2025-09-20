import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { auth, db } from './firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import { doc, getDoc } from 'firebase/firestore';

import LoginPage from "./pages/LoginPage";
import OnboardingPage from "./components/OnboardingPage";
import ProfilePage from "./pages/ProfilePage";
import LandingPage from "./LandingPage";
import Homepage from "./Homepage";

function App() {
  const [user, loading] = useAuthState(auth);
  const [hasProfile, setHasProfile] = useState(false);
  const [profileLoading, setProfileLoading] = useState(true);

  useEffect(() => {
    const checkUserProfile = async () => {
      if (user) {
        const docRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(docRef);

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
        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/homepage" element={<Homepage />} />
        <Route path="/login" element={<LoginPage />} />

        {/* Auth + Profile Routes */}
        <Route
          path="/onboarding"
          element={
            user ? (
              hasProfile ? <Navigate to="/profile" /> : <OnboardingPage />
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route
          path="/profile"
          element={
            user ? (
              hasProfile ? <ProfilePage /> : <Navigate to="/onboarding" />
            ) : (
              <Navigate to="/login" />
            )
          }
        />
      </Routes>
    </Router>
  );
}

export default App;

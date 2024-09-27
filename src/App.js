import React, { useEffect, useState } from 'react';
import { Amplify } from 'aws-amplify';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import { Authenticator, View, Image } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
import awsExports from './aws-exports';
import Home from './pages/Home';
import DreamStreamer from './components/DreamStreamer/DreamStreamer';
import AdminDashboard from './pages/AdminDashboard';
import './App.css';

// Import fetchAuthSession from @aws-amplify/auth
import { fetchAuthSession } from '@aws-amplify/auth';

Amplify.configure(awsExports);

function App({ signOut }) {
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    fetchAuthSession()
      .then(session => {
        console.log("Session:", session); // Debug: Log the session object

        // Use the accessToken's toString method to get the token
        const accessToken = session.tokens?.accessToken?.toString();
        if (!accessToken) {
          console.error("Access Token is missing in the session object");
          return;
        }

        // Access the groups from the accessToken payload
        const groups = session.tokens.accessToken.payload["cognito:groups"];
        console.log("User Groups:", groups); // Debug: Log the groups
        if (groups && groups.includes('admin')) {
          console.log("Redirecting to /admin");
          setIsAdmin(true);
          navigate('/admin');
        } else {
          console.log("Redirecting to /dreamstreamer");
          navigate('/dreamstreamer');
        }
      })
      .catch((error) => {
        console.error("Error fetching session:", error);
        navigate('/');
      });
  }, [navigate]);

  return (
    <Routes>
      <Route path="/" element={<Home signOut={signOut} />} />
      <Route path="/dreamstreamer" element={<DreamStreamer signOut={signOut} />} />
      {isAdmin && <Route path="/admin" element={<AdminDashboard signOut={signOut} />} />}
    </Routes>
  );
}

function AppWithAuth() {
  return (
    <Router>
      <Authenticator
        components={{
          Header() {
            return (
              
              <View textAlign="center" padding="large">
                
                 <h1 className="auth-title">Dream Streamer</h1>
                {/* <Image
                  src="https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.vecteezy.com%2Fvector-art%2F22506045-headphone-icon-in-flat-style-earphone-vector-illustration-on-isolated-background-listen-music-sign-business-concept&psig=AOvVaw1xp_QnA0-3cl8VGEKZ-xDY&ust=1727515870672000&source=images&cd=vfe&opi=89978449&ved=0CBQQjRxqFwoTCPCmkKXo4ogDFQAAAAAdAAAAABAw" // Replace with your logo URL
                  alt="DreamStreamer Logo"
                  className="auth-logo"
                  style={{ width: '150px', marginBottom: '20px' }}
                /> */}
                
                
              </View>
            );
          }
        }}
      >
        {({ signOut }) => <App signOut={signOut} />}
      </Authenticator>
    </Router>
  );
}

export default AppWithAuth;
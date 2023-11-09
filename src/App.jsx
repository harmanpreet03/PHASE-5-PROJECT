// App.jsx
import React, { useContext } from "react";
import { AuthForm } from "./components/AuthForm/AuthForm";
import { Dashboard } from "./components/Home/Dashboard";
import UserContext, { UserProvider } from "./contexts/UserContext";

import "./App.css";

function App() {
  return (
    <UserProvider>
      <div className="App">
        <UserConsumer />
      </div>
    </UserProvider>
  );
}

function UserConsumer() {
  const { user } = useContext(UserContext);
  return user && Object.keys(user).length !== 0 ? <Dashboard /> : <AuthForm />;
}

export default App;

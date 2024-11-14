import React from "react";
import { BrowserRouter } from "react-router-dom";
import Router from "./routes";
import { AuthProvider } from "./contexts/AuthContext";
import ThemeProvider from "./theme";

function App() {
  return (
    <AuthProvider>
      <ThemeProvider>

        <BrowserRouter>
          <Router />
        </BrowserRouter>

      </ThemeProvider>

    </AuthProvider>
  );
}

export default App;
import React from "react";
import AppRoutes from "./routes/AppRoutes";
import { AuthProvider } from "./Context/AuthContext"; // Import AuthContext
import { CourseProvider } from "./Context/CourseContext";

function App() {
    return (
        <AuthProvider>
           <CourseProvider>
              <AppRoutes />
            </CourseProvider> 
        </AuthProvider>
    );
}

export default App;

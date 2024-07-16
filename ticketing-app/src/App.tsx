import AppRoutes from "./AppRoutes";
import { BrowserRouter as Router } from "react-router-dom";

/*
Contains AppRoutes which handles the routing of various links throughout the application
*/

const App = () => {
  return (
    <Router>
      <AppRoutes />
    </Router>
  );
};

export default App;

import { BrowserRouter, Routes, Route } from "react-router-dom";
import Form from "./Form";
import Navbar from "./Navbar";
import ChipotleList from "./ChipotleList";
import Account from "./Account.jsx";
import Favorites from "./Favorites.jsx";
import PrivateRoute from "./PrivateRoute.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<Form />} />
          <Route path="/find-chipotle" element={<PrivateRoute />}>
            <Route path="/find-chipotle" element={<ChipotleList />} />
          </Route>
          <Route path="/account" element={<PrivateRoute />}>
            <Route path="/account" element={<Account />} />
          </Route>
          <Route path="/favorites" element={<PrivateRoute />}>
            <Route path="/favorites" element={<Favorites />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;

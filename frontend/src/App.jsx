import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./Navbar";
import ChipotleList from "./ChipotleList";
import Account from "./Account.jsx";
import Favorites from "./Favorites.jsx";
import PrivateRoute from "./PrivateRoute.jsx";
import Login from "./Login";
import Signup from "./Signup";
import Chipotle from "./Chipotle";
import { AuthProvider } from "./context/AuthContext.jsx";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route element={<PrivateRoute />}>
            <Route path="/account" element={<Account />} />
            <Route path="/find-chipotle" element={<ChipotleList />} />
            <Route path="/favorites" element={<Favorites />} />
            <Route path="/chipotle/:id" element={<Chipotle />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;

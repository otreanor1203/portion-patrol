import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./navbar.jsx";
import ChipotleList from "./ChipotleList.jsx";
import Favorites from "./Favorites.jsx";
import PrivateRoute from "./PrivateRoute.jsx";
import Login from "./Login.jsx";
import Signup from "./Signup.jsx";
import Chipotle from "./Chipotle.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";
import Requests from "./Requests.jsx";
import AddChipotleForm from "./AddChipotleForm.jsx";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route element={<PrivateRoute />}>
            <Route path="/find-chipotle" element={<ChipotleList />} />
            <Route path="/favorites" element={<Favorites />} />
            <Route path="/chipotle/:id" element={<Chipotle />} />
            <Route path="/requests" element={<Requests />} />
            <Route path="/add-chipotle" element={<AddChipotleForm />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;

import { BrowserRouter, Routes, Route } from "react-router-dom";
import Form from "./Form";
import Navbar from "./Navbar";
import ChipotleList from "./ChipotleList";
import Account from "./Account.jsx";
import Favorites from "./Favorites.jsx";

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Form />} />
        <Route path="/find-chipotle" element={<ChipotleList />} />
        <Route path="/account" element={<Account />} />
        <Route path="/favorites" element={<Favorites />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
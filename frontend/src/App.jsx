import { BrowserRouter, Routes, Route } from "react-router-dom";
import Form from "./Form";
import Navbar from "./Navbar";
import ChipotleList from "./ChipotleList";

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Form />} />
        <Route path="/find-chipotle" element={<ChipotleList />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
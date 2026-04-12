import "./App.css";
import { use, useState } from "react";
import axios from "axios";
import { useContext } from "react";
import { AuthContext } from "./context/AuthContext.jsx";
import { Navigate } from "react-router-dom";

export default function AddChipotleForm() {
    const state = useState("");
    const city = useState("");
    const address = useState("");
    const { currentUser } = useContext(AuthContext);

}

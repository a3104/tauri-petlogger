import { useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Weight from "./components/Weight";
import Vaccination from "./components/Vaccination";
import Clinic from "./components/Clinic";
import Medication from "./components/Medication";
import UrineTest from "./components/UrineTest";
import { invoke } from "@tauri-apps/api/core";
// import { message } from '@tauri-apps/api/dialog';

// import { message } from '@tauri-apps/api/core/message';
import "./App.css";
import { message } from '@tauri-apps/plugin-dialog';
import Menu from "./components/menu";
import Register from "./components/Register";
import { Pet } from "./models/pet";
import Pets from "./components/Pets";

function App() {
    const [greetMsg, setGreetMsg] = useState("");
    const [name, setName] = useState("");

    async function greet() {
        // Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
        let str: string = await invoke("greet", { name });
        setGreetMsg(str);
        await message(str, "info");
        // await message('Hello world', 'info');
    }
    async function aaa() {
        // Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
        await invoke("aaa");

    }

    return (
        <div>
            
            <Router>
            <Menu />

                <Routes>
                <Route path="/pets" element={<Pets />} />
                <Route path="/register" element={<Register isVisible={true} pet={{} as Pet} handleUpdate={function (pet: Pet): void {
                        throw new Error("Function not implemented.");
                    } } hideRegister={function (): void {
                        throw new Error("Function not implemented.");
                    } } />} />
                    <Route path="/weight" element={<Weight />} />
                    <Route path="/vaccination" element={<Vaccination />} />
                    <Route path="/clinic" element={<Clinic />} />
                    <Route path="/medication" element={<Medication />} />
                    <Route path="/urine-test" element={<UrineTest />} />
                </Routes>
            </Router>
            <main className="container">
            </main>
        </div>
    );
}

export default App;

import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Weight from "./components/Weight";
import Vaccination from "./components/Vaccination";
// import Clinic from "./components/Clinic";
// import Medication from "./components/Medication";
// import UrineTest from "./components/UrineTest";
// import { message } from '@tauri-apps/api/dialog';

// import { message } from '@tauri-apps/api/core/message';
import "./App.css";
import Menu from "./components/menu";
import Register from "./components/Register";
import { Pet } from "./models/pet";
import Pets from "./components/Pets";
import Configuration from "./components/Configuration.tsx";
import Clinic from "./components/Clinic.tsx";

function App() {

    return (
        <div>
            
            <Router>
            <Menu />

                <Routes>
                <Route path="/pets" element={<Pets />} />
                <Route path="/register" element={<Register isVisible={true} pet={new Pet(0, '', 0, 0, 0, 0, 0, 0)} handleUpdate={function (_): void {
                        throw new Error("Function not implemented.");
                    } } hideRegister={function (): void {
                        throw new Error("Function not implemented.");
                    } } />} />
                    <Route path="/weight" element={<Weight />} />
                    <Route path="/vaccination" element={<Vaccination />} />
                    <Route path="/configuration" element={<Configuration />} />
                    <Route path="/clinic" element={<Clinic />} />
                    {/* <Route path="/medication" element={<Medication />} />
                    <Route path="/urine-test" element={<UrineTest />} /> */}
                </Routes>
            </Router>
            <main className="container">
            </main>
        </div>
    );
}

export default App;

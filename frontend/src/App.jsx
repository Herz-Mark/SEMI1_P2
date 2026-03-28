import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Importamos nuestros componentes y páginas corregidos
import Navbar from "./components/Navbar";
import Landing from "./pages/Landing";
import Registro from "./pages/Registro";
import Login from "./pages/Login";
import Tareas from "./pages/Tareas";
import Archivos from "./pages/Archivos";
import VerArchivos from "./pages/VerArchivos";

function App() {
  return (
    <Router>
      {/* El Navbar queda fuera de las Rutas para que no desaparezca al cambiar de página */}
      <Navbar />

      {/* main envuelve el contenido dinámico de las páginas */}
      <main className="p-16">
        <Routes>
          {/* Definimos qué componente se carga en cada URL */}
          <Route path="/" element={<Landing />} />
          <Route path="/registro" element={<Registro />} />
          <Route path="/login" element={<Login />} />
          <Route path="/tareas" element={<Tareas />} />
          <Route path="/archivos" element={<Archivos />} />
          <Route path="/verArchivos" element={<VerArchivos />} />
        </Routes>
      </main>
    </Router>
  );
}

export default App;

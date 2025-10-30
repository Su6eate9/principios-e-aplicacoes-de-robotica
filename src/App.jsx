import React from "react";
import ReactDOM from "react-dom/client";
import RobotExercises from "./src/RobotExercises";
import "./index.css"; // Certifique-se de ter Tailwind CSS configurado

function App() {
  return (
    <div className="App">
      <RobotExercises />
    </div>
  );
}

export const Exercise1 = () => {
  return (
    <div className="min-h-screen bg-gray-900 p-6">
      <h1 className="text-white text-2xl mb-4">Questão 1 - Transformações</h1>
      <RobotExercises />
    </div>
  );
};

export const Exercise2 = () => {
  return (
    <div className="min-h-screen bg-gray-900 p-6">
      <h1 className="text-white text-2xl mb-4">
        Questão 2 - Modelo de Bicicleta
      </h1>
      <RobotExercises />
    </div>
  );
};

export const Exercise3 = () => {
  return (
    <div className="min-h-screen bg-gray-900 p-6">
      <h1 className="text-white text-2xl mb-4">
        Questão 3 - Navegação Braitenberg
      </h1>
      <RobotExercises />
    </div>
  );
};

// Renderizar a aplicação
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

export default App;

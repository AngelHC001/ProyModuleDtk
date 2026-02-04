import React from "react";
import '../assets/utils/a-estilos.css'

function MainCanvas({ children }) { 
  return (
    <main>
        <div className="bg-bottom">
            {children}
        </div>
    </main>
  );
}

export default MainCanvas;
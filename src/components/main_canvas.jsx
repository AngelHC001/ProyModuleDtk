import React from "react";

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
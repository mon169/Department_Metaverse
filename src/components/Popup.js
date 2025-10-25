import React from 'react';

function Popup() {
  return (
    <div className="popup">
      <p>Marker reached!</p>
      <button onClick={() => console.log("Popup action triggered")}>Close</button>
    </div>
  );
}

export default Popup;
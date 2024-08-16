import React from "react";

export default function Loader() {
  return (
    <div className="grid place-items-center fixed bg-black opacity-90 z-10 inset-0">
      <div className="lds-facebook">
        <div></div>
        <div></div>
        <div></div>
      </div>
    </div>
  );
}

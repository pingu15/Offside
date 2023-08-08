import React, { useEffect, useRef } from "react";
import load from "../images/load.gif";
import "../css/Loading.css";

export default function Loading() {
  const ref = useRef(null);
  useEffect(() => {
    resize();
    function resize() {
        if(!ref.current) return;
        ref.current.style.transform = `scale(${window.innerWidth / 1920})`;
    }
    window.addEventListener("resize", resize);
  });
  return (
    <div ref={ref} className="webpage" >
        <img src={load} alt="loading" className="loading" />
    </div>
  );
}

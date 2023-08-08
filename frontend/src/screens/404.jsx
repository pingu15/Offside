import React, { useEffect, useRef } from "react";
import notFound from "../images/404.png";
import "../css/404.css";
import logo from "../images/logo.png";

export default function NotFound() {
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
      <div className="top-bar">
        <a className="logo" href="/">
          <img className="img" alt="Logo" src={logo} />
        </a>
        <div className="nav-bar">
          <div className="menu">
            <a href="cards" className="div">
              CARDS
            </a>
            <a href="glossary" className="div">
              GLOSSARY
            </a>
            <a href="about" className="div">
              ABOUT
            </a>
          </div>
        </div>
      </div>
      <div className="message">404: Puck Out of Play.</div>
      <img src={notFound} alt="404" className="notFound" />
    </div>
  );
}

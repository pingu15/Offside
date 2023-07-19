import React, { useEffect, useRef } from "react";
import ReactMarkdown from "react-markdown";
import glossary from "../Glossary.md";
import logo from "../images/logo.png";
import "../css/Glossary.css";

export default function Glossary() {
  const ref = useRef(null);
  useEffect(() => {
    resize();
    function resize() {
      ref.current.style.transform = `scale(${window.innerWidth / 1920})`;
    }
    window.addEventListener("resize", resize);
  });
  const [content, setContent] = React.useState(null);
  useEffect(() => {
    fetch(glossary)
      .then((response) => response.text())
      .then((text) => setContent(text));
  });
  return (
    <div className="webpage" ref={ref}>
      <div className="top-bar">
        <div className="logo">
          <img className="img" alt="Logo" src={logo} />
        </div>
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
      <ReactMarkdown children={content} className="markdown" />
    </div>
  );
}

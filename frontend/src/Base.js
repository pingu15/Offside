import LoadCards from "./utils/LoadCards";
import Glossary from "./screens/Glossary";
import About from "./screens/About";
import NotFound from "./screens/404";
import { BrowserRouter, Routes, Route } from "react-router-dom";

export default function Base() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path={""} element={<LoadCards />} />
        <Route path={"/cards"} element={<LoadCards />} />
        <Route path={"/glossary"} element={<Glossary />} />
        <Route path={"/about"} element={<About />} />
        <Route path={"*"} element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

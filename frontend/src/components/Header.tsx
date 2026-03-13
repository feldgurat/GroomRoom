import { Link } from "react-router-dom";
import "./Header.css";

export default function Header() {
  return (
    <header className="header">
      <nav className="nav">
        <Link to="/">Главная</Link>
        <Link to="/about">О нас</Link>
        <Link to="/contacts">Контакты</Link>
        <Link to="/login">Авторизация</Link>
        <Link to="/register">Регистрация</Link>
      </nav>
    </header>
  );
}

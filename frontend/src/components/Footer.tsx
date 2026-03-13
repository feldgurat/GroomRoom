import "./Footer.css";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-inner">
        © {new Date().getFullYear()} Моя лаба · Все права защищены
      </div>
    </footer>
  );
}

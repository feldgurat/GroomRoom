import { Link, useNavigate } from "react-router-dom";
import { PawPrint, LogOut, LayoutDashboard, Shield, Menu, X } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useState } from "react";

export default function Header() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate("/");
    setOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 glass border-b border-sand/30">
      <div className="w-[min(1100px,calc(100%-32px))] mx-auto flex items-center justify-between min-h-[64px]">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 group" onClick={() => setOpen(false)}>
          <PawPrint className="w-7 h-7 text-rose transition-transform duration-300 group-hover:rotate-12" />
          <span className="font-display text-xl font-bold text-mocha-dark">
            Groom<span className="text-rose">Room</span>
          </span>
        </Link>

        {/* Mobile toggle */}
        <button className="sm:hidden p-2 rounded-xl hover:bg-sand/30 transition" onClick={() => setOpen(!open)}>
          {open ? <X className="w-5 h-5 text-mocha" /> : <Menu className="w-5 h-5 text-mocha" />}
        </button>

        {/* Nav */}
        <nav
          className={`${
            open ? "flex" : "hidden"
          } sm:flex flex-col sm:flex-row absolute sm:static top-full left-0 right-0 bg-white/95 sm:bg-transparent backdrop-blur sm:backdrop-blur-none border-b sm:border-0 border-sand/30 p-4 sm:p-0 gap-1 sm:gap-1 items-stretch sm:items-center z-50`}
        >
          <NavLink to="/" onClick={() => setOpen(false)}>Главная</NavLink>
          <NavLink to="/about" onClick={() => setOpen(false)}>О нас</NavLink>
          <NavLink to="/contacts" onClick={() => setOpen(false)}>Контакты</NavLink>

          {!user ? (
            <>
              <NavLink to="/login" onClick={() => setOpen(false)}>Вход</NavLink>
              <NavLink to="/register" onClick={() => setOpen(false)}>Регистрация</NavLink>
            </>
          ) : (
            <>
              <NavLink to="/dashboard" onClick={() => setOpen(false)}>
                <LayoutDashboard className="w-4 h-4 inline mr-1" />
                Мои заявки
              </NavLink>

              {user.role === "admin" && (
                <NavLink to="/admin" onClick={() => setOpen(false)}>
                  <Shield className="w-4 h-4 inline mr-1" />
                  Админ
                </NavLink>
              )}

              <div className="hidden sm:block w-px h-6 bg-sand/60 mx-1" />

              <span className="text-xs text-mocha/60 px-3 py-2 truncate max-w-[140px]">
                {user.name}
              </span>

              <button
                onClick={handleLogout}
                className="flex items-center gap-1.5 text-sm font-medium text-mocha/70 hover:text-red-500 transition-colors px-3 py-2 rounded-xl hover:bg-red-50 text-left"
              >
                <LogOut className="w-4 h-4" />
                Выход
              </button>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}

function NavLink({ to, children, onClick }: { to: string; children: React.ReactNode; onClick?: () => void }) {
  return (
    <Link
      to={to}
      onClick={onClick}
      className="text-sm font-medium text-mocha hover:text-rose transition-colors px-3 py-2 rounded-xl hover:bg-rose/5"
    >
      {children}
    </Link>
  );
}

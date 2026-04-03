import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { LogIn, Eye, EyeOff } from 'lucide-react';
import { login as apiLogin, getMe, setToken } from '../api/client';
import { useAuth } from '../context/AuthContext';
import Toast from '../components/Toast';

export default function Login() {
  const [form, setForm] = useState({ login: '', password: '' });
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const { setUser } = useAuth();
  const navigate = useNavigate();

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm(p => ({ ...p, [e.target.name]: e.target.value }));

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.login || !form.password) { setToast('Заполните все поля'); return; }
    setLoading(true);
    try {
      const data = await apiLogin(form.login, form.password);
      setToken(data.access_token);
      const me = await getMe();
      setUser(me);
      navigate(me.role === 'admin' ? '/admin' : '/dashboard');
    } catch (err: any) {
      setToast(typeof err.detail === 'string' ? err.detail : 'Неверный логин или пароль');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center py-8 animate-fade-in">
      {toast && <Toast message={toast} onClose={() => setToast(null)} />}

      <div className="card p-6 sm:p-8 w-full max-w-md">
        <h1 className="font-display text-2xl font-bold text-mocha-dark mb-1">Вход</h1>
        <p className="text-mocha/60 text-sm mb-6">Войдите, чтобы управлять заявками</p>

        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-mocha mb-1.5">Логин</label>
            <input name="login" value={form.login} onChange={onChange}
              placeholder="Введите логин" className="input-field" autoComplete="username" />
          </div>

          <div>
            <label className="block text-sm font-medium text-mocha mb-1.5">Пароль</label>
            <div className="relative">
              <input type={showPw ? 'text' : 'password'} name="password" value={form.password}
                onChange={onChange} placeholder="Введите пароль" className="input-field pr-12"
                autoComplete="current-password" />
              <button type="button" onClick={() => setShowPw(!showPw)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-mocha/40 hover:text-mocha transition">
                {showPw ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <button type="submit" disabled={loading}
            className="btn-primary w-full flex items-center justify-center gap-2">
            <LogIn className="w-4 h-4" />
            {loading ? 'Вход…' : 'Войти'}
          </button>
        </form>

        <p className="text-center text-sm text-mocha/60 mt-5">
          Нет аккаунта?{' '}
          <Link to="/register" className="text-rose hover:text-rose-dark font-medium transition">
            Зарегистрироваться
          </Link>
        </p>
      </div>
    </div>
  );
}

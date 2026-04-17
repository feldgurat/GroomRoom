import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserPlus, Eye, EyeOff } from 'lucide-react';
import { register as apiRegister } from '../api/client';
import type { RegisterPayload } from '../types';
import Toast from '../components/Toast';

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState<RegisterPayload>({
    name: '', login: '', email: '', password: '', password_repeat: '', consent: false,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<{ msg: string; type: 'error' | 'success' } | null>(null);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setForm(p => ({ ...p, [name]: type === 'checkbox' ? checked : value }));
    setErrors(p => { const n = { ...p }; delete n[name]; return n; });
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setLoading(true);
    try {
      await apiRegister(form);
      setToast({ msg: 'Регистрация прошла успешно!', type: 'success' });
      setTimeout(() => navigate('/login'), 1500);
    } catch (err: any) {
      const detail = err.detail;
      if (typeof detail === 'string') {
        setToast({ msg: detail, type: 'error' });
      } else if (Array.isArray(detail)) {
        const errs: Record<string, string> = {};
        detail.forEach((d: any) => {
          const field = d.loc?.[d.loc.length - 1] ?? '_general';
          errs[field] = (d.msg || '').replace('Value error, ', '');
        });
        setErrors(errs);
        if (errs._general) setToast({ msg: errs._general, type: 'error' });
      } else {
        setToast({ msg: 'Ошибка при регистрации', type: 'error' });
      }
    } finally {
      setLoading(false);
    }
  };

  const fc = (n: string) => `input-field ${errors[n] ? 'input-error' : ''}`;

  return (
    <div className="flex justify-center py-8 animate-fade-in">
      {toast && <Toast message={toast.msg} type={toast.type} onClose={() => setToast(null)} />}

      <div className="card p-6 sm:p-8 w-full max-w-md">
        <h1 className="font-display text-2xl font-bold text-mocha-dark mb-1">Регистрация</h1>
        <p className="text-mocha/60 text-sm mb-6">Создайте аккаунт для записи на груминг</p>

        <form onSubmit={onSubmit} className="space-y-4">
          <Field label="ФИО" name="name" value={form.name} onChange={onChange}
            placeholder="Иванова Анна Петровна" cls={fc('name')} error={errors.name} />

          <Field label="Логин" name="login" value={form.login} onChange={onChange}
            placeholder="my-login" cls={fc('login')} error={errors.login} autoComplete="username" />

          <Field label="Email" name="email" value={form.email} onChange={onChange}
            placeholder="email@example.com" cls={fc('email')} error={errors.email} type="email" />

          <div>
            <label className="block text-sm font-medium text-mocha mb-1.5">Пароль</label>
            <div className="relative">
              <input type={showPw ? 'text' : 'password'} name="password" value={form.password}
                onChange={onChange} placeholder="Придумайте пароль" className={`${fc('password')} pr-12`}
                autoComplete="new-password" />
              <button type="button" onClick={() => setShowPw(!showPw)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-mocha/40 hover:text-mocha transition">
                {showPw ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            {errors.password && <p className="text-xs text-red-500 mt-1">{errors.password}</p>}
          </div>

          <Field label="Повтор пароля" name="password_repeat" value={form.password_repeat}
            onChange={onChange} placeholder="Повторите пароль" cls={fc('password_repeat')}
            error={errors.password_repeat} type={showPw ? 'text' : 'password'}
            autoComplete="new-password" />

          <label className={`flex items-start gap-3 cursor-pointer select-none p-3 rounded-xl transition ${
            errors.consent ? 'bg-red-50 ring-1 ring-red-300' : 'hover:bg-blush/50'
          }`}>
            <input type="checkbox" name="consent" checked={form.consent} onChange={onChange}
              className="mt-0.5 w-4 h-4 rounded border-sand text-rose focus:ring-rose/30 accent-rose" />
            <span className="text-sm text-mocha leading-snug">
              Я даю согласие на обработку персональных данных
            </span>
          </label>
          {errors.consent && <p className="text-xs text-red-500 -mt-2 ml-1">{errors.consent}</p>}

          <button type="submit" disabled={loading}
            className="btn-primary w-full flex items-center justify-center gap-2">
            <UserPlus className="w-4 h-4" />
            {loading ? 'Регистрация…' : 'Зарегистрироваться'}
          </button>
        </form>

        <p className="text-center text-sm text-mocha/60 mt-5">
          Уже есть аккаунт?{' '}
          <Link to="/login" className="text-rose hover:text-rose-dark font-medium transition">
            Войти
          </Link>
        </p>
      </div>
    </div>
  );
}

function Field({ label, name, value, onChange, placeholder, cls, error, type = 'text', autoComplete }:
  { label: string; name: string; value: string; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    placeholder: string; cls: string; error?: string; type?: string; autoComplete?: string }) {
  return (
    <div>
      <label className="block text-sm font-medium text-mocha mb-1.5">{label}</label>
      <input type={type} name={name} value={value} onChange={onChange}
        placeholder={placeholder} className={cls} autoComplete={autoComplete} />
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  );
}

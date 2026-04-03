
import { useState, useEffect, useCallback } from 'react';
import { Plus, Trash2, PawPrint, PackageOpen, Upload, Image } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { getMyOrders, createOrder, deleteOrder } from '../api/client';
import StatusBadge from '../components/StatusBadge';
import Toast from '../components/Toast';
import type { Order } from '../types';

export default function Dashboard() {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [toast, setToast] = useState<{ msg: string; type: 'error' | 'success' } | null>(null);

  const fetch = useCallback(async () => {
    try { setOrders(await getMyOrders()); }
    catch { setToast({ msg: 'Не удалось загрузить заявки', type: 'error' }); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { fetch(); }, [fetch]);

  const handleDelete = async (id: string) => {
    if (!confirm('Удалить заявку?')) return;
    try {
      await deleteOrder(id);
      setOrders(p => p.filter(o => o.id !== id));
      setToast({ msg: 'Заявка удалена', type: 'success' });
    } catch (err: any) {
      setToast({ msg: err.detail || 'Ошибка', type: 'error' });
    }
  };

  return (
    <div className="animate-fade-in">
      {toast && <Toast message={toast.msg} type={toast.type} onClose={() => setToast(null)} />}

      {/* Welcome */}
      <div className="mb-8">
        <h1 className="font-display text-2xl lg:text-3xl font-bold text-mocha-dark mb-1">
          Привет, {user?.name?.split(' ')[0]} 👋
        </h1>
        <p className="text-mocha/60">Управляйте своими заявками на груминг</p>
      </div>

      {/* Toggle form */}
      <button onClick={() => setShowForm(!showForm)}
        className={`mb-6 flex items-center gap-2 ${showForm ? 'btn-secondary' : 'btn-primary'}`}>
        <Plus className={`w-5 h-5 transition-transform duration-300 ${showForm ? 'rotate-45' : ''}`} />
        {showForm ? 'Отмена' : 'Новая заявка'}
      </button>

      {/* Create form */}
      {showForm && (
        <div className="mb-8 animate-scale-in">
          <CreateForm
            onCreated={o => { setOrders(p => [o, ...p]); setShowForm(false); setToast({ msg: 'Заявка создана!', type: 'success' }); }}
            onError={m => setToast({ msg: m, type: 'error' })}
          />
        </div>
      )}

      {/* Orders list */}
      <h2 className="font-display text-lg font-semibold text-mocha-dark mb-4">
        Мои заявки ({orders.length})
      </h2>

      {loading ? (
        <div className="text-center py-12 text-mocha/50">
          <PawPrint className="w-8 h-8 mx-auto animate-bounce mb-2" />
          <p>Загрузка…</p>
        </div>
      ) : orders.length === 0 ? (
        <div className="text-center py-16">
          <PackageOpen className="w-16 h-16 mx-auto text-sand mb-4" />
          <p className="font-display text-lg text-mocha/60">У вас пока нет заявок</p>
          <p className="text-sm text-mocha/40 mt-1">Создайте первую, нажав кнопку выше</p>
        </div>
      ) : (
        <div className="space-y-3">
          {orders.map((o, i) => (
            <div key={o.id} className="card p-4 flex items-center gap-4 animate-slide-up"
              style={{ animationDelay: `${i * 0.05}s`, opacity: 0 }}>
              {/* Pet photo */}
              <div className="w-16 h-16 lg:w-20 lg:h-20 rounded-2xl overflow-hidden bg-blush/30 shrink-0">
                <img src={`/${o.source_photo_path}`} alt={o.pet_name}
                  className="w-full h-full object-cover" loading="lazy" />
              </div>
              {/* Info */}
              <div className="flex-1 min-w-0">
                <p className="font-display font-semibold text-mocha-dark truncate">{o.pet_name}</p>
                <div className="mt-1.5"><StatusBadge status={o.status} /></div>
              </div>
              {/* Result photo */}
              {o.result_photo_path && (
                <div className="hidden sm:block w-16 h-16 lg:w-20 lg:h-20 rounded-2xl overflow-hidden bg-sage/10 shrink-0 ring-2 ring-sage/30">
                  <img src={`/${o.result_photo_path}`} alt="Результат"
                    className="w-full h-full object-cover" loading="lazy" />
                </div>
              )}
              {/* Delete */}
              {o.status === 'new' && (
                <button onClick={() => handleDelete(o.id)}
                  className="shrink-0 p-2.5 rounded-xl text-red-400 hover:text-red-600 hover:bg-red-50 transition-all"
                  title="Удалить">
                  <Trash2 className="w-5 h-5" />
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ── Create order form ────────────────────────────────────────── */
function CreateForm({ onCreated, onError }: { onCreated: (o: Order) => void; onError: (m: string) => void }) {
  const [petName, setPetName] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const pickFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setFile(f);
    const r = new FileReader();
    r.onload = ev => setPreview(ev.target?.result as string);
    r.readAsDataURL(f);
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!petName.trim()) { onError('Введите кличку питомца'); return; }
    if (!file) { onError('Прикрепите фото питомца'); return; }
    setBusy(true);
    try {
      const o = await createOrder(petName.trim(), file);
      onCreated(o);
    } catch (err: any) {
      onError(err.detail || 'Ошибка при создании заявки');
    } finally { setBusy(false); }
  };

  return (
    <div className="card p-5 lg:p-6">
      <h3 className="font-display text-lg font-semibold text-mocha-dark mb-4 flex items-center gap-2">
        <PawPrint className="w-5 h-5 text-rose" /> Новая заявка
      </h3>
      <form onSubmit={submit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-mocha mb-1.5">Кличка питомца</label>
          <input value={petName} onChange={e => setPetName(e.target.value)}
            placeholder="Например, Барсик" className="input-field" />
        </div>
        <div>
          <label className="block text-sm font-medium text-mocha mb-1.5">
            Фото питомца <span className="text-mocha/40">(JPEG, BMP, до 2 МБ)</span>
          </label>
          {preview ? (
            <div className="relative group">
              <img src={preview} alt="Превью"
                className="w-full max-w-xs h-48 object-cover rounded-2xl border border-sand/50" />
              <button type="button" onClick={() => { setFile(null); setPreview(null); }}
                className="absolute top-2 right-2 p-1.5 bg-white/80 backdrop-blur rounded-full text-red-400 hover:text-red-600 transition opacity-0 group-hover:opacity-100">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-sand/60 rounded-2xl cursor-pointer hover:border-rose/50 hover:bg-rose/5 transition-all">
              <Upload className="w-8 h-8 text-mocha/30 mb-2" />
              <span className="text-sm text-mocha/50">Нажмите, чтобы выбрать фото</span>
              <input type="file" accept=".jpg,.jpeg,.bmp,image/jpeg,image/bmp"
                onChange={pickFile} className="hidden" />
            </label>
          )}
        </div>
        <button type="submit" disabled={busy}
          className="btn-primary flex items-center gap-2">
          <Image className="w-4 h-4" /> {busy ? 'Создание…' : 'Создать заявку'}
        </button>
      </form>
    </div>
  );
}

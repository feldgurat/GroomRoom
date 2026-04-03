import { useState, useEffect, useCallback } from 'react';
import { Shield, Play, CheckCircle, Upload, Trash2, PawPrint, RefreshCw, Search } from 'lucide-react';
import { adminGetAllOrders, adminStartProcessing, adminComplete } from '../api/client';
import StatusBadge from '../components/StatusBadge';
import Toast from '../components/Toast';
import type { Order } from '../types';

export default function Admin() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<{ msg: string; type: 'error' | 'success' } | null>(null);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [completeFor, setCompleteFor] = useState<Order | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try { setOrders(await adminGetAllOrders()); }
    catch { setToast({ msg: 'Не удалось загрузить заявки', type: 'error' }); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { load(); }, [load]);

  const doStart = async (id: string) => {
    try {
      const u = await adminStartProcessing(id);
      setOrders(p => p.map(o => o.id === id ? u : o));
      setToast({ msg: 'Статус → Обработка данных', type: 'success' });
    } catch (e: any) { setToast({ msg: e.detail || 'Ошибка', type: 'error' }); }
  };

  const doComplete = async (id: string, file: File) => {
    try {
      const u = await adminComplete(id, file);
      setOrders(p => p.map(o => o.id === id ? u : o));
      setCompleteFor(null);
      setToast({ msg: 'Услуга оказана!', type: 'success' });
    } catch (e: any) { setToast({ msg: e.detail || 'Ошибка', type: 'error' }); }
  };

  const filtered = orders.filter(o => {
    if (filter !== 'all' && o.status !== filter) return false;
    if (search && !o.pet_name.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const cnt = (s?: string) => s ? orders.filter(o => o.status === s).length : orders.length;

  return (
    <div className="animate-fade-in">
      {toast && <Toast message={toast.msg} type={toast.type} onClose={() => setToast(null)} />}
      {completeFor && <CompleteModal order={completeFor} onComplete={doComplete} onClose={() => setCompleteFor(null)} />}

      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Shield className="w-6 h-6 text-sage" />
            <h1 className="font-display text-2xl lg:text-3xl font-bold text-mocha-dark">
              Панель администратора
            </h1>
          </div>
          <p className="text-mocha/60 text-sm">Управление заявками на груминг</p>
        </div>
        <button onClick={load} className="btn-secondary flex items-center gap-2 text-sm">
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          <span className="hidden sm:inline">Обновить</span>
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        {([
          { key: 'all', label: 'Все', color: 'bg-mocha/5 text-mocha' },
          { key: 'new', label: 'Новые', color: 'bg-blue-50 text-blue-700' },
          { key: 'processing', label: 'В обработке', color: 'bg-amber-50 text-amber-700' },
          { key: 'done', label: 'Выполнены', color: 'bg-emerald-50 text-emerald-700' },
        ] as const).map(s => (
          <button key={s.key} onClick={() => setFilter(s.key)}
            className={`p-4 rounded-2xl border transition-all text-left ${
              filter === s.key ? `${s.color} border-current/20 shadow-sm` : 'bg-white/50 border-sand/30 hover:bg-white/80'
            }`}>
            <p className="text-2xl font-bold">{cnt(s.key === 'all' ? undefined : s.key)}</p>
            <p className="text-xs font-medium opacity-70">{s.label}</p>
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-mocha/40" />
        <input placeholder="Поиск по кличке…" value={search}
          onChange={e => setSearch(e.target.value)} className="input-field pl-11" />
      </div>

      {/* List */}
      {loading ? (
        <div className="text-center py-12 text-mocha/50">
          <PawPrint className="w-8 h-8 mx-auto animate-bounce mb-2" /><p>Загрузка…</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-12 text-mocha/40">
          <p className="font-display text-lg">Заявок не найдено</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((o, i) => (
            <div key={o.id} className="card p-4 animate-slide-up"
              style={{ animationDelay: `${i * 0.03}s`, opacity: 0 }}>
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 lg:w-16 lg:h-16 rounded-xl overflow-hidden bg-blush/30 shrink-0">
                  <img src={`/${o.source_photo_path}`} alt={o.pet_name}
                    className="w-full h-full object-cover" loading="lazy" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-display font-semibold text-mocha-dark truncate text-sm lg:text-base">{o.pet_name}</p>
                  <div className="mt-1"><StatusBadge status={o.status} /></div>
                </div>
                {o.result_photo_path && (
                  <div className="hidden sm:block w-14 h-14 rounded-xl overflow-hidden bg-sage/10 shrink-0 ring-2 ring-sage/30">
                    <img src={`/${o.result_photo_path}`} alt="Результат" className="w-full h-full object-cover" />
                  </div>
                )}
                <div className="shrink-0 flex items-center gap-2">
                  {o.status === 'new' && (
                    <button onClick={() => doStart(o.id)}
                      className="btn-sage flex items-center gap-1.5 text-xs lg:text-sm" title="В обработку">
                      <Play className="w-4 h-4" /><span className="hidden lg:inline">В обработку</span>
                    </button>
                  )}
                  {o.status === 'processing' && (
                    <button onClick={() => setCompleteFor(o)}
                      className="btn-primary flex items-center gap-1.5 text-xs lg:text-sm !px-4 !py-2" title="Завершить">
                      <CheckCircle className="w-4 h-4" /><span className="hidden lg:inline">Завершить</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ── Complete modal ───────────────────────────────────────────── */
function CompleteModal({ order, onComplete, onClose }:
  { order: Order; onComplete: (id: string, f: File) => Promise<void>; onClose: () => void }) {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const pick = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0]; if (!f) return;
    setFile(f);
    const r = new FileReader();
    r.onload = ev => setPreview(ev.target?.result as string);
    r.readAsDataURL(f);
  };

  const submit = async () => {
    if (!file) return;
    setBusy(true);
    await onComplete(order.id, file);
    setBusy(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fade-in"
      onClick={onClose}>
      <div className="card p-6 max-w-md w-full animate-scale-in" onClick={e => e.stopPropagation()}>
        <h3 className="font-display text-lg font-semibold text-mocha-dark mb-1">Завершение заявки</h3>
        <p className="text-sm text-mocha/60 mb-5">
          Прикрепите фото результата для <strong>{order.pet_name}</strong>
        </p>

        {preview ? (
          <div className="relative group mb-4">
            <img src={preview} alt="Результат" className="w-full h-48 object-cover rounded-2xl border border-sand/50" />
            <button onClick={() => { setFile(null); setPreview(null); }}
              className="absolute top-2 right-2 p-1.5 bg-white/80 backdrop-blur rounded-full text-red-400 hover:text-red-600 transition opacity-0 group-hover:opacity-100">
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-sand/60 rounded-2xl cursor-pointer hover:border-rose/50 hover:bg-rose/5 transition-all mb-4">
            <Upload className="w-8 h-8 text-mocha/30 mb-2" />
            <span className="text-sm text-mocha/50">Выберите фото результата</span>
            <input type="file" accept=".jpg,.jpeg,.bmp,image/jpeg,image/bmp" onChange={pick} className="hidden" />
          </label>
        )}

        <div className="flex gap-3">
          <button onClick={onClose} className="btn-secondary flex-1">Отмена</button>
          <button onClick={submit} disabled={!file || busy}
            className="btn-primary flex-1 flex items-center justify-center gap-2">
            <CheckCircle className="w-4 h-4" /> {busy ? 'Сохранение…' : 'Завершить'}
          </button>
        </div>
      </div>
    </div>
  );
}

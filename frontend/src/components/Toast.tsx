import { useEffect } from 'react';
import { CheckCircle, XCircle, X } from 'lucide-react';

interface Props {
  message: string;
  type?: 'error' | 'success';
  onClose: () => void;
}

export default function Toast({ message, type = 'error', onClose }: Props) {
  useEffect(() => {
    const t = setTimeout(onClose, 4500);
    return () => clearTimeout(t);
  }, [onClose]);

  const err = type === 'error';

  return (
    <div className="fixed top-4 right-4 z-[100] animate-slide-up max-w-sm w-full pointer-events-auto">
      <div
        className={`flex items-start gap-3 px-4 py-3 rounded-2xl shadow-lg border ${
          err ? 'bg-red-50 border-red-200 text-red-700' : 'bg-green-50 border-green-200 text-green-700'
        }`}
      >
        {err ? <XCircle className="w-5 h-5 shrink-0 mt-0.5" /> : <CheckCircle className="w-5 h-5 shrink-0 mt-0.5" />}
        <p className="text-sm font-medium flex-1">{message}</p>
        <button onClick={onClose} className="shrink-0 opacity-60 hover:opacity-100 transition">
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

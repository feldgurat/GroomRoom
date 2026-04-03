const MAP: Record<string, { label: string; cls: string }> = {
  new:        { label: 'Новая',            cls: 'bg-blue-50 text-blue-700 border-blue-200' },
  processing: { label: 'Обработка данных', cls: 'bg-amber-50 text-amber-700 border-amber-200' },
  done:       { label: 'Услуга оказана',   cls: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
};

export default function StatusBadge({ status }: { status: string }) {
  const s = MAP[status] ?? MAP.new;
  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${s.cls}`}>
      {s.label}
    </span>
  );
}

import { MapPin, Phone, Mail, Clock } from 'lucide-react';

export default function Contacts() {
  return (
    <div className="animate-fade-in py-6">
      <h1 className="font-display text-3xl font-bold text-mocha-dark mb-3">Контакты</h1>
      <p className="text-mocha/70 text-lg mb-8">Будем рады видеть вас и ваших питомцев!</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl">
        {[
          { icon: MapPin, label: 'Адрес', value: 'г. Москва, ул. Пушистая, д. 12' },
          { icon: Phone, label: 'Телефон', value: '+7 (495) 123-45-67' },
          { icon: Mail, label: 'Email', value: 'info@groomroom.ru' },
          { icon: Clock, label: 'Режим работы', value: 'Пн–Сб: 10:00–20:00' },
        ].map(({ icon: Icon, label, value }, i) => (
          <div key={i} className="card p-5 flex items-start gap-4 animate-slide-up"
            style={{ animationDelay: `${i * 0.1}s`, opacity: 0 }}>
            <div className="p-2.5 rounded-xl bg-rose/10 shrink-0">
              <Icon className="w-5 h-5 text-rose" />
            </div>
            <div>
              <p className="text-xs font-medium text-mocha/50 uppercase tracking-wider mb-0.5">{label}</p>
              <p className="font-medium text-mocha-dark">{value}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

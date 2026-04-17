import { Heart, Scissors, Sparkles, Clock } from 'lucide-react';

export default function About() {
  return (
    <div className="animate-fade-in py-6 max-w-5xl mx-auto px-4">
      <h1 className="font-display text-3xl font-bold text-mocha-dark mb-3">О нас</h1>
      <p className="text-mocha/70 text-lg leading-relaxed max-w-2xl mb-10">
        GroomRoom — это профессиональный груминг-салон, где каждый питомец получает
        индивидуальный подход и заботу. Мы работаем с 2018 года и успели подстричь
        более 10 000 пушистых клиентов!
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {[
          { icon: Scissors, title: 'Профессиональные мастера', text: 'Наши грумеры имеют сертификаты и опыт работы от 5 лет' },
          { icon: Heart, title: 'Любовь к животным', text: 'Мы относимся к каждому питомцу как к своему' },
          { icon: Sparkles, title: 'Качественная косметика', text: 'Используем только гипоаллергенные средства премиум-класса' },
          { icon: Clock, title: 'Удобная запись', text: 'Создайте заявку онлайн за пару минут без звонков' },
        ].map(({ icon: Icon, title, text }, i) => (
          <div key={i} className="card p-5 animate-slide-up" style={{ animationDelay: `${i * 0.1}s`, opacity: 0 }}>
            <Icon className="w-8 h-8 text-rose mb-3" />
            <h3 className="font-display font-semibold text-mocha-dark mb-1">{title}</h3>
            <p className="text-sm text-mocha/60 leading-relaxed">{text}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

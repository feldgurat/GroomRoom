import { useState, useEffect } from 'react';
import { Sparkles, Heart, Star } from 'lucide-react';
import { getCompletedOrders } from '../api/client';
import type { Order } from '../types';

export default function Home() {
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    getCompletedOrders().then(setOrders).catch(() => {});
  }, []);

  return (
    <div className="animate-fade-in">
      {/* Hero */}
      <section className="relative py-8 lg:py-14">
        {/* Decorative blobs */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden -z-10">
          <div className="absolute -top-20 -right-20 w-72 h-72 bg-rose/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 -left-20 w-96 h-96 bg-sage/10 rounded-full blur-3xl" />
        </div>

        <div className="flex items-center gap-2 mb-5">
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-rose/10 rounded-full">
            <Sparkles className="w-4 h-4 text-rose" />
            <span className="text-xs font-semibold text-rose uppercase tracking-wider">Груминг-салон</span>
          </div>
        </div>

        <h1 className="font-display text-4xl lg:text-5xl font-bold text-mocha-dark leading-tight mb-5">
          Красота вашего{' '}
          <span className="text-rose italic">питомца</span> —<br className="hidden lg:block" />
          наша забота
        </h1>

        <p className="text-mocha/70 text-lg leading-relaxed mb-8 max-w-lg">
          Профессиональный уход за внешним видом, шерстью, когтями и ушками
          ваших любимцев. Запишитесь онлайн за пару кликов!
        </p>

        <div className="flex items-center gap-6 mb-10">
          <div className="flex items-center gap-2">
            <Heart className="w-5 h-5 text-rose fill-rose" />
            <span className="text-sm font-medium text-mocha">1000+ клиентов</span>
          </div>
          <div className="flex items-center gap-2">
            <Star className="w-5 h-5 text-amber-400 fill-amber-400" />
            <span className="text-sm font-medium text-mocha">4.9 рейтинг</span>
          </div>
        </div>
      </section>

      {/* Completed orders */}
      {orders.length > 0 && (
        <section className="pb-10">
          <div className="flex items-center gap-2 mb-6">
            <Sparkles className="w-5 h-5 text-sage" />
            <h2 className="font-display text-2xl font-semibold text-mocha-dark">Наши работы</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {orders.map((o, i) => (
              <div
                key={o.id}
                className="card group cursor-default animate-slide-up"
                style={{ animationDelay: `${i * 0.1}s`, opacity: 0 }}
              >
                <div className="aspect-square overflow-hidden bg-blush/30">
                  <img
                    src={`/${o.source_photo_path}`}
                    alt={o.pet_name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    loading="lazy"
                  />
                </div>
                <div className="p-3">
                  <p className="font-display font-semibold text-mocha-dark text-sm truncate">{o.pet_name}</p>
                  <p className="text-xs text-sage font-medium mt-0.5">Услуга оказана ✓</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

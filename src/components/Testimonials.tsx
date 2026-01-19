import { Quote } from 'lucide-react';

const reviews = [
  {
    id: 1,
    name: "Valentina R.",
    text: "Professionalità e gusto impeccabile. Domenica ha trasformato il nostro sogno in realtà con una cura per i dettagli davvero rara.",
    event: "Matrimonio Elegante"
  },
  {
    id: 2,
    name: "Marco G.",
    text: "Il catalogo arredi è fantastico. Abbiamo noleggiato sedie e decorazioni per un evento aziendale e il risultato è stato superiore alle aspettative.",
    event: "Evento Corporate"
  },
  {
    id: 3,
    name: "Elena M.",
    text: "Un punto di riferimento per chi cerca eleganza e stile Shabby Chic. Consiglio vivamente la consulenza di Domenica.",
    event: "Festa Privata"
  }
];

export function Testimonials() {
  return (
    <section className="py-24 bg-rose-50/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-serif text-gray-800 italic">Dicono di Noi</h2>
          <div className="h-1 w-20 bg-rose-300 mx-auto mt-4"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {reviews.map((review) => (
            <div 
              key={review.id} 
              className="bg-white p-8 rounded-3xl shadow-sm border border-rose-100 hover:shadow-md transition-shadow relative"
            >
              <Quote className="absolute top-4 right-6 h-8 w-8 text-rose-100" />
              <p className="text-gray-600 italic mb-6 relative z-10">
                "{review.text}"
              </p>
              <div>
                <h4 className="font-semibold text-gray-800">{review.name}</h4>
                <p className="text-rose-400 text-xs uppercase tracking-widest">{review.event}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
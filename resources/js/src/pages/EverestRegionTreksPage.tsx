import React, { useState } from 'react';
import { Tabs } from '../components/Tabs';
import { FAQ } from '../components/FAQ';
import { Seo } from '../components/Seo';
import { TripsGrid } from '../components/TripsGrid';
import { SectionHeading } from '../components/ui/SectionHeading';
import { Button } from '../components/ui/Button';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { Calendar, FileText, Plane, Info, Map, ThermometerSun, Users, ArrowRight, DollarSign, Clock } from 'lucide-react';
import { motion } from 'framer-motion';
const faqs = [{
  question: 'What is the best time to trek in the Everest region?',
  answer: 'The best times are Spring (March-May) and Autumn (September-November) when the weather is stable, skies are clear, and temperatures are comfortable for trekking.'
}, {
  question: 'Do I need previous trekking experience?',
  answer: "While previous trekking experience is helpful, it's not mandatory. However, you should be in good physical condition and able to walk 5-7 hours daily with a daypack."
}, {
  question: 'What permits do I need for Everest region treks?',
  answer: "You need two main permits: Sagarmatha National Park Entry Permit and TIMS (Trekkers' Information Management System) card. Our packages include all necessary permits."
}, {
  question: 'How do I prevent altitude sickness?',
  answer: 'Proper acclimatization is key. Our itineraries include rest days, gradual ascent, and experienced guides who monitor your health. Stay hydrated, avoid alcohol, and inform your guide of any symptoms.'
}, {
  question: 'What accommodation is available during the trek?',
  answer: "You'll stay in teahouses (local lodges) that provide basic but comfortable accommodation with beds, blankets, and meals. Rooms are typically twin-sharing with shared bathrooms."
}, {
  question: 'Is travel insurance mandatory?',
  answer: 'Yes, comprehensive travel insurance covering high-altitude trekking (up to 6,000m) and emergency helicopter evacuation is mandatory for all Everest region treks.'
}, {
  question: 'What should I pack for an Everest trek?',
  answer: 'Essential items include warm layers, waterproof jacket and pants, good trekking boots, sleeping bag, sunglasses, sunscreen, and personal medications. We provide a detailed packing list upon booking.'
}, {
  question: 'Can I charge my devices during the trek?',
  answer: 'Yes, most teahouses offer charging facilities for a small fee (usually $2-5 per device). Bring a power bank as backup, especially for higher altitudes where electricity may be limited.'
}];
export function EverestRegionTreksPage() {
  const [activeGuide, setActiveGuide] = useState<string | null>(null);
  const guides = [{
    id: 'best-time',
    title: 'Best Time to Visit',
    icon: Calendar
  }, {
    id: 'permits',
    title: 'Permits & Fees',
    icon: FileText
  }, {
    id: 'flights',
    title: 'Flights',
    icon: Plane
  }];
  const renderGuideContent = (guideId: string) => {
    switch (guideId) {
      case 'best-time':
        return <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-amber-100 rounded-lg text-amber-700 mt-1">
                  <ThermometerSun size={20} />
                </div>
                <div>
                  <h4 className="font-bold text-stone-900 text-lg">
                    Spring (March - May)
                  </h4>
                  <p className="text-stone-600 mt-1">
                    The most popular season. The weather is mild, and the
                    rhododendrons are in full bloom, painting the hills in red
                    and pink. Visibility is generally good, though afternoon
                    clouds are common.
                  </p>
                  <ul className="mt-3 space-y-1 text-sm text-stone-600">
                    <li>• Temperature: 10°C to 20°C (daytime)</li>
                    <li>• Crowds: High</li>
                    <li>• Highlights: Blooming flora, vibrant atmosphere</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-blue-100 rounded-lg text-blue-700 mt-1">
                  <Calendar size={20} />
                </div>
                <div>
                  <h4 className="font-bold text-stone-900 text-lg">
                    Autumn (September - November)
                  </h4>
                  <p className="text-stone-600 mt-1">
                    Offers the clearest skies and most spectacular mountain
                    views. The weather is stable, though colder than spring.
                    This is the peak season for mountain visibility.
                  </p>
                  <ul className="mt-3 space-y-1 text-sm text-stone-600">
                    <li>• Temperature: 5°C to 15°C (daytime)</li>
                    <li>• Crowds: High to Moderate</li>
                    <li>• Highlights: Crystal clear views, major festivals</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="md:col-span-2 bg-stone-50 p-6 rounded-xl border border-stone-100 mt-4">
              <h4 className="font-bold text-stone-900 mb-2 flex items-center gap-2">
                <Info size={18} className="text-stone-500" />
                Off-Season Considerations
              </h4>
              <p className="text-stone-600 text-sm">
                Winter (Dec-Feb) is possible but very cold with risk of pass
                closures. Monsoon (Jun-Aug) brings rain, leeches, and poor
                visibility, generally not recommended for high-altitude
                trekking, though the valleys are lush green.
              </p>
            </div>
          </div>;
      case 'permits':
        return <div className="space-y-6">
            <p className="text-stone-600">
              Trekking in the Everest region requires specific permits. We
              handle all these arrangements for our guided treks, but here is
              the breakdown for your information.
            </p>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white border border-stone-200 p-6 rounded-xl shadow-sm">
                <div className="flex items-center gap-3 mb-4">
                  <FileText className="text-amber-600" size={24} />
                  <h4 className="font-bold text-stone-900 text-lg">
                    Khumbu Pasang Lhamu Rural Municipality Permit
                  </h4>
                </div>
                <p className="text-stone-600 text-sm mb-4">
                  Replaces the old TIMS card for the Everest region. Obtained at
                  the entrance in Lukla or Monjo.
                </p>
                <div className="font-semibold text-stone-900">
                  Cost: $20 USD
                </div>
              </div>

              <div className="bg-white border border-stone-200 p-6 rounded-xl shadow-sm">
                <div className="flex items-center gap-3 mb-4">
                  <img 
                    src={typeof document !== 'undefined' ? (document.querySelector("link[rel*='icon']")?.getAttribute('href') || '/favicon.ico') : '/favicon.ico'} 
                    alt="Favicon" 
                    className="w-6 h-6 object-contain" 
                  />
                  <h4 className="font-bold text-stone-900 text-lg">
                    Sagarmatha National Park Entry Permit
                  </h4>
                </div>
                <p className="text-stone-600 text-sm mb-4">
                  Required for entering the national park area. Funds go towards
                  conservation and park management.
                </p>
                <div className="font-semibold text-stone-900">
                  Cost: $30 USD
                </div>
              </div>
            </div>

            <div className="text-sm text-stone-500 italic">
              * Note: Permit fees are subject to change by the Nepal Government.
              All our package prices include these permit fees.
            </div>
          </div>;
      case 'flights':
        return <div className="space-y-6">
            <div className="flex flex-col md:flex-row gap-8 items-start">
              <div className="flex-1">
                <h3 className="text-xl font-bold text-stone-900 mb-4 flex items-center gap-2">
                  <Plane className="text-amber-600" />
                  The Gateway to Everest
                </h3>
                <p className="text-stone-600 mb-4 leading-relaxed">
                  The flight to Tenzing-Hillary Airport in Lukla is an adventure
                  in itself. It's a short 30-40 minute scenic flight that offers
                  your first close-up views of the Himalayas.
                </p>

                <div className="bg-amber-50 border-l-4 border-amber-500 p-4 my-6">
                  <h4 className="font-bold text-amber-900 mb-1">
                    Important Update: Ramechhap Flights
                  </h4>
                  <p className="text-amber-800 text-sm">
                    During peak seasons (Spring & Autumn), Flights
                    often operate from Ramechhap airport instead of Kathmandu to
                    manage air traffic. This requires a 4-5 hour drive from
                    Kathmandu starting early morning (around 2 AM).
                  </p>
                </div>

                <h4 className="font-bold text-stone-900 mb-2">
                  Baggage Allowance
                </h4>
                <p className="text-stone-600 text-sm mb-4">
                  Strictly limited to 10kg check-in + 5kg hand carry. We
                  recommend leaving extra luggage at your hotel in Kathmandu.
                </p>
              </div>

              <div className="w-full md:w-1/3 bg-stone-100 p-6 rounded-xl">
                <h4 className="font-bold text-stone-900 mb-4">Flight Tips</h4>
                <ul className="space-y-3">
                  <li className="flex items-start gap-2 text-sm text-stone-700">
                    <span className="text-amber-600 font-bold">•</span>
                    Book early for morning flights (better weather).
                  </li>
                  <li className="flex items-start gap-2 text-sm text-stone-700">
                    <span className="text-amber-600 font-bold">•</span>
                    Sit on the left for mountain views when flying to Lukla.
                  </li>
                  <li className="flex items-start gap-2 text-sm text-stone-700">
                    <span className="text-amber-600 font-bold">•</span>
                    Flights are weather-dependent; always have buffer days.
                  </li>
                  <li className="flex items-start gap-2 text-sm text-stone-700">
                    <span className="text-amber-600 font-bold">•</span>
                    Helicopter upgrades are available if planes are grounded.
                  </li>
                </ul>
              </div>
            </div>
          </div>;
      default:
        return null;
    }
  };
  return <div className="min-h-screen bg-white font-sans">
      <Seo
          fallbackTitle="Everest Region Treks"
          fallbackDescription="Explore trekking packages in the Everest region including Everest Base Camp, Gokyo Lakes, and more."
          fallbackImage="https://images.unsplash.com/photo-1544735716-392fe2489ffa?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80"
          canonicalPath="/everest-region-treks"
          faqs={faqs}
      />
      <Navbar />

      {/* Hero Section */}
      <div className="relative h-[60vh] min-h-[500px] flex items-center justify-center">
        <div className="absolute inset-0 bg-cover bg-center z-0" style={{
        backgroundImage: 'url("https://images.unsplash.com/photo-1544735716-392fe2489ffa?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80")'
      }}>
          <div className="absolute inset-0 bg-black/40" />
        </div>
        <div className="relative z-10 text-center text-white px-4 max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 tracking-tight">
            Everest Region Treks
          </h1>
          <p className="text-xl md:text-2xl text-stone-100 font-light max-w-2xl mx-auto">
            Walk the footsteps of legends in the shadow of the world's highest
            peaks.
          </p>
        </div>
      </div>

      {/* Overview Section */}
      <section className="py-20 px-4 md:px-8 max-w-7xl mx-auto">
        <div className="grid md:grid-cols-12 gap-12 items-start">
          <div className="md:col-span-7 space-y-6">
            <SectionHeading title="The Roof of the World" subtitle="Overview" className="mb-8" />
            <p className="text-lg text-stone-700 leading-relaxed">
              The Everest region, known locally as the Khumbu, is more than just
              home to the world's highest mountain. It is a sanctuary of Sherpa
              culture, ancient monasteries, and breathtaking alpine scenery that
              defies imagination. From the moment you land at the dramatic Lukla
              airport, you enter a world where yaks carry supplies across
              suspension bridges and prayer flags flutter in the mountain
              breeze.
            </p>
            <p className="text-lg text-stone-700 leading-relaxed">
              While the classic trek to Everest Base Camp is the most famous,
              the region offers a diverse array of trails. You can cross high
              passes like the Cho La, visit the turquoise Gokyo Lakes, or
              explore the quieter trails of Thame. Whether you seek the
              challenge of high altitude or the spiritual calm of Tengboche
              Monastery, the Khumbu has a journey for every adventurer.
            </p>
            <div className="flex flex-wrap gap-4 pt-4">
              <div className="flex items-center gap-2 text-stone-600 bg-stone-100 px-4 py-2 rounded-full text-sm font-medium">
                <Map size={16} />
                Sagarmatha National Park
              </div>
              <div className="flex items-center gap-2 text-stone-600 bg-stone-100 px-4 py-2 rounded-full text-sm font-medium">
                <Users size={16} />
                Sherpa Culture
              </div>
              <div className="flex items-center gap-2 text-stone-600 bg-stone-100 px-4 py-2 rounded-full text-sm font-medium">
                <img src={typeof document !== 'undefined' ? (document.querySelector("link[rel*='icon']")?.getAttribute('href') || '/favicon.ico') : '/favicon.ico'} className="w-4 h-4 object-contain" alt="Favicon" />
                8,000m Peaks
              </div>
            </div>
          </div>
          <div className="md:col-span-5 sticky top-20">
            <div className="aspect-[4/5] rounded-2xl overflow-hidden shadow-xl">
              <img src="https://images.unsplash.com/photo-1585938389612-a552a28d6914?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80" alt="Trekker looking at Mount Everest" className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
            </div>
            <div className="absolute -bottom-6 -left-6 bg-white p-6 rounded-xl shadow-lg max-w-xs hidden md:block border border-stone-100">
              <p className="text-stone-800 font-serif italic text-lg">
                "It is not the mountain we conquer, but ourselves."
              </p>
              <p className="text-stone-500 text-sm mt-2">
                — Sir Edmund Hillary
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Trips Grid */}
      <section className="bg-stone-50 py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <TripsGrid trips={[]} />
          <div className="mt-12 text-center">
            <Button variant="outline" className="border-stone-300 text-stone-700 hover:bg-stone-100">
              View All Everest Treks
            </Button>
          </div>
        </div>
      </section>

      {/* Essential Information - Card-based Guide Selection */}
      <section className="py-20 px-4 max-w-7xl mx-auto">
        <SectionHeading title="Essential Information" subtitle="Plan Your Trip" className="mb-10 text-center" />

        {/* Guide Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {guides.map(guide => <motion.button key={guide.id} onClick={() => setActiveGuide(activeGuide === guide.id ? null : guide.id)} whileHover={{
          y: -4
        }} className={`group relative bg-white border-2 rounded-2xl p-8 text-left transition-all ${activeGuide === guide.id ? 'border-amber-500 shadow-lg' : 'border-stone-200 hover:border-stone-300 hover:shadow-md'}`}>
              <div className="flex items-start justify-between mb-4">
                <div className={`p-3 rounded-xl transition-colors ${activeGuide === guide.id ? 'bg-amber-100 text-amber-700' : 'bg-stone-100 text-stone-600 group-hover:bg-stone-200'}`}>
                  <guide.icon size={28} />
                </div>
                <ArrowRight size={24} className={`transition-all ${activeGuide === guide.id ? 'text-amber-600 translate-x-1' : 'text-stone-400 group-hover:text-stone-600 group-hover:translate-x-1'}`} />
              </div>
              <h3 className="text-xl font-bold text-stone-900">
                {guide.title}
              </h3>
            </motion.button>)}
        </div>

        {/* Guide Content */}
        {activeGuide && <motion.div initial={{
        opacity: 0,
        y: 20
      }} animate={{
        opacity: 1,
        y: 0
      }} exit={{
        opacity: 0,
        y: -20
      }} transition={{
        duration: 0.3
      }} className="bg-white border border-stone-200 rounded-2xl p-8 shadow-lg">
            {renderGuideContent(activeGuide)}
          </motion.div>}
      </section>

      {/* FAQ Section */}
      <section className="bg-stone-900 py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-stone-400">
              Everything you need to know before you go.
            </p>
          </div>
          <FAQ items={faqs} />

          <div className="mt-12 text-center bg-stone-800 rounded-2xl p-8">
            <h3 className="text-xl font-bold text-white mb-2">
              Still have questions?
            </h3>
            <p className="text-stone-400 mb-6">
              Our team of experts is ready to help you plan your perfect trek.
            </p>
            <Button variant="primary" className="bg-amber-600 hover:bg-amber-700 border-none">
              Contact Us
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>;
}
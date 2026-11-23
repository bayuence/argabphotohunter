import React, { useState } from 'react';
import Header from './components/Header';
import ServiceSelector from './components/ServiceSelector';
import OrderForm from './components/OrderForm';
import Footer from './components/Footer';

export default function App() {
  const [selectedService, setSelectedService] = useState('design');

  return (
    <div className="min-h-screen bg-[#0c0d0f] text-slate-100 flex flex-col justify-between">
      <main className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <Header />
        <ServiceSelector
          selectedService={selectedService}
          onSelectService={setSelectedService}
        />
        <OrderForm selectedService={selectedService} />
      </main>
      <Footer />
    </div>
  );
}

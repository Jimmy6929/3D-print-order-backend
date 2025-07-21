import React, { useState } from 'react';
import Header from '../components/Header';
import Hero from '../components/Hero';
import TrustSignals from '../components/TrustSignals';
import HowItWorks from '../components/HowItWorks';
import UploadSection from '../components/UploadSection';
import Features from '../components/Features';
import Footer from '../components/Footer';
import PrinterSelection from '../components/PrinterSelection';
import { useAuth } from '../contexts/AuthContext';

interface CalculationDetails {
  volume_mm3: number;
  volume_cm3: number;
  triangle_count: number;
  weight_g: number;
  print_time_h: number;
  material_density: number;
  file_format?: string;
  original_filename?: string;
}

interface PricingOption {
  price: number;
  print_time_h: number;
  material_type: string;
  technology: string;
  details: {
    material_cost: number;
    labor_cost: number;
    setup_fee: number;
    post_processing: number;
  };
}

interface PricingOptions {
  fdm: PricingOption;
  resin: PricingOption;
}

interface QuoteData {
  quoteId: string;
  fileUrl: string;
  pricingOptions: PricingOptions;
  calculationDetails: CalculationDetails;
}

const Home: React.FC = () => {
  const [quote, setQuote] = useState<QuoteData | null>(null);
  const [confirmedOrder, setConfirmedOrder] = useState<null | { 
    orderId: string; 
    printerType: string;
    price: number;
  }>(null);
  
  const { user } = useAuth();

  const scrollToHero = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const scrollToUpload = () => {
    const uploadSection = document.getElementById('upload-section');
    uploadSection?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleUploadComplete = (data: QuoteData) => {
    setQuote(data);
    setConfirmedOrder(null);
    // Scroll to printer selection after upload
    setTimeout(() => {
      const printerSection = document.getElementById('printer-selection');
      printerSection?.scrollIntoView({ behavior: 'smooth' });
    }, 500);
  };

  const handlePrinterSelection = (printerType: 'fdm' | 'resin', pricing: PricingOption) => {
    if (quote) {
      setConfirmedOrder({ 
        orderId: quote.quoteId,
        printerType: printerType,
        price: pricing.price
      });
      // Scroll to order confirmation
      setTimeout(() => {
        const orderSection = document.getElementById('order-confirmation');
        orderSection?.scrollIntoView({ behavior: 'smooth' });
      }, 500);
    }
  };

  const handleStartOver = () => {
    setQuote(null);
    setConfirmedOrder(null);
    // Scroll back to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLogoClick = () => {
    // Reset all workflow state when logo is clicked
    setQuote(null);
    setConfirmedOrder(null);
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-white">
      <Header onLogoClick={handleLogoClick} />
      <Hero 
        onScrollToUpload={scrollToUpload}
        onUploadComplete={handleUploadComplete}
      />
      
      {/* Show printer selection after upload */}
      {quote && !confirmedOrder && (
        <section id="printer-selection" className="py-32 bg-white">
          <PrinterSelection 
            pricingOptions={quote.pricingOptions}
            onSelectPrinter={handlePrinterSelection}
            quoteId={quote.quoteId}
            fileUrl={quote.fileUrl}
            calculationDetails={quote.calculationDetails}
          />
        </section>
      )}

      {/* Show order confirmation */}
      {confirmedOrder && (
        <section id="order-confirmation" className="py-32 bg-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div style={{
              padding: '3rem',
              background: confirmedOrder.printerType === 'resin' 
                ? 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)'
                : 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
              borderRadius: '20px',
              textAlign: 'center',
              boxShadow: confirmedOrder.printerType === 'resin'
                ? '0 20px 40px rgba(139, 92, 246, 0.3)'
                : '0 20px 40px rgba(16, 185, 129, 0.3)',
              color: 'white'
            }}>
              <h2 style={{ 
                color: 'white', 
                margin: '0 0 2rem 0',
                fontSize: '2rem',
                fontWeight: '600'
              }}>
                🎉 {confirmedOrder.printerType.toUpperCase()} Order Confirmed!
              </h2>
              <div style={{ 
                background: 'rgba(255, 255, 255, 0.2)',
                padding: '2rem',
                borderRadius: '12px',
                margin: '0 0 2.5rem 0'
              }}>
                <p style={{ margin: '0 0 0.75rem 0', fontSize: '1.1rem' }}>
                  <strong>Order ID:</strong> {confirmedOrder.orderId}
                </p>
                <p style={{ margin: '0 0 0.75rem 0', fontSize: '1rem' }}>
                  <strong>Technology:</strong> {confirmedOrder.printerType.toUpperCase()} Printing
                </p>
                <p style={{ margin: '0 0 1rem 0', fontSize: '1rem' }}>
                  <strong>Price:</strong> £{confirmedOrder.price.toFixed(2)}
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-6 justify-center">
                <a 
                  href={`/order/${confirmedOrder.orderId}`}
                  style={{
                    display: 'inline-block',
                    background: 'rgba(255, 255, 255, 0.2)',
                    color: 'white',
                    textDecoration: 'none',
                    fontWeight: '600',
                    fontSize: '1.1rem',
                    padding: '1rem 2rem',
                    borderRadius: '12px',
                    transition: 'all 0.3s ease',
                    border: '1px solid rgba(255, 255, 255, 0.3)'
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.3)';
                    e.currentTarget.style.transform = 'translateY(-2px)';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                >
                  Track Your Order →
                </a>
                <button
                  onClick={handleStartOver}
                  style={{
                    background: 'rgba(255, 255, 255, 0.2)',
                    color: 'white',
                    fontWeight: '600',
                    fontSize: '1.1rem',
                    padding: '1rem 2rem',
                    borderRadius: '12px',
                    transition: 'all 0.3s ease',
                    border: '1px solid rgba(255, 255, 255, 0.3)',
                    cursor: 'pointer'
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.3)';
                    e.currentTarget.style.transform = 'translateY(-2px)';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                >
                  Start New Order
                </button>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Only show these sections if no upload workflow is active */}
      {!quote && (
        <>
          <TrustSignals />
          <HowItWorks />
          <UploadSection onScrollToHero={scrollToHero} />
          <Features />
        </>
      )}
      
      <Footer />
    </div>
  );
};

export default Home; 
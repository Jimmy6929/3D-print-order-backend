import React, { useState } from 'react';
import FileUploader from '../components/FileUploader';
import QuoteDisplay from '../components/QuoteDisplay';
import UploadStatus from '../components/UploadStatus';

interface CalculationDetails {
  volume_mm3: number;
  volume_cm3: number;
  triangle_count: number;
  weight_g: number;
  print_time_h: number;
  material: string;
  material_density: number;
}

const Home: React.FC = () => {
  const [quote, setQuote] = useState<null | { 
    quoteId: string; 
    price: number; 
    fileUrl: string; 
    calculationDetails?: CalculationDetails;
  }>(null);
  const [confirmedOrder, setConfirmedOrder] = useState<null | { orderId: string }>(null);
  const [status, setStatus] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [isConfirming, setIsConfirming] = useState(false);

  const handleUploadComplete = (data: { 
    quoteId: string; 
    price: number; 
    fileUrl: string; 
    calculationDetails?: CalculationDetails;
  }) => {
    setQuote(data);
    setConfirmedOrder(null);
    setStatus('Quote generated! Review and confirm your order.');
    setError(null);
  };

  const handleConfirmOrder = async (quoteData: any) => {
    setIsConfirming(true);
    try {
      const res = await fetch('http://localhost:8000/confirm-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(quoteData),
      });
      if (!res.ok) throw new Error('Order confirmation failed');
      const data = await res.json();
      setConfirmedOrder({ orderId: data.order_id });
      setStatus('Order confirmed successfully!');
    } catch (err: any) {
      setError(err.message || 'Order confirmation failed');
    } finally {
      setIsConfirming(false);
    }
  };

  return (
    <div style={{ 
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '2rem 1rem'
    }}>
      <div style={{ 
        maxWidth: quote ? '1200px' : '600px', 
        margin: '0 auto', 
        transition: 'max-width 0.3s ease'
      }}>
        <div style={{ 
          padding: '3rem 2rem', 
          background: 'rgba(255, 255, 255, 0.95)',
          borderRadius: '20px', 
          backdropFilter: 'blur(10px)',
          boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
          textAlign: 'center',
          border: '1px solid rgba(255, 255, 255, 0.3)'
        }}>
          <h1 style={{ 
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            marginBottom: '1rem',
            fontSize: '3rem',
            fontWeight: '700',
            letterSpacing: '-1px'
          }}>
            3D Print Order System
          </h1>
          <p style={{ 
            color: '#64748b', 
            fontSize: '1.2rem',
            margin: '0 0 2.5rem 0',
            fontWeight: '400'
          }}>
            Upload your STL file and get an instant quote with detailed pricing breakdown
          </p>
          <FileUploader onUploadComplete={handleUploadComplete} />
          <UploadStatus status={status} error={error} />
        </div>
      </div>
      {quote && !confirmedOrder && <QuoteDisplay 
        price={quote.price} 
        quoteId={quote.quoteId} 
        fileUrl={quote.fileUrl} 
        calculationDetails={quote.calculationDetails}
        onConfirmOrder={handleConfirmOrder}
      />}
      
      {confirmedOrder && (
        <div style={{
          marginTop: '2rem',
          padding: '2.5rem',
          background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
          borderRadius: '20px',
          textAlign: 'center',
          boxShadow: '0 20px 40px rgba(16, 185, 129, 0.3)',
          color: 'white'
        }}>
          <h2 style={{ 
            color: 'white', 
            margin: '0 0 1.5rem 0',
            fontSize: '2rem',
            fontWeight: '600'
          }}>
            Order Confirmed!
          </h2>
          <div style={{ 
            background: 'rgba(255, 255, 255, 0.2)',
            padding: '1rem',
            borderRadius: '12px',
            margin: '0 0 1.5rem 0'
          }}>
            <p style={{ margin: '0', fontSize: '1.1rem' }}>
              <strong>Order ID:</strong> {confirmedOrder.orderId}
            </p>
          </div>
          <a 
            href={`/order/${confirmedOrder.orderId}`}
            style={{
              display: 'inline-block',
              background: 'rgba(255, 255, 255, 0.2)',
              color: 'white',
              textDecoration: 'none',
              fontWeight: '600',
              fontSize: '1.1rem',
              padding: '0.75rem 1.5rem',
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
        </div>
      )}
      
      {isConfirming && (
        <div style={{
          marginTop: '2rem',
          padding: '2.5rem',
          background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
          borderRadius: '20px',
          textAlign: 'center',
          boxShadow: '0 20px 40px rgba(245, 158, 11, 0.3)',
          color: 'white'
        }}>
          <div style={{
            display: 'inline-block',
            width: '40px',
            height: '40px',
            border: '3px solid rgba(255, 255, 255, 0.3)',
            borderTop: '3px solid white',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            marginBottom: '1rem'
          }}></div>
          <p style={{ margin: '0', fontSize: '1.2rem', fontWeight: '500' }}>
            Confirming your order...
          </p>
        </div>
      )}
    </div>
  );
};

export default Home; 
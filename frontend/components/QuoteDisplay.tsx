import React from 'react';

interface CalculationDetails {
  volume_mm3: number;
  volume_cm3: number;
  triangle_count: number;
  weight_g: number;
  print_time_h: number;
  material: string;
  material_density: number;
}

interface QuoteDisplayProps {
  price: number;
  quoteId: string;
  fileUrl: string;
  calculationDetails?: CalculationDetails;
  onConfirmOrder?: (quoteData: any) => void;
}

const QuoteDisplay: React.FC<QuoteDisplayProps> = ({ 
  price, 
  quoteId, 
  fileUrl, 
  calculationDetails,
  onConfirmOrder 
}) => {
  const formatTime = (hours: number) => {
    const h = Math.floor(hours);
    const m = Math.round((hours - h) * 60);
    return h > 0 ? `${h}h ${m}m` : `${m}m`;
  };

  const formatVolume = (mm3: number) => {
    if (mm3 < 1000) return `${mm3.toFixed(1)} mm³`;
    return `${(mm3 / 1000).toFixed(2)} cm³`;
  };

  return (
    <div style={{ 
      margin: '2rem 0', 
      background: 'rgba(255, 255, 255, 0.95)',
      borderRadius: '20px',
      boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
      backdropFilter: 'blur(10px)',
      border: '1px solid rgba(255, 255, 255, 0.3)',
      overflow: 'hidden'
    }}>
      <div style={{ 
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        padding: '2.5rem 2rem',
        textAlign: 'center',
        color: 'white'
      }}>
        <h2 style={{ 
          margin: '0 0 1rem 0',
          fontSize: '2.2rem',
          fontWeight: '600',
          letterSpacing: '-0.5px'
        }}>
          Instant Quote Generated
        </h2>
        <div style={{
          fontSize: '3rem',
          fontWeight: '700',
          margin: '0',
          textShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
          £{price.toFixed(2)}
        </div>
        <div style={{
          fontSize: '1.1rem',
          opacity: '0.9',
          marginTop: '0.5rem'
        }}>
          Total Price
        </div>
      </div>

      {calculationDetails && (
        <div style={{ 
          margin: '0',
          background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
          padding: '2rem',
          borderTop: '1px solid rgba(255, 255, 255, 0.5)'
        }}>
          <h3 style={{ 
            color: '#475569', 
            margin: '0 0 1.5rem 0',
            fontSize: '1.3rem',
            fontWeight: '600',
            textAlign: 'center'
          }}>
            Calculation Details
          </h3>
          
          <div style={{ 
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '1.5rem',
            fontSize: '1rem'
          }}>
            <div style={{ 
              background: 'white',
              padding: '1.25rem',
              borderRadius: '12px',
              display: 'flex', 
              justifyContent: 'space-between',
              alignItems: 'center',
              boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
            }}>
              <span style={{ color: '#64748b', fontWeight: '500' }}>Volume</span>
              <strong style={{ color: '#1e293b' }}>{formatVolume(calculationDetails.volume_mm3)}</strong>
            </div>
            
            <div style={{ 
              background: 'white',
              padding: '1.25rem',
              borderRadius: '12px',
              display: 'flex', 
              justifyContent: 'space-between',
              alignItems: 'center',
              boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
            }}>
              <span style={{ color: '#64748b', fontWeight: '500' }}>Weight</span>
              <strong style={{ color: '#1e293b' }}>{calculationDetails.weight_g.toFixed(1)}g</strong>
            </div>
            
            <div style={{ 
              background: 'white',
              padding: '1.25rem',
              borderRadius: '12px',
              display: 'flex', 
              justifyContent: 'space-between',
              alignItems: 'center',
              boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
            }}>
              <span style={{ color: '#64748b', fontWeight: '500' }}>Print Time</span>
              <strong style={{ color: '#1e293b' }}>{formatTime(calculationDetails.print_time_h)}</strong>
            </div>
            
            <div style={{ 
              background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)',
              padding: '1.25rem',
              borderRadius: '12px',
              display: 'flex', 
              justifyContent: 'space-between',
              alignItems: 'center',
              color: 'white',
              boxShadow: '0 4px 8px rgba(251, 191, 36, 0.3)'
            }}>
              <span style={{ fontWeight: '500' }}>Cost</span>
              <strong>£{((calculationDetails.weight_g * 0.02) + (calculationDetails.print_time_h * 2.5)).toFixed(2)}</strong>
            </div>
            
            <div style={{ 
              background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
              padding: '1.25rem',
              borderRadius: '12px',
              display: 'flex', 
              justifyContent: 'space-between',
              alignItems: 'center',
              color: 'white',
              boxShadow: '0 4px 8px rgba(16, 185, 129, 0.3)'
            }}>
              <span style={{ fontWeight: '500' }}>Base Fee</span>
              <strong>£2.00</strong>
            </div>
          </div>
        </div>
      )}

      <div style={{
        background: 'white',
        padding: '2rem',
        borderTop: '1px solid rgba(255, 255, 255, 0.5)'
      }}>
        <h4 style={{ 
          color: '#475569', 
          margin: '0 0 1.5rem 0',
          fontSize: '1.3rem',
          fontWeight: '600',
          textAlign: 'center'
        }}>
          Order Details
        </h4>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ 
            background: 'linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%)',
            padding: '1.25rem',
            borderRadius: '12px',
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center' 
          }}>
            <span style={{ color: '#64748b', fontWeight: '500', fontSize: '1rem' }}>Quote ID</span>
            <code style={{ 
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              padding: '0.5rem 1rem', 
              borderRadius: '8px',
              fontSize: '0.9rem',
              fontWeight: '600'
            }}>
              {quoteId}
            </code>
          </div>
          <div style={{ 
            background: 'linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%)',
            padding: '1.25rem',
            borderRadius: '12px',
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center' 
          }}>
            <span style={{ color: '#64748b', fontWeight: '500', fontSize: '1rem' }}>STL File</span>
            <a 
              href={fileUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              style={{
                background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
                color: 'white',
                textDecoration: 'none',
                padding: '0.75rem 1.5rem',
                borderRadius: '10px',
                fontWeight: '600',
                fontSize: '0.95rem',
                transition: 'all 0.3s ease',
                boxShadow: '0 4px 8px rgba(59, 130, 246, 0.3)'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 6px 12px rgba(59, 130, 246, 0.4)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 8px rgba(59, 130, 246, 0.3)';
              }}
            >
              Download STL
            </a>
          </div>
          <div style={{ 
            marginTop: '1rem',
            textAlign: 'center'
          }}>
            <button
              onClick={() => onConfirmOrder && onConfirmOrder({
                quote_id: quoteId,
                price: price,
                file_url: fileUrl,
                calculation_details: calculationDetails
              })}
              style={{
                background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                border: 'none',
                color: 'white',
                fontWeight: '700',
                fontSize: '1.2rem',
                cursor: 'pointer',
                width: '100%',
                padding: '1rem 2rem',
                borderRadius: '12px',
                boxShadow: '0 8px 16px rgba(16, 185, 129, 0.3)',
                transition: 'all 0.3s ease',
                letterSpacing: '0.5px'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 12px 24px rgba(16, 185, 129, 0.4)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 8px 16px rgba(16, 185, 129, 0.3)';
              }}
            >
              Confirm Order
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuoteDisplay; 
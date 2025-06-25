import React, { useState } from 'react';
import { 
  ShoppingCartIcon, 
  ClockIcon, 
  ScaleIcon,
  CogIcon,
  BeakerIcon,
  CurrencyPoundIcon,
  SparklesIcon
} from '@heroicons/react/24/outline';
import { ClockIcon as ClockIconSolid } from '@heroicons/react/24/solid';

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

interface PrinterSelectionProps {
  pricingOptions: PricingOptions;
  onSelectPrinter: (printerType: 'fdm' | 'resin', pricing: PricingOption) => void;
  quoteId: string;
  fileUrl: string;
  calculationDetails: any;
}

const PrinterSelection: React.FC<PrinterSelectionProps> = ({ 
  pricingOptions, 
  onSelectPrinter,
  quoteId,
  fileUrl,
  calculationDetails
}) => {
  const [selectedPrinter, setSelectedPrinter] = useState<'fdm' | 'resin' | null>(null);
  const [isConfirming, setIsConfirming] = useState(false);

  const handleSelection = async (printerType: 'fdm' | 'resin') => {
    setSelectedPrinter(printerType);
    setIsConfirming(true);
    
    const pricing = pricingOptions[printerType];
    
    // Prepare order data for Supabase
    const orderData = {
      quote_id: quoteId,
      price: pricing.price,
      file_url: fileUrl,
      printer_type: printerType,
      pricing_info: pricing,
      calculation_details: calculationDetails,
      // Include both prices for database storage
      price_fdm: pricingOptions.fdm.price,
      price_resin: pricingOptions.resin.price,
      estimated_print_time_resin: pricingOptions.resin.print_time_h
    };

    try {
      const response = await fetch('http://localhost:8000/confirm-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
      });

      if (!response.ok) throw new Error('Order confirmation failed');
      
      const result = await response.json();
      onSelectPrinter(printerType, pricing);
      
    } catch (error) {
      console.error('Error confirming order:', error);
      setSelectedPrinter(null);
    } finally {
      setIsConfirming(false);
    }
  };

  const formatTime = (hours: number) => {
    const h = Math.floor(hours);
    const m = Math.round((hours - h) * 60);
    return h > 0 ? `${h}h ${m}m` : `${m}m`;
  };

  return (
    <div style={{ 
      margin: '2rem 0',
      background: 'rgba(255, 255, 255, 0.95)',
      borderRadius: '20px',
      padding: '2rem',
      boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
      backdropFilter: 'blur(10px)',
      border: '1px solid rgba(255, 255, 255, 0.3)'
    }}>
      <h3 style={{ 
        textAlign: 'center', 
        marginBottom: '2rem',
        fontSize: '1.8rem',
        color: '#1e293b',
        fontWeight: '600'
      }}>
        Choose Your Printing Technology
      </h3>
      
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: '1fr 1fr', 
        gap: '2rem' 
      }}>
        {/* FDM Option */}
        <div 
          style={{
            border: selectedPrinter === 'fdm' ? '3px solid #10b981' : '2px solid #e2e8f0',
            borderRadius: '16px',
            padding: '2rem',
            background: selectedPrinter === 'fdm' ? '#f0fdf4' : 'white',
            transition: 'all 0.3s ease',
            opacity: isConfirming && selectedPrinter !== 'fdm' ? 0.5 : 1,
            boxShadow: selectedPrinter === 'fdm' ? '0 8px 25px rgba(16, 185, 129, 0.15)' : '0 4px 6px rgba(0,0,0,0.1)',
            display: 'flex',
            flexDirection: 'column',
            height: '100%'
          }}
        >
          <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
            <h4 style={{ margin: '0 0 0.5rem 0', color: '#1e293b', fontSize: '1.4rem', fontWeight: '600' }}>
              FDM Printing
            </h4>
            <div style={{ fontSize: '0.9rem', color: '#64748b', fontWeight: '500' }}>
              {pricingOptions.fdm.technology}
            </div>
          </div>
          
          <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
            <div style={{ fontSize: '2.5rem', fontWeight: '700', color: '#059669' }}>
              £{pricingOptions.fdm.price.toFixed(2)}
            </div>
          </div>

          <div style={{ fontSize: '0.9rem', color: '#64748b', marginBottom: '1rem', lineHeight: '1.5' }}>
            <div style={{ marginBottom: '0.3rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <ClockIcon style={{ width: '16px', height: '16px' }} />
              Print Time: {formatTime(pricingOptions.fdm.print_time_h)}
            </div>
            <div style={{ marginBottom: '0.3rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <ScaleIcon style={{ width: '16px', height: '16px' }} />
              Weight: {calculationDetails.weight_g.toFixed(1)}g
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <CogIcon style={{ width: '16px', height: '16px' }} />
              Material: {pricingOptions.fdm.material_type}
            </div>
          </div>

          {/* Price Breakdown */}
          <div style={{ 
            fontSize: '0.85rem', 
            background: '#f8fafc', 
            padding: '1rem', 
            borderRadius: '8px', 
            marginBottom: '1rem',
            border: '1px solid #e2e8f0'
          }}>
            <div style={{ fontWeight: '600', marginBottom: '0.5rem', color: '#374151', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <CurrencyPoundIcon style={{ width: '16px', height: '16px' }} />
              Price Breakdown:
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.2rem' }}>
              <span>Material ({calculationDetails.weight_g.toFixed(1)}g × £0.02)</span>
              <span>£{pricingOptions.fdm.details.material_cost.toFixed(2)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.2rem' }}>
              <span>Labor ({formatTime(pricingOptions.fdm.print_time_h)} × £2.5/h)</span>
              <span>£{pricingOptions.fdm.details.labor_cost.toFixed(2)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.2rem' }}>
              <span>Setup Fee</span>
              <span>£{pricingOptions.fdm.details.setup_fee.toFixed(2)}</span>
            </div>
            <div style={{ borderTop: '1px solid #d1d5db', paddingTop: '0.3rem', marginTop: '0.3rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: '600' }}>
                <span>Total</span>
                <span style={{ color: '#059669' }}>£{pricingOptions.fdm.price.toFixed(2)}</span>
              </div>
            </div>
          </div>

          <div style={{ fontSize: '0.8rem', color: '#94a3b8', lineHeight: '1.4', marginBottom: '1.5rem', flex: '1' }}>
            <div>• Great for functional parts</div>
            <div>• Stronger materials available</div>
            <div>• Lower cost per part</div>
            <div>• Good for larger objects</div>
          </div>

          {/* Order Button */}
          <button
            onClick={() => !isConfirming && handleSelection('fdm')}
            disabled={isConfirming}
            style={{
              width: '100%',
              padding: '1rem 1.5rem',
              fontSize: '1.1rem',
              fontWeight: '700',
              border: 'none',
              borderRadius: '12px',
              cursor: isConfirming ? 'not-allowed' : 'pointer',
              background: selectedPrinter === 'fdm' && isConfirming 
                ? 'linear-gradient(135deg, #6b7280 0%, #4b5563 100%)'
                : 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
              color: 'white',
              boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)',
              transition: 'all 0.3s ease',
              letterSpacing: '0.5px'
            }}
            onMouseOver={(e) => {
              if (!isConfirming) {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 6px 16px rgba(16, 185, 129, 0.4)';
              }
            }}
            onMouseOut={(e) => {
              if (!isConfirming) {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(16, 185, 129, 0.3)';
              }
            }}
          >
            {selectedPrinter === 'fdm' && isConfirming ? (
              <>
                <ClockIconSolid style={{ width: '20px', height: '20px', marginRight: '0.5rem' }} />
                Processing Order...
              </>
            ) : (
              <>
                <ShoppingCartIcon style={{ width: '20px', height: '20px', marginRight: '0.5rem' }} />
                Order FDM Print - £{pricingOptions.fdm.price.toFixed(2)}
              </>
            )}
          </button>
        </div>

        {/* Resin Option */}
        <div 
          style={{
            border: selectedPrinter === 'resin' ? '3px solid #8b5cf6' : '2px solid #e2e8f0',
            borderRadius: '16px',
            padding: '2rem',
            background: selectedPrinter === 'resin' ? '#faf5ff' : 'white',
            transition: 'all 0.3s ease',
            opacity: isConfirming && selectedPrinter !== 'resin' ? 0.5 : 1,
            boxShadow: selectedPrinter === 'resin' ? '0 8px 25px rgba(139, 92, 246, 0.15)' : '0 4px 6px rgba(0,0,0,0.1)',
            display: 'flex',
            flexDirection: 'column',
            height: '100%'
          }}
        >
          <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
            <h4 style={{ margin: '0 0 0.5rem 0', color: '#1e293b', fontSize: '1.4rem', fontWeight: '600' }}>
              Resin Printing
            </h4>
            <div style={{ fontSize: '0.9rem', color: '#64748b', fontWeight: '500' }}>
              {pricingOptions.resin.technology}
            </div>
          </div>
          
          <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
            <div style={{ fontSize: '2.5rem', fontWeight: '700', color: '#7c3aed' }}>
              £{pricingOptions.resin.price.toFixed(2)}
            </div>
          </div>

          <div style={{ fontSize: '0.9rem', color: '#64748b', marginBottom: '1rem', lineHeight: '1.5' }}>
            <div style={{ marginBottom: '0.3rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <ClockIcon style={{ width: '16px', height: '16px' }} />
              Print Time: {formatTime(pricingOptions.resin.print_time_h)}
            </div>
            <div style={{ marginBottom: '0.3rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <ScaleIcon style={{ width: '16px', height: '16px' }} />
              Weight: {calculationDetails.weight_g.toFixed(1)}g
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <BeakerIcon style={{ width: '16px', height: '16px' }} />
              Material: {pricingOptions.resin.material_type}
            </div>
          </div>

          {/* Price Breakdown */}
          <div style={{ 
            fontSize: '0.85rem', 
            background: '#faf5ff', 
            padding: '1rem', 
            borderRadius: '8px', 
            marginBottom: '1rem',
            border: '1px solid #e9d5ff'
          }}>
            <div style={{ fontWeight: '600', marginBottom: '0.5rem', color: '#374151', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <CurrencyPoundIcon style={{ width: '16px', height: '16px' }} />
              Price Breakdown:
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.2rem' }}>
              <span>Material ({calculationDetails.weight_g.toFixed(1)}g × £0.08)</span>
              <span>£{pricingOptions.resin.details.material_cost.toFixed(2)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.2rem' }}>
              <span>Labor ({formatTime(pricingOptions.resin.print_time_h)} × £1.8/h)</span>
              <span>£{pricingOptions.resin.details.labor_cost.toFixed(2)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.2rem' }}>
              <span>Setup Fee</span>
              <span>£{pricingOptions.resin.details.setup_fee.toFixed(2)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.2rem' }}>
              <span>Post-processing</span>
              <span>£{pricingOptions.resin.details.post_processing.toFixed(2)}</span>
            </div>
            <div style={{ borderTop: '1px solid #d1d5db', paddingTop: '0.3rem', marginTop: '0.3rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: '600' }}>
                <span>Total</span>
                <span style={{ color: '#7c3aed' }}>£{pricingOptions.resin.price.toFixed(2)}</span>
              </div>
            </div>
          </div>

          <div style={{ fontSize: '0.8rem', color: '#94a3b8', lineHeight: '1.4', marginBottom: '1.5rem', flex: '1' }}>
            <div>• Ultra-fine details (0.01mm)</div>
            <div>• Smooth surface finish</div>
            <div>• Perfect for miniatures</div>
            <div>• Faster print times</div>
          </div>

          {/* Order Button */}
          <button
            onClick={() => !isConfirming && handleSelection('resin')}
            disabled={isConfirming}
            style={{
              width: '100%',
              padding: '1rem 1.5rem',
              fontSize: '1.1rem',
              fontWeight: '700',
              border: 'none',
              borderRadius: '12px',
              cursor: isConfirming ? 'not-allowed' : 'pointer',
              background: selectedPrinter === 'resin' && isConfirming 
                ? 'linear-gradient(135deg, #6b7280 0%, #4b5563 100%)'
                : 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
              color: 'white',
              boxShadow: '0 4px 12px rgba(139, 92, 246, 0.3)',
              transition: 'all 0.3s ease',
              letterSpacing: '0.5px'
            }}
            onMouseOver={(e) => {
              if (!isConfirming) {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 6px 16px rgba(139, 92, 246, 0.4)';
              }
            }}
            onMouseOut={(e) => {
              if (!isConfirming) {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(139, 92, 246, 0.3)';
              }
            }}
          >
            {selectedPrinter === 'resin' && isConfirming ? (
              <>
                <ClockIconSolid style={{ width: '20px', height: '20px', marginRight: '0.5rem' }} />
                Processing Order...
              </>
            ) : (
              <>
                <ShoppingCartIcon style={{ width: '20px', height: '20px', marginRight: '0.5rem' }} />
                Order Resin Print - £{pricingOptions.resin.price.toFixed(2)}
              </>
            )}
          </button>
        </div>
      </div>

      {isConfirming && (
        <div style={{ 
          marginTop: '2rem', 
          textAlign: 'center',
          padding: '1rem',
          background: '#f8fafc',
          borderRadius: '12px',
          border: '1px solid #e2e8f0'
        }}>
          <div style={{ color: '#64748b', fontSize: '0.9rem' }}>
            Processing your order for {selectedPrinter?.toUpperCase()} printing...
          </div>
        </div>
      )}
    </div>
  );
};

export default PrinterSelection; 
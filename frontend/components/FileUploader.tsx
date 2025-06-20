import React, { useRef, useState } from 'react';

interface CalculationDetails {
  volume_mm3: number;
  volume_cm3: number;
  triangle_count: number;
  weight_g: number;
  print_time_h: number;
  material: string;
  material_density: number;
}

interface FileUploaderProps {
  onUploadComplete: (data: { 
    quoteId: string; 
    price: number; 
    fileUrl: string; 
    calculationDetails?: CalculationDetails;
  }) => void;
}

const FileUploader: React.FC<FileUploaderProps> = ({ onUploadComplete }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.name.endsWith('.stl')) {
      setError('Only STL files are allowed.');
      return;
    }
    setError(null);
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      const res = await fetch('http://localhost:8000/upload', {
        method: 'POST',
        body: formData,
      });
      if (!res.ok) throw new Error('Upload failed');
      const data = await res.json();
      onUploadComplete({
        quoteId: data.quote_id || data.quoteId || '',
        price: data.price,
        fileUrl: data.file_url,
        calculationDetails: data.calculation_details,
      });
    } catch (err: any) {
      setError(err.message || 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div style={{ margin: '2rem 0' }}>
      <div style={{
        border: uploading ? '2px solid #667eea' : '2px dashed #cbd5e1',
        borderRadius: '16px',
        padding: '3rem 2rem',
        textAlign: 'center',
        background: uploading 
          ? 'linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)'
          : 'rgba(248, 250, 252, 0.8)',
        transition: 'all 0.3s ease',
        backdropFilter: 'blur(5px)'
      }}>
        <div style={{ 
          marginBottom: '1.5rem', 
          fontSize: '4rem',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          fontWeight: 'bold'
        }}>
          STL
        </div>
        <input
          type="file"
          accept=".stl"
          ref={fileInputRef}
          onChange={handleFileChange}
          disabled={uploading}
          style={{ 
            width: '100%',
            padding: '1rem 1.5rem',
            fontSize: '1rem',
            border: '2px solid #e2e8f0',
            borderRadius: '12px',
            marginBottom: '1rem',
            backgroundColor: 'white',
            transition: 'all 0.3s ease',
            outline: 'none'
          }}
          onFocus={(e) => e.target.style.borderColor = '#667eea'}
          onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
        />
        <div style={{ 
          color: '#64748b', 
          fontSize: '1rem',
          fontWeight: '500' 
        }}>
          Select your STL file to get started
        </div>
      </div>
      {uploading && (
        <div style={{ 
          textAlign: 'center', 
          margin: '1.5rem 0',
          padding: '1.5rem',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          borderRadius: '16px',
          color: 'white',
          boxShadow: '0 10px 25px rgba(102, 126, 234, 0.3)'
        }}>
          <div style={{
            display: 'inline-block',
            width: '24px',
            height: '24px',
            border: '2px solid rgba(255, 255, 255, 0.3)',
            borderTop: '2px solid white',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            marginRight: '0.75rem',
            verticalAlign: 'middle'
          }}></div>
          <span style={{ fontWeight: '600', fontSize: '1.1rem' }}>
            Analyzing your STL file...
          </span>
        </div>
      )}
      {error && (
        <div style={{ 
          background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
          color: 'white',
          padding: '1.5rem',
          borderRadius: '16px',
          margin: '1.5rem 0',
          textAlign: 'center',
          boxShadow: '0 10px 25px rgba(239, 68, 68, 0.3)',
          fontWeight: '500'
        }}>
          {error}
        </div>
      )}
    </div>
  );
};

export default FileUploader; 
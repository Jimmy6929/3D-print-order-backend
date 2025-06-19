import React from 'react';

interface UploadStatusProps {
  status?: string;
  error?: string | null;
}

const UploadStatus: React.FC<UploadStatusProps> = ({ status, error }) => {
  if (error) {
    return <div style={{ color: 'red', margin: '1rem 0' }}>{error}</div>;
  }
  if (status) {
    return <div style={{ color: 'green', margin: '1rem 0' }}>{status}</div>;
  }
  return null;
};

export default UploadStatus; 
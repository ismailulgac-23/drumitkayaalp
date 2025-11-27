'use client';
import { Icon } from '@iconify/react';
import React from 'react';

function WhatsAppButton() {
  const whatsappNumber = '905321234567'; // WhatsApp numarası (ülke kodu ile, başında + olmadan)
  const message = 'Merhaba, randevu almak istiyorum.';

  const handleClick = () => {
    const url = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  return (
    <div
      className="whatsapp-button"
      onClick={handleClick}
      style={{
        position: 'fixed',
        bottom: '30px',
        right: '30px',
        width: '60px',
        height: '60px',
        borderRadius: '50%',
        backgroundColor: '#25D366',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        zIndex: 9999,
        boxShadow: '0 4px 12px rgba(37, 211, 102, 0.4)',
        transition: 'all 0.3s ease',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'scale(1.1)';
        e.currentTarget.style.boxShadow = '0 6px 20px rgba(37, 211, 102, 0.6)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'scale(1)';
        e.currentTarget.style.boxShadow = '0 4px 12px rgba(37, 211, 102, 0.4)';
      }}
    >
      <Icon icon="fontisto:whatsapp" className='text-white' style={{ fontSize: '32px' }} />
    </div>
  );
}

export default WhatsAppButton;


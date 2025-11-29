'use client';
import { Icon } from '@iconify/react';
import React, { useState, useEffect } from 'react';

function WhatsAppButton() {
  const [whatsappNumber, setWhatsappNumber] = useState(null);
  const [message, setMessage] = useState('Merhaba, randevu almak istiyorum.');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchWhatsAppInfo();
  }, []);

  const fetchWhatsAppInfo = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/api/contact-channels`);
      const data = await response.json();
      if (data.success) {
        const whatsappChannel = data.data.find((ch) => ch.type === 'whatsapp' && ch.isActive);
        if (whatsappChannel) {
          // Telefon numarasını temizle (sadece rakamlar)
          const cleanNumber = whatsappChannel.value.replace(/[^0-9]/g, '');
          if (cleanNumber) {
            setWhatsappNumber(cleanNumber);
          }
        }
      }
    } catch (error) {
      console.error('Error fetching WhatsApp info:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleClick = () => {
    if (!whatsappNumber) return;
    const url = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  // WhatsApp bilgisi yüklenene kadar veya WhatsApp kanalı yoksa butonu gösterme
  if (loading || !whatsappNumber) {
    return null;
  }

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


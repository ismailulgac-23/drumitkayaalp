'use client';
import React, { useState, useEffect } from 'react';
import { formatPhoneNumber, cleanPhoneForTelLink } from '@/common/phoneFormatter';

function Footer() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [contactChannels, setContactChannels] = useState([]);
  const [footerLogo, setFooterLogo] = useState('/assets/imgs/logo-light.png');

  useEffect(() => {
    fetchContactChannels();
    fetchLogo();
  }, []);

  const fetchLogo = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/api/logos/type/footer`);
      const data = await response.json();
      if (data.success && data.data) {
        setFooterLogo(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}${data.data.url}`);
      }
    } catch (error) {
      console.error('Error fetching footer logo:', error);
    }
  };

  const fetchContactChannels = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/api/contact-channels`);
      const data = await response.json();
      if (data.success) {
        setContactChannels(data.data || []);
      }
    } catch (error) {
      console.error('Error fetching contact channels:', error);
    }
  };

  const handleNewsletterSubmit = async (e) => {
    e.preventDefault();
    if (!email) return;

    setLoading(true);
    setMessage('');

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/api/newsletters/subscribe`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (data.success) {
        setMessage('Bülten aboneliğiniz başarıyla oluşturuldu!');
        setEmail('');
      } else {
        setMessage(data.message || 'Bir hata oluştu');
      }
    } catch (error) {
      console.error('Error subscribing to newsletter:', error);
      setMessage('Bir hata oluştu. Lütfen tekrar deneyin.');
    } finally {
      setLoading(false);
      setTimeout(() => setMessage(''), 5000);
    }
  };

  const getContactChannel = (type) => {
    return contactChannels.find(ch => ch.type === type);
  };

  const phoneChannel = getContactChannel('phone');
  const emailChannel = getContactChannel('email');
  const addressChannel = getContactChannel('address');
  const whatsappChannel = getContactChannel('whatsapp');
  const socialChannels = contactChannels.filter(ch => ch.type === 'social_media');

  return (
    <footer className="clean-footer crev">
      <div className="container pb-40 pt-40 ontop">
        <div className="row justify-content-between">
          <div className="col-lg-2">
            <div className="logo icon-img-100 md-mb80">
              <img src={footerLogo} alt="Klinik Logo" onError={(e) => { e.target.src = '/assets/imgs/logo-light.png'; }} />
            </div>
          </div>
          <div className="col-lg-4">
            <div className="column md-mb50">
              <h6 className="sub-title mb-30">İletişim</h6>
              {addressChannel && (
                <h6 className="p-color fw-400">
                  {addressChannel.value}
                </h6>
              )}
              {emailChannel && (
                <h6 className="mt-30 mb-15">
                  <a href={`mailto:${emailChannel.value}`}>{emailChannel.value}</a>
                </h6>
              )}
              {phoneChannel && (
                <a href={`tel:${cleanPhoneForTelLink(phoneChannel.value)}`} className="underline">
                  <span className="fz-22 main-color">{formatPhoneNumber(phoneChannel.value)}</span>
                </a>
              )}
              {whatsappChannel && (
                <div className="mt-20">
                  <a 
                    href={`https://wa.me/${whatsappChannel.value.replace(/[^0-9]/g, '')}`} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="underline"
                  >
                    <span className="fz-18 main-color">WhatsApp: {formatPhoneNumber(whatsappChannel.value)}</span>
                  </a>
                </div>
              )}
            </div>
          </div>
          <div className="col-lg-2">
            <div className="column md-mb50">
              <h6 className="sub-title mb-30">Hızlı Linkler</h6>
              <ul className="rest fz-14 opacity-7">
                <li className="mb-15">
                  <a href="/hakkimizda">Hakkımızda</a>
                </li>
                <li className="mb-15">
                  <a href="/hizmetler">Hizmetler</a>
                </li>
                <li className="mb-15">
                  <a href="/oncesi-sonrasi">Öncesi-Sonrası</a>
                </li>
                <li className="mb-15">
                  <a href="/sss">SSS</a>
                </li>
                <li>
                  <a href="/iletisim">İletişim</a>
                </li>
              </ul>
            </div>
          </div>
          <div className="col-lg-3">
            <div className="column subscribe-minimal">
              <h6 className="sub-title mb-30">Bülten</h6>
              <form onSubmit={handleNewsletterSubmit}>
                <div className="form-group mb-40">
                  <input 
                    type="email" 
                    name="subscrib" 
                    placeholder="Email Adresiniz" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                  <button type="submit" disabled={loading}>
                    <span className="ti-location-arrow"></span>
                  </button>
                </div>
                {message && (
                  <div className={`fz-12 ${message.includes('başarıyla') ? 'main-color' : 'text-danger'}`}>
                    {message}
                  </div>
                )}
              </form>
              {socialChannels.length > 0 && (
                <ul className="rest social-icon d-flex align-items-center">
                  {socialChannels.map((channel, index) => {
                    // URL formatını kontrol et ve düzelt
                    let url = channel.value;
                    if (!url.startsWith('http://') && !url.startsWith('https://')) {
                      url = `https://${url}`;
                    }
                    
                    return (
                      <li key={channel.id} className={`cursor-pointer ${index > 0 ? 'ml-10' : ''}`}>
                        <a 
                          href={url} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="hover-anim"
                          aria-label={channel.label || 'Social Media Link'}
                        >
                          <i className={channel.icon || 'fab fa-link'}></i>
                        </a>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          </div>
        </div>
        <div className="pt-30 pb-30 mt-80 bord-thin-top">
          <div className="row">
            <div className="col-lg-6">
              <div className="text">
                <p className="fz-13">
                  © {new Date().getFullYear()} Klinik. Tüm hakları saklıdır.
                </p>
              </div>
            </div>
            <div className="col-lg-6">
              <div className="text text-right">
                <p className="fz-13">
                  <a href="/sss">Gizlilik Politikası</a> |{' '}
                  <a href="/sss">Kullanım Koşulları</a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;

'use client';
import React, { useEffect, useLayoutEffect, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { formatPhoneNumber, cleanPhoneForTelLink } from '@/common/phoneFormatter';

function Contact() {
  const [contactChannels, setContactChannels] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchContactChannels();
  }, []);

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

  const getContactChannel = (type) => {
    return contactChannels.find(ch => ch.type === type);
  };

  const phoneChannel = getContactChannel('phone');
  const emailChannel = getContactChannel('email');
  const addressChannel = getContactChannel('address');
  const whatsappChannel = getContactChannel('whatsapp');
  const workingHoursChannel = getContactChannel('working_hours');
  const socialChannels = contactChannels.filter(ch => ch.type === 'social_media');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      // TODO: Contact form submission endpoint oluşturulacak
      // Şimdilik sadece başarılı mesaj gösteriyoruz
      setTimeout(() => {
        setMessage('Mesajınız başarıyla gönderildi!');
        setFormData({
          name: '',
          email: '',
          phone: '',
          subject: '',
          message: '',
        });
        setLoading(false);
        setTimeout(() => setMessage(''), 5000);
      }, 1000);
    } catch (error) {
      console.error('Error submitting contact form:', error);
      setMessage('Bir hata oluştu. Lütfen tekrar deneyin.');
      setLoading(false);
    }
  };

  useLayoutEffect(() => {
    if (typeof window === 'undefined') return;
    
    gsap.registerPlugin(ScrollTrigger);

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: '.contact',
        start: 'top 80%',
        toggleActions: 'play none none reverse',
      },
    });

    tl.fromTo(
      '.contact .info-box',
      { opacity: 0, x: -100 },
      { opacity: 1, x: 0, duration: 1, ease: 'power3.out' }
    )
      .fromTo(
        '.contact .sec-head',
        { opacity: 0, y: 50 },
        { opacity: 1, y: 0, duration: 0.8 },
        '-=0.5'
      )
      .fromTo(
        '.contact .form-group',
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.5,
          stagger: 0.1,
          ease: 'power2.out',
        },
        '-=0.4'
      )
      .fromTo(
        '.contact button',
        { opacity: 0, scale: 0.8 },
        { opacity: 1, scale: 1, duration: 0.6, ease: 'back.out(1.7)' },
        '-=0.2'
      );

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => {
        try {
          const triggerElement = trigger.vars?.trigger;
          if (triggerElement && typeof triggerElement.closest === 'function') {
            if (triggerElement.closest('.contact')) {
              trigger.kill();
            }
          }
        } catch (error) {
          // Ignore errors
        }
      });
    };
  }, []);

  return (
    <section className="contact section-padding">
      <div className="container">
        <div className="row">
          <div className="col-lg-4 valign">
            <div className="sec-head info-box full-width md-mb80">
              {phoneChannel && (
                <div className="phone fz-30 fw-600 underline main-color">
                  <a href={`tel:${cleanPhoneForTelLink(phoneChannel.value)}`}>{formatPhoneNumber(phoneChannel.value)}</a>
                </div>
              )}
              {addressChannel && (
                <div className="morinfo mt-50 pb-30 bord-thin-bottom">
                  <h6 className="mb-15">Adres</h6>
                  <p>{addressChannel.value}</p>
                </div>
              )}
              {emailChannel && (
                <div className="morinfo mt-30 pb-30 bord-thin-bottom">
                  <h6 className="mb-15">Email</h6>
                  <p>{emailChannel.value}</p>
                </div>
              )}
              {whatsappChannel && (
                <div className="morinfo mt-30 pb-30 bord-thin-bottom">
                  <h6 className="mb-15">WhatsApp</h6>
                  <p>
                    <a href={`https://wa.me/${whatsappChannel.value.replace(/[^0-9]/g, '')}`} target="_blank" rel="noopener noreferrer">
                      {formatPhoneNumber(whatsappChannel.value)}
                    </a>
                  </p>
                </div>
              )}
              {workingHoursChannel && (
                <div className="morinfo mt-30 pb-30 bord-thin-bottom">
                  <h6 className="mb-15">Çalışma Saatleri</h6>
                  <p dangerouslySetInnerHTML={{ __html: workingHoursChannel.value.replace(/\n/g, '<br />') }}></p>
                </div>
              )}

              {socialChannels.length > 0 && (
                <div className="social-icon mt-50">
                  {socialChannels.map((channel) => (
                    <a key={channel.id} href={channel.value} target="_blank" rel="noopener noreferrer">
                      <i className={channel.icon || 'fab fa-link'}></i>
                    </a>
                  ))}
                </div>
              )}
            </div>
          </div>
          <div className="col-lg-7 offset-lg-1 valign">
            <div className="full-width">
              <div className="sec-head mb-50">
                <h6 className="sub-title main-color mb-15">İletişime Geçin</h6>
                <h3 className="text-u ls1">
                  Bize <span className="fw-200">Mesaj Gönderin</span>
                </h3>
              </div>
              <form
                id="contact-form"
                className="form2"
                onSubmit={handleSubmit}
              >
                <div className="messages">
                  {message && (
                    <div className={`alert ${message.includes('başarıyla') ? 'alert-success' : 'alert-danger'}`}>
                      {message}
                    </div>
                  )}
                </div>

                <div className="controls row">
                  <div className="col-lg-6">
                    <div className="form-group mb-30">
                      <input
                        id="form_name"
                        type="text"
                        name="name"
                        placeholder="Ad Soyad"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        required
                      />
                    </div>
                  </div>

                  <div className="col-lg-6">
                    <div className="form-group mb-30">
                      <input
                        id="form_email"
                        type="email"
                        name="email"
                        placeholder="Email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        required
                      />
                    </div>
                  </div>

                  <div className="col-lg-6">
                    <div className="form-group mb-30">
                      <input
                        id="form_phone"
                        type="tel"
                        name="phone"
                        placeholder="Telefon"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        required
                      />
                    </div>
                  </div>

                  <div className="col-lg-6">
                    <div className="form-group mb-30">
                      <input
                        id="form_subject"
                        type="text"
                        name="subject"
                        placeholder="Konu"
                        value={formData.subject}
                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="col-12">
                    <div className="form-group">
                      <textarea
                        id="form_message"
                        name="message"
                        placeholder="Mesajınız"
                        rows="4"
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        required
                      ></textarea>
                    </div>
                    <div className="mt-30">
                      <button
                        type="submit"
                        className="butn butn-full butn-bord radius-30"
                        disabled={loading}
                      >
                        <span className="text">{loading ? 'Gönderiliyor...' : 'Gönder'}</span>
                      </button>
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Contact;

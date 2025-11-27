'use client';
import React, { useEffect, useLayoutEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

function FAQS() {
  useLayoutEffect(() => {
    if (typeof window === 'undefined') return;
    
    gsap.registerPlugin(ScrollTrigger);

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: '.page-faqs',
        start: 'top 80%',
        toggleActions: 'play none none reverse',
      },
    });

    tl.fromTo(
      '.page-faqs .sec-head',
      { opacity: 0, y: 50 },
      { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }
    )
      .fromTo(
        '.page-faqs .accordion .item',
        { opacity: 0, y: 50, scale: 0.95 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.6,
          stagger: 0.15,
          ease: 'power2.out',
        },
        '-=0.4'
      )
      .fromTo(
        '.page-faqs .img1, .page-faqs .img2, .page-faqs .img3',
        { opacity: 0, scale: 0.8, rotation: -10 },
        {
          opacity: 1,
          scale: 1,
          rotation: 0,
          duration: 1,
          stagger: 0.2,
          ease: 'power3.out',
        },
        '-=0.3'
      );

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => {
        if (trigger.vars.trigger === document.querySelector('.page-faqs')) {
          trigger.kill();
        }
      });
    };
  }, []);

  function openAccordion(event) {
    const items = document.querySelectorAll('.accordion-info');
    items.forEach((element) => {
      element.classList.remove('active');
      element.style.maxHeight = 0;
      element.parentElement.classList.remove('active');
    });
    event.currentTarget.parentElement.classList.add('active');
    event.currentTarget.nextElementSibling.style.maxHeight = '300px';
    event.currentTarget.nextElementSibling.classList.add('active');
    
    // GSAP animation for accordion
    gsap.fromTo(
      event.currentTarget.nextElementSibling,
      { opacity: 0, height: 0 },
      { opacity: 1, height: 'auto', duration: 0.4, ease: 'power2.out' }
    );
    
    // Rotate icon
    const icon = event.currentTarget.querySelector('.ico');
    if (icon) {
      gsap.to(icon, { rotation: 45, duration: 0.3, ease: 'power2.out' });
    }
  }

  return (
    <section className="page-faqs section-padding pb-0 position-re">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-8">
            <div>
              <div className="sec-head mb-50 text-center">
                <h6 className="sub-title main-color mb-15">Sıkça Sorulan Sorular</h6>
                <h3>
                  Merak Ettiğiniz <br /> Sorular ve Cevapları
                </h3>
              </div>
              <div className="accordion bord">
                <div className="item active wow fadeInUp" data-wow-delay=".1s">
                  <div onClick={openAccordion} className="title">
                    <h6>Randevu nasıl alabilirim?</h6>
                    <span className="ico ti-plus"></span>
                  </div>
                  <div className="accordion-info">
                    <p className="">
                      Randevu almak için web sitemizden online randevu formunu doldurabilir, 
                      telefon ile iletişime geçebilir veya WhatsApp üzerinden mesaj gönderebilirsiniz. 
                      Randevu saatinden 15 dakika önce kliniğimizde bulunmanız önemlidir.
                    </p>
                  </div>
                </div>

                <div className="item wow fadeInUp" data-wow-delay=".3s">
                  <div onClick={openAccordion} className="title">
                    <h6>Hangi ödeme yöntemlerini kabul ediyorsunuz?</h6>
                    <span className="ico ti-plus"></span>
                  </div>
                  <div className="accordion-info">
                    <p className="">
                      Nakit, kredi kartı ve banka kartı ile ödeme yapabilirsiniz. 
                      Ayrıca taksitli ödeme seçenekleri de mevcuttur. 
                      Sigorta kapsamında olan hizmetler için sigorta şirketinizle anlaşmamız bulunmaktadır.
                    </p>
                  </div>
                </div>

                <div className="item wow fadeInUp" data-wow-delay=".5s">
                  <div onClick={openAccordion} className="title">
                    <h6>Randevu iptal etmek istersem ne yapmalıyım?</h6>
                    <span className="ico ti-plus"></span>
                  </div>
                  <div className="accordion-info">
                    <p className="">
                      Randevu iptal etmeniz gerekiyorsa en az 24 saat önceden bilgi vermeniz gerekmektedir. 
                      Bu sayede başka hastalarımızın randevu alabilmesi için zaman tanımış olursunuz. 
                      İptal işlemini telefon veya WhatsApp üzerinden yapabilirsiniz.
                    </p>
                  </div>
                </div>

                <div className="item wow fadeInUp" data-wow-delay=".7s">
                  <div onClick={openAccordion} className="title">
                    <h6>Randevu öncesi hazırlık yapmam gerekiyor mu?</h6>
                    <span className="ico ti-plus"></span>
                  </div>
                  <div className="accordion-info">
                    <p className="">
                      Randevu öncesi hazırlık bilgileri randevu türüne göre değişiklik gösterebilir. 
                      Genel olarak kimlik belgenizi yanınızda getirmeniz, varsa önceki tedavi raporlarınızı 
                      getirmeniz ve kullandığınız ilaçların listesini yanınızda bulundurmanız önerilir. 
                      Özel durumlar için randevu öncesi size bilgi verilecektir.
                    </p>
                  </div>
                </div>

                <div className="item wow fadeInUp" data-wow-delay=".9s">
                  <div onClick={openAccordion} className="title">
                    <h6>Acil durumlarda ne yapmalıyım?</h6>
                    <span className="ico ti-plus"></span>
                  </div>
                  <div className="accordion-info">
                    <p className="">
                      Acil durumlarda 7/24 hizmet veren acil servisimizden yararlanabilirsiniz. 
                      Acil durumlar için telefon numaramızı arayabilir veya doğrudan kliniğimize başvurabilirsiniz. 
                      Hayati tehlike durumlarında öncelikle 112 Acil Servis'i aramanızı öneririz.
                    </p>
                  </div>
                </div>

                <div className="item wow fadeInUp" data-wow-delay="1.1s">
                  <div onClick={openAccordion} className="title">
                    <h6>Sigorta kapsamında mı?</h6>
                    <span className="ico ti-plus"></span>
                  </div>
                  <div className="accordion-info">
                    <p className="">
                      Evet, birçok sigorta şirketi ile anlaşmamız bulunmaktadır. 
                      Randevu alırken sigorta bilgilerinizi belirtmeniz durumunda, 
                      sigorta kapsamındaki hizmetler için ödeme işlemleri otomatik olarak yapılacaktır. 
                      Detaylı bilgi için iletişime geçebilirsiniz.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="img1">
        <img src="/assets/imgs/intro/03.jpg" alt="" />
      </div>
      <div className="img2">
        <img src="/assets/imgs/arw0.png" alt="" />
      </div>
      <div className="img3">
        <img src="/assets/imgs/intro/04.jpg" alt="" />
      </div>
    </section>
  );
}

export default FAQS;

import React from 'react';

function Footer() {
  return (
    <footer className="clean-footer crev">
      <div className="container pb-40 pt-40 ontop">
        <div className="row justify-content-between">
          <div className="col-lg-2">
            <div className="logo icon-img-100 md-mb80">
              <img src="/assets/imgs/logo-light.png" alt="Klinik Logo" />
            </div>
          </div>
          <div className="col-lg-4">
            <div className="column md-mb50">
              <h6 className="sub-title mb-30">İletişim</h6>
              <h6 className="p-color fw-400">
                İstanbul, Kadıköy
              </h6>
              <h6 className="mt-30 mb-15">
                <a href="mailto:info@klinik.com">info@klinik.com</a>
              </h6>
              <a href="tel:02161234567" className="underline">
                <span className="fz-22 main-color">0216 123 45 67</span>
              </a>
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
              <div className="form-group mb-40">
                <input type="text" name="subscrib" placeholder="Email Adresiniz" />
                <button>
                  <span className="ti-location-arrow"></span>
                </button>
              </div>
              <ul className="rest social-icon d-flex align-items-center">
                <li className="hover-this cursor-pointer">
                  <a href="#0" className="hover-anim">
                    <i className="fab fa-facebook-f"></i>
                  </a>
                </li>
                <li className="hover-this cursor-pointer ml-10">
                  <a href="#0" className="hover-anim">
                    <i className="fab fa-instagram"></i>
                  </a>
                </li>
                <li className="hover-this cursor-pointer ml-10">
                  <a href="#0" className="hover-anim">
                    <i className="fab fa-linkedin-in"></i>
                  </a>
                </li>
                <li className="hover-this cursor-pointer ml-10">
                  <a href="#0" className="hover-anim">
                    <i className="fab fa-twitter"></i>
                  </a>
                </li>
              </ul>
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

"use client";
import React, { useState, useEffect, useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Custom Select Component
const CustomSelect = ({
  name,
  value,
  onChange,
  options,
  placeholder,
  required = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedLabel, setSelectedLabel] = useState("");
  const selectRef = useRef(null);
  const dropdownRef = useRef(null);

  useEffect(() => {
    if (value) {
      const option = options.find((opt) => opt.value === value);
      setSelectedLabel(option ? option.label : "");
    } else {
      setSelectedLabel("");
    }
  }, [value, options]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        selectRef.current &&
        !selectRef.current.contains(event.target) &&
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  useEffect(() => {
    if (isOpen && dropdownRef.current) {
      gsap.fromTo(
        dropdownRef.current,
        { opacity: 0, y: -10 },
        { opacity: 1, y: 0, duration: 0.3, ease: "power2.out" }
      );
    }
  }, [isOpen]);

  const handleSelect = (optionValue, optionLabel) => {
    onChange({
      target: {
        name,
        value: optionValue,
      },
    });
    setSelectedLabel(optionLabel);
    setIsOpen(false);
  };

  return (
    <div className="custom-select-wrapper" ref={selectRef}>
      <div
        className={`custom-select ${isOpen ? "open" : ""} ${value ? "has-value" : ""
          }`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="custom-select-value">
          {selectedLabel || placeholder}
        </span>
        <i className={`ti-angle-${isOpen ? "up" : "down"}`}></i>
      </div>
      {isOpen && (
        <div className="custom-select-dropdown" ref={dropdownRef}>
          {options.map((option, index) => (
            <div
              key={index}
              className={`custom-select-option ${value === option.value ? "selected" : ""
                }`}
              onClick={() => handleSelect(option.value, option.label)}
            >
              {option.label}
            </div>
          ))}
        </div>
      )}
      {required && !value && (
        <input
          type="text"
          required
          style={{
            position: "absolute",
            opacity: 0,
            pointerEvents: "none",
            height: 0,
          }}
          tabIndex={-1}
        />
      )}
      <style jsx>{`
        .custom-select-wrapper {
          position: relative;
          width: 100%;
          z-index: 999999 !important;
        }
        .custom-select {
          width: 100%;
          padding: 15px 30px;
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 30px;
          background: transparent;
          color: #fff;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: space-between;
          transition: all 0.4s;
          position: relative;
          z-index: 999999 !important;
        }
        .custom-select:hover {
          border-color: rgba(255, 255, 255, 0.2);
        }
        .custom-select.open {
          border-color: rgba(255, 255, 255, 0.3);
          z-index: 999999 !important;
        }
        .custom-select-value {
          flex: 1;
          color: ${value ? "#fff" : "rgba(255, 255, 255, 0.5)"};
        }
        .custom-select i {
          font-size: 14px;
          transition: transform 0.3s;
          color: rgba(255, 255, 255, 0.7);
        }
        .custom-select.open i {
          transform: rotate(180deg);
        }
        .custom-select-dropdown {
          position: absolute !important;
          top: calc(100% + 8px) !important;
          left: 0 !important;
          right: 0 !important;
          background: #0f0f0f !important;
          border: 1px solid rgba(255, 255, 255, 0.1) !important;
          border-radius: 20px !important;
          max-height: 250px !important;
          overflow-y: auto !important;
          z-index: 9999999 !important;
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.8) !important;
          pointer-events: auto !important;
          isolation: isolate !important;
        }
        .custom-select-dropdown::-webkit-scrollbar {
          width: 6px;
        }
        .custom-select-dropdown::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 10px;
        }
        .custom-select-dropdown::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.2);
          border-radius: 10px;
        }
        .custom-select-option {
          padding: 15px 30px;
          color: #fff;
          cursor: pointer;
          transition: all 0.3s;
          border-bottom: 1px solid rgba(255, 255, 255, 0.05);
          position: relative;
          z-index: 9999999 !important;
        }
        .custom-select-option:last-child {
          border-bottom: none;
        }
        .custom-select-option:hover {
          background: rgba(255, 255, 255, 0.05);
          padding-left: 35px;
        }
        .custom-select-option.selected {
          background: rgba(253, 91, 56, 0.1);
          color: #fd5b38;
        }
      `}</style>
    </div>
  );
};

// Custom Date Picker Component
const CustomDatePicker = ({ name, value, onChange, required = false, min }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const datePickerRef = useRef(null);
  const calendarRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        datePickerRef.current &&
        !datePickerRef.current.contains(event.target) &&
        calendarRef.current &&
        !calendarRef.current.contains(event.target)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  useEffect(() => {
    if (isOpen && calendarRef.current) {
      gsap.fromTo(
        calendarRef.current,
        { opacity: 0, y: -10, scale: 0.95 },
        { opacity: 1, y: 0, scale: 1, duration: 0.3, ease: "back.out(1.1)" }
      );
    }
  }, [isOpen]);

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    return `${day < 10 ? "0" + day : day}.${month < 10 ? "0" + month : month
      }.${year}`;
  };

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];

    // Previous month's trailing days
    const prevMonth = new Date(year, month - 1, 0);
    for (let i = startingDayOfWeek - 1; i >= 0; i--) {
      days.push({
        date: prevMonth.getDate() - i,
        month: month - 1,
        year: year,
        isCurrentMonth: false,
      });
    }

    // Current month's days
    for (let day = 1; day <= daysInMonth; day++) {
      days.push({
        date: day,
        month: month,
        year: year,
        isCurrentMonth: true,
      });
    }

    // Next month's leading days
    const remainingDays = 42 - days.length;
    for (let day = 1; day <= remainingDays; day++) {
      days.push({
        date: day,
        month: month + 1,
        year: year,
        isCurrentMonth: false,
      });
    }

    return days;
  };

  const handleDateSelect = (day) => {
    if (!day.isCurrentMonth) return;

    const selectedDate = new Date(day.year, day.month, day.date);
    const dateString = selectedDate.toISOString().split("T")[0];

    const minDate = min ? new Date(min) : null;
    if (minDate && selectedDate < minDate) return;

    onChange({
      target: {
        name,
        value: dateString,
      },
    });
    setIsOpen(false);
  };

  const navigateMonth = (direction) => {
    setCurrentMonth(
      new Date(
        currentMonth.getFullYear(),
        currentMonth.getMonth() + direction,
        1
      )
    );
  };

  const monthNames = [
    "Ocak",
    "Şubat",
    "Mart",
    "Nisan",
    "Mayıs",
    "Haziran",
    "Temmuz",
    "Ağustos",
    "Eylül",
    "Ekim",
    "Kasım",
    "Aralık",
  ];

  const weekDays = ["Pzt", "Sal", "Çar", "Per", "Cum", "Cmt", "Paz"];

  const days = getDaysInMonth(currentMonth);
  const minDate = min ? new Date(min) : null;
  const selectedDate = value ? new Date(value) : null;

  return (
    <div className="custom-datepicker-wrapper" ref={datePickerRef}>
      <div
        className={`custom-datepicker ${isOpen ? "open" : ""} ${value ? "has-value" : ""
          }`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="custom-datepicker-value">
          {value ? formatDate(value) : "Tarih Seçiniz"}
        </span>
        <i className="ti-calendar"></i>
      </div>
      {isOpen && (
        <div className="custom-datepicker-calendar" ref={calendarRef}>
          <div className="calendar-header">
            <button
              type="button"
              className="calendar-nav-btn"
              onClick={() => navigateMonth(-1)}
            >
              <i className="ti-angle-left"></i>
            </button>
            <span className="calendar-month-year">
              {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
            </span>
            <button
              type="button"
              className="calendar-nav-btn"
              onClick={() => navigateMonth(1)}
            >
              <i className="ti-angle-right"></i>
            </button>
          </div>
          <div className="calendar-weekdays">
            {weekDays.map((day, index) => (
              <div key={index} className="calendar-weekday">
                {day}
              </div>
            ))}
          </div>
          <div className="calendar-days">
            {days.map((day, index) => {
              const dayDate = new Date(day.year, day.month, day.date);
              const isSelected =
                selectedDate &&
                dayDate.getDate() === selectedDate.getDate() &&
                dayDate.getMonth() === selectedDate.getMonth() &&
                dayDate.getFullYear() === selectedDate.getFullYear();
              const isDisabled = minDate && dayDate < minDate;
              const isToday =
                dayDate.toDateString() === new Date().toDateString() &&
                day.isCurrentMonth;

              return (
                <div
                  key={index}
                  className={`calendar-day ${!day.isCurrentMonth ? "other-month" : ""
                    } ${isSelected ? "selected" : ""} ${isDisabled ? "disabled" : ""
                    } ${isToday ? "today" : ""}`}
                  onClick={() => !isDisabled && handleDateSelect(day)}
                >
                  {day.date}
                </div>
              );
            })}
          </div>
        </div>
      )}
      {required && !value && (
        <input
          type="text"
          required
          style={{
            position: "absolute",
            opacity: 0,
            pointerEvents: "none",
            height: 0,
          }}
          tabIndex={-1}
        />
      )}
      <style jsx>{`
        .custom-datepicker-wrapper {
          position: relative;
          width: 100%;
          z-index: 999999 !important;
        }
        .custom-datepicker {
          width: 100%;
          padding: 15px 30px;
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 30px;
          background: transparent;
          color: #fff;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: space-between;
          transition: all 0.4s;
          position: relative;
          z-index: 999999 !important;
        }
        .custom-datepicker:hover {
          border-color: rgba(255, 255, 255, 0.2);
        }
        .custom-datepicker.open {
          border-color: rgba(255, 255, 255, 0.3);
          z-index: 999999 !important;
        }
        .custom-datepicker-value {
          flex: 1;
          color: ${value ? "#fff" : "rgba(255, 255, 255, 0.5)"};
        }
        .custom-datepicker i {
          font-size: 16px;
          color: rgba(255, 255, 255, 0.7);
        }
        .custom-datepicker-calendar {
          position: absolute !important;
          top: calc(100% + 8px) !important;
          left: 0 !important;
          right: 0 !important;
          background: #0f0f0f !important;
          border: 1px solid rgba(255, 255, 255, 0.1) !important;
          border-radius: 20px !important;
          padding: 20px !important;
          z-index: 9999999 !important;
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.8) !important;
          min-width: 300px !important;
          pointer-events: auto !important;
          isolation: isolate !important;
        }
        .calendar-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 20px;
        }
        .calendar-month-year {
          font-weight: 600;
          color: #fff;
          font-size: 16px;
        }
        .calendar-nav-btn {
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 8px;
          width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          color: #fff;
          transition: all 0.3s;
          position: relative;
          z-index: 9999999 !important;
        }
        .calendar-nav-btn:hover {
          background: rgba(255, 255, 255, 0.1);
          border-color: rgba(255, 255, 255, 0.2);
        }
        .calendar-nav-btn i {
          font-size: 12px;
        }
        .calendar-weekdays {
          display: grid;
          grid-template-columns: repeat(7, 1fr);
          gap: 8px;
          margin-bottom: 10px;
        }
        .calendar-weekday {
          text-align: center;
          font-size: 12px;
          color: rgba(255, 255, 255, 0.5);
          font-weight: 600;
          padding: 8px 0;
        }
        .calendar-days {
          display: grid;
          grid-template-columns: repeat(7, 1fr);
          gap: 8px;
        }
        .calendar-day {
          aspect-ratio: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 10px;
          cursor: pointer;
          transition: all 0.3s;
          color: rgba(255, 255, 255, 0.7);
          font-size: 14px;
          position: relative;
          z-index: 9999999 !important;
        }
        .calendar-day.other-month {
          color: rgba(255, 255, 255, 0.2);
        }
        .calendar-day:hover:not(.disabled):not(.other-month) {
          background: rgba(255, 255, 255, 0.1);
          transform: scale(1.1);
        }
        .calendar-day.selected {
          background: #fd5b38;
          color: #fff;
          font-weight: 600;
        }
        .calendar-day.today:not(.selected) {
          border: 2px solid rgba(255, 255, 255, 0.3);
        }
        .calendar-day.disabled {
          opacity: 0.3;
          cursor: not-allowed;
        }
        .calendar-day.disabled:hover {
          transform: none;
          background: transparent;
        }
      `}</style>
    </div>
  );
};

function AppointmentForm() {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    date: "",
    time: "",
    service: "",
    doctor: "",
    notes: "",
  });

  const [submitted, setSubmitted] = useState(false);
  const [services, setServices] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

  useEffect(() => {
    fetchServices();
    fetchDoctors();
  }, []);

  const fetchServices = async () => {
    try {
      const response = await fetch(`${API_URL}/api/services`);
      const data = await response.json();
      if (data.success) {
        setServices(data.data || []);
      }
    } catch (error) {
      console.error('Error fetching services:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchDoctors = async () => {
    try {
      const response = await fetch(`${API_URL}/api/doctors`);
      const data = await response.json();
      if (data.success) {
        setDoctors(data.data || []);
      }
    } catch (error) {
      console.error('Error fetching doctors:', error);
    }
  };

  useLayoutEffect(() => {
    if (typeof window === "undefined") return;

    gsap.registerPlugin(ScrollTrigger);

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: ".contact",
        start: "top 80%",
        toggleActions: "play none none reverse",
      },
    });

    tl.fromTo(
      ".contact .sec-head",
      { opacity: 0, y: 50 },
      { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" }
    )
      .fromTo(
        ".contact .form-group",
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.5,
          stagger: 0.1,
          ease: "power2.out",
        },
        "-=0.4"
      )
      .fromTo(
        ".contact button",
        { opacity: 0, scale: 0.8 },
        { opacity: 1, scale: 1, duration: 0.6, ease: "back.out(1.7)" },
        "-=0.2"
      );

    return () => {
      try {
        ScrollTrigger.getAll().forEach((trigger) => {
          try {
            const triggerElement = trigger.vars?.trigger;
            const contactElement = document.querySelector(".contact");
            if (triggerElement && contactElement && triggerElement === contactElement) {
              trigger.kill();
            }
          } catch (error) {
            // Silently handle errors during cleanup
          }
        });
      } catch (error) {
        // Silently handle errors during cleanup
      }
    };
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Find selected service and doctor IDs
      const selectedService = services.find(s => s.title === formData.service);
      const selectedDoctor = doctors.find(d => d.name === formData.doctor);

      const response = await fetch(`${API_URL}/api/appointments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          phone: formData.phone,
          email: formData.email || undefined,
          date: formData.date,
          time: formData.time,
          serviceId: selectedService?.id || undefined,
          serviceName: formData.service || undefined,
          doctorId: selectedDoctor?.id || undefined,
          doctorName: formData.doctor || undefined,
          notes: formData.notes || undefined,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setSubmitted(true);
        setTimeout(() => {
          setSubmitted(false);
          setFormData({
            name: "",
            phone: "",
            email: "",
            date: "",
            time: "",
            service: "",
            doctor: "",
            notes: "",
          });
        }, 3000);
      } else {
        alert(data.message || 'Randevu oluşturulurken bir hata oluştu');
      }
    } catch (error) {
      console.error('Error submitting appointment:', error);
      alert('Randevu oluşturulurken bir hata oluştu. Lütfen tekrar deneyin.');
    }
  };

  const timeSlots = [
    "09:00",
    "09:30",
    "10:00",
    "10:30",
    "11:00",
    "11:30",
    "13:00",
    "13:30",
    "14:00",
    "14:30",
    "15:00",
    "15:30",
    "16:00",
    "16:30",
    "17:00",
  ];

  return (
    <>
      <section className="contact section-padding">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-8">
              <div className="sec-head mb-50 text-center">
                <h6 className="sub-title main-color mb-15">Randevu Formu</h6>
                <h3 className="text-u ls1">
                  Randevu <span className="fw-200">Talep Formu</span>
                </h3>
                <p className="mt-20">
                  Lütfen aşağıdaki formu doldurarak randevu talebinizi oluşturun.
                  En kısa sürede size dönüş yapacağız.
                </p>
              </div>
              {submitted ? (
                <div className="text-center py-80" style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                  <div className="icon-img-100 mb-30">
                    <i
                      className="ti-check"
                      style={{ fontSize: "60px", color: "#4ade80" }}
                    ></i>
                  </div>
                  <h3 className="mb-20">Randevu Talebiniz Alındı!</h3>
                  <p>
                    Randevu talebiniz başarıyla gönderildi. En kısa sürede size
                    telefon veya email ile dönüş yapacağız.
                  </p>
                </div>
              ) : (
                <form
                  id="appointment-form"
                  className="form2"
                  method="post"
                  onSubmit={handleSubmit}
                >
                  <div className="messages"></div>

                  <div className="controls row">
                    <div className="col-lg-6">
                      <div className="form-group mb-30">
                        <input
                          id="form_name"
                          type="text"
                          name="name"
                          placeholder="Ad Soyad *"
                          value={formData.name}
                          onChange={handleChange}
                          required
                        />
                      </div>
                    </div>

                    <div className="col-lg-6">
                      <div className="form-group mb-30 group">
                        <input
                          id="form_phone"
                          type="tel"
                          name="phone"
                          placeholder="Telefon *"
                          value={formData.phone}
                          onChange={handleChange}
                          required
                        />
                      </div>
                    </div>

                    <div className="col-lg-6">
                      <div className="form-group mb-30 group">
                        <input
                          id="form_email"
                          type="email"
                          name="email"
                          placeholder="Email"
                          value={formData.email}
                          onChange={handleChange}
                        />
                      </div>
                    </div>

                    <div className="col-lg-6 group-3">
                      <div className="form-group mb-30 group-3">
                        <CustomSelect
                          name="service"
                          value={formData.service}
                          onChange={handleChange}
                          placeholder={loading ? "Yükleniyor..." : "Hizmet Seçiniz *"}
                          required
                          options={services.map((service) => ({
                            value: service.title,
                            label: service.title,
                          }))}
                        />
                      </div>
                    </div>

                    <div className="col-lg-6 group-2">
                      <div className="form-group mb-30 group-2">
                        <CustomDatePicker
                          name="date"
                          value={formData.date}
                          onChange={handleChange}
                          required
                          min={new Date().toISOString().split("T")[0]}
                        />
                      </div>
                    </div>

                    <div className="col-lg-6 group-2">
                      <div
                        className="form-group mb-30 group-2"
                      >
                        <CustomSelect
                          name="time"
                          value={formData.time}
                          onChange={handleChange}
                          placeholder="Saat Seçiniz *"
                          required
                          options={timeSlots.map((time) => ({
                            value: time,
                            label: time,
                          }))}
                        />
                      </div>
                    </div>

                    <div className="col-lg-12 group-1">
                      <div className="form-group mb-30 group-1">
                        <CustomSelect
                          name="doctor"
                          value={formData.doctor}
                          onChange={handleChange}
                          placeholder="Doktor Seçiniz (Opsiyonel)"
                          options={doctors.map((doctor) => ({
                            value: doctor.name,
                            label: doctor.name + (doctor.specialty ? ` - ${doctor.specialty}` : ''),
                          }))}
                        />
                      </div>
                    </div>

                    <div className="col-12">
                      <div className="form-group" style={{ zIndex: 1 }}>
                        <textarea
                          id="form_notes"
                          name="notes"
                          placeholder="Notlar (Opsiyonel)"
                          rows="4"
                          value={formData.notes}
                          onChange={handleChange}
                        ></textarea>
                      </div>
                      <div className="mt-30">
                        <button
                          type="submit"
                          className="butn butn-full butn-bord radius-30"
                        >
                          <span className="text">Randevu Talebi Gönder</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
      <style jsx>{`
      .group-3 {
        position: relative;
        z-index: 3;
      }
        .group-2 {
        position: relative;
        z-index: 2;
      }
        .group-1 {
        position: relative;
        z-index: 1;
      }
    `}</style>
    </>
  );
}

export default AppointmentForm;

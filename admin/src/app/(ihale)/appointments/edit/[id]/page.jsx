"use client";
import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import ComponentCard from "@/components/common/ComponentCard";
import Button from "@/components/ui/button/Button";
import axios from "@/axios";

export default function EditAppointment() {
    const router = useRouter();
    const params = useParams();
    const [loading, setLoading] = useState(false);
    const [loadingData, setLoadingData] = useState(true);
    const [doctors, setDoctors] = useState([]);
    const [services, setServices] = useState([]);
    const [formData, setFormData] = useState({
        name: "",
        phone: "",
        email: "",
        date: "",
        time: "",
        doctorId: "",
        serviceId: "",
        status: "Planlandı",
        notes: "",
    });

    useEffect(() => {
        fetchDoctors();
        fetchServices();
        fetchAppointment();
    }, [params.id]);

    const fetchDoctors = async () => {
        try {
            const response = await axios.get('/doctors');
            if (response.data.success) {
                setDoctors(response.data.data || []);
            }
        } catch (error) {
            console.error('Error fetching doctors:', error);
        }
    };

    const fetchServices = async () => {
        try {
            const response = await axios.get('/services');
            if (response.data.success) {
                setServices(response.data.data || []);
            }
        } catch (error) {
            console.error('Error fetching services:', error);
        }
    };

    const fetchAppointment = async () => {
        try {
            setLoadingData(true);
            const response = await axios.get(`/appointments/${params.id}`);
            if (response.data.success) {
                const appointment = response.data.data;
                const date = new Date(appointment.date);
                const formattedDate = date.toISOString().split('T')[0];
                
                setFormData({
                    name: appointment.name || "",
                    phone: appointment.phone || "",
                    email: appointment.email || "",
                    date: formattedDate,
                    time: appointment.time || "",
                    doctorId: appointment.doctorId || "",
                    serviceId: appointment.serviceId || "",
                    status: appointment.status || "Planlandı",
                    notes: appointment.notes || "",
                });
            }
        } catch (error) {
            console.error('Error fetching appointment:', error);
            alert('Randevu bilgileri yüklenirken bir hata oluştu');
        } finally {
            setLoadingData(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        
        try {
            const updateData = {
                name: formData.name,
                phone: formData.phone,
                email: formData.email || undefined,
                date: formData.date,
                time: formData.time,
                status: formData.status,
                notes: formData.notes || undefined,
                doctorId: formData.doctorId || undefined,
                serviceId: formData.serviceId || undefined,
            };

            const response = await axios.put(`/appointments/${params.id}`, updateData);
            if (response.data.success) {
                alert("Randevu başarıyla güncellendi!");
                router.push("/appointments");
            }
        } catch (error) {
            console.error('Error updating appointment:', error);
            alert(error.response?.data?.message || 'Randevu güncellenirken bir hata oluştu');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    if (loadingData) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-lg">Yükleniyor...</div>
            </div>
        );
    }

    return (
        <div>
            <PageBreadcrumb 
                pageTitle="Randevu Düzenle" 
                onSave={handleSubmit}
                loading={loading}
            />
            <div className="space-y-6">
                <ComponentCard title="Randevu Bilgileri">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Hasta Adı <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                    className="w-full rounded-md border border-input bg-background px-3 py-2"
                                    placeholder="Hasta Adı Soyadı"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Hasta Telefonu <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="tel"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    required
                                    className="w-full rounded-md border border-input bg-background px-3 py-2"
                                    placeholder="0532 123 45 67"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Email
                                </label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="w-full rounded-md border border-input bg-background px-3 py-2"
                                    placeholder="email@example.com"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Tarih <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="date"
                                    name="date"
                                    value={formData.date}
                                    onChange={handleChange}
                                    required
                                    className="w-full rounded-md border border-input bg-background px-3 py-2"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Saat <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="time"
                                    name="time"
                                    value={formData.time}
                                    onChange={handleChange}
                                    required
                                    className="w-full rounded-md border border-input bg-background px-3 py-2"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Doktor
                                </label>
                                <select
                                    name="doctorId"
                                    value={formData.doctorId}
                                    onChange={handleChange}
                                    className="w-full rounded-md border border-input bg-background px-3 py-2"
                                >
                                    <option value="">Seçiniz</option>
                                    {doctors.map(doctor => (
                                        <option key={doctor.id} value={doctor.id}>{doctor.name}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Hizmet
                                </label>
                                <select
                                    name="serviceId"
                                    value={formData.serviceId}
                                    onChange={handleChange}
                                    className="w-full rounded-md border border-input bg-background px-3 py-2"
                                >
                                    <option value="">Seçiniz</option>
                                    {services.map(service => (
                                        <option key={service.id} value={service.id}>{service.title}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Durum
                                </label>
                                <select
                                    name="status"
                                    value={formData.status}
                                    onChange={handleChange}
                                    className="w-full rounded-md border border-input bg-background px-3 py-2"
                                >
                                    <option value="Planlandı">Planlandı</option>
                                    <option value="Bekliyor">Bekliyor</option>
                                    <option value="Tamamlandı">Tamamlandı</option>
                                    <option value="İptal">İptal</option>
                                </select>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Notlar
                            </label>
                            <textarea
                                name="notes"
                                value={formData.notes}
                                onChange={handleChange}
                                rows={4}
                                className="w-full rounded-md border border-input bg-background px-3 py-2"
                                placeholder="Randevu hakkında notlar"
                            />
                        </div>

                        <div className="flex gap-4 justify-end">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => router.back()}
                            >
                                İptal
                            </Button>
                            <Button
                                type="submit"
                                disabled={loading}
                            >
                                {loading ? "Güncelleniyor..." : "Güncelle"}
                            </Button>
                        </div>
                    </form>
                </ComponentCard>
            </div>
        </div>
    );
}

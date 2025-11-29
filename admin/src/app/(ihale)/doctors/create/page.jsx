"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import ComponentCard from "@/components/common/ComponentCard";
import Button from "@/components/ui/button/Button";
import axios from "@/axios";

export default function CreateDoctor() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        specialty: "",
        bio: "",
        isActive: true,
    });
    const [image, setImage] = useState(null);
    const [preview, setPreview] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        
        try {
            const formDataToSend = new FormData();
            formDataToSend.append('name', formData.name);
            formDataToSend.append('email', formData.email || '');
            formDataToSend.append('phone', formData.phone || '');
            formDataToSend.append('specialty', formData.specialty || '');
            formDataToSend.append('bio', formData.bio || '');
            formDataToSend.append('isActive', formData.isActive.toString());
            
            if (image) {
                formDataToSend.append('doctors', image);
            }

            const response = await axios.post('/doctors', formDataToSend, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            if (response.data.success) {
                alert("Doktor başarıyla eklendi!");
                router.push("/doctors");
            } else {
                alert("Bir hata oluştu!");
            }
        } catch (error) {
            console.error('Error creating doctor:', error);
            alert("Bir hata oluştu!");
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) {
                alert('Dosya boyutu 5MB\'dan küçük olmalıdır');
                return;
            }
            setImage(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <div>
            <PageBreadcrumb 
                pageTitle="Yeni Doktor Ekle" 
            />
            <div className="space-y-6">
                <ComponentCard title="Doktor Bilgileri">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Ad Soyad <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                    className="w-full rounded-md border border-input bg-background px-3 py-2"
                                    placeholder="Dr. Ad Soyad"
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
                                    Telefon
                                </label>
                                <input
                                    type="tel"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    className="w-full rounded-md border border-input bg-background px-3 py-2"
                                    placeholder="+90 (5XX) XXX XX XX"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Uzmanlık Alanı
                                </label>
                                <input
                                    type="text"
                                    name="specialty"
                                    value={formData.specialty}
                                    onChange={handleChange}
                                    className="w-full rounded-md border border-input bg-background px-3 py-2"
                                    placeholder="Örn: Kardiyoloji, Dermatoloji"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Fotoğraf
                            </label>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleImageChange}
                                className="w-full rounded-md border border-input bg-background px-3 py-2"
                            />
                            {preview && (
                                <div className="mt-3">
                                    <img src={preview} alt="Preview" className="w-32 h-32 object-cover rounded-full" />
                                </div>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Biyografi
                            </label>
                            <textarea
                                name="bio"
                                value={formData.bio}
                                onChange={handleChange}
                                rows={6}
                                className="w-full rounded-md border border-input bg-background px-3 py-2"
                                placeholder="Doktor hakkında bilgiler"
                            />
                        </div>

                        <div className="flex items-center">
                            <label className="flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    name="isActive"
                                    checked={formData.isActive}
                                    onChange={handleChange}
                                    className="mr-2"
                                />
                                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Aktif</span>
                            </label>
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
                                {loading ? "Kaydediliyor..." : "Kaydet"}
                            </Button>
                        </div>
                    </form>
                </ComponentCard>
            </div>
        </div>
    );
}


"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import ComponentCard from "@/components/common/ComponentCard";
import Button from "@/components/ui/button/Button";
import axios from "@/axios";

export default function CreateService() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        price: "",
        duration: "",
        order: "",
        isActive: true,
    });
    const [image, setImage] = useState(null);
    const [preview, setPreview] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        
        try {
            const formDataToSend = new FormData();
            formDataToSend.append('title', formData.title);
            formDataToSend.append('description', formData.description || '');
            formDataToSend.append('price', formData.price || '0');
            formDataToSend.append('duration', formData.duration || '');
            formDataToSend.append('order', formData.order || '0');
            formDataToSend.append('isActive', formData.isActive.toString());
            
            if (image) {
                formDataToSend.append('services', image);
            }

            const response = await axios.post('/services', formDataToSend, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            if (response.data.success) {
                alert("Hizmet başarıyla eklendi!");
                router.push("/site-content/services");
            } else {
                alert("Bir hata oluştu!");
            }
        } catch (error) {
            console.error('Error creating service:', error);
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
                pageTitle="Yeni Hizmet Ekle" 
            />
            <div className="space-y-6">
                <ComponentCard title="Hizmet Bilgileri">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Hizmet Adı <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    name="title"
                                    value={formData.title}
                                    onChange={handleChange}
                                    required
                                    className="w-full rounded-md border border-input bg-background px-3 py-2"
                                    placeholder="Hizmet adı"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Fiyat
                                </label>
                                <input
                                    type="number"
                                    name="price"
                                    value={formData.price}
                                    onChange={handleChange}
                                    className="w-full rounded-md border border-input bg-background px-3 py-2"
                                    placeholder="0"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Süre
                                </label>
                                <input
                                    type="text"
                                    name="duration"
                                    value={formData.duration}
                                    onChange={handleChange}
                                    className="w-full rounded-md border border-input bg-background px-3 py-2"
                                    placeholder="30 dakika"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Sıra
                                </label>
                                <input
                                    type="number"
                                    name="order"
                                    value={formData.order}
                                    onChange={handleChange}
                                    className="w-full rounded-md border border-input bg-background px-3 py-2"
                                    placeholder="0"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Görsel
                            </label>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleImageChange}
                                className="w-full rounded-md border border-input bg-background px-3 py-2"
                            />
                            {preview && (
                                <div className="mt-3">
                                    <img src={preview} alt="Preview" className="w-full h-48 object-cover rounded" />
                                </div>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Açıklama <span className="text-red-500">*</span>
                            </label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                required
                                rows={6}
                                className="w-full rounded-md border border-input bg-background px-3 py-2"
                                placeholder="Hizmet açıklaması"
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


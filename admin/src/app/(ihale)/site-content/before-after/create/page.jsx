"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import ComponentCard from "@/components/common/ComponentCard";
import Button from "@/components/ui/button/Button";
import axios from "@/axios";

export default function CreateBeforeAfter() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        order: "",
        isActive: true,
    });
    const [beforeImage, setBeforeImage] = useState(null);
    const [afterImage, setAfterImage] = useState(null);
    const [beforePreview, setBeforePreview] = useState(null);
    const [afterPreview, setAfterPreview] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!beforeImage || !afterImage) {
            alert("Lütfen öncesi ve sonrası görselleri yükleyin!");
            return;
        }

        setLoading(true);
        
        try {
            const formDataToSend = new FormData();
            formDataToSend.append('title', formData.title);
            formDataToSend.append('description', formData.description || '');
            formDataToSend.append('order', formData.order || '0');
            formDataToSend.append('isActive', formData.isActive.toString());
            formDataToSend.append('beforeImage', beforeImage);
            formDataToSend.append('afterImage', afterImage);

            const response = await axios.post('/before-after', formDataToSend, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            if (response.data.success) {
                alert("Öğe başarıyla eklendi!");
                router.push("/site-content/before-after");
            } else {
                alert("Bir hata oluştu!");
            }
        } catch (error) {
            console.error('Error creating before-after:', error);
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

    const handleBeforeImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) {
                alert('Dosya boyutu 5MB\'dan küçük olmalıdır');
                return;
            }
            setBeforeImage(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setBeforePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleAfterImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) {
                alert('Dosya boyutu 5MB\'dan küçük olmalıdır');
                return;
            }
            setAfterImage(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setAfterPreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <div>
            <PageBreadcrumb 
                pageTitle="Yeni Öncesi-Sonrası Ekle" 
            />
            <div className="space-y-6">
                <ComponentCard title="Öncesi-Sonrası Bilgileri">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Başlık <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                name="title"
                                value={formData.title}
                                onChange={handleChange}
                                required
                                className="w-full rounded-md border border-input bg-background px-3 py-2"
                                placeholder="Başlık"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Açıklama
                            </label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                rows={4}
                                className="w-full rounded-md border border-input bg-background px-3 py-2"
                                placeholder="Açıklama"
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Öncesi Görsel <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleBeforeImageChange}
                                    required
                                    className="w-full rounded-md border border-input bg-background px-3 py-2"
                                />
                                {beforePreview && (
                                    <div className="mt-3">
                                        <img src={beforePreview} alt="Before preview" className="w-full h-48 object-cover rounded" />
                                    </div>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Sonrası Görsel <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleAfterImageChange}
                                    required
                                    className="w-full rounded-md border border-input bg-background px-3 py-2"
                                />
                                {afterPreview && (
                                    <div className="mt-3">
                                        <img src={afterPreview} alt="After preview" className="w-full h-48 object-cover rounded" />
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
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

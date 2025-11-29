"use client";
import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import ComponentCard from "@/components/common/ComponentCard";
import Button from "@/components/ui/button/Button";
import axios from "@/axios";

export default function EditBeforeAfter() {
    const router = useRouter();
    const params = useParams();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
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
    const [currentBeforeUrl, setCurrentBeforeUrl] = useState(null);
    const [currentAfterUrl, setCurrentAfterUrl] = useState(null);

    useEffect(() => {
        fetchData();
    }, [params.id]);

    const fetchData = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`/before-after/${params.id}`);
            if (response.data.success) {
                const data = response.data.data;
                setFormData({
                    title: data.title || "",
                    description: data.description || "",
                    order: data.order?.toString() || "0",
                    isActive: data.isActive !== undefined ? data.isActive : true,
                });
                setCurrentBeforeUrl(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}${data.beforeImage}`);
                setCurrentAfterUrl(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}${data.afterImage}`);
                setBeforePreview(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}${data.beforeImage}`);
                setAfterPreview(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}${data.afterImage}`);
            }
        } catch (error) {
            console.error('Error fetching before-after:', error);
            alert('Veri yüklenirken bir hata oluştu');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        
        try {
            const formDataToSend = new FormData();
            formDataToSend.append('title', formData.title);
            formDataToSend.append('description', formData.description || '');
            formDataToSend.append('order', formData.order || '0');
            formDataToSend.append('isActive', formData.isActive.toString());
            
            if (beforeImage) {
                formDataToSend.append('beforeImage', beforeImage);
            }
            if (afterImage) {
                formDataToSend.append('afterImage', afterImage);
            }

            const response = await axios.put(`/before-after/${params.id}`, formDataToSend, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            if (response.data.success) {
            alert("Öğe başarıyla güncellendi!");
            router.push("/site-content/before-after");
            } else {
                alert("Bir hata oluştu!");
            }
        } catch (error) {
            console.error('Error updating before-after:', error);
            alert("Bir hata oluştu!");
        } finally {
            setSaving(false);
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

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                    <h1 className="text-2xl font-bold">Yükleniyor...</h1>
                </div>
            </div>
        );
    }

    return (
        <div>
            <PageBreadcrumb 
                pageTitle="Öncesi-Sonrası Düzenle" 
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
                                    Öncesi Görsel
                                </label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleBeforeImageChange}
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
                                    Sonrası Görsel
                                </label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleAfterImageChange}
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
                                disabled={saving}
                            >
                                {saving ? "Güncelleniyor..." : "Güncelle"}
                            </Button>
                        </div>
                    </form>
                </ComponentCard>
            </div>
        </div>
    );
}

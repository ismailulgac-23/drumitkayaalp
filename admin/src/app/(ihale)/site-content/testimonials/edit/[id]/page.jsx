"use client";
import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import ComponentCard from "@/components/common/ComponentCard";
import Button from "@/components/ui/button/Button";
import { Icon } from "@iconify/react";
import axios from "@/axios";

export default function EditTestimonial() {
    const router = useRouter();
    const params = useParams();
    const [loading, setLoading] = useState(false);
    const [avatar, setAvatar] = useState(null);
    const [preview, setPreview] = useState(null);
    const [currentAvatarUrl, setCurrentAvatarUrl] = useState(null);
    const [formData, setFormData] = useState({
        patientName: "",
        rating: 5,
        comment: "",
        date: "",
        isActive: true,
    });

    useEffect(() => {
        fetchTestimonial();
    }, [params.id]);

    const fetchTestimonial = async () => {
        try {
            const response = await axios.get(`/testimonials/${params.id}`);
            if (response.data.success) {
                const testimonial = response.data.data;
                setFormData({
                    patientName: testimonial.patientName,
                    rating: testimonial.rating,
                    comment: testimonial.comment,
                    date: testimonial.date ? new Date(testimonial.date).toISOString().split('T')[0] : "",
                    isActive: testimonial.isActive,
                });
                if (testimonial.avatarUrl) {
                    setCurrentAvatarUrl(testimonial.avatarUrl);
                    setPreview(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}${testimonial.avatarUrl}`);
                }
            }
        } catch (error) {
            console.error('Error fetching testimonial:', error);
            alert('Yorum bilgileri yüklenirken bir hata oluştu');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        
        try {
            const formDataToSend = new FormData();
            formDataToSend.append('patientName', formData.patientName);
            formDataToSend.append('rating', formData.rating);
            formDataToSend.append('comment', formData.comment);
            formDataToSend.append('date', formData.date);
            formDataToSend.append('isActive', formData.isActive);
            
            if (avatar) {
                formDataToSend.append('avatar', avatar);
            }

            const response = await axios.put(`/testimonials/${params.id}`, formDataToSend, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            if (response.data.success) {
                alert("Yorum başarıyla güncellendi!");
                router.push("/site-content/testimonials");
            }
        } catch (error) {
            console.error('Error updating testimonial:', error);
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

    const handleAvatarChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) {
                alert('Dosya boyutu 5MB\'dan küçük olmalıdır');
                return;
            }
            setAvatar(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const renderStars = (rating) => {
        return Array.from({ length: 5 }, (_, i) => (
            <button
                key={i}
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, rating: i + 1 }))}
                className="focus:outline-none"
            >
                <Icon
                    icon={i < rating ? "ri:star-fill" : "ri:star-line"}
                    className={i < rating ? "text-yellow-400 text-2xl" : "text-gray-300 text-2xl"}
                />
            </button>
        ));
    };

    return (
        <div>
            <PageBreadcrumb 
                pageTitle="Yorum Düzenle" 
                onSave={handleSubmit}
                loading={loading}
            />
            <div className="space-y-6">
                <ComponentCard title="Yorum Bilgileri">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Hasta Adı <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    name="patientName"
                                    value={formData.patientName}
                                    onChange={handleChange}
                                    required
                                    className="w-full rounded-md border border-input bg-background px-3 py-2"
                                    placeholder="Hasta adı"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Tarih
                                </label>
                                <input
                                    type="date"
                                    name="date"
                                    value={formData.date}
                                    onChange={handleChange}
                                    className="w-full rounded-md border border-input bg-background px-3 py-2"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Puan <span className="text-red-500">*</span>
                            </label>
                            <div className="flex items-center gap-2">
                                {renderStars(formData.rating)}
                                <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">
                                    ({formData.rating}/5)
                                </span>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Yorum <span className="text-red-500">*</span>
                            </label>
                            <textarea
                                name="comment"
                                value={formData.comment}
                                onChange={handleChange}
                                required
                                rows={6}
                                className="w-full rounded-md border border-input bg-background px-3 py-2"
                                placeholder="Yorum"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Avatar
                            </label>
                            <div className="space-y-4">
                                {preview ? (
                                    <div className="relative inline-block">
                                        <img 
                                            src={preview} 
                                            alt="Avatar preview" 
                                            className="w-32 h-32 rounded-full object-cover border-2 border-gray-300 dark:border-gray-700"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setPreview(currentAvatarUrl ? `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}${currentAvatarUrl}` : null);
                                                setAvatar(null);
                                                document.getElementById('avatar-input-edit').value = '';
                                            }}
                                            className="absolute top-0 right-0 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                                        >
                                            <Icon icon="heroicons:x-mark" className="h-4 w-4" />
                                        </button>
                                    </div>
                                ) : (
                                    <div className="w-32 h-32 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center border-2 border-dashed border-gray-300 dark:border-gray-600">
                                        <Icon icon="heroicons:user" className="h-12 w-12 text-gray-400" />
                                    </div>
                                )}
                                <input
                                    id="avatar-input-edit"
                                    type="file"
                                    accept="image/*"
                                    onChange={handleAvatarChange}
                                    className="block w-full text-sm text-gray-500 dark:text-gray-400
                                        file:mr-4 file:py-2 file:px-4
                                        file:rounded-md file:border-0
                                        file:text-sm file:font-semibold
                                        file:bg-primary file:text-white
                                        hover:file:bg-primary/90
                                        cursor-pointer"
                                />
                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                    PNG, JPG, JPEG (max 5MB)
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center">
                            <input
                                type="checkbox"
                                name="isActive"
                                checked={formData.isActive}
                                onChange={handleChange}
                                className="rounded border-gray-300"
                            />
                            <label className="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                                Aktif
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
                                {loading ? "Güncelleniyor..." : "Güncelle"}
                            </Button>
                        </div>
                    </form>
                </ComponentCard>
            </div>
        </div>
    );
}


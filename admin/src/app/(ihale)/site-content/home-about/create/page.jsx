"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import ComponentCard from "@/components/common/ComponentCard";
import Button from "@/components/ui/button/Button";
import axios from "@/axios";

export default function CreateHomeAbout() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        smallTitle: '',
        title: '',
        content: '',
        isActive: true,
    });
    const [image, setImage] = useState(null);
    const [preview, setPreview] = useState(null);

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
            setImage(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            const formDataToSend = new FormData();
            formDataToSend.append('smallTitle', formData.smallTitle);
            formDataToSend.append('title', formData.title);
            formDataToSend.append('content', formData.content);
            formDataToSend.append('isActive', formData.isActive);
            if (image) {
                formDataToSend.append('about', image);
            }

            await axios.post('/home-about', formDataToSend, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            alert('About başarıyla oluşturuldu');
            router.push('/site-content/home-about');
        } catch (error) {
            console.error('Error creating about:', error);
            alert('About oluşturulurken bir hata oluştu');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <PageBreadcrumb title="Anasayfa About Oluştur" />
            <ComponentCard>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-2">Küçük Üst Başlık</label>
                        <input
                            type="text"
                            name="smallTitle"
                            value={formData.smallTitle}
                            onChange={handleChange}
                            className="form-control"
                            placeholder="Hakkımızda"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2">Başlık</label>
                        <input
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            className="form-control"
                            placeholder="Başlık"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2">Content</label>
                        <textarea
                            name="content"
                            value={formData.content}
                            onChange={handleChange}
                            className="form-control"
                            rows="6"
                            placeholder="Content alanı..."
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2">Fotoğraf</label>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                            className="form-control"
                        />
                        {preview && (
                            <img src={preview} alt="Preview" className="mt-2 w-48 h-32 object-cover rounded" />
                        )}
                    </div>

                    <div>
                        <label className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                name="isActive"
                                checked={formData.isActive}
                                onChange={handleChange}
                            />
                            <span>Aktif</span>
                        </label>
                    </div>

                    <div className="flex gap-2">
                        <Button type="submit" className="btn btn-primary" disabled={loading}>
                            {loading ? 'Kaydediliyor...' : 'Kaydet'}
                        </Button>
                        <Button
                            type="button"
                            className="btn btn-secondary"
                            onClick={() => router.back()}
                        >
                            İptal
                        </Button>
                    </div>
                </form>
            </ComponentCard>
        </div>
    );
}


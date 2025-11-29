"use client";
import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import ComponentCard from "@/components/common/ComponentCard";
import Button from "@/components/ui/button/Button";
import axios from "@/axios";

export default function EditHomeAbout() {
    const router = useRouter();
    const params = useParams();
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);
    const [formData, setFormData] = useState({
        smallTitle: '',
        title: '',
        content: '',
        isActive: true,
    });
    const [image, setImage] = useState(null);
    const [preview, setPreview] = useState(null);
    const [currentImage, setCurrentImage] = useState(null);

    useEffect(() => {
        fetchAbout();
    }, [params.id]);

    const fetchAbout = async () => {
        try {
            setFetching(true);
            const response = await axios.get(`/home-about/all`);
            const about = response.data.data.find(item => item.id === params.id);
            if (about) {
                setFormData({
                    smallTitle: about.smallTitle || '',
                    title: about.title || '',
                    content: about.content || '',
                    isActive: about.isActive,
                });
                if (about.image) {
                    setCurrentImage(about.image);
                }
            }
        } catch (error) {
            console.error('Error fetching about:', error);
            alert('About yüklenirken bir hata oluştu');
        } finally {
            setFetching(false);
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

            await axios.put(`/home-about/${params.id}`, formDataToSend, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            alert('About başarıyla güncellendi');
            router.push('/site-content/home-about');
        } catch (error) {
            console.error('Error updating about:', error);
            alert('About güncellenirken bir hata oluştu');
        } finally {
            setLoading(false);
        }
    };

    if (fetching) {
        return <div>Yükleniyor...</div>;
    }

    return (
        <div>
            <PageBreadcrumb title="Anasayfa About Düzenle" />
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
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2">Fotoğraf</label>
                        {currentImage && !preview && (
                            <div className="mb-2">
                                <img
                                    src={`http://localhost:3000${currentImage}`}
                                    alt="Current"
                                    className="w-48 h-32 object-cover rounded"
                                />
                            </div>
                        )}
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
                            {loading ? 'Güncelleniyor...' : 'Güncelle'}
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


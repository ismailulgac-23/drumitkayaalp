"use client";
import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import ComponentCard from "@/components/common/ComponentCard";
import Button from "@/components/ui/button/Button";
import axios from "@/axios";

export default function EditHomeIntro() {
    const router = useRouter();
    const params = useParams();
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);
    const [formData, setFormData] = useState({
        smallTitle: '',
        mainTitle: '',
        subTitle: '',
        description: '',
        buttonText: '',
        buttonLink: '',
        isActive: true,
    });
    const [backgroundImage, setBackgroundImage] = useState(null);
    const [preview, setPreview] = useState(null);
    const [currentBackgroundImage, setCurrentBackgroundImage] = useState(null);

    useEffect(() => {
        fetchIntro();
    }, [params.id]);

    const fetchIntro = async () => {
        try {
            setFetching(true);
            const response = await axios.get(`/home-intro/all`);
            const intro = response.data.data.find(item => item.id === params.id);
            if (intro) {
                setFormData({
                    smallTitle: intro.smallTitle || '',
                    mainTitle: intro.mainTitle || '',
                    subTitle: intro.subTitle || '',
                    description: intro.description || '',
                    buttonText: intro.buttonText || '',
                    buttonLink: intro.buttonLink || '',
                    isActive: intro.isActive,
                });
                if (intro.backgroundImage) {
                    setCurrentBackgroundImage(intro.backgroundImage);
                }
            }
        } catch (error) {
            console.error('Error fetching intro:', error);
            alert('Intro yüklenirken bir hata oluştu');
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
            setBackgroundImage(file);
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
            formDataToSend.append('mainTitle', formData.mainTitle);
            formDataToSend.append('subTitle', formData.subTitle);
            formDataToSend.append('description', formData.description);
            formDataToSend.append('buttonText', formData.buttonText);
            formDataToSend.append('buttonLink', formData.buttonLink);
            formDataToSend.append('isActive', formData.isActive);
            if (backgroundImage) {
                formDataToSend.append('backgroundImage', backgroundImage);
            }

            await axios.put(`/home-intro/${params.id}`, formDataToSend, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            alert('Intro başarıyla güncellendi');
            router.push('/site-content/home-intro');
        } catch (error) {
            console.error('Error updating intro:', error);
            alert('Intro güncellenirken bir hata oluştu');
        } finally {
            setLoading(false);
        }
    };

    if (fetching) {
        return <div>Yükleniyor...</div>;
    }

    return (
        <div>
            <PageBreadcrumb title="Anasayfa Intro Düzenle" />
            <ComponentCard>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-2">Küçük Başlık</label>
                        <input
                            type="text"
                            name="smallTitle"
                            value={formData.smallTitle}
                            onChange={handleChange}
                            className="form-control"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2">Ana Başlık *</label>
                        <input
                            type="text"
                            name="mainTitle"
                            value={formData.mainTitle}
                            onChange={handleChange}
                            className="form-control"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2">Alt Başlık</label>
                        <input
                            type="text"
                            name="subTitle"
                            value={formData.subTitle}
                            onChange={handleChange}
                            className="form-control"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2">Alt Yazı</label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            className="form-control"
                            rows="4"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2">Buton Adı</label>
                        <input
                            type="text"
                            name="buttonText"
                            value={formData.buttonText}
                            onChange={handleChange}
                            className="form-control"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2">Buton Link</label>
                        <input
                            type="text"
                            name="buttonLink"
                            value={formData.buttonLink}
                            onChange={handleChange}
                            className="form-control"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2">Arkaplan Görseli</label>
                        {currentBackgroundImage && !preview && (
                            <div className="mb-2">
                                <img
                                    src={`http://localhost:3000${currentBackgroundImage}`}
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


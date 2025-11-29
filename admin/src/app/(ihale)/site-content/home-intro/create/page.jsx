"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import ComponentCard from "@/components/common/ComponentCard";
import Button from "@/components/ui/button/Button";
import axios from "@/axios";

export default function CreateHomeIntro() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
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

            await axios.post('/home-intro', formDataToSend, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            alert('Intro başarıyla oluşturuldu');
            router.push('/site-content/home-intro');
        } catch (error) {
            console.error('Error creating intro:', error);
            alert('Intro oluşturulurken bir hata oluştu');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <PageBreadcrumb title="Anasayfa Intro Oluştur" />
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
                            placeholder="Modern Sağlık Hizmetleri"
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
                            placeholder="Sağlığınız İçin Yanınızdayız"
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
                            placeholder="Profesyonel ve Güvenilir Sağlık Hizmetleri"
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
                            placeholder="Açıklama metni..."
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
                            placeholder="Randevu Al"
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
                            placeholder="/randevu-al"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2">Arkaplan Görseli</label>
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


"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import ComponentCard from "@/components/common/ComponentCard";
import Button from "@/components/ui/button/Button";

export default function HomePageContent() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        heroTitle: "Modern ve Güvenilir Sağlık Hizmetleri",
        heroSubtitle: "Sağlığınız için en iyi hizmeti sunuyoruz",
        heroImage: "",
        aboutSection: "Hakkımızda içeriği buraya gelecek...",
        servicesSection: "Hizmetlerimiz bölümü içeriği...",
        testimonialsSection: "Müşteri yorumları bölümü...",
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        
        setTimeout(() => {
            setLoading(false);
            alert("Anasayfa içeriği başarıyla güncellendi!");
        }, 1000);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    return (
        <div>
            <PageBreadcrumb 
                pageTitle="Anasayfa İçerik Yönetimi" 
                onSave={handleSubmit}
                loading={loading}
            />
            <div className="space-y-6">
                <ComponentCard title="Hero Bölümü">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Ana Başlık
                            </label>
                            <input
                                type="text"
                                name="heroTitle"
                                value={formData.heroTitle}
                                onChange={handleChange}
                                className="w-full rounded-md border border-input bg-background px-3 py-2"
                                placeholder="Ana başlık"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Alt Başlık
                            </label>
                            <input
                                type="text"
                                name="heroSubtitle"
                                value={formData.heroSubtitle}
                                onChange={handleChange}
                                className="w-full rounded-md border border-input bg-background px-3 py-2"
                                placeholder="Alt başlık"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Hero Görsel URL
                            </label>
                            <input
                                type="url"
                                name="heroImage"
                                value={formData.heroImage}
                                onChange={handleChange}
                                className="w-full rounded-md border border-input bg-background px-3 py-2"
                                placeholder="https://example.com/image.jpg"
                            />
                        </div>
                    </form>
                </ComponentCard>

                <ComponentCard title="Hakkımızda Bölümü">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            İçerik
                        </label>
                        <textarea
                            name="aboutSection"
                            value={formData.aboutSection}
                            onChange={handleChange}
                            rows={8}
                            className="w-full rounded-md border border-input bg-background px-3 py-2"
                            placeholder="Hakkımızda içeriği"
                        />
                    </div>
                </ComponentCard>

                <ComponentCard title="Hizmetler Bölümü">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            İçerik
                        </label>
                        <textarea
                            name="servicesSection"
                            value={formData.servicesSection}
                            onChange={handleChange}
                            rows={6}
                            className="w-full rounded-md border border-input bg-background px-3 py-2"
                            placeholder="Hizmetler bölümü içeriği"
                        />
                    </div>
                </ComponentCard>

                <ComponentCard title="Müşteri Yorumları Bölümü">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            İçerik
                        </label>
                        <textarea
                            name="testimonialsSection"
                            value={formData.testimonialsSection}
                            onChange={handleChange}
                            rows={6}
                            className="w-full rounded-md border border-input bg-background px-3 py-2"
                            placeholder="Müşteri yorumları bölümü içeriği"
                        />
                    </div>
                </ComponentCard>

                <div className="flex gap-4 justify-end">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => router.back()}
                    >
                        İptal
                    </Button>
                    <Button
                        onClick={handleSubmit}
                        disabled={loading}
                    >
                        {loading ? "Kaydediliyor..." : "Kaydet"}
                    </Button>
                </div>
            </div>
        </div>
    );
}


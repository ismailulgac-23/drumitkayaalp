"use client";
import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import ComponentCard from "@/components/common/ComponentCard";
import Button from "@/components/ui/button/Button";

export default function EditFAQ() {
    const router = useRouter();
    const params = useParams();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        question: "",
        answer: "",
        order: "",
        isActive: true,
    });

    useEffect(() => {
        // Simulate fetching FAQ data
        setFormData({
            question: "Randevu nasıl alabilirim?",
            answer: "Randevu almak için web sitemizden online randevu formunu doldurabilir veya telefon ile iletişime geçebilirsiniz.",
            order: "1",
            isActive: true,
        });
    }, [params.id]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        
        setTimeout(() => {
            setLoading(false);
            alert("Soru başarıyla güncellendi!");
            router.push("/site-content/faq");
        }, 1000);
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    return (
        <div>
            <PageBreadcrumb 
                pageTitle="Soru Düzenle" 
                onSave={handleSubmit}
                loading={loading}
            />
            <div className="space-y-6">
                <ComponentCard title="SSS Bilgileri">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Soru <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                name="question"
                                value={formData.question}
                                onChange={handleChange}
                                required
                                className="w-full rounded-md border border-input bg-background px-3 py-2"
                                placeholder="Soru"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Cevap <span className="text-red-500">*</span>
                            </label>
                            <textarea
                                name="answer"
                                value={formData.answer}
                                onChange={handleChange}
                                required
                                rows={6}
                                className="w-full rounded-md border border-input bg-background px-3 py-2"
                                placeholder="Cevap"
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
                                placeholder="1"
                            />
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


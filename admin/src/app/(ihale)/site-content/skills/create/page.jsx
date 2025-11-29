"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import ComponentCard from "@/components/common/ComponentCard";
import Button from "@/components/ui/button/Button";
import axios from "@/axios";

export default function CreateSkill() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        percentage: 0,
        title: '',
        order: 0,
        isActive: true,
    });

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : (type === 'number' ? parseInt(value) : value)
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            await axios.post('/skills', formData);
            alert('Uzmanlık alanı başarıyla oluşturuldu');
            router.push('/site-content/skills');
        } catch (error) {
            console.error('Error creating skill:', error);
            alert('Uzmanlık alanı oluşturulurken bir hata oluştu');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <PageBreadcrumb title="Uzmanlık Alanı Oluştur" />
            <ComponentCard>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-2">Yüzdelik (0-100) *</label>
                        <input
                            type="number"
                            name="percentage"
                            value={formData.percentage}
                            onChange={handleChange}
                            className="form-control"
                            required
                            min="0"
                            max="100"
                            placeholder="98"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2">Alt Başlık *</label>
                        <input
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            className="form-control"
                            required
                            placeholder="Genel Muayene"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2">Sıra</label>
                        <input
                            type="number"
                            name="order"
                            value={formData.order}
                            onChange={handleChange}
                            className="form-control"
                            min="0"
                        />
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


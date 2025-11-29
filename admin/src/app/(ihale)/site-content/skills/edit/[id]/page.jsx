"use client";
import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import ComponentCard from "@/components/common/ComponentCard";
import Button from "@/components/ui/button/Button";
import axios from "@/axios";

export default function EditSkill() {
    const router = useRouter();
    const params = useParams();
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);
    const [formData, setFormData] = useState({
        percentage: 0,
        title: '',
        order: 0,
        isActive: true,
    });

    useEffect(() => {
        fetchSkill();
    }, [params.id]);

    const fetchSkill = async () => {
        try {
            setFetching(true);
            const response = await axios.get(`/skills/${params.id}`);
            if (response.data.success) {
                setFormData(response.data.data);
            }
        } catch (error) {
            console.error('Error fetching skill:', error);
            alert('Uzmanlık alanı yüklenirken bir hata oluştu');
        } finally {
            setFetching(false);
        }
    };

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
            await axios.put(`/skills/${params.id}`, formData);
            alert('Uzmanlık alanı başarıyla güncellendi');
            router.push('/site-content/skills');
        } catch (error) {
            console.error('Error updating skill:', error);
            alert('Uzmanlık alanı güncellenirken bir hata oluştu');
        } finally {
            setLoading(false);
        }
    };

    if (fetching) {
        return <div>Yükleniyor...</div>;
    }

    return (
        <div>
            <PageBreadcrumb title="Uzmanlık Alanı Düzenle" />
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


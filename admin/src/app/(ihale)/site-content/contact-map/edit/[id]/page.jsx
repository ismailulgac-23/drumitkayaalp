"use client";
import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import ComponentCard from "@/components/common/ComponentCard";
import Button from "@/components/ui/button/Button";
import axios from "@/axios";

export default function EditContactMap() {
    const router = useRouter();
    const params = useParams();
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);
    const [formData, setFormData] = useState({
        iframeCode: '',
        isActive: true,
    });

    useEffect(() => {
        fetchMap();
    }, [params.id]);

    const fetchMap = async () => {
        try {
            setFetching(true);
            const response = await axios.get(`/contact-map/all`);
            const map = response.data.data.find(item => item.id === params.id);
            if (map) {
                setFormData({
                    iframeCode: map.iframeCode || '',
                    isActive: map.isActive,
                });
            }
        } catch (error) {
            console.error('Error fetching map:', error);
            alert('Harita yüklenirken bir hata oluştu');
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

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            await axios.put(`/contact-map/${params.id}`, formData);
            alert('Harita başarıyla güncellendi');
            router.push('/site-content/contact-map');
        } catch (error) {
            console.error('Error updating map:', error);
            alert('Harita güncellenirken bir hata oluştu');
        } finally {
            setLoading(false);
        }
    };

    if (fetching) {
        return <div>Yükleniyor...</div>;
    }

    return (
        <div>
            <PageBreadcrumb title="İletişim Haritası Düzenle" />
            <ComponentCard>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-2">Iframe Kodu *</label>
                        <textarea
                            name="iframeCode"
                            value={formData.iframeCode}
                            onChange={handleChange}
                            className="form-control"
                            required
                            rows="6"
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


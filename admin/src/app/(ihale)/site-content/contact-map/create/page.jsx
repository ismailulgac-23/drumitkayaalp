"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import ComponentCard from "@/components/common/ComponentCard";
import Button from "@/components/ui/button/Button";
import axios from "@/axios";

export default function CreateContactMap() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        iframeCode: '',
        isActive: true,
    });

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
            await axios.post('/contact-map', formData);
            alert('Harita başarıyla oluşturuldu');
            router.push('/site-content/contact-map');
        } catch (error) {
            console.error('Error creating map:', error);
            alert('Harita oluşturulurken bir hata oluştu');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <PageBreadcrumb title="İletişim Haritası Oluştur" />
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
                            placeholder='<iframe id="gmap_canvas" src="https://maps.google.com/maps?q=hollwood&t=&z=11&ie=UTF8&iwloc=&output=embed"></iframe>'
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


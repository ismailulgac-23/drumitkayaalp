"use client";
import React, { useState, useEffect } from "react";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import ComponentCard from "@/components/common/ComponentCard";
import Button from "@/components/ui/button/Button";
import { Icon } from "@iconify/react";
import axios from "@/axios";

export default function LogosPage() {
    const [logos, setLogos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingLogo, setEditingLogo] = useState(null);
    const [formData, setFormData] = useState({
        type: "header",
        name: "",
        alt: "",
        width: "",
        height: "",
    });
    const [uploading, setUploading] = useState(false);
    const [preview, setPreview] = useState(null);

    useEffect(() => {
        fetchLogos();
    }, []);

    const fetchLogos = async () => {
        try {
            setLoading(true);
            const response = await axios.get('/logos/admin');
            if (response.data.success) {
                setLogos(response.data.data || []);
            }
        } catch (error) {
            console.error('Error fetching logos:', error);
            alert('Logolar yüklenirken bir hata oluştu');
        } finally {
            setLoading(false);
        }
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) {
                alert('Dosya boyutu 5MB\'dan küçük olmalıdır');
                return;
            }
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!editingLogo && !preview && !document.getElementById('logo-file').files[0]) {
            alert('Lütfen bir logo dosyası seçin');
            return;
        }

        setUploading(true);
        try {
            const formDataToSend = new FormData();
            formDataToSend.append('type', formData.type);
            formDataToSend.append('name', formData.name);
            formDataToSend.append('alt', formData.alt || formData.name);
            if (formData.width) formDataToSend.append('width', formData.width);
            if (formData.height) formDataToSend.append('height', formData.height);

            const fileInput = document.getElementById('logo-file');
            if (fileInput.files[0]) {
                formDataToSend.append('logos', fileInput.files[0]);
            }

            let response;
            if (editingLogo) {
                response = await axios.put(`/logos/${editingLogo.id}`, formDataToSend, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                });
            } else {
                response = await axios.post('/logos', formDataToSend, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                });
            }

            if (response.data.success) {
                fetchLogos();
                setShowModal(false);
                resetForm();
            }
        } catch (error) {
            console.error('Error saving logo:', error);
            alert('Logo kaydedilirken bir hata oluştu');
        } finally {
            setUploading(false);
        }
    };

    const handleEdit = (logo) => {
        setEditingLogo(logo);
        setFormData({
            type: logo.type,
            name: logo.name,
            alt: logo.alt || "",
            width: logo.width?.toString() || "",
            height: logo.height?.toString() || "",
        });
        setPreview(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}${logo.url}`);
        setShowModal(true);
    };

    const handleDelete = async (id) => {
        if (!confirm('Bu logoyu silmek istediğinize emin misiniz?')) {
            return;
        }

        try {
            const response = await axios.delete(`/logos/${id}`);
            if (response.data.success) {
                fetchLogos();
            }
        } catch (error) {
            console.error('Error deleting logo:', error);
            alert('Logo silinirken bir hata oluştu');
        }
    };

    const handleToggle = async (id) => {
        try {
            const response = await axios.patch(`/logos/${id}/toggle`);
            if (response.data.success) {
                fetchLogos();
            }
        } catch (error) {
            console.error('Error toggling logo:', error);
            alert('Durum değiştirilirken bir hata oluştu');
        }
    };

    const resetForm = () => {
        setEditingLogo(null);
        setFormData({
            type: "header",
            name: "",
            alt: "",
            width: "",
            height: "",
        });
        setPreview(null);
        const fileInput = document.getElementById('logo-file');
        if (fileInput) fileInput.value = '';
    };

    const logoTypes = [
        { value: "header", label: "Header Logo" },
        { value: "footer", label: "Footer Logo" },
        { value: "favicon", label: "Favicon" },
        { value: "og_image", label: "OG Image (Social Media)" },
    ];

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                    <h1 className="text-2xl font-bold">Yükleniyor...</h1>
                </div>
            </div>
        );
    }

    return (
        <div>
            <PageBreadcrumb pageTitle="Logo Yönetimi" />
            <ComponentCard title="Logolar">
                <div className="space-y-4">
                    <div className="flex justify-end">
                        <Button onClick={() => { resetForm(); setShowModal(true); }}>
                            <Icon icon="ri:add-line" className="mr-2" />
                            Yeni Logo Ekle
                        </Button>
                    </div>

                    {/* Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {logos.length > 0 ? (
                            logos.map((logo) => (
                                <div key={logo.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-lg transition-shadow">
                                    <div className="mb-3 bg-gray-900 dark:bg-gray-950 rounded p-4">
                                        <img
                                            src={`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}${logo.url}`}
                                            alt={logo.alt || logo.name}
                                            className="w-full h-32 object-contain rounded"
                                            onError={(e) => {
                                                e.target.src = '/placeholder.webp';
                                            }}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <div>
                                            <span className="text-xs font-medium text-gray-500 dark:text-gray-400">Tip:</span>
                                            <p className="font-semibold">{logoTypes.find(t => t.value === logo.type)?.label || logo.type}</p>
                                        </div>
                                        <div>
                                            <span className="text-xs font-medium text-gray-500 dark:text-gray-400">İsim:</span>
                                            <p className="text-sm">{logo.name}</p>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                                                logo.isActive 
                                                    ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                                                    : 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
                                            }`}>
                                                {logo.isActive ? 'Aktif' : 'Pasif'}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2 pt-2 border-t border-gray-200 dark:border-gray-700">
                                            <button
                                                onClick={() => handleEdit(logo)}
                                                className="p-2 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400"
                                                title="Düzenle"
                                            >
                                                <Icon icon="ri:edit-line" className="text-xl" />
                                            </button>
                                            <button
                                                onClick={() => handleToggle(logo.id)}
                                                className="p-2 text-gray-600 dark:text-gray-400 hover:text-yellow-600 dark:hover:text-yellow-400"
                                                title={logo.isActive ? 'Pasif Et' : 'Aktif Et'}
                                            >
                                                <Icon 
                                                    icon={logo.isActive ? "ri:eye-off-line" : "ri:eye-line"} 
                                                    className="text-xl"
                                                />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(logo.id)}
                                                className="p-2 text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400"
                                                title="Sil"
                                            >
                                                <Icon icon="ri:delete-bin-line" className="text-xl" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="col-span-full p-8 text-center text-gray-500 dark:text-gray-400">
                                <Icon icon="ri:image-line" className="text-4xl mx-auto mb-2" />
                                <p>Logo bulunamadı</p>
                            </div>
                        )}
                    </div>
                </div>
            </ComponentCard>

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
                        <h2 className="text-xl font-bold mb-4">
                            {editingLogo ? 'Logo Düzenle' : 'Yeni Logo'}
                        </h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-2">Tip</label>
                                <select
                                    value={formData.type}
                                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                                    className="w-full rounded-md border border-input bg-background px-3 py-2"
                                    required
                                    disabled={!!editingLogo}
                                >
                                    {logoTypes.map(type => (
                                        <option key={type.value} value={type.value}>{type.label}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-2">İsim</label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full rounded-md border border-input bg-background px-3 py-2"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-2">Alt Text</label>
                                <input
                                    type="text"
                                    value={formData.alt}
                                    onChange={(e) => setFormData({ ...formData, alt: e.target.value })}
                                    className="w-full rounded-md border border-input bg-background px-3 py-2"
                                    placeholder="Logo açıklaması"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium mb-2">Genişlik (px)</label>
                                    <input
                                        type="number"
                                        value={formData.width}
                                        onChange={(e) => setFormData({ ...formData, width: e.target.value })}
                                        className="w-full rounded-md border border-input bg-background px-3 py-2"
                                        placeholder="Otomatik"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-2">Yükseklik (px)</label>
                                    <input
                                        type="number"
                                        value={formData.height}
                                        onChange={(e) => setFormData({ ...formData, height: e.target.value })}
                                        className="w-full rounded-md border border-input bg-background px-3 py-2"
                                        placeholder="Otomatik"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-2">
                                    Logo Dosyası {!editingLogo && <span className="text-red-500">*</span>}
                                </label>
                                <input
                                    id="logo-file"
                                    type="file"
                                    accept="image/*"
                                    onChange={handleFileChange}
                                    className="w-full rounded-md border border-input bg-background px-3 py-2"
                                    required={!editingLogo}
                                />
                                {preview && (
                                    <div className="mt-3 bg-gray-900 dark:bg-gray-950 rounded p-4">
                                        <img src={preview} alt="Preview" className="w-full h-32 object-contain rounded" />
                                    </div>
                                )}
                            </div>
                            <div className="flex gap-4 justify-end">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => { setShowModal(false); resetForm(); }}
                                >
                                    İptal
                                </Button>
                                <Button type="submit" disabled={uploading}>
                                    {uploading ? 'Yükleniyor...' : editingLogo ? 'Güncelle' : 'Kaydet'}
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}


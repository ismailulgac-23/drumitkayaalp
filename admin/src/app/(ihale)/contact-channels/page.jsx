"use client";
import React, { useState, useEffect } from "react";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import ComponentCard from "@/components/common/ComponentCard";
import Button from "@/components/ui/button/Button";
import { Icon } from "@iconify/react";
import axios from "@/axios";

export default function ContactChannelsPage() {
    const [channels, setChannels] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingChannel, setEditingChannel] = useState(null);
    const [formData, setFormData] = useState({
        type: "phone",
        label: "",
        value: "",
        icon: "",
        order: 0,
        isActive: true,
    });

    useEffect(() => {
        fetchChannels();
    }, []);

    const fetchChannels = async () => {
        try {
            setLoading(true);
            const response = await axios.get('/contact-channels/admin');
            if (response.data.success) {
                setChannels(response.data.data || []);
            }
        } catch (error) {
            console.error('Error fetching contact channels:', error);
            alert('İletişim kanalları yüklenirken bir hata oluştu');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingChannel) {
                const response = await axios.put(`/contact-channels/${editingChannel.id}`, formData);
                if (response.data.success) {
                    fetchChannels();
                    setShowModal(false);
                    resetForm();
                }
            } else {
                const response = await axios.post('/contact-channels', formData);
                if (response.data.success) {
                    fetchChannels();
                    setShowModal(false);
                    resetForm();
                }
            }
        } catch (error) {
            console.error('Error saving contact channel:', error);
            alert('İletişim kanalı kaydedilirken bir hata oluştu');
        }
    };

    const handleEdit = (channel) => {
        setEditingChannel(channel);
        setFormData({
            type: channel.type,
            label: channel.label,
            value: channel.value,
            icon: channel.icon || "",
            order: channel.order,
            isActive: channel.isActive,
        });
        setShowModal(true);
    };

    const handleDelete = async (id) => {
        if (!confirm('Bu iletişim kanalını silmek istediğinize emin misiniz?')) {
            return;
        }

        try {
            const response = await axios.delete(`/contact-channels/${id}`);
            if (response.data.success) {
                fetchChannels();
            }
        } catch (error) {
            console.error('Error deleting contact channel:', error);
            alert('İletişim kanalı silinirken bir hata oluştu');
        }
    };

    const handleToggle = async (id) => {
        try {
            const response = await axios.patch(`/contact-channels/${id}/toggle`);
            if (response.data.success) {
                fetchChannels();
            }
        } catch (error) {
            console.error('Error toggling contact channel:', error);
            alert('Durum değiştirilirken bir hata oluştu');
        }
    };

    const resetForm = () => {
        setEditingChannel(null);
        setFormData({
            type: "phone",
            label: "",
            value: "",
            icon: "",
            order: 0,
            isActive: true,
        });
    };

    const channelTypes = [
        { value: "phone", label: "Telefon" },
        { value: "whatsapp", label: "WhatsApp" },
        { value: "email", label: "Email" },
        { value: "address", label: "Adres" },
        { value: "working_hours", label: "Çalışma Saatleri" },
        { value: "social_media", label: "Sosyal Medya" },
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
            <PageBreadcrumb pageTitle="İletişim Kanalları" />
            <ComponentCard title="İletişim Kanalları Yönetimi">
                <div className="space-y-4">
                    <div className="flex justify-end">
                        <Button onClick={() => { resetForm(); setShowModal(true); }}>
                            <Icon icon="ri:add-line" className="mr-2" />
                            Yeni Kanal Ekle
                        </Button>
                    </div>

                    {/* Table */}
                    <div className="overflow-x-auto">
                        <table className="w-full border-collapse">
                            <thead>
                                <tr className="border-b border-gray-200 dark:border-gray-700">
                                    <th className="text-left p-3 font-semibold text-gray-700 dark:text-gray-300">Tip</th>
                                    <th className="text-left p-3 font-semibold text-gray-700 dark:text-gray-300">Etiket</th>
                                    <th className="text-left p-3 font-semibold text-gray-700 dark:text-gray-300">Değer</th>
                                    <th className="text-left p-3 font-semibold text-gray-700 dark:text-gray-300">İkon</th>
                                    <th className="text-left p-3 font-semibold text-gray-700 dark:text-gray-300">Sıra</th>
                                    <th className="text-left p-3 font-semibold text-gray-700 dark:text-gray-300">Durum</th>
                                    <th className="text-left p-3 font-semibold text-gray-700 dark:text-gray-300">İşlemler</th>
                                </tr>
                            </thead>
                            <tbody>
                                {channels.length > 0 ? (
                                    channels.map((channel) => (
                                        <tr key={channel.id} className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800">
                                            <td className="p-3">
                                                <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400">
                                                    {channelTypes.find(t => t.value === channel.type)?.label || channel.type}
                                                </span>
                                            </td>
                                            <td className="p-3">{channel.label}</td>
                                            <td className="p-3">{channel.value}</td>
                                            <td className="p-3">
                                                {channel.icon && (
                                                    <i className={channel.icon}></i>
                                                )}
                                            </td>
                                            <td className="p-3">{channel.order}</td>
                                            <td className="p-3">
                                                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                                                    channel.isActive 
                                                        ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                                                        : 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
                                                }`}>
                                                    {channel.isActive ? 'Aktif' : 'Pasif'}
                                                </span>
                                            </td>
                                            <td className="p-3">
                                                <div className="flex items-center gap-2">
                                                    <button
                                                        onClick={() => handleEdit(channel)}
                                                        className="p-2 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400"
                                                        title="Düzenle"
                                                    >
                                                        <Icon icon="ri:edit-line" className="text-xl" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleToggle(channel.id)}
                                                        className="p-2 text-gray-600 dark:text-gray-400 hover:text-yellow-600 dark:hover:text-yellow-400"
                                                        title={channel.isActive ? 'Pasif Et' : 'Aktif Et'}
                                                    >
                                                        <Icon 
                                                            icon={channel.isActive ? "ri:eye-off-line" : "ri:eye-line"} 
                                                            className="text-xl"
                                                        />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(channel.id)}
                                                        className="p-2 text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400"
                                                        title="Sil"
                                                    >
                                                        <Icon icon="ri:delete-bin-line" className="text-xl" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={7} className="p-8 text-center text-gray-500 dark:text-gray-400">
                                            <Icon icon="ri:inbox-line" className="text-4xl mx-auto mb-2" />
                                            <p>İletişim kanalı bulunamadı</p>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </ComponentCard>

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md">
                        <h2 className="text-xl font-bold mb-4">
                            {editingChannel ? 'İletişim Kanalı Düzenle' : 'Yeni İletişim Kanalı'}
                        </h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-2">Tip</label>
                                <select
                                    value={formData.type}
                                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                                    className="w-full rounded-md border border-input bg-background px-3 py-2"
                                    required
                                >
                                    {channelTypes.map(type => (
                                        <option key={type.value} value={type.value}>{type.label}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-2">Etiket</label>
                                <input
                                    type="text"
                                    value={formData.label}
                                    onChange={(e) => setFormData({ ...formData, label: e.target.value })}
                                    className="w-full rounded-md border border-input bg-background px-3 py-2"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-2">Değer</label>
                                <input
                                    type="text"
                                    value={formData.value}
                                    onChange={(e) => setFormData({ ...formData, value: e.target.value })}
                                    className="w-full rounded-md border border-input bg-background px-3 py-2"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-2">İkon (örn: fab fa-facebook-f)</label>
                                <input
                                    type="text"
                                    value={formData.icon}
                                    onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                                    className="w-full rounded-md border border-input bg-background px-3 py-2"
                                    placeholder="fab fa-facebook-f"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-2">Sıra</label>
                                <input
                                    type="number"
                                    value={formData.order}
                                    onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) })}
                                    className="w-full rounded-md border border-input bg-background px-3 py-2"
                                />
                            </div>
                            <div className="flex gap-4 justify-end">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => { setShowModal(false); resetForm(); }}
                                >
                                    İptal
                                </Button>
                                <Button type="submit">
                                    {editingChannel ? 'Güncelle' : 'Kaydet'}
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}


"use client";
import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import ComponentCard from "@/components/common/ComponentCard";
import Button from "@/components/ui/button/Button";
import axios from "@/axios";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";

export default function EditService() {
    const router = useRouter();
    const params = useParams();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        price: "",
        duration: "",
        order: "",
        isActive: true,
    });
    const [image, setImage] = useState(null);
    const [preview, setPreview] = useState(null);
    const [currentImageUrl, setCurrentImageUrl] = useState(null);

    useEffect(() => {
        fetchData();
    }, [params.id]);

    const fetchData = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`/services/${params.id}`);
            if (response.data.success) {
                const data = response.data.data;
                setFormData({
                    title: data.title || "",
                    description: data.description || "",
                    price: data.price?.toString() || "",
                    duration: data.duration || "",
                    order: data.order?.toString() || "0",
                    isActive: data.isActive !== undefined ? data.isActive : true,
                });
                if (data.image) {
                    const imageUrl = `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}${data.image}`;
                    setCurrentImageUrl(imageUrl);
                    setPreview(imageUrl);
                }
            }
        } catch (error) {
            console.error('Error fetching service:', error);
            alert('Veri yüklenirken bir hata oluştu');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        
        try {
            const formDataToSend = new FormData();
            formDataToSend.append('title', formData.title);
            formDataToSend.append('description', formData.description || '');
            formDataToSend.append('price', formData.price || '0');
            formDataToSend.append('duration', formData.duration || '');
            formDataToSend.append('order', formData.order || '0');
            formDataToSend.append('isActive', formData.isActive.toString());
            
            if (image) {
                formDataToSend.append('services', image);
            }

            const response = await axios.put(`/services/${params.id}`, formDataToSend, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            if (response.data.success) {
                alert("Hizmet başarıyla güncellendi!");
                router.push("/site-content/services");
            } else {
                alert("Bir hata oluştu!");
            }
        } catch (error) {
            console.error('Error updating service:', error);
            alert("Bir hata oluştu!");
        } finally {
            setSaving(false);
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
            if (file.size > 5 * 1024 * 1024) {
                alert('Dosya boyutu 5MB\'dan küçük olmalıdır');
                return;
            }
            setImage(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

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
            <PageBreadcrumb 
                pageTitle="Hizmet Düzenle" 
            />
            <div className="space-y-6">
                <ComponentCard title="Hizmet Bilgileri">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Hizmet Adı <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    name="title"
                                    value={formData.title}
                                    onChange={handleChange}
                                    required
                                    className="w-full rounded-md border border-input bg-background px-3 py-2"
                                    placeholder="Hizmet adı"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Fiyat
                                </label>
                                <input
                                    type="number"
                                    name="price"
                                    value={formData.price}
                                    onChange={handleChange}
                                    className="w-full rounded-md border border-input bg-background px-3 py-2"
                                    placeholder="0"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Süre
                                </label>
                                <input
                                    type="text"
                                    name="duration"
                                    value={formData.duration}
                                    onChange={handleChange}
                                    className="w-full rounded-md border border-input bg-background px-3 py-2"
                                    placeholder="30 dakika"
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
                                    placeholder="0"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Görsel
                            </label>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleImageChange}
                                className="w-full rounded-md border border-input bg-background px-3 py-2"
                            />
                            {preview && (
                                <div className="mt-3">
                                    <img src={preview} alt="Preview" className="w-full h-48 object-cover rounded" />
                                </div>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Açıklama <span className="text-red-500">*</span>
                            </label>
                            <div className="ckeditor-wrapper">
                                <CKEditor
                                    editor={ClassicEditor}
                                    data={formData.description}
                                    onChange={(event, editor) => {
                                        const data = editor.getData();
                                        setFormData(prev => ({
                                            ...prev,
                                            description: data
                                        }));
                                    }}
                                    onReady={(editor) => {
                                        // Custom upload adapter
                                        editor.plugins.get('FileRepository').createUploadAdapter = (loader) => {
                                            return {
                                                upload: () => {
                                                    return new Promise((resolve, reject) => {
                                                        loader.file.then((file) => {
                                                            const formData = new FormData();
                                                            formData.append('image', file);

                                                            axios.post('/upload/single', formData, {
                                                                headers: {
                                                                    'Content-Type': 'multipart/form-data',
                                                                },
                                                            })
                                                            .then((response) => {
                                                                if (response.data.success) {
                                                                    const imageUrl = `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}${response.data.data.url}`;
                                                                    resolve({
                                                                        default: imageUrl
                                                                    });
                                                                } else {
                                                                    reject('Resim yüklenemedi');
                                                                }
                                                            })
                                                            .catch((error) => {
                                                                console.error('Upload error:', error);
                                                                reject('Resim yüklenirken bir hata oluştu');
                                                            });
                                                        });
                                                    });
                                                },
                                                abort: () => {
                                                    // Upload iptal edildiğinde
                                                }
                                            };
                                        };
                                    }}
                                    config={{
                                        toolbar: {
                                            items: [
                                                'heading',
                                                '|',
                                                'bold',
                                                'italic',
                                                'link',
                                                '|',
                                                'bulletedList',
                                                'numberedList',
                                                '|',
                                                'blockQuote',
                                                'insertTable',
                                                '|',
                                                'imageUpload',
                                                'mediaEmbed',
                                                '|',
                                                'undo',
                                                'redo'
                                            ],
                                            shouldNotGroupWhenFull: false
                                        },
                                        heading: {
                                            options: [
                                                { model: 'paragraph', title: 'Paragraf', class: 'ck-heading_paragraph' },
                                                { model: 'heading1', view: 'h1', title: 'Başlık 1', class: 'ck-heading_heading1' },
                                                { model: 'heading2', view: 'h2', title: 'Başlık 2', class: 'ck-heading_heading2' },
                                                { model: 'heading3', view: 'h3', title: 'Başlık 3', class: 'ck-heading_heading3' },
                                                { model: 'heading4', view: 'h4', title: 'Başlık 4', class: 'ck-heading_heading4' }
                                            ]
                                        }
                                    }}
                                />
                            </div>
                            <style jsx global>{`
                                .ckeditor-wrapper .ck-editor__editable {
                                    min-height: 300px;
                                }
                                .ckeditor-wrapper .ck-content {
                                    min-height: 300px;
                                }
                                
                                /* Heading Styles */
                                .ckeditor-wrapper .ck-content h1 {
                                    font-size: 2.5em !important;
                                    font-weight: 700 !important;
                                    line-height: 1.2 !important;
                                    margin-top: 0.67em !important;
                                    margin-bottom: 0.67em !important;
                                }
                                
                                .ckeditor-wrapper .ck-content h2 {
                                    font-size: 2em !important;
                                    font-weight: 700 !important;
                                    line-height: 1.3 !important;
                                    margin-top: 0.83em !important;
                                    margin-bottom: 0.83em !important;
                                }
                                
                                .ckeditor-wrapper .ck-content h3 {
                                    font-size: 1.75em !important;
                                    font-weight: 600 !important;
                                    line-height: 1.4 !important;
                                    margin-top: 1em !important;
                                    margin-bottom: 1em !important;
                                }
                                
                                .ckeditor-wrapper .ck-content h4 {
                                    font-size: 1.5em !important;
                                    font-weight: 600 !important;
                                    line-height: 1.4 !important;
                                    margin-top: 1.17em !important;
                                    margin-bottom: 1.17em !important;
                                }
                                
                                .ckeditor-wrapper .ck-content p {
                                    font-size: 1em !important;
                                    line-height: 1.6 !important;
                                    margin-top: 1em !important;
                                    margin-bottom: 1em !important;
                                }
                            `}</style>
                        </div>

                        <div className="flex items-center">
                            <label className="flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    name="isActive"
                                    checked={formData.isActive}
                                    onChange={handleChange}
                                    className="mr-2"
                                />
                                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Aktif</span>
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
                                disabled={saving}
                            >
                                {saving ? "Güncelleniyor..." : "Güncelle"}
                            </Button>
                        </div>
                    </form>
                </ComponentCard>
            </div>
        </div>
    );
}


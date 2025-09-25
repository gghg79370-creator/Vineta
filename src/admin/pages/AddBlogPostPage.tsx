import React, { useState } from 'react';
import { Card } from '../components/ui/Card';
import { ImageUpload } from '../components/products/ImageUpload';
import { AdminBlogPost } from '../data/adminData';

interface AddBlogPostPageProps {
    navigate: (page: string) => void;
    onSave: (post: AdminBlogPost) => void;
    postToEdit?: AdminBlogPost;
}

const AddBlogPostPage: React.FC<AddBlogPostPageProps> = ({ navigate, onSave, postToEdit }) => {
    const isEditMode = !!postToEdit;

    const [post, setPost] = useState({
        title: postToEdit?.title || '',
        content: postToEdit?.content || '',
        author: postToEdit?.author || 'نورا أحمد',
        status: postToEdit?.status || 'Draft',
    });
    const [image, setImage] = useState<any>(postToEdit?.featuredImage ? [postToEdit.featuredImage] : []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setPost(prev => ({ ...prev, [name]: value }));
    };

    const handleSave = () => {
        const postData: AdminBlogPost = {
            id: postToEdit?.id || 0,
            title: post.title,
            content: post.content,
            author: post.author,
            status: post.status as 'Published' | 'Draft',
            publishDate: postToEdit?.publishDate || new Date().toISOString().split('T')[0],
            featuredImage: image.length > 0 ? (typeof image[0] === 'string' ? image[0] : URL.createObjectURL(image[0])) : ''
        };
        onSave(postData);
    };

    return (
        <div className="space-y-6">
             <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">{isEditMode ? 'تعديل المنشور' : 'منشور جديد'}</h1>
                    <p className="text-gray-500 mt-1">{isEditMode ? 'قم بتحديث منشور المدونة أدناه.' : 'اكتب منشور مدونة جديد.'}</p>
                </div>
                 <div className="flex items-center gap-3 w-full md:w-auto">
                    <button 
                        onClick={() => navigate('content')}
                        className="bg-white border border-gray-300 text-gray-700 font-bold py-2 px-4 rounded-lg hover:bg-gray-50 transition-colors w-full md:w-auto justify-center">
                        إلغاء
                    </button>
                    <button onClick={handleSave} className="bg-primary-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-primary-500 transition-colors w-full md:w-auto justify-center">
                        {isEditMode ? 'حفظ التغييرات' : 'نشر'}
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                    <Card title="محتوى المنشور">
                        <div className="space-y-4">
                             <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">العنوان</label>
                                <input type="text" name="title" value={post.title} onChange={handleChange} className="w-full border-gray-300 rounded-lg"/>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">المحتوى</label>
                                <textarea name="content" rows={12} value={post.content} onChange={handleChange} className="w-full border-gray-300 rounded-lg"></textarea>
                            </div>
                        </div>
                    </Card>
                </div>
                <div className="lg:col-span-1 space-y-6">
                    <Card title="التنظيم">
                         <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">الحالة</label>
                                <select name="status" value={post.status} onChange={handleChange} className="w-full border-gray-300 rounded-lg">
                                    <option value="Draft">مسودة</option>
                                    <option value="Published">منشور</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">المؤلف</label>
                                <select name="author" value={post.author} onChange={handleChange} className="w-full border-gray-300 rounded-lg">
                                    <option>نورا أحمد</option>
                                    <option>أحمد محمود</option>
                                </select>
                            </div>
                         </div>
                    </Card>
                    <Card title="صورة مميزة">
                        <ImageUpload initialImages={postToEdit ? [postToEdit.featuredImage] : []} onImagesChange={setImage} />
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default AddBlogPostPage;
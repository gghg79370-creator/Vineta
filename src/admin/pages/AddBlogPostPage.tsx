import React, { useState } from 'react';
import { Card } from '../components/ui/Card';
import { ImageUpload } from '../components/products/ImageUpload';
import { AdminBlogPost } from '../data/adminData';
import { SparklesIcon } from '../../components/icons';
import { GoogleGenAI } from "@google/genai";
import Spinner from '../../components/ui/Spinner';

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
    const [isGenerating, setIsGenerating] = useState(false);

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

    const generateContent = async () => {
        if (!post.title) {
            alert("Please enter a title first to generate content.");
            return;
        }
        setIsGenerating(true);
        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
            const prompt = `أنت كاتب محتوى إبداعي لمتجر أزياء إلكتروني يسمى Vineta. اكتب محتوى مقال في مدونة بناءً على العنوان التالي: "${post.title}". يجب أن تكون النبرة جذابة وغنية بالمعلومات، ومناسبة لمدونة أزياء. قم بتضمين مقدمة، وجسم رئيسي مع بضع فقرات، وخاتمة. يجب أن يكون المحتوى باللغة العربية.`;
            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: prompt,
            });
            setPost(prev => ({ ...prev, content: response.text }));
        } catch (error) {
            console.error("Error generating content:", error);
            alert("Failed to generate content. Please try again.");
        } finally {
            setIsGenerating(false);
        }
    };


    return (
        <div className="space-y-6">
             <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                 <div className="flex items-center gap-3 w-full md:w-auto">
                    <button 
                        onClick={() => navigate('content')}
                        className="bg-white border border-gray-300 text-gray-700 font-bold py-2 px-4 rounded-lg hover:bg-gray-50 transition-colors w-full md:w-auto justify-center">
                        إلغاء
                    </button>
                    <button onClick={handleSave} className="bg-admin-accent text-white font-bold py-2 px-4 rounded-lg hover:bg-admin-accentHover transition-colors w-full md:w-auto justify-center">
                        {isEditMode ? 'حفظ التغييرات' : 'نشر'}
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                    <Card title="محتوى المنشور">
                        <div className="space-y-4">
                             <div>
                                <label className="admin-form-label">العنوان</label>
                                <input type="text" name="title" value={post.title} onChange={handleChange} className="admin-form-input"/>
                            </div>
                            <div>
                                <div className="flex justify-between items-center mb-1">
                                    <label className="admin-form-label">المحتوى</label>
                                    <button onClick={generateContent} disabled={isGenerating} className="text-xs font-bold text-admin-accent hover:underline flex items-center gap-1 disabled:opacity-50">
                                        {isGenerating ? <Spinner size="sm" color="text-admin-accent"/> : <SparklesIcon size="sm"/>}
                                        <span>إنشاء باستخدام AI</span>
                                    </button>
                                </div>
                                <textarea name="content" rows={12} value={post.content} onChange={handleChange} className="admin-form-input"></textarea>
                            </div>
                        </div>
                    </Card>
                </div>
                <div className="lg:col-span-1 space-y-6">
                    <Card title="التنظيم">
                         <div className="space-y-4">
                            <div>
                                <label className="admin-form-label">الحالة</label>
                                <select name="status" value={post.status} onChange={handleChange} className="admin-form-input">
                                    <option value="Draft">مسودة</option>
                                    <option value="Published">منشور</option>
                                </select>
                            </div>
                            <div>
                                <label className="admin-form-label">المؤلف</label>
                                <select name="author" value={post.author} onChange={handleChange} className="admin-form-input">
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
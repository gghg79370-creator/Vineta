import React from 'react';
import { AdminBlogPost } from '../../data/adminData';
import { PencilIcon, TrashIcon } from '../../../components/icons';

interface BlogPostListTableProps {
    posts: AdminBlogPost[];
    onEdit: (post: AdminBlogPost) => void;
    onDelete: (post: AdminBlogPost) => void;
}

const BlogPostListTable: React.FC<BlogPostListTableProps> = ({ posts, onEdit, onDelete }) => {

    const getStatusClasses = (status: string) => {
        switch (status) {
            case 'Published': return 'bg-green-100 text-green-700';
            case 'Draft': return 'bg-gray-100 text-gray-700';
            default: return 'bg-gray-100 text-gray-700';
        }
    };

    return (
        <div className="overflow-x-auto -mx-5">
            <table className="w-full text-sm text-right">
                <thead className="bg-gray-50 text-gray-500">
                    <tr>
                        <th className="px-5 py-3 font-semibold">العنوان</th>
                        <th className="px-5 py-3 font-semibold">المؤلف</th>
                        <th className="px-5 py-3 font-semibold">الحالة</th>
                        <th className="px-5 py-3 font-semibold">تاريخ النشر</th>
                        <th className="px-5 py-3 font-semibold"></th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-admin-border">
                    {posts.map(post => (
                        <tr key={post.id} className="hover:bg-gray-50">
                            <td className="px-5 py-3">
                                <div className="flex items-center gap-3">
                                    <img src={post.featuredImage} alt={post.title} className="w-16 h-12 object-cover rounded-md"/>
                                    <span className="font-semibold text-gray-800">{post.title}</span>
                                </div>
                            </td>
                            <td className="px-5 py-3 text-gray-500">{post.author}</td>
                             <td className="px-5 py-3">
                                <span className={`px-2 py-1 rounded-md text-xs font-bold ${getStatusClasses(post.status)}`}>
                                    {post.status === 'Published' ? 'منشور' : 'مسودة'}
                                </span>
                            </td>
                            <td className="px-5 py-3 text-gray-500">{post.publishDate}</td>
                            <td className="px-5 py-3 text-left">
                                <div className="flex items-center gap-2 justify-end">
                                    <button onClick={() => onEdit(post)} className="text-gray-400 hover:text-admin-accent p-1"><PencilIcon size="sm"/></button>
                                    <button onClick={() => onDelete(post)} className="text-gray-400 hover:text-red-500 p-1"><TrashIcon size="sm"/></button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default BlogPostListTable;
import React from 'react';
import { Breadcrumb } from '../components/ui/Breadcrumb';
import { allAdminBlogPosts } from '../admin/data/adminData';
import { useQuery } from '../hooks/useQuery';
import { UserIcon } from '../components/icons';

interface BlogPostPageProps {
    navigateTo: (pageName: string, data?: any) => void;
}

const BlogPostPage: React.FC<BlogPostPageProps> = ({ navigateTo }) => {
    const query = useQuery();
    const postId = Number(query.get('id'));
    const post = allAdminBlogPosts.find(p => p.id === postId);

    if (!post) {
        return (
            <div className="text-center py-20">
                <h1 className="text-2xl font-bold">لم يتم العثور على المنشور</h1>
                <button onClick={() => navigateTo('blog')} className="mt-4 text-brand-primary font-semibold">
                    &larr; العودة إلى المدونة
                </button>
            </div>
        );
    }
    
    const breadcrumbItems = [
        { label: 'الرئيسية', page: 'home' },
        { label: 'المدونة', page: 'blog' },
        { label: post.title }
    ];

    return (
        <div className="bg-brand-bg">
            <Breadcrumb items={breadcrumbItems} navigateTo={navigateTo} title={post.title} />
            <div className="container mx-auto px-4 py-12 max-w-4xl">
                <div className="mb-8">
                    <img src={post.featuredImage} alt={post.title} className="w-full h-auto max-h-[500px] object-cover rounded-lg" />
                </div>
                <div className="flex items-center gap-4 text-sm text-brand-text-light mb-6">
                    <div className="flex items-center gap-2">
                        <UserIcon size="sm" />
                        <span>{post.author}</span>
                    </div>
                    <span>&bull;</span>
                    <span>{new Date(post.publishDate).toLocaleDateString('ar-EG')}</span>
                </div>
                <article className="prose prose-lg max-w-none text-right" dangerouslySetInnerHTML={{ __html: post.content.replace(/\n/g, '<br />') }} />
            </div>
        </div>
    );
};

export default BlogPostPage;
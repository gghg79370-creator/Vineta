import React from 'react';
import { Breadcrumb } from '../components/ui/Breadcrumb';
import { allAdminBlogPosts } from '../admin/data/adminData';
import BlogPostCard from '../components/blog/BlogPostCard';

interface BlogListPageProps {
    navigateTo: (pageName: string, data?: any) => void;
}

const BlogListPage: React.FC<BlogListPageProps> = ({ navigateTo }) => {
    const breadcrumbItems = [
        { label: 'الرئيسية', page: 'home' },
        { label: 'المدونة' }
    ];

    const publishedPosts = allAdminBlogPosts.filter(p => p.status === 'Published');

    return (
        <div className="bg-brand-bg">
            <Breadcrumb items={breadcrumbItems} navigateTo={navigateTo} title="المدونة" />
            <div className="container mx-auto px-4 py-16">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {publishedPosts.map(post => (
                        <BlogPostCard key={post.id} post={post} navigateTo={navigateTo} />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default BlogListPage;
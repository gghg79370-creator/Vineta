
import React from 'react';
import { AdminBlogPost } from '../../admin/data/adminData';

interface BlogPostCardProps {
    post: AdminBlogPost;
    navigateTo: (page: string, data?: any) => void;
}

const BlogPostCard: React.FC<BlogPostCardProps> = ({ post, navigateTo }) => {
    return (
        <div className="group" onClick={() => navigateTo('blogPost', { id: post.id })}>
            <div className="overflow-hidden rounded-lg mb-4 cursor-pointer">
                <img src={post.featuredImage} alt={post.title} className="w-full h-56 object-cover transition-transform duration-300 group-hover:scale-105" />
            </div>
            <div>
                <p className="text-sm text-gray-500 mb-1">{post.author} &bull; {new Date(post.publishDate).toLocaleDateString('ar-EG')}</p>
                <h3 className="font-bold text-lg text-gray-800 group-hover:text-brand-primary transition-colors cursor-pointer">{post.title}</h3>
            </div>
        </div>
    );
};

export default BlogPostCard;

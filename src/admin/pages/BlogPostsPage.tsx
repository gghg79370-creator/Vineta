import React, { useState, useMemo } from 'react';
import { AdminBlogPost } from '../data/adminData';
import { Pagination } from '../components/ui/Pagination';
import BlogPostListTable from '../components/content/BlogPostListTable';
import ConfirmDeleteModal from '../components/modals/ConfirmDeleteModal';
import { PlusIcon } from '../../components/icons';

interface BlogPostsPageProps {
    navigate: (page: string, data?: any) => void;
    blogPosts: AdminBlogPost[];
    onDeletePost: (postId: number) => void;
}

const BlogPostsPage: React.FC<BlogPostsPageProps> = ({ navigate, blogPosts, onDeletePost }) => {
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');
    const [postToDelete, setPostToDelete] = useState<AdminBlogPost | null>(null);

    const postsPerPage = 10;

    const filteredPosts = useMemo(() => {
        return blogPosts.filter(p =>
            p.title.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [blogPosts, searchTerm]);

    const indexOfLastPost = currentPage * postsPerPage;
    const indexOfFirstPost = indexOfLastPost - postsPerPage;
    const currentPosts = filteredPosts.slice(indexOfFirstPost, indexOfLastPost);
    const totalPages = Math.ceil(filteredPosts.length / postsPerPage);

     const handleDeleteClick = (post: AdminBlogPost) => {
        setPostToDelete(post);
    };

    const confirmDelete = () => {
        if (postToDelete) {
            onDeletePost(postToDelete.id);
            setPostToDelete(null);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">منشورات المدونة</h1>
                    <p className="text-gray-500 mt-1">إنشاء وإدارة محتوى مدونتك.</p>
                </div>
                 <button 
                    onClick={() => navigate('addBlogPost')}
                    className="bg-primary-600 text-white font-bold py-2 px-4 rounded-lg flex items-center gap-2 hover:bg-primary-500 transition-colors w-full md:w-auto justify-center">
                    <PlusIcon />
                    <span>منشور جديد</span>
                </button>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm border space-y-4">
                <input
                    type="search"
                    placeholder="بحث بالعنوان..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full md:w-1/3 border-gray-300 rounded-lg"
                />
                <BlogPostListTable
                    posts={currentPosts}
                    onEdit={(post) => navigate('editBlogPost', post)}
                    onDelete={handleDeleteClick}
                />
                <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={(page) => setCurrentPage(page)}
                />
            </div>
             <ConfirmDeleteModal
                isOpen={!!postToDelete}
                onClose={() => setPostToDelete(null)}
                onConfirm={confirmDelete}
                productName={postToDelete?.title || ''}
            />
        </div>
    );
};

export default BlogPostsPage;
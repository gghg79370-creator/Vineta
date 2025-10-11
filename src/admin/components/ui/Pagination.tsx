import React from 'react';
import { ChevronRightIcon } from '../../../components/icons';

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}

export const Pagination: React.FC<PaginationProps> = ({ currentPage, totalPages, onPageChange }) => {
    if (totalPages <= 1) return null;

    const pageNumbers = [];
    for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
    }

    return (
        <div className="flex justify-center items-center pt-4 mt-4 border-t space-x-2 space-x-reverse">
            <button
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="w-10 h-10 flex items-center justify-center bg-white border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed rotate-180"
                aria-label="Previous Page"
            >
                <ChevronRightIcon size="sm" />
            </button>
            
            {pageNumbers.map(number => (
                <button
                    key={number}
                    onClick={() => onPageChange(number)}
                    className={`w-10 h-10 flex items-center justify-center rounded-lg font-bold transition-colors ${
                        currentPage === number 
                            ? 'bg-admin-accent text-white' 
                            : 'bg-white border border-gray-300 hover:bg-gray-100'
                    }`}
                >
                    {number}
                </button>
            ))}

            <button
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="w-10 h-10 flex items-center justify-center bg-white border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label="Next Page"
            >
                <ChevronRightIcon size="sm" />
            </button>
        </div>
    );
};


import React, { useState, useMemo, useRef, useEffect } from 'react';
import { AdminCustomer } from '../data/adminData';
import { Pagination } from '../components/ui/Pagination';
import { CustomerListTable } from '../components/customers/CustomerListTable';
import ConfirmDeleteModal from '../components/modals/ConfirmDeleteModal';
import { TrashIcon } from '../../components/icons';
import { Card } from '../components/ui/Card';

interface CustomersPageProps {
    navigate: (page: string, data?: any) => void;
    customers: AdminCustomer[];
    onDeleteCustomers: (customerIds: number[]) => void;
}

const CustomersPage: React.FC<CustomersPageProps> = ({ navigate, customers, onDeleteCustomers }) => {
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');
    const [tagFilter, setTagFilter] = useState('All');
    const [selectedCustomers, setSelectedCustomers] = useState<number[]>([]);
    const [customersToDelete, setCustomersToDelete] = useState<number[] | null>(null);
    const searchInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === '/' && document.activeElement?.tagName !== 'INPUT' && document.activeElement?.tagName !== 'TEXTAREA') {
                e.preventDefault();
                searchInputRef.current?.focus();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    const customersPerPage = 10;
    
    const allTags = useMemo(() => {
        const tags = new Set<string>();
        customers.forEach(c => c.tags.forEach(t => tags.add(t)));
        return ['All', ...Array.from(tags)];
    }, [customers]);

    const filteredCustomers = useMemo(() => {
        return customers
            .filter(c => 
                c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                c.email.toLowerCase().includes(searchTerm.toLowerCase())
            )
            .filter(c => tagFilter === 'All' || c.tags.includes(tagFilter));
    }, [customers, searchTerm, tagFilter]);

    const indexOfLastCustomer = currentPage * customersPerPage;
    const indexOfFirstCustomer = indexOfLastCustomer - customersPerPage;
    const currentCustomers = filteredCustomers.slice(indexOfFirstCustomer, indexOfLastCustomer);
    const totalPages = Math.ceil(filteredCustomers.length / customersPerPage);
    
    const handleDeleteClick = (customerIds: number[]) => {
        setCustomersToDelete(customerIds);
    };

    const confirmDelete = () => {
        if (customersToDelete) {
            onDeleteCustomers(customersToDelete);
            setCustomersToDelete(null);
            setSelectedCustomers([]);
        }
    };

    const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.checked) {
            setSelectedCustomers(currentCustomers.map(c => c.id));
        } else {
            setSelectedCustomers([]);
        }
    }

    const handleSelectOne = (customerId: number) => {
        setSelectedCustomers(prev => 
            prev.includes(customerId) 
                ? prev.filter(id => id !== customerId)
                : [...prev, customerId]
        );
    }

    return (
        <div className="space-y-6">
            <Card title="جميع العملاء">
                <div className="space-y-4">
                    <div className="flex flex-col md:flex-row gap-4 items-center">
                        <input
                            ref={searchInputRef}
                            type="search"
                            placeholder="بحث بالاسم أو البريد الإلكتروني... (اضغط /)"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="admin-form-input w-full md:w-1/3"
                        />
                        <select value={tagFilter} onChange={e => setTagFilter(e.target.value)} className="admin-form-input w-full md:w-auto">
                            {allTags.map(tag => (
                                <option key={tag} value={tag}>{tag === 'All' ? 'كل الوسوم' : tag}</option>
                            ))}
                        </select>
                    </div>

                    {selectedCustomers.length > 0 && (
                        <div className="bg-admin-accent/10 p-3 rounded-lg flex items-center justify-between animate-fade-in">
                            <p className="font-semibold text-sm text-admin-accent">{selectedCustomers.length} عملاء محددون</p>
                            <div className="flex items-center gap-3">
                                <button onClick={() => handleDeleteClick(selectedCustomers)} className="font-semibold text-sm text-red-600 hover:underline flex items-center gap-1"><TrashIcon size="sm" /> حذف</button>
                            </div>
                        </div>
                    )}

                    {currentCustomers.length > 0 ? (
                        <>
                            <CustomerListTable 
                                customers={currentCustomers}
                                selectedCustomers={selectedCustomers}
                                onSelectAll={handleSelectAll}
                                onSelectOne={handleSelectOne}
                                onView={(customer) => navigate('customerDetail', customer)}
                            />
                            <Pagination
                                currentPage={currentPage}
                                totalPages={totalPages}
                                onPageChange={(page) => setCurrentPage(page)}
                            />
                        </>
                    ) : (
                         <div className="text-center py-16">
                            <h3 className="text-lg font-bold text-gray-800">لم يتم العثور على عملاء</h3>
                            <p className="text-gray-500 mt-2">حاول ضبط البحث أو الفلاتر للعثور على ما تبحث عنه.</p>
                        </div>
                    )}
                </div>
            </Card>
            <ConfirmDeleteModal
                isOpen={!!customersToDelete}
                onClose={() => setCustomersToDelete(null)}
                onConfirm={confirmDelete}
                title="حذف العملاء"
                itemName={customersToDelete ? `${customersToDelete.length} عملاء` : ''}
            />
        </div>
    );
};

export default CustomersPage;

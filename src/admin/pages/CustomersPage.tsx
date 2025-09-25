
import React, { useState, useMemo } from 'react';
import { AdminCustomer } from '../data/adminData';
import { Pagination } from '../components/ui/Pagination';
import { CustomerListTable } from '../components/customers/CustomerListTable';
import ConfirmDeleteModal from '../components/modals/ConfirmDeleteModal';
import { TrashIcon } from '../../components/icons';

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
    };

    const handleSelectOne = (customerId: number) => {
        setSelectedCustomers(prev => 
            prev.includes(customerId) 
                ? prev.filter(id => id !== customerId)
                : [...prev, customerId]
        );
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-gray-900">العملاء</h1>
                <p className="text-gray-500 mt-1">عرض وإدارة جميع عملائك.</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm border space-y-4">
                 <div className="flex flex-col md:flex-row gap-4">
                    <input
                        type="search"
                        placeholder="بحث بالاسم أو البريد الإلكتروني..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full md:w-1/3 border-gray-300 rounded-lg"
                    />
                     <select value={tagFilter} onChange={e => setTagFilter(e.target.value)} className="w-full md:w-auto border-gray-300 rounded-lg">
                        {allTags.map(tag => <option key={tag} value={tag}>{tag === 'All' ? 'كل الوسوم' : tag}</option>)}
                    </select>
                </div>

                {selectedCustomers.length > 0 && (
                    <div className="bg-primary-50 p-3 rounded-lg flex items-center justify-between animate-fade-in">
                        <p className="font-semibold text-sm text-primary-700">{selectedCustomers.length} عميل محدد</p>
                        <button onClick={() => setCustomersToDelete(selectedCustomers)} className="font-semibold text-sm text-red-600 hover:underline flex items-center gap-1"><TrashIcon size="sm" /> حذف</button>
                    </div>
                )}

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
            </div>
             <ConfirmDeleteModal
                isOpen={!!customersToDelete}
                onClose={() => setCustomersToDelete(null)}
                onConfirm={confirmDelete}
                title="حذف العملاء"
                itemName={customersToDelete?.length === 1 ? `العميل المحدد` : `${customersToDelete?.length} عملاء`}
            />
        </div>
    );
};

export default CustomersPage;
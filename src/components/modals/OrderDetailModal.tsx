import React from 'react';
import { Order, TrackingEvent } from '../../types';
import { CloseIcon, PackageIcon, TruckIcon, CheckCircleIcon, XCircleIcon } from '../icons';

interface OrderDetailModalProps {
    isOpen: boolean;
    order: Order | null;
    onClose: () => void;
}

export const OrderDetailModal = ({ isOpen, order, onClose }: OrderDetailModalProps) => {

    if (!order) return null;
    
    const statusClasses: { [key: string]: string } = {
        'Delivered': 'bg-brand-delivered/10 text-brand-delivered',
        'On the way': 'bg-brand-onway/10 text-brand-onway',
        'Cancelled': 'bg-brand-sale/10 text-brand-sale',
    };
    
    const timelineStatuses: TrackingEvent['status'][] = ['تم الطلب', 'تم الشحن', 'قيد التوصيل', 'تم التوصيل'];
    const lastEvent = order.trackingHistory ? order.trackingHistory[order.trackingHistory.length - 1] : null;

    const getStatusIcon = (status: TrackingEvent['status'], isCompleted: boolean) => {
        const activeClass = isCompleted ? 'text-brand-delivered' : 'text-brand-text-light';
        const iconSize = 'w-6 h-6';
        switch (status) {
            case 'تم الطلب': return <PackageIcon className={`${iconSize} ${activeClass}`} />;
            case 'تم الشحن': return <TruckIcon className={`${iconSize} ${activeClass}`} />;
            case 'قيد التوصيل': return <TruckIcon className={`${iconSize} ${activeClass}`} />;
            case 'تم التوصيل': return <CheckCircleIcon className={`${iconSize} ${isCompleted ? 'text-brand-delivered' : 'text-brand-text-light'}`} />;
            default: return null;
        }
    };

    return (
        <div className={`fixed inset-0 bg-black/60 z-[70] flex items-center justify-center p-4 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
            <div className={`bg-brand-bg w-full max-w-2xl max-h-[90vh] rounded-2xl shadow-lg transform transition-all duration-300 ease-in-out ${isOpen ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}`}>
                <div className="p-5 flex justify-between items-center border-b border-brand-border">
                    <h2 className="font-bold text-lg text-brand-dark">تفاصيل الطلب</h2>
                    <button onClick={onClose} className="p-1 hover:bg-brand-subtle rounded-full"><CloseIcon /></button>
                </div>
                <div className="p-5 flex flex-wrap gap-x-6 gap-y-2 items-center border-b border-brand-border bg-brand-subtle">
                    <span className="font-bold text-brand-dark">#{order.id}</span>
                    <span className="text-sm text-brand-text-light">{order.date}</span>
                    <span className="text-sm text-brand-text-light">{order.items.length} منتجات</span>
                    <span className={`text-xs font-bold px-2 py-1 rounded-md ${statusClasses[order.status]}`}>{order.status}</span>
                </div>
                <div className="p-5 overflow-y-auto" style={{maxHeight: 'calc(90vh - 120px)'}}>
                    <div className="border-b border-brand-border pb-5 mb-5">
                        <h3 className="font-bold text-lg mb-4">تتبع الطلب</h3>
                        
                        {order.estimatedDelivery && order.status !== 'Delivered' && order.status !== 'Cancelled' && (
                            <div className="p-4 bg-brand-subtle rounded-lg mb-6 text-center">
                                <p className="text-sm text-brand-text-light">التسليم المتوقع</p>
                                <p className="font-bold text-lg text-brand-dark">{order.estimatedDelivery}</p>
                            </div>
                        )}

                        {order.status === 'Cancelled' ? (
                            <div className="flex items-center gap-4">
                                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-brand-sale/10 flex items-center justify-center">
                                    <XCircleIcon className="w-6 h-6 text-brand-sale"/>
                                </div>
                                <div>
                                    <p className="font-bold text-brand-sale">تم إلغاء الطلب</p>
                                    <p className="text-sm text-brand-text-light">{order.trackingHistory?.find(e => e.status === 'تم إلغاء الطلب')?.date}</p>
                                </div>
                            </div>
                        ) : (
                            <div className="relative pr-8">
                                {timelineStatuses.map((status, index) => {
                                    const event = order.trackingHistory?.find(e => e.status === status);
                                    const isCompleted = !!event;
                                    const isCurrentEvent = lastEvent?.status === status && order.status !== 'Delivered';
                                    const lineCompleted = order.trackingHistory ? order.trackingHistory.length > index : false;

                                    let statusTextClass = 'text-brand-text-light font-semibold';
                                    if (isCurrentEvent) {
                                        statusTextClass = 'text-brand-primary font-extrabold';
                                    } else if (isCompleted) {
                                        statusTextClass = 'text-brand-dark font-bold';
                                    }

                                    return (
                                        <div key={status} className="relative pb-8 last:pb-0">
                                            {index < timelineStatuses.length - 1 && (
                                                <div className={`absolute top-5 -right-3 w-0.5 h-full ${lineCompleted ? 'bg-brand-delivered' : 'bg-brand-border'}`}></div>
                                            )}
                                            <div className="flex items-start gap-4">
                                                <div className={`relative flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center z-10 ${isCompleted ? 'bg-brand-delivered/10' : 'bg-brand-subtle'}`}>
                                                    {isCurrentEvent && <span className="absolute animate-sonar-pulse bg-brand-delivered rounded-full h-10 w-10 z-0"></span>}
                                                    <div className={`relative z-10 ${isCompleted ? '' : 'opacity-50'}`}>
                                                        {getStatusIcon(status, isCompleted)}
                                                    </div>
                                                </div>
                                                <div className="pt-2">
                                                    <p className={statusTextClass}>{status}</p>
                                                    {event && (
                                                        <>
                                                            <p className="text-sm text-brand-text-light mt-1">{event.date}</p>
                                                            {event.location && <p className="text-xs text-brand-text-light">{event.location}</p>}
                                                        </>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>

                    <div className="space-y-4">
                        {order.items.map((item, index) => (
                             <div key={index} className="flex gap-4 items-center">
                                <img src={item.image} alt={item.name} className="w-20 h-24 rounded-md object-cover"/>
                                <div className="flex-1 grid grid-cols-3 gap-4 items-center text-sm">
                                    <div>
                                        <p className="font-bold text-brand-dark">{item.name}</p>
                                        <p className="text-brand-text-light">{item.variant}</p>
                                        <p className="text-brand-text-light">الكمية: {item.quantity}</p>
                                    </div>
                                    <div className="text-center">
                                        <p className="text-brand-text-light">السعر</p>
                                        <p className="font-semibold text-brand-dark">{item.price} ج.م</p>
                                    </div>
                                     <div className="text-center">
                                        <p className="text-brand-text-light">المجموع</p>
                                        <p className="font-bold text-brand-dark">{(parseFloat(item.price) * item.quantity).toFixed(2)} ج.م</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="border-t border-brand-border mt-5 pt-5 flex justify-end">
                        <div className="w-full max-w-xs space-y-2">
                             <div className="flex justify-between">
                                <span className="text-brand-text-light">المجموع الفرعي:</span>
                                <span className="font-semibold text-brand-dark">{order.total} ج.م</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-brand-text-light">الشحن:</span>
                                <span className="font-semibold text-brand-dark">0.00 ج.م</span>
                            </div>
                             <div className="flex justify-between font-bold text-lg border-t border-brand-border pt-2 mt-2">
                                <span className="text-brand-dark">الإجمالي:</span>
                                <span className="text-brand-dark">{order.total} ج.م</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

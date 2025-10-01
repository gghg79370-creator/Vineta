import React from 'react';
import { Order, TrackingEvent } from '../../types';
import { PackageIcon, TruckIcon, CheckCircleIcon } from '../icons';

interface OrderTrackerProps {
    order: Order;
}

const OrderTracker: React.FC<OrderTrackerProps> = ({ order }) => {
    const steps: TrackingEvent['status'][] = ['تم الطلب', 'تم الشحن', 'قيد التوصيل', 'تم التوصيل'];
    const currentStatus = order.trackingHistory?.[order.trackingHistory.length - 1]?.status;
    const currentStepIndex = currentStatus ? steps.indexOf(currentStatus) : -1;

    const getStepIcon = (step: TrackingEvent['status'], index: number) => {
        const isCompleted = index <= currentStepIndex;
        const isActive = index === currentStepIndex;
        const iconClass = `w-7 h-7 transition-colors duration-300 ${isCompleted ? 'text-white' : 'text-gray-400'}`;

        let icon;
        switch (step) {
            case 'تم الطلب': icon = <PackageIcon className={iconClass} />; break;
            case 'تم الشحن': icon = <TruckIcon className={iconClass} />; break;
            case 'قيد التوصيل': icon = <TruckIcon className={iconClass} />; break;
            case 'تم التوصيل': icon = <CheckCircleIcon className={iconClass} />; break;
            default: icon = null;
        }
        
        return (
            <div className={`relative w-14 h-14 rounded-full flex items-center justify-center transition-all duration-300 ${isCompleted ? 'bg-brand-delivered' : 'bg-gray-200'}`}>
                {isActive && order.status !== 'Delivered' && <span className="absolute animate-sonar-pulse bg-brand-delivered rounded-full h-14 w-14 z-0"></span>}
                <div className="relative z-10">{icon}</div>
            </div>
        );
    };

    return (
        <div>
            {/* Horizontal Tracker */}
            <div className="flex items-center my-4">
                {steps.map((step, index) => {
                    const isCompleted = index <= currentStepIndex;
                    const isLineCompleted = index < currentStepIndex;
                    const isLastStep = index === steps.length - 1;

                    return (
                        <React.Fragment key={step}>
                            <div className="flex flex-col items-center text-center w-16">
                                {getStepIcon(step, index)}
                                <p className={`mt-2 text-xs font-bold ${isCompleted ? 'text-brand-dark' : 'text-gray-400'}`}>{step}</p>
                            </div>
                            {!isLastStep && (
                                <div className="flex-1 h-1 bg-gray-200 mx-1 relative">
                                    <div className={`absolute top-0 right-0 h-1 bg-brand-delivered transition-all duration-500`} style={{ width: isLineCompleted ? '100%' : '0%' }}></div>
                                </div>
                            )}
                        </React.Fragment>
                    );
                })}
            </div>
            
            {/* Detailed History */}
            <div className="border-t pt-4 mt-6">
                 <h4 className="font-bold text-md mb-3 text-brand-dark">سجل التتبع</h4>
                 <div className="space-y-3">
                    {order.trackingHistory?.slice().reverse().map((event, index) => (
                        <div key={index} className="flex items-center gap-4 text-sm">
                            <div className="font-semibold text-gray-500 w-28">{event.date}</div>
                            <div className="font-bold text-brand-dark">{event.status}</div>
                            {event.location && <div className="text-gray-500">- {event.location}</div>}
                        </div>
                    ))}
                 </div>
            </div>
        </div>
    );
};

export default OrderTracker;
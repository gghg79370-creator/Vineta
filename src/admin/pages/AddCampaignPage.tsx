import React, { useState } from 'react';
import { Card } from '../components/ui/Card';

interface AddCampaignPageProps {
    navigate: (page: string) => void;
}

const AddCampaignPage: React.FC<AddCampaignPageProps> = ({ navigate }) => {
    const [step, setStep] = useState(1);

    const StepIndicator = ({ currentStep }: { currentStep: number }) => {
        const steps = ['التفاصيل', 'الجمهور', 'المحتوى', 'المراجعة'];
        return (
            <nav className="flex items-center justify-center mb-8">
                {steps.map((label, index) => {
                    const stepNumber = index + 1;
                    const isCompleted = stepNumber < currentStep;
                    const isActive = stepNumber === currentStep;

                    return (
                        <React.Fragment key={stepNumber}>
                            <div className="flex flex-col items-center">
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg
                                    ${isCompleted ? 'bg-primary-600 text-white' : ''}
                                    ${isActive ? 'bg-primary-100 text-primary-600 border-2 border-primary-600' : ''}
                                    ${!isCompleted && !isActive ? 'bg-gray-200 text-gray-500' : ''}`}
                                >
                                    {isCompleted ? '✓' : stepNumber}
                                </div>
                                <p className={`mt-2 text-sm font-semibold ${isActive ? 'text-primary-600' : 'text-gray-500'}`}>{label}</p>
                            </div>
                            {stepNumber < steps.length && <div className={`flex-1 h-1 mx-4 ${isCompleted ? 'bg-primary-600' : 'bg-gray-200'}`}></div>}
                        </React.Fragment>
                    );
                })}
            </nav>
        );
    };

    const renderStepContent = () => {
        switch (step) {
            case 1: // Details
                return (
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">اسم الحملة</label>
                            <input type="text" defaultValue="إطلاق مجموعة الصيف" className="w-full border-gray-300 rounded-lg" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">القناة</label>
                            <select className="w-full border-gray-300 rounded-lg">
                                <option>بريد إلكتروني</option>
                                <option>رسائل نصية</option>
                                <option>وسائل التواصل</option>
                            </select>
                        </div>
                    </div>
                );
            case 2: // Audience
                return <p className="text-center text-gray-500">واجهة اختيار الجمهور هنا (قيد الإنشاء).</p>;
            case 3: // Content
                return (
                    <div>
                         <label className="block text-sm font-medium text-gray-700 mb-1">محتوى البريد الإلكتروني</label>
                        <textarea rows={10} placeholder="اكتب محتوى حملتك هنا..." className="w-full border-gray-300 rounded-lg"></textarea>
                    </div>
                );
            case 4: // Review
                return <p className="text-center text-gray-500">واجهة المراجعة النهائية هنا (قيد الإنشاء).</p>;
            default:
                return null;
        }
    };

    return (
        <div className="space-y-6 max-w-4xl mx-auto">
            <div>
                <h1 className="text-3xl font-bold text-gray-900">إنشاء حملة جديدة</h1>
                <p className="text-gray-500 mt-1">اتبع الخطوات لإنشاء وإطلاق حملتك.</p>
            </div>
            
            <Card title={`الخطوة ${step}: ${['التفاصيل', 'الجمهور', 'المحتوى', 'المراجعة'][step-1]}`}>
                 <div className="p-6">
                    <StepIndicator currentStep={step} />
                    {renderStepContent()}
                 </div>
            </Card>

            <div className="flex justify-between">
                <button 
                    onClick={() => step > 1 ? setStep(step - 1) : navigate('marketing')}
                    className="bg-white border border-gray-300 text-gray-700 font-bold py-2 px-6 rounded-lg hover:bg-gray-50">
                    {step === 1 ? 'إلغاء' : 'السابق'}
                </button>
                <button 
                    onClick={() => step < 4 ? setStep(step + 1) : navigate('marketing')}
                    className="bg-primary-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-primary-500">
                    {step === 4 ? 'إطلاق الحملة' : 'التالي'}
                </button>
            </div>
        </div>
    );
};

export default AddCampaignPage;

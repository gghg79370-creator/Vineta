import React from 'react';

interface StickyMobileActionsProps {
    children: React.ReactNode;
}

const StickyMobileActions: React.FC<StickyMobileActionsProps> = ({ children }) => {
    return (
        <div className="md:hidden sticky bottom-0 left-0 right-0 bg-white/80 backdrop-blur-sm p-3 border-t border-admin-border z-20">
            <div className="flex items-center gap-3">
                {children}
            </div>
        </div>
    );
};

export default StickyMobileActions;
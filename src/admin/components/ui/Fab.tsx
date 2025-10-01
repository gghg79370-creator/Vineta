import React from 'react';
import { PlusIcon } from '../../../components/icons';

interface FabProps {
    onClick: () => void;
    icon?: React.ReactNode;
    ariaLabel?: string;
}

const Fab: React.FC<FabProps> = ({ onClick, icon = <PlusIcon />, ariaLabel = "Add new item" }) => {
    return (
        <button
            onClick={onClick}
            className="md:hidden fixed bottom-6 left-6 bg-admin-accent text-white rounded-full p-4 shadow-lg z-30 transform transition-transform hover:scale-110 active:scale-100"
            aria-label={ariaLabel}
        >
            {icon}
        </button>
    );
};

export default Fab;
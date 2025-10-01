import { useAppState } from '../state/AppState';
import { Toast } from '../types';

export const useToast = () => {
    const { dispatch } = useAppState();

    const addToast = (message: string, type: Toast['type'] = 'info') => {
        const id = Date.now();
        dispatch({ type: 'ADD_TOAST', payload: { id, message, type } });
        setTimeout(() => {
            dispatch({ type: 'REMOVE_TOAST', payload: id });
        }, 3000);
    };

    return addToast;
};

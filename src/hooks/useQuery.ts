import React from 'react';

export const useQuery = () => {
    const { hash } = window.location;
    const queryString = hash.split('?')[1] || '';
    return new URLSearchParams(queryString);
};

import { useState, useEffect, useCallback } from 'react';

export const useCountdown = (targetDate: Date | null) => {
    const calculateTimeLeft = useCallback(() => {
        if (!targetDate) {
            return { days: 0, hours: 0, minutes: 0, seconds: 0 };
        }
        const difference = +targetDate - +new Date();
        if (difference > 0) {
            return {
                days: Math.floor(difference / (1000 * 60 * 60 * 24)),
                hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
                minutes: Math.floor((difference / 1000 / 60) % 60),
                seconds: Math.floor((difference / 1000) % 60)
            };
        }
        return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    }, [targetDate]);

    const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

    useEffect(() => {
        if (!targetDate) return;

        const intervalId = setInterval(() => {
            setTimeLeft(calculateTimeLeft());
        }, 1000);

        return () => clearInterval(intervalId);
    }, [targetDate, calculateTimeLeft]);

    return timeLeft;
};

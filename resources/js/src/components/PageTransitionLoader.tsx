import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import Loading from './Loading';

const PageTransitionLoader = () => {
    const location = useLocation();
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        setIsLoading(true);
        
        // This duration can be adjusted, or tied to actual page load state via context if necessary.
        // For now, this will show the loader during every route transition.
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 800);

        return () => clearTimeout(timer);
    }, [location.pathname]);

    if (!isLoading) return null;

    return <Loading />;
};

export default PageTransitionLoader;

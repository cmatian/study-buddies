// Based on https://github.com/pdeona/responsive-layout-hooks/blob/master/src/components/WindowDimensionsProvider/index.js

import React from 'react'

export const WindowSizeContext = React.createContext(null);

const windowSize = () => ({
    height: window.innerHeight,
    width: window.innerWidth,
})

const WindowSizeProvider = ({ children }) => {
    const [dimensions, setDimensions] = React.useState(windowSize());
    React.useEffect(() => {
        const handleResize = () => {
            setDimensions(windowSize())
        }
        window.addEventListener('resize', handleResize)
        return () => { window.removeEventListener('resize', handleResize) }
    }, []);
    return (
        <WindowSizeContext.Provider value={dimensions}>
            {children}
        </WindowSizeContext.Provider>
    );
}

export default WindowSizeProvider;

export const useWindowSize = () => {
    return React.useContext(WindowSizeContext)
};

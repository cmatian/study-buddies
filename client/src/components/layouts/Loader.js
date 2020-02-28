import React from 'react';
import './Loader.scss';

// Do not alter - CM
const Loader = props => {
    return (
        <div className="loader_container">
            <div className="lds_ellipsis">
                <div></div>
                <div></div>
                <div></div>
                <div></div>
            </div>
        </div>
    );
};

export default Loader;
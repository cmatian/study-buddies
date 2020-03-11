import React from "react";
import "./styles/Header.scss";

const Header = props => {
    return (
        <header>
            <h1>{props.headerTitle}</h1>
        </header>
    );
};

export default Header;

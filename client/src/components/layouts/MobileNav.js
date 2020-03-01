import React from "react";
import { NavLink, withRouter } from "react-router-dom";
import AuthNavButton from "../auth/AuthNavButton";
import "./Nav.scss";

class MobileNav extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        return (
            <nav className={window.location.pathname === "/" ? "home" : "default"}>
                <div>
                    <ul>
                        <li className="logo">
                            <NavLink exact to="/" activeClassName="active">
                                Study Buddies
                            </NavLink>
                        </li>
                        <li className="user">
                            <AuthNavButton/>
                        </li>
                    </ul>
                </div>
            </nav>
        );
    }
}

export default withRouter(MobileNav);

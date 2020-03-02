import React from "react";
import { NavLink, withRouter } from "react-router-dom";
import AuthNavButton from "../auth/AuthNavButton";
import "./Nav.scss"; // CSS

class Nav extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        return (
            <nav className={window.location.pathname === "/" ? "home" : "default"}>
                <div>
                    <ul>
                        {window.location.pathname !== "/" &&
                            <li className="logo">
                                <NavLink exact to="/" activeClassName="active">
                                    Study Buddies
                                </NavLink>
                            </li>
                        }
                        <li>
                            <NavLink exact to="/users/reservations" activeClassName="active">
                                My Reservations
                            </NavLink>
                        </li>
                        <li>
                            <NavLink exact to="/maps" activeClassName="active">
                                Map
                            </NavLink>
                        </li>
                        <li className="user">
                            <AuthNavButton />
                        </li>
                    </ul>
                </div>
            </nav>
        );
    }
}

export default withRouter(Nav);

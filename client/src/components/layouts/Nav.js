import React from "react";
import { NavLink, withRouter } from "react-router-dom";
import GoogleSignIn from "../auth/GoogleSignIn";
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
                        {window.location.pathname !== "/" ? (
                            <li className="logo">
                                <NavLink exact to="/" activeClassName="active">
                                    Study Buddies
                                </NavLink>
                            </li>
                        ) : (
                            ""
                        )}
                        <li>
                            <NavLink exact to="/reservations" activeClassName="active">
                                My Reservations
                            </NavLink>
                        </li>
                        <li>
                            <NavLink exact to="/maps" activeClassName="active">
                                Map
                            </NavLink>
                        </li>
                        <li className="user">
                            <NavLink exact to="/" activeClassName="active">
                                Sign-in
                            </NavLink>
                        </li>
                        <li className="user">
                            <GoogleSignIn/>
                        </li>
                    </ul>
                </div>
            </nav>
        );
    }
}

export default withRouter(Nav);

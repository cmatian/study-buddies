import React from "react";
import { NavLink, withRouter } from "react-router-dom";
import AuthNavButton from "../auth/AuthNavButton";
import ResponsiveLayout from "./ResponsiveLayout";
import MobileNav from "./MobileNav";
import "./Nav.scss";

class Nav extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        return (
            <ResponsiveLayout
                breakPoint={500}
                renderDesktop={() => this.renderDesktopNav()}
                renderMobile={() => (
                    <MobileNav/>
                )}
                />
        )
    }

    renderDesktopNav() {
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
                        <li>
                            <NavLink exact to="/maps/users/saved" activeClassName="active">
                                My Locations
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

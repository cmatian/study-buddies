import React from "react";
import { NavLink, withRouter } from "react-router-dom";
import AuthNavButton from "../auth/AuthNavButton";
import ResponsiveLayout from "./ResponsiveLayout";
import MobileNav from "./MobileNav";
import UserContext from "../../UserContext";
import "./Nav.scss";

class Nav extends React.Component {
    static contextType = UserContext;

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

    handleProtectedClick = event => {
        const userContext = this.context;
        if (!userContext.isAuthenticated) {
            event.preventDefault();
        }
    }

    renderDesktopNav() {
        const userContext = this.context;
        const protectedNavClassName = userContext.isAuthenticated ? "" : "disabled";
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
                            <NavLink exact to="/maps" activeClassName="active">
                                Map
                            </NavLink>
                        </li>
                        <li>
                            <NavLink exact to="/users/reservations" activeClassName="active"
                                 className={protectedNavClassName}
                                 onClick={this.handleProtectedClick}>
                                My Reservations
                            </NavLink>
                        </li>
                        <li>
                            <NavLink exact to="/maps/users/saved" activeClassName="active"
                                 className={protectedNavClassName}
                                 onClick={this.handleProtectedClick}>
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

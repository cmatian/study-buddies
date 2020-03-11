import React from "react";
import { NavLink, withRouter } from "react-router-dom";
import AuthNavButton from "../auth/AuthNavButton";
import ResponsiveLayout from "./ResponsiveLayout";
import MobileNav from "./MobileNav";
import UserContext from "../../UserContext";
import ReactTooltip from "react-tooltip";
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
        const protectedOpts = {};
        if (!userContext.isAuthenticated) {
            protectedOpts["className"] = "disabled";
            protectedOpts["data-tip"] = "Sign in to use this feature";
        }
        return (
            <nav className={window.location.pathname === "/" ? "home" : "default"}>
                <div>
                    <ReactTooltip place="bottom"/>
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
                                    onClick={this.handleProtectedClick}
                                    {...protectedOpts}>
                                Reservations
                            </NavLink>
                        </li>
                        <li>
                            <NavLink exact to="/maps/users/saved" activeClassName="active"
                                 onClick={this.handleProtectedClick}
                                 {...protectedOpts}>
                                Saved
                            </NavLink>
                        </li>
                        <li>
                            <AuthNavButton />
                        </li>
                    </ul>
                </div>
            </nav>
        );
    }
}

export default withRouter(Nav);

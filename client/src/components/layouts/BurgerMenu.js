import React from "react";
import { NavLink } from "react-router-dom";
import UserContext from "../../UserContext";
import ReactTooltip from "react-tooltip";
import "./BurgerMenu.scss";

class BurgerMenu extends React.Component {
    static contextType = UserContext;

    constructor(props) {
        super(props);
        this.state = {};
    }

    handleProtectedClick = event => {
        const userContext = this.context;
        if (!userContext.isAuthenticated) {
            event.preventDefault();
        } else {
            this.props.close();
        }
    }

    render() {
        const userContext = this.context;
        var close = this.props.close;
        const protectedOpts = {};
        if (!userContext.isAuthenticated) {
            protectedOpts["className"] = "disabled";
            protectedOpts["data-tip"] = "Sign in to use this feature";
        }
        return (
            <div className="menu">
                <ReactTooltip place="bottom"/>
                <ul>
                    <li>
                        <NavLink exact to="/" activeClassName="active"
                                 onClick={close}>
                            Home
                        </NavLink>
                    </li>
                    <li>
                        <NavLink exact to="/maps" activeClassName="active" onClick={close}>
                            Map
                        </NavLink>
                    </li>
                    <li>
                        <NavLink exact to="/users/reservations" activeClassName="active"
                                 onClick={this.handleProtectedClick}
                                 {...protectedOpts}>
                            My Reservations
                        </NavLink>
                    </li>
                    <li>
                        <NavLink exact to="/maps/users/saved" activeClassName="active"
                                 onClick={this.handleProtectedClick}
                                 {...protectedOpts}>
                            My Locations
                        </NavLink>
                    </li>
                </ul>
            </div>
        );
    }
}

export default BurgerMenu;

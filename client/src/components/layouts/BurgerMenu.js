import React from "react";
import { NavLink } from "react-router-dom";
import UserContext from "../../UserContext";
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
        const protectedNavClassName = userContext.isAuthenticated ? "" : "disabled";
        var close = this.props.close;
        return (
            <div className="menu">
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
                </ul>
            </div>
        );
    }
}

export default BurgerMenu;

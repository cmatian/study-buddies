import React from "react";
import { NavLink, withRouter } from "react-router-dom";

export default ({ close }) => (
    <div className="menu">
        <ul>
            <li>
                <NavLink exact to="/" activeClassName="active" onClick={close}>
                    Home
                </NavLink>
            </li>
            <li>
                <NavLink exact to="/users/reservations" activeClassName="active" onClick={close}>
                    My Reservations
                </NavLink>
            </li>
            <li>
                <NavLink exact to="/maps" activeClassName="active" onClick={close}>
                    Map
                </NavLink>
            </li>
            <li>
                <NavLink exact to="/maps/users/saved" activeClassName="active" onClick={close}>
                    My Locations
                </NavLink>
            </li>
        </ul>
    </div>
);

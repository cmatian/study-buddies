import React from "react";
import { NavLink, withRouter } from "react-router-dom";
import AuthNavButton from "../auth/AuthNavButton";
import BurgerIcon from "./BurgerIcon";
import BurgerMenu from "./BurgerMenu";
import Popup from "reactjs-popup";
import "./styles/Nav.scss";
import "./styles/MobileNav.scss";

const contentStyle = {
    background: "rgba(255,255,255,0)",
    width: "80%",
    border: "none"
};

class MobileNav extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        return (
            <div>
                <Popup
                    modal
                    overlayStyle={{ background: "rgba(255,255,255,0.98" }}
                    contentStyle={contentStyle}
                    closeOnDocumentClick={false}
                    trigger={open => <BurgerIcon open={open} />}
                >
                    {close => <BurgerMenu close={close} />}
                </Popup>
                <nav className={window.location.pathname === "/" ? "home" : "default"}>
                    <div>
                        <ul>
                            <li className="logo">
                                <NavLink exact to="/" activeClassName="active">
                                    Study Buddies
                                </NavLink>
                            </li>
                            <li className="user">
                                <AuthNavButton />
                            </li>
                        </ul>
                    </div>
                </nav>
            </div>
        );
    }
}

export default withRouter(MobileNav);

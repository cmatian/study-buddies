import React from "react";
import { NavLink, withRouter } from "react-router-dom";
import AuthButtonContext from "../../AuthButtonContext";

class AuthNavButton extends React.Component {
    static contextType = AuthButtonContext;

    constructor(props) {
        super(props);

        this.state = {
            gapiInitted: false
        };
    }
    
    componentDidMount() {
        this.initGapi();
    }

    componentDidUpdate() {
        this.initGapi();
    }

    initGapi() {
        var authBtnContext = this.context;
        if (!this.state.gapiInitted) {
            this.setState({...this.state, gapiInitted: true});
            window.gapi.load('auth2', () => {
                window.gapi.auth2.init({
                    client_id: '619292312007-4q3t96220pemll7ocger1j381pvo093k.apps.googleusercontent.com'
                })
                    .then(() => {
                        var googleAuth = window.gapi.auth2.getAuthInstance();
                        if (googleAuth.isSignedIn.get()) {
                            authBtnContext.callbacks.onSigninSuccess(googleAuth.currentUser.get());
                        } else {
                            authBtnContext.callbacks.onSignout();
                        }
                    });
            });
        };
    }

    onNavClick(e) {
        var authBtnContext = this.context;
        if (authBtnContext.isAuthenticated) {
            e.stopPropagation();
            e.nativeEvent.stopPropagation();
            var googleAuth = window.gapi.auth2.getAuthInstance();
            googleAuth.signOut().then(() => {
                authBtnContext.callbacks.onSignout();
                this.props.history.replace("/signin");
            });
        }
    }

    render() {
        var authBtnContext = this.context;
        var path = "/signin";
        if (authBtnContext.isAuthenticated) {
            path = "/signout";
        }
        var buttonText = "Sign In";
        if (!authBtnContext.isUserChecked) {
            buttonText = "(checking user...)";
        } else if (authBtnContext.isAuthenticated) {
            buttonText = "Sign Out";
        }
        return (
            <NavLink exact to={path} activeClassName="active" onClick={(e) => this.onNavClick(e)}>
                {buttonText}
            </NavLink>
        );
    }
}

export default withRouter(AuthNavButton);

import React from "react";
import CallbackContext from "../../CallbackContext";
import UserContext from "../../UserContext";
import "./Signin.scss";

class Signin extends React.Component {
    static contextType = CallbackContext;

    constructor(props) {
        super(props);

        this.state = {
            initialized: false
        };
    }

    componentDidMount() {
        this.init();
    }

    componentDidUpdate() {
        this.init();
    }

    init() {
        var callbackContext = this.context;
        if (!this.state.initialized) {
            this.setState({ ...this.state, initialized: true });
            window.gapi.signin2.render('study-buddies-sign-in', {
                'scope': 'profile email',
                'theme': 'dark',
                'longtitle': true,
                'onsuccess': callbackContext.onSigninSuccess,
                'onfailure': callbackContext.onSigninFailure
            });
        }
    }

    render() {
        return (
            <div className="signin_wrapper">
                <div className="signin_container">
                    <div className="signin_title">
                        <h1>Sign in to Study Buddies</h1>
                        <span className="sb_border"></span>
                    </div>
                    <div className="signin_body">
                        <p>
                            Welcome back! Sign in with your Google account to access your reservations or create new ones.
                        </p>
                        <p className="p_note">
                            If you are an <span className="orange_text">Oregon State University</span> student or faculty member you may use your OSU gmail account.
                        </p>
                    </div>
                    <div id="study-buddies-sign-in"></div>
                </div>
            </div>
        );
    }
}

export default Signin;

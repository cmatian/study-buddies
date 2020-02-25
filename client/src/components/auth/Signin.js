import React from "react";
import CallbackContext from "../../CallbackContext";
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
            this.setState({...this.state, initialized: true});
            window.gapi.signin2.render('study-buddies-sign-in', {
                'scope': 'profile email',
                'theme': 'dark',
                'onsuccess': callbackContext.onSigninSuccess,
                'onfailure': callbackContext.onSigninFailure
            });
        }
    }

    render() {
        return (
            <div className="signin_wrapper">
                <div id="study-buddies-sign-in"></div>
            </div>
        );
    }
}

export default Signin;

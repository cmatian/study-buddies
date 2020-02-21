import React from "react";
import CallbackContext from "../../CallbackContext";

class SignIn extends React.Component {
    static contextType = CallbackContext;

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
        var callbackContext = this.context;
        if (!this.state.gapiInitted) {
            this.setState({...this.state, gapiInitted: true});
            window.gapi.load('auth2', () => {
                window.gapi.auth2.init({
                    client_id: '619292312007-4q3t96220pemll7ocger1j381pvo093k.apps.googleusercontent.com'
                }).then(() => {
                    window.gapi.signin2.render('study-buddies-sign-in', {
                        'scope': 'profile email',
                        'theme': 'dark',
                        'onsuccess': callbackContext.onSigninSuccess,
                        'onfailure': callbackContext.onSigninFailure
                    })
                })
            });
        };
    }

    render() {
        return (
            <div id="study-buddies-sign-in"></div>
        );
    }
}

export default SignIn;

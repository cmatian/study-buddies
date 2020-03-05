import React from "react";
import CallbackContext from "../../CallbackContext";
import { Link } from 'react-router-dom';
import Loader from '../layouts/Loader';
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
        console.log('Updated!');
    }

    init() {
        console.log(window.gapi.signin2);
        var callbackContext = this.context;
        if (!this.state.initialized) {
            this.setState({
                ...this.state,
                initialized: true
            },
                () => {
                    window.gapi.signin2.render('study-buddies-sign-in', {
                        'scope': 'profile email',
                        'theme': 'dark',
                        'longtitle': true,
                        'onsuccess': callbackContext.onSigninSuccess,
                        'onfailure': callbackContext.onSigninFailure
                    });
                }
            );
        }
    }

    render() {
        const { user } = this.props; // Different context that we consume for checking if a user is logged in
        console.log(user.isUserChecked, user.isAuthenticated);

        return (
            <div className="signin_wrapper">
                <div className="signin_container">
                    <div className="signin_title">
                        {!user.isAuthenticated ?
                            <h1>Sign in to Study Buddies</h1>
                            :
                            <h1>You are signed in!</h1>
                        }
                        <span className="sb_border"></span>
                    </div >
                    {!user.isAuthenticated &&
                        // Show the signin text
                        <div className="signin_body">

                            <p>Welcome back! Sign in with your Google account to access your reservations or create new ones.</p>
                            <p className="p_note">If you are an <span className="orange_text">Oregon State University</span> student or faculty member you may use your OSU gmail account.</p>

                        </div>
                    }
                    {user.isAuthenticated &&
                        // Show the redirect button 
                        < Link to="/maps" className="redirect_button">
                            Find a Study Spot
                                </Link>
                    }
                    < div id="study-buddies-sign-in" className={user.isAuthenticated ? "isAuthed" : ""}></div>
                </div>
            </div >
        );
    }
}

export default Signin;

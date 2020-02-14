import React from 'react';

class SignIn extends React.Component {
    componentDidMount() {
        window.gapi.load('auth2', () => {
            window.gapi.auth2.init({
            client_id: '619292312007-4q3t96220pemll7ocger1j381pvo093k.apps.googleusercontent.com'
        }).then(() => {
            window.gapi.signin2.render('study-buddies-sign-in', {
              'scope': 'profile email',
              'theme': 'dark',
              'onsuccess': this.onSuccess,
              'onfailure': this.onFailure
            })
          })
        });
    }

    onSuccess(googleUser) {
        var profile = googleUser.getBasicProfile();
        console.log('ID: ' + profile.getId()); // Do not send to your backend! Use an ID token instead.
        console.log('Name: ' + profile.getName());
        console.log('Image URL: ' + profile.getImageUrl());
        console.log('Email: ' + profile.getEmail()); // This is null if the 'email' scope is not present.
        var idToken = googleUser.getAuthResponse().id_token;
        var data = {idToken: idToken};
        fetch('/backend/signin', {
            method: 'POST',
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json'
            }
        }).then((response) => {
            console.log('Success:', response.json());
        }).catch((error) => {
            console.error('Error', error);
        });
    }

    onFailure(error) {
        console.log(error);
    }

    render() {
        return (
            <div id="study-buddies-sign-in"></div>
        );
    }
}

export default SignIn;

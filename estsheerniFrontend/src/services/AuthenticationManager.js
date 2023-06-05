import axios from 'axios';

class AuthenticationManager {
    constructor() {
        this.isLoggedIn = false;
        this.error = null;
        this.token = null;
        this.loginEndpoint = "http://127.0.0.1:8000/login/";
        this.registerEndpoint = "http://127.0.0.1:8000/register/";
        this.refreshTokenEndpoint = "http://127.0.0.1:8000/refresh_token/";
    }

    async logIn(email, password) {
        try {
            const response = await axios.post(this.loginEndpoint, {
                email: email,
                password: password
            });
            
            if (response.status === 200) {
                this.token = response.data.token;
                this.isLoggedIn = true;
            } else {
                this.error = "Login failed";
            }
        } catch (error) {
            this.error = error;
        }
    }

    async register(email, password, firstName, lastName, phoneNumber) {
        try {
            const response = await axios.post(this.registerEndpoint, {
                email: email,
                password: password,
                profile: {
                    first_name: firstName,
                    last_name: lastName,
                    phone_number: phoneNumber
                }
            });

            if (response.status === 200) {
                this.isLoggedIn = true;
            } else {
                this.error = "Registration failed";
            }
        } catch (error) {
            this.error = error;
        }
    }

    logOut() {
        this.token = null;
        this.isLoggedIn = false;
    }

    async refreshToken() {
        try {
            const response = await axios.post(this.refreshTokenEndpoint, {
                refresh_token: this.token
            });

            if (response.status === 200) {
                this.token = response.data.token;
            } else {
                this.error = "Token refresh failed";
            }
        } catch (error) {
            this.error = error;
        }
    }
}

export default AuthenticationManager;

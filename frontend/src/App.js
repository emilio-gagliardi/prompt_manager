// frontend/src/App.js
import React, { useState } from 'react';
import axiosInstance from './api/axiosInstance';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import PromptEditor from './pages/PromptEditor';

function App() {
    const [serviceUnavailable, setServiceUnavailable] = useState(false);

    axiosInstance.interceptors.response.use(
        response => response,
        error => {
            if (error.response && error.response.status === 503) {
                setServiceUnavailable(true);
            }
            return Promise.reject(error);
        }
    );

    if (serviceUnavailable) {
        return (
            <div className="error-message">
                <h1>Service Unavailable</h1>
                <p>The application is currently unable to connect to the database. Please try again later.</p>
            </div>
        );
    }

    return (
        <Router>
            <Switch>
                <Route exact path="/" component={Dashboard} />
                <Route path="/prompts/:promptId" component={PromptEditor} />
            </Switch>
        </Router>
    );
}

export default App;

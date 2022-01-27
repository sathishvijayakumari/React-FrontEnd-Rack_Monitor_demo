import React, { PureComponent } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import './App.css';

import Login from './components/login/Login';
import Home from './components/home/Home';
import Alerts from './components/alerts/Alerts.jsx';
import AssestDetails from './components/assest/AssestDetails.jsx';
import Configuration from './components/configuration/Configuration.jsx';
import SystemHealth from './components/health/SystemHealth.jsx';
import RealtimeTracking from './components/realtime/RealtimeTracking.jsx';
import Header from './components/header/Header';
import Sidebar from './components/sidebar/Sidebar';

import Example from './components/practice/Example.jsx';
import Dashboard from './components/practice/Dashboard.jsx';

class App extends PureComponent {
  state = {
    isLogged: false,
    message: '',
    status: 'failed',
  }

  handleCallback = (childData) => {
    let storing = localStorage.getItem('isLogged');
    console.log('storing===>', childData);
    this.setState({ status: storing })
  }

  componentDidMount() {
    const loginStatus = localStorage.getItem('isLogged')
    console.log('======>', loginStatus);
    this.setState({ status: loginStatus });
  }

  render() {

    const { status } = this.state;
    console.log('===', status);
    if (status === "failed" || status === null) {
      return (
        <Router>
          <Routes>
            <Route path="/" element={<Navigate to="/login" />} />
            <Route exact path="/login" element={<Login parentCallback={this.handleCallback} />} />
          </Routes>
        </Router>
      )
    } else {
      return (
        <Router>
          <Header />
          <Sidebar />
          <Routes>
            <Route path="/login" element={<Navigate to="/home" />} />
            <Route exact path="/home" element={<Home />} />
            <Route exact path="/configuration" element={<Configuration />} />
            <Route exact path="/realtime" element={<RealtimeTracking />} />
            <Route exact path="/health" element={<SystemHealth />} />
            <Route exact path="/alerts" element={<Alerts />} />
            <Route exact path="/asset" element={<AssestDetails />} />
          </Routes>
        </Router>
      )
    }
  }
}

export default App;

import React, { Component } from 'react'
import header from '../../styling/header.module.css';

export default class Header extends Component {

   logout = (e) => {
      e.preventDefault();
      localStorage.setItem('isLogged', 'failed');
      window.location.pathname = "/login";
   }

   homePage = (e) => {
      window.location.pathname = "/home"
   }

   render() {
      return (
         <div className={header.header_container}>
            <img src='../images/Vacus_White_Logo.png' alt="logo" id="logo"
               className={header.logo_image}
               onClick={this.homePage}
            />

            <img src='../images/logout.png' alt="logout" id="logout"
               className={header.logout_image}
               onClick={this.logout}
            />
         </div>
      )
   }
}

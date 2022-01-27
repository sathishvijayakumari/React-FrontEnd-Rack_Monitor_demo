/* eslint-disable no-lone-blocks */
import React, { Component } from 'react'
import sidebar from '../../styling/sidebar.module.css'
import $ from 'jquery';
import { Link } from 'react-router-dom';

export default class Sidebar extends Component {
   constructor(props) {
      super(props)
      this.state = {
         value: '',
      }
   }

   componentDidMount() {
      $("#0").css({
         "background-color": "#00629b", "color": "#FFF",
         "margin": "auto", "border": "2px solid #ff4a4a"
      });
      $("#0 img").css("display", "none");


   }

   changeOptions = (e) => {
      e.preventDefault();
      // $("button").css({
      //    "background-color": "#FFF",
      //    "color": "#00629b", "border": "none"
      // })
      // $("#" + id).css({
      //    "background-color": "#00629b",
      //    "color": "#FFF", "border": "2px solid #ff4a4a"
      // });
      // $("#" + id + " " + "img").css("display", "none")

      //var imgId = $("#" + id + " " + "img").attr("id");
      console.log('----->', e.target);
   }

   render() {
      return (
         <div className={sidebar.sidebar_container}>
            <Link to="/configuration" className={sidebar.sidebar_button}>
               <img
                  alt=""
                  src="../images/configuration.png"
                  title="Configuration"
                  className={sidebar.images}
               ></img>
               <span>CONFIGURATION</span>
            </Link>

            <Link to="/realtime"
               className={sidebar.sidebar_button}
               onChange={this.changeOptions}>
               <img
                  alt=""
                  src="../images/tracking.png"
                  title="RealTime Tracking"
                  className={sidebar.images}
               ></img>
               <span> REALTIME STATUS</span>
            </Link>

            <Link to="/health" className={sidebar.sidebar_button}>
               <img
                  alt=""
                  src="../images/system_health.png"
                  title="System Health"
                  className={sidebar.images}
               ></img>
               <span> SYSTEM HEALTH</span>
            </Link>

            <Link to="/alerts"
               className={sidebar.sidebar_button}

               onChange={this.changeOptions}>
               <img
                  style={{ marginLeft: '30px' }}
                  alt=""
                  src="../images/alert.png"
                  title="Alerts"
                  className={sidebar.images}
               ></img>
               <span style={{ marginRight: '50px' }}> ALERTS</span>
            </Link>

            <Link to="/asset"
               className={sidebar.sidebar_button}
               onChange={this.changeOptions}>
               <img
                  alt=""
                  src="../images/assets_details.png"
                  title="Assest"
                  className={sidebar.images}
               ></img>
               <span> ASSET DETAILS</span>
            </Link>
         </div>
      )
   }
}


{/* <button
   id="0"
   onClick={() => this.changeOptions('0')}
   className={sidebar.sidebar_button}>
   <img src="../images/configuration.png"
      alt="configuration" id="configuration"
      className={sidebar.images} />
   CONFIGURATION
</button>

<button
   id="1"
   onClick={() => this.changeOptions('1')}
   className={sidebar.sidebar_button}>
   <img src="../images/tracking.png"
      alt="realtime" id="realtime"
      className={sidebar.images} />
   REALTIME STATUS
</button>

<button
   id="2"
   onClick={() => this.changeOptions('2')}
   className={sidebar.sidebar_button}>
   <img src="../images/system_health.png"
      alt="health" id="health"
      className={sidebar.images} />
   SYSTEM HEALTH
</button>

<button
   id="3"
   onClick={() => this.changeOptions('3')}
   className={sidebar.sidebar_button}>
   <img src="../images/alert.png"
      alt="alerts" id="alerts"
      className={sidebar.images} />
   ALERTS
</button>

<button
   id="4"
   onClick={() => this.changeOptions('4')}
   className={sidebar.sidebar_button}>
   <img src="../images/assets_details.png"
      alt="asset" id="asset"
      className={sidebar.images} />
   ASSET DETAILS
</button> */}
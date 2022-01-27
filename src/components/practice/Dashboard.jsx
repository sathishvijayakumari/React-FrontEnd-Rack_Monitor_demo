import React, { Component, Fragment } from 'react'
import dashboard from '../../styling/dashboard.module.css';
import configuration from '../../styling/configuration.module.css';
import $ from 'jquery';

import RackMonitor from '../configuration/RackMonitor';
import AssetTag from '../configuration/AssetTag';
import Sensors from '../configuration/Sensors';
import MasterGateway from '../configuration/MasterGateway';
import SlaveGateway from '../configuration/SlaveGateway';
import SignalRepeater from '../configuration/SignalRepeater';
import UploadFloorMap from '../configuration/UploadFloorMap';
import { Helmet } from 'react-helmet';

export default class Dashboard extends Component {
   optionList = [false, false, false, false, false, false, false, false, false]
   constructor(props) {
      super(props);
      this.state = {
         dropdownStatus: false,
         flag: false,
      };
   }

   dropdown = (e) => {
      console.log('=====>', e.target);
   }

   componentDidMount() {
      $('#opt0').css({
         "background-color": "#2cd2da",
         "color": "#FFF",
         "font-family": "serif",
         "font-weight": "bold",
         // "border": "1px solid #ff0909"
      });
      this.setState({ flag: true })
      this.optionList[0] = true
   }

   optionChange = (id) => {
      // e.preventDefault();
      this.setState({ flag: true })
      this.optionList = [false, false, false, false, false, false, false, false, false]
      // let id = parseInt(e.target.id.substring(3))
      console.log('=======>', id);
      this.optionList[id] = true;
      $("a").css({ "background-color": "#111", "border": "none" });
      $("#opt" + id).css({
         "background-color": "#2cd2da",
         "color": "#FFF",
         "font-family": "serif",
         "font-weight": "bold",
         // "border": "1px solid #ff0909"
      });
   }


   render() {
      const { dropdownStatus } = this.state;
      return (
         <Fragment>
            <Helmet>
               Configuration
            </Helmet>

            <div
               id="parent_div"
               className={dashboard.sidenav}
            // onClick={this.optionChange}
            >
               <div
                  // id="opt0"
                  onClick={() => console.log('===============')}
               >
                  Rack Monitor
               </div>
               <div id="opt1"
                  className={configuration.subLeftNavBar}>
                  Asset Tag
               </div>
               <a href="#rackmonitor" id="opt0" onClick={() => this.optionChange(0)}>RackMonitor</a>
               <a href="#assetTag" id="opt1" onClick={() => this.optionChange(1)}>AssetTag</a>
               <a href="#sensors" id="opt2" onClick={() => this.optionChange(2)}>Sensors</a>
               <a href="#mastergateway" id="opt3" onClick={() => this.optionChange(3)}>MasterGateway</a>
               <button className={dashboard.dropdownBtn}
                  id="opt4"
                  onClick={() => this.setState({
                     dropdownStatus: !this.state.dropdownStatus
                  })}>Dropdown
                  <i className={dashboard.dropdownIcon + " fa fa-caret-down"}
                     style={{ marginTop: '5px' }}></i>
               </button>
               <div
                  style={{
                     display: dropdownStatus ? "block" : "none",
                     backgroundColor: "#262626",
                     paddingLeft: "8px",
                  }}>
                  <a href="#slavegateway" id="opt5" onClick={() => this.optionChange(5)}>SlaveGateway</a>
                  <a href="#signalrepeater" id="opt6" onClick={() => this.optionChange(6)}>SignalRepeater</a>
                  <a href="#Link3" id="opt7">Link 3</a>
               </div>
               <a href="#uploadmap" id="opt8" onClick={() => this.optionChange(8)}>UploadFloorMap</a>

            </div>

            <div className={configuration.container}>
               {this.optionList[0] && (<RackMonitor />)}
               {this.optionList[1] && (<AssetTag />)}
               {this.optionList[2] && (<Sensors />)}
               {this.optionList[3] && (<MasterGateway />)}
               {this.optionList[5] && (<SlaveGateway />)}
               {this.optionList[6] && (<SignalRepeater />)}
               {this.optionList[8] && (<UploadFloorMap />)}
            </div>

         </Fragment>
      )
   }
}

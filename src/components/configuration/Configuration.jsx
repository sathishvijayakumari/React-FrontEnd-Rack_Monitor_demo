import React, { Component, Fragment } from 'react'
import { Helmet } from 'react-helmet';
import configuration from '../../styling/configuration.module.css';
import $ from 'jquery';

import RackMonitor from '../configuration/RackMonitor';
import AssetTag from '../configuration/AssetTag';
import Sensors from '../configuration/Sensors';
import MasterGateway from '../configuration/MasterGateway';
import SlaveGateway from '../configuration/SlaveGateway';
import SignalRepeater from '../configuration/SignalRepeater';
import UploadFloorMap from '../configuration/UploadFloorMap';

export default class Configuration extends Component {
   optionList = [false, false, false, false, false, false, false]
   constructor(props) {
      super(props);
      this.state = {
         flag: false,
      }
   }

   componentDidMount() {
      $('#opt0').css({ "background-color": "#2cd2da", "border": "1px solid #ff0909" });
      this.setState({ flag: true })
      this.optionList[0] = true
   }

   optionChange = (e) => {
      e.preventDefault();
      this.setState({ flag: true })
      this.optionList = [false, false, false, false, false, false, false]
      let id = parseInt(e.target.id.substring(3))
      this.optionList[id] = true;
      $("#parent_div > div").css({ "background-color": "#276ebe", "border": "none" });
      $("#" + e.target.id).css({ "background-color": "#2cd2da", "border": "1px solid #ff0909" });
   }

   render() {
      return (
         <Fragment>
            <Helmet>
               Configuration
            </Helmet>

            <div
               id="parent_div"
               onClick={this.optionChange}
               className={configuration.leftNavbar_Container}>
               <div
                  id="opt0"
                  className={configuration.subLeftNavBar}>
                  Rack Monitor
               </div>
               <div id="opt1"
                  className={configuration.subLeftNavBar}>
                  Asset Tag
               </div>
               <div id="opt2" className={configuration.subLeftNavBar}>
                  Sensors
               </div>
               <div id="opt3" className={configuration.subLeftNavBar}>
                  Master Gateway
               </div>
               <div id="opt4" className={configuration.subLeftNavBar}>
                  Slave Gateway
               </div>
               <div id="opt5" className={configuration.subLeftNavBar}>
                  Signal Repeater
               </div>
               <div id="opt6" className={configuration.subLeftNavBar}>
                  Upload Floor
               </div>
            </div>

            <div className={configuration.container}>
               {this.optionList[0] && (<RackMonitor />)}
               {this.optionList[1] && (<AssetTag />)}
               {this.optionList[2] && (<Sensors />)}
               {this.optionList[3] && (<MasterGateway />)}
               {this.optionList[4] && (<SlaveGateway />)}
               {this.optionList[5] && (<SignalRepeater />)}
               {this.optionList[6] && (<UploadFloorMap />)}
            </div>
         </Fragment>

      )
   }
}

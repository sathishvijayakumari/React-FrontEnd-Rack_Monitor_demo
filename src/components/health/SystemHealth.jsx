import React, { Component, Fragment, } from 'react';
import { Helmet } from 'react-helmet';
import healthStyle from '../../styling/health.module.css';

import MasterGateway from '../health/MasterGateway';
import SlaveGateway from '../health/SlaveGateway';
import SignalRepeater from '../health/SignalRepeater';
import Sensors from '../health/SensorsHealth';
import Assests from '../health/AssestsHealth';

import $ from 'jquery';

export default class SystemHealth extends Component {
   optionList = [false, false, false, false, false]
   constructor(props) {
      super(props);
      this.state = {
         flag: false,
      }
   }

   componentDidMount() {
      $('#option0').css({ "background-color": "#2cd2da", "border": "1px solid #ff0909" });
      this.setState({ flag: true })
      this.optionList[0] = true
   }

   optionChange = (e) => {
      e.preventDefault();
      this.setState({ flag: true })
      this.optionList = [false, false, false, false, false]
      let id = parseInt(e.target.id.substring(6))
      this.optionList[id] = true;
      $("#parent_div > div").css({ "background-color": "#276ebe", "border": "none" });
      $("#" + e.target.id).css({ "background-color": "#2cd2da", "border": "1px solid #ff0909" });
   }
   render() {
      return (
         <Fragment>
            <Helmet>
               SystemHealth
            </Helmet>
            <div
               id="parent_div"
               onClick={this.optionChange}
               className={healthStyle.leftNavbar_Container}>
               <div
                  id="option0"
                  className={healthStyle.subLeftNavBar}>
                  Master Gateway
               </div>
               <div id="option1"
                  className={healthStyle.subLeftNavBar}>
                  Slave Gateway
               </div>
               <div id="option2" className={healthStyle.subLeftNavBar}>
                  Signal Repeater
               </div>
               <div id="option3" className={healthStyle.subLeftNavBar}>
                  Sensors
               </div>
               <div id="option4" className={healthStyle.subLeftNavBar}>
                  Assets Tag
               </div>
            </div>

            <div className={healthStyle.container}>
               {this.optionList[0] && (<MasterGateway />)}
               {this.optionList[1] && (<SlaveGateway />)}
               {this.optionList[2] && (<SignalRepeater />)}
               {this.optionList[3] && (<Sensors />)}
               {this.optionList[4] && (<Assests />)}
            </div>
         </Fragment>
      )
   }
}

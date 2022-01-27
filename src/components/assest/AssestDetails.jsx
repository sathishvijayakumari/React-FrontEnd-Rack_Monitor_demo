import React, { Component, Fragment, } from 'react';
import { Helmet } from 'react-helmet';
import healthStyle from '../../styling/health.module.css';
import $ from 'jquery';
import AssetRackMonitor from './AssetRackMonitor';
import AssestTag from './AssestTag';

export default class AssestDetails extends Component {
   optionList = [false, false]
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
      this.optionList = [false, false]
      let id = parseInt(e.target.id.substring(6))
      this.optionList[id] = true;
      $("#parent_div > div").css({ "background-color": "#276ebe", "border": "none" });
      $("#" + e.target.id).css({ "background-color": "#2cd2da", "border": "1px solid #ff0909" });
   }
   render() {
      return (
         <Fragment>
            <Helmet>
               Assest Tag Details
            </Helmet>
            <div
               id="parent_div"
               onClick={this.optionChange}
               className={healthStyle.leftNavbar_Container}>
               <div
                  id="option0"
                  className={healthStyle.subLeftNavBar}>
                  Rack Monitor
               </div>
               <div id="option1"
                  className={healthStyle.subLeftNavBar}>
                  Assest Tag
               </div>
            </div>

            <div className={healthStyle.container}>
               {this.optionList[0] && (<AssetRackMonitor />)}
               {this.optionList[1] && (<AssestTag />)}
            </div>
         </Fragment>
      )
   }
}

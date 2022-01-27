import React, { Component, Fragment } from 'react';
import common from '../../styling/common.module.css';
import $ from 'jquery';
import axios from 'axios';

export default class SignalRepeater extends Component {

   constructor(props) {
      super(props);
      this.state = {
         error: false,
         message: "",
         repeaterData: ""
      }
   }

   componentDidMount() {
      this.signalRepeaterData();
   }
   componentWillUnmount() {
      clearInterval(this.interval);
      this.setState({ error: false, message: "", })
   }

   signalRepeaterData = (e) => {
      console.log('===signalRepeaterData====',);
      axios({ method: "GET", url: "/api/signalrepeater" })
         .then((response) => {
            if (response.status === 200 && response.data.length !== 0) {
               let data = response.data;
               $("#repeater_table tbody").empty();
               for (let i = 0; i < data.length; i++) {
                  let status = "red";
                  if (new Date() - new Date(data[i].lastseen) <= 2 * 60 * 1000) {
                     status = "green";
                  }
                  $("#repeater_table tbody").append(
                     "<tr><td>" +
                     (i + 1) +
                     "</td><td>" +
                     data[i].macid +
                     "</td><td>" +
                     data[i].lastseen.replace("T", " ").substr(0, 19) +
                     "</td><td>" +
                     "<div style='margin:auto; width:0px; padding:5px; border-radius:5px; background-color:" +
                     status +
                     ";'></div></td></tr>"
                  );
               }
            } else {
               this.setState({
                  error: true,
                  message: "No data found for Signal Repeater.",
               });
            }
         })
         .catch((error) => {
            if (error.response.status === 403) {
               this.setState({
                  error: true,
                  message: "User Session has timed out. Please login again.",
               });
            } else if (error.response.status === 404) {
               this.setState({
                  error: true,
                  message: "No data found for Signal Repeater.",
               });
            } else {
               this.setState({ error: true, message: "Request Failed." });
            }
         });
   }

   render() {
      return (
         <Fragment>

            {this.state.error && (
               <div className="alert alert-danger">
                  <strong className={common.message}>Error! {this.state.message}</strong>
               </div>
            )}

            <p className={common.header}>Signal Repeater</p>

            <div className="mt-3">
               <table className="table table-dark text-center" id="repeater_table">
                  <thead>
                     <tr>
                        <th>S.NO</th>
                        <th>ASSET MAC ID</th>
                        <th>SENSOR TYPE</th>
                        <th>BATTERY STATUS(%)</th>
                        <th>LAST SEEN</th>
                        <th>STATUS</th>
                     </tr>
                  </thead>

                  <tbody>
                  </tbody>
               </table>
            </div>
         </Fragment>
      )
   }
}

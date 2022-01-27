import React, { Component, Fragment } from 'react';
import common from '../../styling/common.module.css';
import $ from 'jquery';
import axios from 'axios';

export default class AssestsHealth extends Component {

   constructor(props) {
      super(props);
      this.state = {
         error: false,
         message: "",
      }
   }

   componentDidMount() {
      this.assestsHealthData();
      // this.interval = setInterval(this.assestsHealthData, 15 * 1000)
   }
   componentWillUnmount() {
      clearInterval(this.interval);
      this.setState({ error: false, message: "", })
   }

   assestsHealthData = (e) => {
      console.log('===assestsHealthData====',);
      $("#assets_health tbody").empty();
      axios({ method: "GET", url: "/api/asset?rackno=all" })
         .then((response) => {
            const data = response.data;
            console.log('=====>', response);
            if (data.length !== 0 && response.status === 200) {
               for (let i = 0; i < data.length; i++) {
                  let status = 'red';
                  if ((new Date() - new Date(data[i].lastseen)) <= (2 * 60 * 1000)) {
                     status = "green";
                  }

                  $("#assets_health tbody").append(
                     "<tr>" +
                     "<td>" + (i + 1) + "</td>" +
                     "<td>" + data[i].tagid + "</td>" +
                     "<td>" + data[i].battery + "</td>" +
                     "<td>" + data[i].lastseen.replace("T", " ").substr(0, 19) + "</td>" +
                     "<td>" +
                     "<div style = 'margin:auto;width:12px;height: 12px;border-radius:12px;background-color:" + status + "'></div>" + "</td > " +
                     "</tr>"
                  )
               }
            } else {
               this.setState({
                  error: true,
                  message: "No data found for assests tag Gateway.",
               });
            }
         })
         .catch((error) => {
            console.log('Health assests tag gate Error====', error);
            if (error.response.status === 403) {
               this.setState({
                  error: true,
                  message: "User Session has timed out. Please login again.",
               });
            } else {
               this.setState({ error: true, message: "Request Failed." });
            }
         })
   }


   render() {
      return (
         <Fragment>

            {this.state.error && (
               <div className="alert alert-danger">
                  <strong className={common.message}>Error! {this.state.message}</strong>
               </div>
            )}

            <p className={common.header}>Assets Tag</p>

            <div className="mt-3">
               <table className="table table-dark text-center" id="assets_health">
                  <thead>
                     <tr>
                        <th>S.NO</th>
                        <th>ASSET MAC ID</th>
                        <th>BATTERY STATUS(%)</th>
                        <th>LAST SEEN</th>
                        <th>STATUS</th>
                     </tr>
                  </thead>

                  <tbody></tbody>
               </table>
            </div>
         </Fragment>
      )
   }
}

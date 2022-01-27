import React, { Component, Fragment } from 'react';
import common from '../../styling/common.module.css';
import $ from 'jquery';
import axios from 'axios';

export default class SlaveGateway extends Component {

   constructor(props) {
      super(props);
      this.state = {
         error: false,
         message: "",
      }
   }

   componentDidMount() {
      this.slaveGate();
      this.interval = setInterval(this.slaveGate, 15 * 1000)
   }
   componentWillUnmount() {
      clearInterval(this.interval);
      this.setState({ error: false, message: "", })
   }

   slaveGate = () => {
      console.log('===slaveGate====');
      $("#slave_table tbody").empty();
      axios({ method: "GET", url: "/api/gateway/slave" })
         .then((response) => {
            const data = response.data;
            console.log('=====>', data);
            if (data.length !== 0 && response.status === 200) {
               for (let i = 0; i < data.length; i++) {
                  let status = 'red';
                  if ((new Date() - new Date(data[i].lastseen)) <= (2 * 60 * 1000)) {
                     status = "green";
                  }

                  $("#slave_table tbody").append(
                     "<tr>" +
                     "<td>" + (i + 1) + "</td>" +
                     "<td>" + data[i].gatewayid + "</td>" +
                     "<td>" + data[i].master.floor.name + "</td>" +
                     "<td>" + data[i].master.gatewayid + "</td>" +
                     "<td>" + data[i].lastseen.replace("T", " ").substr(0, 19) + "</td>" +
                     "<td>" +
                     "<div style = 'margin:auto;width:12px;height: 12px;border-radius:12px;background-color:" + status + "'></div>" + "</td > " +
                     "</tr>"
                  )
               }
            } else {
               this.setState({
                  error: true,
                  message: "No data found for Slave Gateway.",
               });
            }
         })
         .catch((error) => {
            console.log('Health Slave gate Error====', error);
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

            <p className={common.header}>Slave Gateway</p>

            <div className="mt-3">
               <table className="table table-dark text-center" id="slave_table">
                  <thead>
                     <tr>
                        <th>S.NO</th>
                        <th>SLAVE ID</th>
                        <th>FLOOR NAME</th>
                        <th>MASTER GATEWAY ID</th>
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

import React, { Component, Fragment } from 'react';
import common from '../../styling/common.module.css';
import $ from 'jquery';
import axios from 'axios';

export default class SensorsHealth extends Component {

   constructor(props) {
      super(props);
      this.state = {
         error: false,
         message: "",
      }
   }

   componentDidMount() {
      this.sensorsData();
      this.interval = setInterval(this.sensorsData, 15 * 1000)
   }
   componentWillUnmount() {
      clearInterval(this.interval);
      this.setState({ error: false, message: "", })
   }

   sensorsData = () => {
      console.log('===sensorsData====');
      $("#sensors_table tbody").empty();
      axios({ method: "GET", url: "/api/sensor/health" })
         .then((response) => {
            const data = response.data.Temphumidity;
            console.log('=====>', response);
            if (data.length !== 0 && response.status === 200) {
               for (let i = 0; i < data.length; i++) {
                  let status = 'red';
                  if ((new Date() - new Date(data[i].lastseen)) <= (2 * 60 * 1000)) {
                     status = "green";
                  }

                  $("#sensors_table tbody").append(
                     "<tr>" +
                     "<td>" + (i + 1) + "</td>" +
                     "<td>" + data[i].macid + "</td>" +
                     "<td>Temp/Humid Sensor</td>" +
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
                  message: "No data found for Sensors Gateway.",
               });
            }
         })
         .catch((error) => {
            console.log('Health Sensors gate Error====', error);
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

            <p className={common.header}>SENSORS</p>

            <div className="mt-3">
               <table className="table table-dark text-center" id="sensors_table">
                  <thead>
                     <tr>
                        <th>S.NO</th>
                        <th>MAC ID</th>
                        <th>SENSOR TYPE</th>
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

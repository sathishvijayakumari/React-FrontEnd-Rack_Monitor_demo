import React, { Component, Fragment } from 'react';
import common from '../../styling/common.module.css';
import $ from 'jquery';
import axios from 'axios';


export default class AssestTag extends Component {
   constructor(props) {
      super(props);
      this.state = {
         error: false,
         message: "",
      };
   }

   componentDidMount = () => {
      axios({ method: "GET", url: "/api/asset?rackno=all" })
         .then((response) => {
            // console.log(response);
            if (response.status === 200 && response.data.length !== 0) {
               let data = response.data;
               $("#asset_details_table tbody").empty();
               for (let i = 0; i < data.length; i++) {
                  let status = "red";
                  if (new Date() - new Date(data[i].lastseen) <= 2 * 60 * 1000) {
                     status = "green";
                  }
                  $("#asset_details_table tbody").append(
                     "<tr><td>" +
                     (i + 1) +
                     "</td><td>" +
                     data[i].tagid +
                     "</td><td>" +
                     data[i].rackno.macid +
                     "</td><td>" +
                     data[i].usage +
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
                  message: "No data found for MasterGateway.",
               });
            }
         })
         .catch((error) => {
            // console.log(error);
            if (error.response.status === 403) {
               this.setState({
                  error: true,
                  message: "User Session has timed out. Please login again.",
               });
            } else {
               this.setState({ error: true, message: "Request Failed." });
            }
         });
   };

   render() {
      return (
         <Fragment>
            {this.state.error && (
               <div
                  className="alert alert-danger border-0 rounded-0"
                  style={{ zIndex: "-1" }}
               >
                  <strong>Error!</strong> {this.state.message}
               </div>
            )}

            <div className="container-fluid mt-2">
               <p className={common.header}>
                  ASSET DETAILS
               </p>
               <table className="table table-dark text-center" id="asset_details_table">
                  <thead>
                     <tr>
                        <th>S.No</th>
                        <th>ASSET ID</th>
                        <th>RACK ID</th>
                        <th>UNIT USAGE</th>
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

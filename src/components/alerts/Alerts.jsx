import React, { Fragment, PureComponent } from "react";
import { Helmet } from "react-helmet";
import axios from "axios";
import $ from "jquery";
import common from '../../styling/common.module.css'

export default class Alerts extends PureComponent {

   constructor(props) {
      super(props);
      this.state = {
         message: "",
         error: false,
      };
   }

   componentDidMount = () => {
      axios({ method: "GET", url: "/api/alert" })
         .then((response) => {
            console.log(response);
            if (response.status === 200 && response.data.length !== 0) {
               let data = response.data;
               $("#alerts_table tbody").empty();
               let count = 1;
               for (let i = data.length - 1; i >= 0; i--) {
                  if (count === 101) break;
                  $("#alerts_table tbody").append(
                     "<tr><td>" +
                     count +
                     "</td><td>" +
                     data[i].macid.tagid +
                     "</td><td>" +
                     data[i].value +
                     "</td><td>" +
                     data[i].lastseen.replace("T", " ").substr(0, 19) +
                     "</td></tr>"
                  );
                  count = count + 1;
               }
            } else {
               this.setState({
                  error: true,
                  message: "No data found.",
               });
            }
         })
         .catch((error) => {
            console.log(error);
            if (error.response.status === 403) {
               this.setState({
                  error: true,
                  message: "User session had timed out. Please login again.",
               });
            } else if (error.response.status === 400) {
               this.setState({
                  error: true,
                  message: "Request Failed.",
               });
            } else {
               this.setState({
                  error: true,
                  message: "Error occurred. Please try again.",
               });
            }
         });
   };

   /** On component un-load, clear timeout set on component load. */
   componentWillUnmount = () => {
      clearTimeout(this.timeout);
   };
   render() {
      return (
         <Fragment>
            <Helmet>
               <title>Alert Notifications</title>
            </Helmet>
            <div className="container my-4">
               {this.state.error && (
                  <div
                     className="alert alert-danger border-0 rounded-0"
                     style={{ zIndex: "-1" }}
                  >
                     <strong>Error!</strong> {this.state.message}
                  </div>
               )}

               <div className={common.header}>Alert Notifications</div>
               <div className="container-fluid mt-2">
                  <table className="table table-dark text-center" id="alerts_table">
                     <thead>
                        <tr>
                           <th>S.No</th>
                           <th>ASSET MAC ID</th>
                           <th>TYPE</th>
                           <th>LAST SEEN</th>
                        </tr>
                     </thead>
                     <tbody></tbody>
                  </table>
               </div>
            </div>
         </Fragment>
      )
   }
}

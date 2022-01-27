import React, { Fragment, Component } from "react";

import common from "../../styling/common.module.css";
import $ from "jquery";
import axios from "axios";
export default class SignalRepeater extends Component {
   constructor(props) {
      super(props);
      this.state = {
         floorID: "",
         repeaterID: "",
         message: "",
         success: false,
         error: false,
      };
   }

   componentDidMount = () => {
      $("#repeater_floorname").empty();
      // let data = this.props.floorDetails;
      // for (let i = 0; i < data.length; i++) {
      //    $("#repeater_floorname").append(
      //       "<option value=" + data[i].id + ">" + data[i].name + "</option>"
      //    );
      // }
      axios({ method: "GET", url: "/api/uploadmap" })
         .then((response) => {
            console.log('Response--->', response);
            const data = response.data;
            if (data.length !== 0 && response.status === 200) {
               for (let i = 0; i < data.length; i++) {
                  $("#repeater_floorname").append(
                     "<option value=" + data[i].id + ">" + data[i].name + "</option>"
                  )
               }
               this.setState({ floorID: data[0].id })
            } else {
               this.setState({
                  error: true,
                  message: "No floor map uploaded. Please upload a floor map to begin",
               });
            }
         })
         .catch((error) => {
            console.log('Error----->', error);
            if (error.response.status === 403) {
               this.setState({
                  error: true,
                  message: "User session had timed out. Please login again.",
               });
            } else {
               this.setState({
                  error: true,
                  message: "Error occurred. Please try again.",
               });
            }
         })
   };

   componentWillUnmount = () => {
      this.setState({
         floorID: "",
         repeaterID: "",
         message: "",
         success: false,
         error: false,
      });
      clearTimeout(this.timeout);
   };

   inputHandler = (event) => {
      this.setState({ [event.target.name]: event.target.value });
   };

   changeFloor = (event) => {
      this.setState({ floorID: event.target.value });
   };

   registerSignalRepeater = (e) => {
      e.preventDefault();
      const { floorID, repeaterID } = this.state;
      axios({
         method: "POST",
         url: "/api/signalrepeater",
         data: { floorid: floorID, macid: repeaterID },
      })
         .then((response) => {
            console.log(response);
            if (response.status === 201) {
               this.setState({
                  success: true,
                  error: false,
                  message: "Signal Repeater is registered successfully.",
               });
            } else {
               this.setState({
                  success: false,
                  error: true,
                  message: "Unable to register Signal Repeater.",
               });
            }
         })
         .catch((error) => {
            console.log(error);
            if (error.response.status === 403) {
               this.setState({
                  success: false,
                  error: true,
                  message: "User session has timed out. Please login again.",
               });
            } else if (error.response.status === 400) {
               this.setState({
                  success: false,
                  error: true,
                  message: "Data duplication error.",
               });
            } else {
               this.setState({
                  success: false,
                  error: true,
                  message: "Error occurred.",
               });
            }
         });
   };

   unregisterRepeater = (e) => {
      e.preventDefault();
      const { repeaterID } = this.state;
      axios({
         method: "DELETE",
         url: "/api/signalrepeater",
         data: { macid: repeaterID },
      })
         .then((response) => {
            console.log(response);
            if (response.status === 200) {
               this.setState({
                  success: true,
                  error: false,
                  message: "Signal Repeater is removed successfully.",
               });
            } else {
               this.setState({
                  success: false,
                  error: true,
                  message: "Unable to remove Signal Repeater.",
               });
            }
         })
         .catch((error) => {
            console.log(error);
            if (error.response.status === 403) {
               this.setState({
                  success: false,
                  error: true,
                  message: "User session has timed out. Please login again.",
               });
            } else {
               this.setState({
                  success: false,
                  error: true,
                  message: "Error occurred.",
               });
            }
         });
   };

   render() {
      const { repeaterID } = this.state;
      return (
         <Fragment>
            {this.state.success && (
               <div
                  className="alert alert-success border-0 rounded-0"
                  style={{ zIndex: "-1" }}
               >
                  <strong>Success!</strong> {this.state.message}
               </div>
            )}

            {this.state.error && (
               <div
                  className="alert alert-danger border-0 rounded-0"
                  style={{ zIndex: "-1" }}
               >
                  <strong>Error!</strong> {this.state.message}
               </div>
            )}

            <p className={common.header}>Signal Repeater</p>

            <form
               className="container mt-1"
               onSubmit={this.registerSignalRepeater}
            >
               <div className="row">
                  <div className="col-sm-5 my-2">
                     <label className="text-secondary">Floor Name *</label>
                     <select
                        className="form-select bg-light text-dark border border-secondary"
                        id="repeater_floorname"
                        onChange={this.changeFloor}
                     ></select>
                  </div>

                  <div className="col-sm-5 my-2">
                     <label className="text-secondary">SignalRepeater ID *</label>
                     <input
                        type="text"
                        name="repeaterID"
                        value={repeaterID}
                        onChange={this.inputHandler}
                        className="form-control bg-light text-dark border border-secondary"
                        required
                     />
                  </div>

               </div>


               <div className="text-center">
                  <input type="submit"
                     value="Register Repeater"
                     className={"btn btn-primary " + common.button} />

                  <input type="submit"
                     className={"btn btn-danger " + common.button}
                     style={{ marginLeft: '10px' }}
                     value="Remove Repeater"
                     onClick={this.unregisterRepeater} />
               </div>

            </form>
         </Fragment>
      )
   }
}

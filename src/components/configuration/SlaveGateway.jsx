import React, { Component, Fragment } from 'react';
import common from '../../styling/common.module.css';
import axios from 'axios';
import $ from 'jquery';

export default class SlaveGateway extends Component {
   constructor(props) {
      super(props);
      this.state = {
         floorId: "",
         slaveId: "",
         masterId: "",
         error: false,
         success: false,
         message: "",
      }
   }
   componentDidMount() {
      axios({ method: "GET", url: "/api/gateway/master" })
         .then((response) => {
            // console.log(response);
            if (response.status === 200 && response.data.length !== 0) {
               $("#gatewayID").empty();
               for (let i = 0; i < response.data.length; i++) {
                  $("#gatewayID").append(
                     "<option value=" +
                     response.data[i].id +
                     ">" +
                     response.data[i].gatewayid +
                     "</option>"
                  );
               }
               this.setState({ masterId: response.data[0].id });
            } else {
               this.setState({
                  success: false,
                  error: true,
                  message: "No floor map details is found.",
               });
            }
         })
         .catch((error) => {
            // console.log(error);
            if (error.response.status === 403) {
               this.setState({
                  success: false,
                  error: true,
                  message: "User session had timed out. Please login again.",
               });
            } else {
               this.setState({
                  success: false,
                  error: true,
                  message: "Error occurred. Please try again.",
               });
            }
         });
   }

   inputHandler = (e) => {
      this.setState({ [e.target.name]: e.target.value })
   }

   slaveRegistration = (e) => {
      e.preventDefault();
      console.log('slaveRegistration=====>', this.state);
      const { floorId, slaveId, masterId } = this.state;
      axios({
         method: "POST", url: "/api/gateway/slave",
         data: { masterid: masterId, macaddress: slaveId },
      })
         .then((response) => {
            if (response.status === 200) {
               this.setState({
                  success: true,
                  error: false,
                  message: "slave Gateway is registered successfully.",
               });
            } else {
               this.setState({
                  success: false,
                  error: true,
                  message: "slave Gateway  is not registered",
               });
            }
         })
         .catch((error) => {
            console.log(error);
            if (error.response.status === 403) {
               this.setState({
                  success: false,
                  error: true,
                  message: "User session had timed out. Please login again.",
               });
            } else if (error.response.status === 400) {
               this.setState({
                  success: false,
                  error: true,
                  message: "slave Gateway ID found.",
               });
            } else {
               this.setState({
                  success: false,
                  error: true,
                  message: "Error occurred. Please try again.",
               });
            }
         })
   }

   changeGateway = (event) => {
      this.setState({ masterId: event.target.value });
   };

   removeGateway = (e) => {
      e.preventDefault();
      axios({
         method: "DELETE", url: "/api/gateway/slave",
         data: { macaddress: this.state.slaveId },
      })
         .then((response) => {
            console.log(response);
            if (response.status === 200) {
               this.setState({
                  success: true,
                  error: false,
                  message: "slave Gateway is removed successfully.",
               });
            } else {
               this.setState({
                  success: false,
                  error: true,
                  message: "slave Gateway is not removed.",
               });
            }
         })
         .catch((error) => {
            // console.log(error);
            if (error.response.status === 403) {
               this.setState({
                  success: false,
                  error: true,
                  message: "User session had timed out. Please login again.",
               });
            } else if (error.response.status === 404) {
               this.setState({
                  success: false,
                  error: true,
                  message: "Masater Gateway ID is not found.",
               });
            } else {
               this.setState({
                  success: false,
                  error: true,
                  message: "Error occurred. Please try again.",
               });
            }
         })
   }

   render() {
      const { error, success, message, masterId, slaveId } = this.state;
      return (
         <Fragment>
            {error && (
               <div className="alert alert-danger">
                  <strong className={common.message}>Error!   {message} </strong>
               </div>
            )}
            {success && (
               <div className="alert alert-success">
                  <strong className={common.message}>Success!   {message}</strong>
               </div>
            )}
            <p className={common.header}>slave Gateway</p>
            <form className="container mt-2"
               onSubmit={this.slaveRegistration}>

               <div className="row">
                  <div className="col-sm-5 my-2">
                     <label className="text-secondary">Master Gateway ID*</label>
                     <select
                        className="form-select bg-light text-dark border border-secondary"
                        id="gatewayID"
                        onChange={this.changeGateway}
                     ></select>
                  </div>

                  <div className="col-sm-5 my-2">
                     <label className="text-secondary">Slave Gateway ID*</label>
                     <input
                        type="text"
                        name="slaveId"
                        value={slaveId}
                        onChange={this.inputHandler}
                        className="form-control bg-light text-dark border border-secondary"
                        required
                     />
                  </div>
                  <div className="text-center">
                     <input type="submit"
                        value="Register Gateway"
                        className={"btn btn-primary " + common.button} />

                     <input type="submit"
                        className={"btn btn-danger " + common.button}
                        style={{ marginLeft: '10px' }}
                        value="Remove Gateway"
                        onClick={this.removeGateway} />
                  </div>
               </div>

            </form>
         </Fragment>
      )
   }
}

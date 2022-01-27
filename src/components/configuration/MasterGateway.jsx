import React, { Component, Fragment } from 'react';
import common from '../../styling/common.module.css';
import axios from 'axios';
import $ from 'jquery';

export default class MasterGateway extends Component {
   constructor(props) {
      super(props);
      this.state = {
         floorId: "",
         masterId: "",
         error: "",
         success: false,
         message: false,
      }
   }
   componentDidMount() {
      axios({ method: "GET", url: "/api/uploadmap" })
         .then((response) => {
            console.log('Response--->', response);
            const data = response.data;
            if (data.length !== 0 && response.status === 200) {
               for (let i = 0; i < data.length; i++) {
                  $("#rack_floorname").append("<option value=" + data[i].id + ">" + data[i].name + "</option>")
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
   }

   inputHandler = (e) => {
      this.setState({ [e.target.name]: e.target.value })
   }

   masterRegistration = (e) => {
      e.preventDefault();
      console.log('masterRegistration=====>', this.state);
      const { floorId, masterId } = this.state;
      axios({
         method: "POST", url: "/api/gateway/master",
         data: { floorid: floorId, macaddress: masterId }
      })
         .then((response) => {
            if (response.status === 200) {
               this.setState({
                  success: true,
                  error: false,
                  message: "Master Gateway is registered successfully.",
               });
            } else {
               this.setState({
                  success: false,
                  error: true,
                  message: "Master Gateway  is not registered",
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
                  message: "Master Gateway ID found.",
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

   removeGateway = (e) => {
      e.preventDefault();
      axios({
         method: "DELETE", url: "/api/gateway/master",
         data: { macaddress: this.state.masterId }
      })
         .then((response) => {
            console.log(response);
            if (response.status === 200) {
               this.setState({
                  success: true,
                  error: false,
                  message: "Master Gateway is removed successfully.",
               });
            } else {
               this.setState({
                  success: false,
                  error: true,
                  message: "Master Gateway is not removed.",
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
      const { error, success, message, masterId } = this.state;
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
            <p className={common.header}>Master Gateway</p>
            <form className="container mt-2"
               onSubmit={this.masterRegistration}>

               <div className="row">
                  <div className="col-sm-5 my-2">
                     <label className="text-secondary">Floor Name *</label>
                     <select
                        className="form-select bg-light text-dark border border-secondary"
                        id="rack_floorname"
                        onChange={this.changeFloor}
                     ></select>
                  </div>

                  <div className="col-sm-5 my-2">
                     <label className="text-secondary">Rack MAC ID *</label>
                     <input
                        type="text"
                        name="masterId"
                        value={masterId}
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

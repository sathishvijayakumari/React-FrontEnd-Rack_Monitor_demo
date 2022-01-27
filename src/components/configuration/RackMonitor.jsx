import React, { Component, Fragment } from 'react';
import $ from 'jquery';
import common from '../../styling/common.module.css';
import axios from 'axios';

export default class RackMonitor extends Component {

   constructor(props) {
      super(props);
      this.state = {
         floorID: "",
         rackID: "",
         pdu: "",
         capacity: "",
         x1: "",
         y1: "",
         x2: "",
         y2: "",
         message: "",
         success: false,
         error: false,
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

   rackRegistration = (e) => {
      e.preventDefault();
      console.log('=====>', this.state);
   }

   render() {
      const { rackID, pdu, capacity, x1, y1, x2, y2, message, success, error } = this.state;
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
            <p className={common.header}>Rack Monitor</p>
            <form className="container mt-2"
               onSubmit={this.rackRegistration}>

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
                        name="rackID"
                        value={rackID}
                        onChange={this.inputHandler}
                        className="form-control bg-light text-dark border border-secondary"
                        required
                     />
                  </div>

                  <div className="col-sm-5 my-2">
                     <label className="text-secondary">PDU *</label>
                     <input
                        type="text"
                        name="pdu"
                        value={pdu}
                        onChange={this.inputHandler}
                        className="form-control bg-light text-dark border border-secondary"
                        required
                     />
                  </div>

                  <div className="col-sm-5 my-2">
                     <label className="text-secondary">Capacity *</label>
                     <input
                        type="text"
                        name="capacity"
                        value={capacity}
                        onChange={this.inputHandler}
                        className="form-control bg-light text-dark border border-secondary"
                        required
                     />
                  </div>

                  <div className="col-sm-5 my-2">
                     <label className="text-secondary">X1 *</label>
                     <input
                        name="x1"
                        type="number"
                        min="0"
                        step="any"
                        value={x1}
                        onChange={this.inputHandler}
                        className="form-control bg-light text-dark border border-secondary"
                        required
                     />
                  </div>

                  <div className="col-sm-5 my-2">
                     <label className="text-secondary">Y1 *</label>
                     <input
                        name="y1"
                        type="number"
                        min="0"
                        step="any"
                        value={y1}
                        onChange={this.inputHandler}
                        className="form-control bg-light text-dark border border-secondary"
                        required
                     />
                  </div>

                  <div className="col-sm-5 my-2">
                     <label className="text-secondary">X2 *</label>
                     <input
                        name="x2"
                        type="number"
                        min="0"
                        step="any"
                        value={x2}
                        onChange={this.inputHandler}
                        className="form-control bg-light text-dark border border-secondary"
                        required
                     />
                  </div>

                  <div className="col-sm-5 my-2">
                     <label className="text-secondary">Y2 *</label>
                     <input
                        name="y2"
                        type="number"
                        min="0"
                        step="any"
                        value={y2}
                        onChange={this.inputHandler}
                        className="form-control bg-light text-dark border border-secondary"
                        required
                     />
                  </div>
               </div>
               <div className="text-center">
                  <input type="submit"
                     value="Register Rack"
                     className={"btn btn-primary " + common.button} />
               </div>
            </form>
         </Fragment>
      )
   }
}

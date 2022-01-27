import React, { Fragment, Component } from "react";

import common from "../../styling/common.module.css";
import $ from "jquery";
import axios from "axios";


export default class AssetTag extends Component {
   constructor(props) {
      super(props);
      this.state = {
         tagid: "",
         assetsn: "",
         devicemodel: "",
         assetunitusage: "",
         rackno: "",
         address: "",
         datacenter: "",
         floorid: "",
         rooms: "",
         columns: "",
         macaddr: "",
         description: "",
         manufacturer: "",
         serialno: "",
         supplier: "",
         macaddr2: "",
         equipmentcategory: "",
         lifecycle: "",
         maintenancecycle: "",
         pricipal: "",
         maintenancecontact: "",
         weight: 0.0,
         power: 0.0,
         current: 0,
         voltage: 0.0,
         firstusetime: "",
         inventorycode: "",
         lastmaintenancestaff: "",
         nextmaintenancestaff: "",
         lastupdatedtime: "",
         nextupdatedtime: "",
         message: "",
         success: false,
         error: false,
      };
   }

   componentDidMount = () => {
      $("#asset_tag_select2").empty();
      //let data = this.props.floorDetails;
      // for (let i = 0; i < data.length; i++) {
      //    $("#asset_tag_select2").append(
      //       "<option value=" + data[i].id + ">" + data[i].name + "</option>"
      //    );
      // }
      axios({ method: "GET", url: "/api/uploadmap" })
         .then((response) => {
            console.log('Response--->', response);
            const data = response.data;
            if (data.length !== 0 && response.status === 200) {
               for (let i = 0; i < data.length; i++) {
                  $("#asset_tag_select2").append(
                     "<option value=" + data[i].id + ">" + data[i].name + "</option>"
                  );
               }
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
      this.getRackDetails();
   };

   componentWillUnmount = () => {
      this.setState({
         tagid: "",
         assetsn: "",
         devicemodel: "",
         assetunitusage: "",
         rackno: "",
         address: "",
         datacenter: "",
         floorid: "",
         rooms: "",
         columns: "",
         macaddr: "",
         description: "",
         manufacturer: "",
         serialno: "",
         supplier: "",
         macaddr2: "",
         equipmentcategory: "",
         lifecycle: "",
         maintenancecycle: "",
         pricipal: "",
         maintenancecontact: "",
         weight: 0.0,
         power: 0.0,
         current: 0,
         voltage: 0.0,
         firstusetime: "",
         inventorycode: "",
         lastmaintenancestaff: "",
         nextmaintenancestaff: "",
         lastupdatedtime: "",
         nextupdatedtime: "",
         message: "",
         success: false,
         error: false,
      });
      clearTimeout(this.timeout);
   };

   getRackDetails = async () => {
      this.setState({ floorid: $("#asset_tag_select2").val() });
      axios({
         method: "GET",
         url: "/api/rack?floorid=" + $("#asset_tag_select2").val(),
      })
         .then((response) => {
            if (response.status === 200) {
               $("#asset_tag_select1").empty();
               if (response.data.length !== 0) {
                  for (let i = 0; i < response.data.length; i++) {
                     $("#asset_tag_select1").append(
                        "<option value=" +
                        response.data[i].id +
                        ">" +
                        response.data[i].macid +
                        "</option>"
                     );
                  }
                  this.setState({ rackno: $("#asset_tag_select1").val() });
               } else {
                  this.setState({
                     error: true,
                     success: false,
                     message:
                        "No rack is registered for the floor. Please select some other floor.",
                  });
               }
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
                  message: "Request Failed.",
               });
            } else {
               this.setState({
                  success: false,
                  error: true,
                  message: "Error occurred. Please try again.",
               });
            }
         });
   };

   // input value handle and assign to variables
   inputHandler = (event) => {
      this.setState({ [event.target.name]: event.target.value });
   };

   registerAsset = (e) => {
      e.preventDefault();
      this.setState({ floorid: $("#asset_tag_select2").val() });
      this.setState({ rackno: $("#asset_tag_select1").val() });
      console.log(this.state);
      const {
         tagid,
      } = this.state;
      if (
         tagid.length === 0
      ) {
         this.setState({
            error: true,
            message: "Please enter all mandatory fields.",
         });
      } else if (
         tagid.length !== 17 ||
         tagid.match("^5a-c2-15-[a-x0-9]{2}-[a-x0-9]{2}-[a-x0-9]{2}") === null
      ) {
         this.setState({
            error: true,
            message:
               'Invalid MAC ID entered. Please enter a valid one. Please follow the pattern "5a-c2-15-00-00-00"',
         });
      } else {
         axios({ method: "POST", url: "/api/asset", data: this.state })
            .then((response) => {
               // console.log(response);
               if (response.status === 201) {
                  this.setState({
                     success: true,
                     error: false,
                     message: "Asset is registered successfully.",
                  });
               } else {
                  this.setState({
                     success: true,
                     error: false,
                     message: "Unable to register asset.",
                  });
               }
            })
            .catch((error) => {
               // console.log(error);
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
                     message: "Bad Request.",
                  });
               } else if (error.response.status === 406) {
                  this.setState({
                     success: false,
                     error: true,
                     message:
                        "Maximum unit storage left is : " +
                        error.response.data.capacity,
                  });
               } else {
                  this.setState({
                     success: false,
                     error: true,
                     message:
                        "Error occurred while registering asset. Please try again.",
                  });
               }
            });
      }
   };
   render() {
      const {
         tagid,
         assetsn,
         devicemodel,
         assetunitusage,
         address,
         datacenter,
         rooms,
         columns,
         macaddr,
         description,
         manufacturer,
         serialno,
         supplier,
         macaddr2,
         equipmentcategory,
         lifecycle,
         maintenancecycle,
         pricipal,
         maintenancecontact,
         weight,
         power,
         current,
         voltage,
         firstusetime,
         inventorycode,
         lastmaintenancestaff,
         nextmaintenancestaff,
         lastupdatedtime,
         nextupdatedtime,
      } = this.state;

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

            {/* {this.state.error && (
               <div
                  className="alert alert-danger border-0 rounded-0"
                  style={{ zIndex: "-1" }}
               >
                  <strong>Error!</strong> {this.state.message}
               </div>
            )} */}
            <legend>Assets</legend>
            <form id="asset_tag" onSubmit={this.registerAsset}>
               <fieldset>
                  <div className="col-sm-4 my-2">
                     <input
                        type="text"
                        placeholder="Tag MAC ID *"
                        name="tagid"
                        value={tagid}
                        onChange={this.inputHandler}
                        className="form-control bg-light text-dark border border-secondary mt-2"
                     />
                  </div>
               </fieldset>
               <fieldset>
                  <legend>Basic Info.</legend>
                  <div className="row">
                     <div className="col-sm-4 my-2">
                        <input
                           type="text"
                           placeholder="Asset SN*"
                           name="assetsn"
                           value={assetsn}
                           onChange={this.inputHandler}
                           className="form-control bg-light text-dark border border-secondary mt-2"
                        ></input>
                     </div>

                     <div className="col-sm-4 my-2">
                        <input
                           type="text"
                           placeholder="Device Model*"
                           name="devicemodel"
                           value={devicemodel}
                           onChange={this.inputHandler}
                           className="form-control bg-light text-dark border border-secondary mt-2"
                        ></input>
                     </div>
                     <div className="col-sm-4 my-2">
                        <input
                           type="text"
                           placeholder="Asset Unit usage*"
                           name="assetunitusage"
                           value={assetunitusage}
                           onChange={this.inputHandler}
                           className="form-control bg-light text-dark border border-secondary mt-2"
                        ></input>
                     </div>
                     <div className="col-sm-4 my-2">
                        <select
                           id="asset_tag_select1"
                           className="form-select bg-light text-dark border border-secondary mt-2"
                        ></select>
                     </div>
                     <div className="col-sm-4 my-2">

                        <input
                           type="text"
                           placeholder="Address*"
                           name="address"
                           value={address}
                           onChange={this.inputHandler}
                           className="form-control bg-light text-dark border border-secondary mt-2"
                        ></input>
                     </div>

                     <div className="col-sm-4 my-2">
                        <input
                           type="text"
                           placeholder="Data Center*"
                           name="datacenter"
                           value={datacenter}
                           onChange={this.inputHandler}
                           className="form-control bg-light text-dark border border-secondary mt-2"
                        ></input>
                     </div>
                     <div className="col-sm-4 my-2">
                        <select
                           id="asset_tag_select2"
                           onChange={(this.inputHandler, this.getRackDetails)}
                           className="form-select bg-light text-dark border border-secondary mt-2"
                        ></select>
                     </div>
                     <div className="col-sm-4 my-2">
                        <input
                           type="text"
                           placeholder="Rooms*"
                           name="rooms"
                           value={rooms}
                           onChange={this.inputHandler}
                           className="form-control bg-light text-dark border border-secondary mt-2"
                        ></input>
                     </div>
                     <div className="col-sm-4 my-2">
                        <input
                           type="text"
                           placeholder="Columns*"
                           name="columns"
                           value={columns}
                           onChange={this.inputHandler}
                           className="form-control bg-light text-dark border border-secondary mt-2"
                        ></input>
                     </div>
                     <div className="col-sm-4 my-2">
                        <input
                           type="text"
                           placeholder="Mac Address"
                           name="macaddr"
                           value={macaddr}
                           onChange={this.inputHandler}
                           className="form-control bg-light text-dark border border-secondary mt-2"
                        ></input>
                     </div>

                     <div className="col-sm-4 my-2">
                        <input
                           type="text"
                           placeholder="Desctiprtion"
                           name="description"
                           value={description}
                           onChange={this.inputHandler}
                           className="form-control bg-light text-dark border border-secondary mt-2"
                        ></input>
                     </div>
                     <div className="col-sm-4 my-2">

                        <input
                           type="text"
                           placeholder="Manufacturer"
                           name="manufacturer"
                           value={manufacturer}
                           onChange={this.inputHandler}
                           className="form-control bg-light text-dark border border-secondary mt-2"
                        ></input>
                     </div>
                     <div className="col-sm-4 my-2">
                        <input
                           type="text"
                           placeholder="Serial Number"
                           name="serialno"
                           value={serialno}
                           onChange={this.inputHandler}
                           className="form-control bg-light text-dark border border-secondary mt-2"
                        ></input>
                     </div>
                     <div className="col-sm-4 my-2">

                        <input
                           type="text"
                           placeholder="Supplier"
                           name="supplier"
                           value={supplier}
                           onChange={this.inputHandler}
                           className="form-control bg-light text-dark border border-secondary mt-2"
                        ></input>
                     </div>
                     <div className="col-sm-4 my-2">
                        <input
                           type="text"
                           placeholder="Mac Address2"
                           name="macaddr2"
                           value={macaddr2}
                           onChange={this.inputHandler}
                           className="form-control bg-light text-dark border border-secondary mt-2"
                        ></input>
                     </div>
                  </div>
               </fieldset>
               <fieldset>
                  <legend>Pro Info.</legend>
                  <div className="row">
                     <div className="col-sm-4 my-2">
                        <input
                           type="text"
                           placeholder="Equipment Category"
                           name="equipmentcategory"
                           value={equipmentcategory}
                           onChange={this.inputHandler}
                           className="form-control bg-light text-dark border border-secondary mt-2"
                        ></input>
                     </div>
                     <div className="col-sm-4 my-2">
                        <input
                           type="text"
                           placeholder="Life Cycle"
                           name="lifecycle"
                           value={lifecycle}
                           onChange={this.inputHandler}
                           className="form-control bg-light text-dark border border-secondary mt-2"
                        ></input>
                     </div>
                     <div className="col-sm-4 my-2">
                        <input
                           type="text"
                           placeholder="Maintainence Cycle"
                           name="maintenancecycle"
                           value={maintenancecycle}
                           onChange={this.inputHandler}
                           className="form-control bg-light text-dark border border-secondary mt-2"
                        ></input>
                     </div>
                     <div className="col-sm-4 my-2">
                        <input
                           type="text"
                           placeholder="Principal"
                           name="pricipal"
                           value={pricipal}
                           onChange={this.inputHandler}
                           className="form-control bg-light text-dark border border-secondary mt-2"
                        ></input>
                     </div>
                     <div className="col-sm-4 my-2">
                        <input
                           type="text"
                           placeholder="Maintenance Contact"
                           name="maintenancecontact"
                           value={maintenancecontact}
                           onChange={this.inputHandler}
                           className="form-control bg-light text-dark border border-secondary mt-2"
                        ></input>
                     </div>

                     <div className="col-sm-4 my-2">
                        <input
                           type="number"
                           placeholder="Weight (Kg)"
                           name="weight"
                           value={weight}
                           onChange={this.inputHandler}
                           className="form-control bg-light text-dark border border-secondary mt-2"
                        ></input>
                     </div>
                     <div className="col-sm-4 my-2">
                        <input
                           type="number"
                           placeholder="Power (W)"
                           name="power"
                           value={power}
                           onChange={this.inputHandler}
                           className="form-control bg-light text-dark border border-secondary mt-2"
                        ></input>
                     </div>
                     <div className="col-sm-4 my-2">
                        <input
                           type="number"
                           placeholder="Current (A)"
                           name="current"
                           value={current}
                           onChange={this.inputHandler}
                           className="form-control bg-light text-dark border border-secondary mt-2"
                        ></input>
                     </div>
                     <div className="col-sm-4 my-2">
                        <input
                           type="number"
                           placeholder="Voltage (V)"
                           name="voltage"
                           value={voltage}
                           onChange={this.inputHandler}
                           className="form-control bg-light text-dark border border-secondary mt-2"
                        ></input>
                     </div>
                     <div className="col-sm-4 my-2">
                        <input
                           type="datetime-local"
                           placeholder="First use time"
                           name="firstusetime"
                           value={firstusetime}
                           id="firsttimeuse"
                           onChange={this.inputHandler}
                           title="First Time Use"
                           className="form-control bg-light text-dark border border-secondary mt-2"
                        ></input>
                     </div>
                     <div className="col-sm-4 my-2">
                        <input
                           type="text"
                           placeholder="Inventory Code"
                           name="inventorycode"
                           value={inventorycode}
                           onChange={this.inputHandler}
                           className="form-control bg-light text-dark border border-secondary mt-2"
                        ></input>
                     </div>
                     <div className="col-sm-4 my-2">
                        <input
                           type="text"
                           placeholder="Last Maintenance Staff"
                           name="lastmaintenancestaff"
                           value={lastmaintenancestaff}
                           onChange={this.inputHandler}
                           className="form-control bg-light text-dark border border-secondary mt-2"
                        ></input>
                     </div>
                     <div className="col-sm-4 my-2">
                        <input
                           type="text"
                           placeholder="Next Maintenance Staff"
                           name="nextmaintenancestaff"
                           value={nextmaintenancestaff}
                           onChange={this.inputHandler}
                           className="form-control bg-light text-dark border border-secondary mt-2"
                        ></input>
                     </div>
                     <div className="col-sm-4 my-2">
                        <input
                           type="datetime-local"
                           placeholder="Last Update time"
                           name="lastupdatedtime"
                           value={lastupdatedtime}
                           onChange={this.inputHandler}
                           title="Last Updated Time"
                           className="form-control bg-light text-dark border border-secondary mt-2"
                        ></input>
                     </div>
                     <div className="col-sm-4 my-2">
                        <input
                           type="datetime-local"
                           placeholder="Next Updated time"
                           name="nextupdatedtime"
                           value={nextupdatedtime}
                           onChange={this.inputHandler}
                           title="Next Update Time"
                           className="form-control bg-light text-dark border border-secondary mt-2"
                        ></input>
                     </div>
                  </div>
               </fieldset>

               <div className="text-center">
                  <input type="submit"
                     value="Submit"
                     className={"btn btn-primary " + common.button} />
               </div>
            </form>
         </Fragment>
      );
   }
}
import React, { Fragment, PureComponent } from "react";

// Styling import statement
import common from "../../stylings/global.module.css";

// Display model for error or success message
import ErrorSuccess from "../errorsuccess/ErrorSuccess";
import Forbidden from "../errorsuccess/Forbidden";

// Dependency import statement
import $ from "jquery";
import axios from "axios";

import { ConfigEventAssetTag } from "../../events/configuration/AssetTag_Event";
import { rackMonitor } from "../../urls/url";
const config = new ConfigEventAssetTag();

class AssetTag extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      tagid: undefined,
      assetsn: null,
      devicemodel: null,
      assetunitusage: null,
      rackno: undefined,
      address: null,
      datacenter: null,
      floorid: undefined,
      rooms: null,
      columns: null,
      macaddr: null,
      description: null,
      manufacturer: null,
      serialno: null,
      supplier: null,
      macaddr2: null,
      equipmentcategory: null,
      lifecycle: null,
      maintenancecycle: null,
      pricipal: null,
      maintenancecontact: null,
      weight: 0.0,
      power: 0.0,
      current: 0,
      voltage: 0.0,
      firstusetime: null,
      inventorycode: null,
      lastmaintenancestaff: null,
      nextmaintenancestaff: null,
      lastupdatedtime: null,
      nextupdatedtime: null,
      displayModal: false,
      success: false,
      message: "",
      forbidden: false,
    };
  }

  componentDidMount = () => {
    $("#asset_tag input[name=firstusetime]").val(new Date());
    if (this.props.floorDetails.length !== 0) {
      $("#asset_tag select:nth-child(2)").empty();
      let floorDetails = this.props.floorDetails;
      for (let i = 0; i < floorDetails.length; i++) {
        $("#asset_tag select:nth-child(2)").append(
          "<option value='" +
            floorDetails[i].id +
            "'>" +
            floorDetails[i].name +
            "</option>"
        );
      }
      this.setState({ floorid: $("#asset_tag select").eq(1).val() });
    } else {
      this.setState({
        displayModal: true,
        message: "No floor is uploaded. Please upload a floor map to proceed.",
      });
    }
    this.getRackDetails();
  };

  getRackDetails = async () => {
    this.setState({ floorid: $("#asset_tag select").eq(1).val() });
    axios({
      method: "GET",
      url: rackMonitor + "?floorid=" + $("#asset_tag select").eq(1).val(),
    })
      .then((response) => {
        if (response.status === 200) {
          if (response.data.length !== 0) {
            $("#asset_tag select").eq(0).empty();
            for (let i = 0; i < response.data.length; i++) {
              $("#asset_tag select")
                .eq(0)
                .append(
                  "<option value='" +
                    response.data[i].id +
                    "'>" +
                    response.data[i].macid +
                    "</option>"
                );
            }
            this.setState({ rackno: $("#asset_tag select").eq(0).val() });
          } else {
            this.setState({
              displayModal: true,
              message:
                "No rack is registered for the floor. Please select some other floor.",
            });
          }
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  inputHandler = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };

  registerAsset = async (e) => {
    e.preventDefault();
    this.setState({ floorid: $("#asset_tag select").eq(1).val() });
    this.setState({ rackno: $("#asset_tag select").eq(0).val() });

    const {
      tagid,
      assetsn,
      devicemodel,
      assetunitusage,
      address,
      datacenter,
      rooms,
      columns,
    } = this.state;
    if (
      tagid.length === 0 ||
      assetsn.length === 0 ||
      devicemodel.length === 0 ||
      assetunitusage.length === 0 ||
      address.length === 0 ||
      datacenter.length === 0 ||
      rooms.length === 0 ||
      columns.length === 0
    ) {
      this.setState({
        displayModal: true,
        message: "Please enter all mandatory fields.",
      });
    } else if (
      tagid.length !== 17 ||
      tagid.match("^5a-c2-15-[a-x0-9]{2}-[a-x0-9]{2}-[a-x0-9]{2}") === null
    ) {
      this.setState({
        displayModal: true,
        message:
          'Invalid MAC ID entered. Please enter a valid one. Please follow the pattern "5a-c2-15-00-00-00"',
      });
    }
    // else if (
    //   this.state.macaddr2 !== null &&
    //   (this.state.macaddr2.length !== 17 ||
    //     this.state.macaddr2.match(
    //       "^5a-c2-15-[a-x0-9]{2}-[a-x0-9]{2}-[a-x0-9]{2}"
    //     ) === null)
    // ) {
    //   this.setState({
    //     displayModal: true,
    //     message:
    //       'Invalid MAC ID entered for field : Mac Address 2. Please enter a valid one. Please follow the pattern "5a-c2-15-00-00-00"',
    //   });
    // }
    else {
      await config.addAssetTag(this.state).then((response) => {
        if (response.status) {
          this.setState({
            displayModal: true,
            success: true,
            message: response.message,
          });
        } else {
          if (response.code === 403) {
            console.log("Forbidden Error");
            this.setState({ forbidden: true });
          } else {
            this.setState({ displayModal: true, message: response.message });
          }
        }
      });
    }
  };

  removeAsset = async () => {
    if (
      this.state.tagid.length !== 17 ||
      this.state.tagid.match(
        "^5a-c2-15-[a-x0-9]{2}-[a-x0-9]{2}-[a-x0-9]{2}"
      ) === null
    ) {
      this.setState({
        displayModal: true,
        message:
          'Invalid Tag MAC ID entered. Please enter a valid one. Please follow the pattern "5a-c2-15-00-00-00"',
      });
    } else {
      await config.removeAssetTag(this.state.tagid).then((response) => {
        if (response.code === 403) {
          this.setState({
            forbidden: true,
          });
        } else {
          this.setState({
            displayModal: true,
            success: response.status,
            message: response.message,
          });
        }
      });
    }
  };

  updateAsset = async () => {};

  render() {
    const {
      tagid,
      assetsn,
      devicemodel,
      assetunitusage,
      address,
      datacenter,
      floorid,
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
        <div className={common.heading}>Asset Tag</div>
        <hr width="55%" color="#ca3b00" size="4"></hr>
        <form id="asset_tag" onSubmit={this.registerAsset}>
          <fieldset>
            <div className={common.row}>
              <div className={common.col_3}>
                <input
                  type="text"
                  placeholder="Tag MAC ID *"
                  name="tagid"
                  value={tagid}
                  onChange={this.inputHandler}
                />
              </div>
            </div>
          </fieldset>
          <fieldset>
            <legend>Basic Info.</legend>
            <div className={common.row}>
              <div className={common.col_3}>
                <input
                  type="text"
                  placeholder="Asset SN*"
                  name="assetsn"
                  value={assetsn}
                  onChange={this.inputHandler}
                ></input>

                <input
                  type="text"
                  placeholder="Device Model*"
                  name="devicemodel"
                  value={devicemodel}
                  onChange={this.inputHandler}
                ></input>

                <input
                  type="text"
                  placeholder="Asset Unit usage*"
                  name="assetunitusage"
                  value={assetunitusage}
                  onChange={this.inputHandler}
                ></input>

                <select id="asset_tag_select1"></select>
                <span>Rack Monitor</span>

                <input
                  type="text"
                  placeholder="Address*"
                  name="address"
                  value={address}
                  onChange={this.inputHandler}
                ></input>
              </div>

              <div className={common.col_3}>
                <input
                  type="text"
                  placeholder="Data Center*"
                  name="datacenter"
                  value={datacenter}
                  onChange={this.inputHandler}
                ></input>

                <select
                  id="asset_tag_select2"
                  name={floorid}
                  onChange={(this.inputHandler, this.getRackDetails)}
                ></select>
                <span>Floor Name</span>

                <input
                  type="text"
                  placeholder="Rooms*"
                  name="rooms"
                  value={rooms}
                  onChange={this.inputHandler}
                ></input>

                <input
                  type="text"
                  placeholder="Columns*"
                  name="columns"
                  value={columns}
                  onChange={this.inputHandler}
                ></input>

                <input
                  type="text"
                  placeholder="Mac Address"
                  name="macaddr"
                  value={macaddr}
                  onChange={this.inputHandler}
                ></input>
              </div>

              <div className={common.col_3}>
                <input
                  type="text"
                  placeholder="Desctiprtion"
                  name="description"
                  value={description}
                  onChange={this.inputHandler}
                ></input>

                <input
                  type="text"
                  placeholder="Manufacturer"
                  name="manufacturer"
                  value={manufacturer}
                  onChange={this.inputHandler}
                ></input>

                <input
                  type="text"
                  placeholder="Serial Number"
                  name="serialno"
                  value={serialno}
                  onChange={this.inputHandler}
                ></input>

                <input
                  type="text"
                  placeholder="Supplier"
                  name="supplier"
                  value={supplier}
                  onChange={this.inputHandler}
                ></input>

                <input
                  type="text"
                  placeholder="Mac Address2"
                  name="macaddr2"
                  value={macaddr2}
                  onChange={this.inputHandler}
                ></input>
              </div>
            </div>
          </fieldset>
          <fieldset>
            <legend>Pro Info.</legend>
            <div className={common.row}>
              <div className={common.col_3}>
                <input
                  type="text"
                  placeholder="Equipment Category"
                  name="equipmentcategory"
                  value={equipmentcategory}
                  onChange={this.inputHandler}
                ></input>
                <input
                  type="text"
                  placeholder="Life Cycle"
                  name="lifecycle"
                  value={lifecycle}
                  onChange={this.inputHandler}
                ></input>
                <input
                  type="text"
                  placeholder="Maintainence Cycle"
                  name="maintenancecycle"
                  value={maintenancecycle}
                  onChange={this.inputHandler}
                ></input>
                <input
                  type="text"
                  placeholder="Principal"
                  name="pricipal"
                  value={pricipal}
                  onChange={this.inputHandler}
                ></input>
                <input
                  type="text"
                  placeholder="Maintenance Contact"
                  name="maintenancecontact"
                  value={maintenancecontact}
                  onChange={this.inputHandler}
                ></input>
              </div>
              <div className={common.col_3}>
                <input
                  type="number"
                  placeholder="Weight (Kg)"
                  name="weight"
                  value={weight}
                  onChange={this.inputHandler}
                ></input>
                <input
                  type="number"
                  placeholder="Power (W)"
                  name="power"
                  value={power}
                  onChange={this.inputHandler}
                ></input>
                <input
                  type="number"
                  placeholder="Current (A)"
                  name="current"
                  value={current}
                  onChange={this.inputHandler}
                ></input>
                <input
                  type="number"
                  placeholder="Voltage (V)"
                  name="voltage"
                  value={voltage}
                  onChange={this.inputHandler}
                ></input>
                <input
                  type="datetime-local"
                  placeholder="First use time"
                  name="firstusetime"
                  value={firstusetime}
                  onChange={this.inputHandler}
                ></input>
              </div>
              <div className={common.col_3}>
                <input
                  type="text"
                  placeholder="Inventory Code"
                  name="inventorycode"
                  value={inventorycode}
                  onChange={this.inputHandler}
                ></input>
                <input
                  type="text"
                  placeholder="Last Maintenance Staff"
                  name="lastmaintenancestaff"
                  value={lastmaintenancestaff}
                  onChange={this.inputHandler}
                ></input>
                <input
                  type="text"
                  placeholder="Next Maintenance Staff"
                  name="nextmaintenancestaff"
                  value={nextmaintenancestaff}
                  onChange={this.inputHandler}
                ></input>
                <input
                  type="time"
                  placeholder="Last Update time"
                  name="lastupdatedtime"
                  value={lastupdatedtime}
                  onChange={this.inputHandler}
                ></input>
                <input
                  type="time"
                  placeholder="Next Updated time"
                  name="nextupdatedtime"
                  value={nextupdatedtime}
                  onChange={this.inputHandler}
                ></input>
              </div>
            </div>
          </fieldset>

          <div className={common.row}>
            <div className={common.col_3}>
              <input type="submit" value="Submit" />
            </div>
            <div className={common.col_3}>
              <input type="button" value="Remove" onClick={this.removeAsset} />
            </div>
            <div className={common.col_3}>
              <input type="button" value="Update" onClick={this.updateAsset} />
            </div>
          </div>
        </form>

        {this.state.displayModal && (
          <ErrorSuccess
            display={this.state.displayModal}
            success={this.state.success}
            message={this.state.message}
            hideDisplayModal={() => {
              this.setState({
                username: "",
                password: "",
                displayModal: false,
                success: false,
                message: "",
              });
            }}
          />
        )}

        {this.state.forbidden && (
          <Forbidden
            hideForbiddenModal={() => {
              this.setState({ forbidden: false });
              window.location.pathname = "/";
            }}
          ></Forbidden>
        )}
      </Fragment>
    );
  }
}

export default AssetTag;

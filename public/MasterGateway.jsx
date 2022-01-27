import React, { Fragment, PureComponent } from "react";
import { Helmet } from "react-helmet";

import axios from "axios";
import $ from "jquery";
import common from "../../stylings/Main.module.css";

class MasterGateway extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      floorID: "",
      gatewayId: "",
      gatewayId1: "",
      removeTag: false,
      message: "",
      success: false,
      error: false,
    };
  }

  componentDidMount = () => {
    axios({ method: "GET", url: "/api/uploadmap" })
      .then((response) => {
        console.log(response);
        if (response.status === 200 && response.data.length !== 0) {
          for (let i = 0; i < response.data.length; i++) {
            $("#floorname").append(
              "<option value=" +
                response.data[i].id +
                ">" +
                response.data[i].name +
                "</option>"
            );
          }
        } else {
          this.setState({
            success: false,
            error: true,
            message: "No floor map details is found.",
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
        } else {
          this.setState({
            success: false,
            error: true,
            message: "Error occurred. Please try again.",
          });
        }
      });
  };

  inputHandler = (event) => {
    this.setState({ [event.target.name]: event.target.value });
  };

  floorChange = (event) => {
    this.setState({ floorID: event.target.value });
  };

  registerGateway = () => {
    const { floorID, gatewayId } = this.state;
    if (gatewayId && floorID) {
      axios({
        method: "POST",
        url: "/api/gateway/master",
        data: { floorid: floorID, macaddress: gatewayId },
      })
        .then((response) => {
          console.log(response);
          if (response.status === 201) {
            this.setState({
              success: true,
              error: false,
              message: "Master Gateway is registered successfully.",
            });
          } else {
            this.setState({
              success: false,
              error: true,
              message: "Master Gateway is not registered",
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
          } else {
            this.setState({
              success: false,
              error: true,
              message: "Error occurred. Please try again.",
            });
          }
        });
    }
  };

  unregisterGateway = () => {
    const { gatewayId1 } = this.state;
    if (gatewayId1) {
      axios({
        method: "DELETE",
        url: "/api/gateway/master",
        data: { macaddress: gatewayId1 },
      })
        .then((response) => {
          console.log(response);
          if (response.status === 201) {
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
          console.log(error);
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
  };

  render() {
    const { gatewayId, gatewayId1 } = this.state;
    return (
      <Fragment>
        <Helmet>
          <title>Configuration</title>
        </Helmet>

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
        <div className={common.heading}>Master Gateway</div>

        <form
          className="container mt-5"
          style={{ width: "40%" }}
          onSubmit={this.registerGateway}
        >
          <div className="col-xs-4">
            <label className="text-secondary">Floor Name *</label>
            <select
              className="form-select bg-light text-dark border border-secondary"
              id="floorname"
              onChange={this.floorChange}
            ></select>
          </div>

          <div className="col-xs-4">
            <label className="text-secondary">Master Gateway *</label>
            <input
              type="text"
              name="gatewayId"
              value={gatewayId}
              onChange={this.inputHandler}
              className="form-control bg-light text-dark border border-secondary"
              required
            />
          </div>

          {/* form submit button */}
          <div className="col-xs-4 my-4">
            <div className="text-center">
              <input
                type="submit"
                className="form-control btn btn-primary"
                value="Register Gateway"
              />
            </div>
          </div>

          <div className="col-xs-4 my-4">
            <div className="text-center">
              <input
                type="button"
                onClick={() =>
                  this.setState({ removeTag: !this.state.removeTag })
                }
                className="form-control btn btn-primary"
                value="Remove Gateway"
              />
            </div>
          </div>
        </form>
      </Fragment>
    );
  }
}

export default MasterGateway;

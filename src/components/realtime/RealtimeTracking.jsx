import React, { Component, Fragment } from 'react'
import $ from 'jquery';
import axios from 'axios';
import common from '../../styling/common.module.css';
import Chart from 'chart.js/auto'


export default class RealtimeTracking extends Component {
   constructor(props) {
      super(props);
      this.state = {
         floorID: "",
         floorName: "",
         floorDetails: [],
         floorImg: "",
         message: "",
         success: false,
         error: false,
         pix: 80,
         loading: false,
         rackcolor: '',
      }
   }

   componentDidMount() {
      const { pix } = this.state;
      axios({ method: "GET", url: "/api/uploadmap" })
         .then((response) => {
            let data = response.data;
            console.log('=====', data);
            this.setState({ floorDetails: data });
            if (data.length !== 0 && response.status === 200) {
               for (let i = 0; i < data.length; i++) {
                  $("#floorName").append(
                     "<option value=" + data[i].id + ">" + data[i].name + "</option>"
                  )
               }
               this.setState({ floorImg: data[0].image })
               let img = document.createElement("img");
               $(img).attr("src", data[0].image);
               $(img).attr("alt", "");
               $(img).attr("style", "width: 100%; height: 100%;");
               $("#tracking").css("width", pix * data[0].width);
               $("#tracking").css("height", pix * data[0].height);
               $("#tracking").css("position", "relative");
               $("#tracking").append(img);

               this.rackDetails();
               this.sensors();
               this.interval = setInterval(() => {
                  $('#tracking > div').remove();
                  this.rackDetails();
                  this.sensors();
               }, 15 * 1000);


            } else {
               this.setState({ message: "No floor map details is found.", error: true })
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
         })
   }

   rackDetails = async () => {
      console.log('<===========RackDetails===>');
      $("#rack_assets").css("display", "none");
      $("#daily_sensor").css("display", "none");
      const { pix } = this.state;
      let floorId = $("#floorName").val();
      axios({ method: "GET", url: "/api/rack?floorid=" + floorId })
         .then((response) => {
            let data = response.data;
            console.log('Response===>', response)
            if (data.length !== 0 && response.status === 200) {
               for (let i = 0; i < data.length; i++) {
                  let div = document.createElement("div");
                  $(div).css("position", "absolute");
                  $(div).attr("id", data[i].macid);
                  $(div).css("left", pix * data[i].x)
                  $(div).css("top", pix * data[i].y)
                  $(div).css("width", pix * (data[i].x1 - data[i].x))
                  $(div).css("height", pix * (data[i].y1 - data[i].y))
                  this.rackMouseHoverData(data[i].macid, floorId, 'colorchange');

                  // this.interval = setInterval(() => {
                  //    this.rackMouseHoverData(data[i].macid, floorId, 'colorchange');
                  // }, 15 * 1000);
                  // $(div).css("background-color", "rgba(82, 202, 82, 0.78)")
                  $(div).css("cursor", "pointer");

                  // Mouse Hover using Display the Rack Details
                  $(div).mouseover(() => this.rackMouseHoverData(data[i].macid, floorId, 'mousehover'))

                  // Whenever click Particular Rack Displaying Assets Details Table.
                  $(div).on("click", () => {
                     $("#assetId").empty();
                     $("#assetId").text(data[i].macid);
                     this.underRackDetails(data[i].id);
                  })

                  $("#tracking").append(div);
               }
            }
         })
         .catch((error) => {
            console.log('Error====>', error);
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
                  message: "Error occurred on Rack details Please try again.",
               });
            }
         })
   }

   underRackDetails = (rackId) => {
      $("#rack_assets").css("display", "block");
      $("#rack_assets  tbody").empty();

      axios({ method: "POST", url: "/api/asset/racktracking", data: { id: rackId } })
         .then((response) => {
            console.log('UnderRackDetails Response===>', response.data)
            const data = response.data.health;
            if (data.length !== 0 && response.status === 200) {
               for (let i = 0; i < data.length; i++) {
                  $("#rack_assets  tbody").append(
                     "<tr><td>" + (i + 1) + "</td>" +
                     "<td>" + data[i].tagid + "</td>" +
                     "<td>" + data[i].usage + "</td>" +
                     "<td>" + data[i].weight + "</td>" +
                     "<td>" + data[i].voltage + "</td>" +
                     "<td>" + data[i].current + "</td>" +
                     "<td>" + data[i].battery + "</td>" +
                     "<td>" + data[i].lastseen.substring(0, 19).replace("T", " ") + "</td></tr>"
                  )
               }

            }
         })
         .catch((error) => {
            console.log('UnderRackDetails Error===>', error)
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
                  message: "Error occurred on UnderRack Details Please try again.",
               });
            }
         })
   }

   sensors = () => {
      const { pix } = this.state;
      let floorID = $("#floorName").val()

      axios({ method: "GET", url: "/api/sensor/temphumidity?floorid=" + floorID })
         .then((response) => {
            console.log("Sensor Response===>", response)
            const data = response.data;
            if (data.length !== 0 && response.status === 200) {
               for (let i = 0; i < data.length; i++) {
                  let div = document.createElement("div")
                  $(div).attr("id", data[i].macid);
                  $(div).css("position", "absolute");
                  $(div).css("width", "12px");
                  $(div).css("height", "12px");
                  $(div).css("border-radius", "12px");
                  $(div).css("background-color", "rgba(0, 43, 255, 0.9)");
                  if (data[i].position === "FT") {
                     $(div).css("left", pix * data[i].rackid.x);
                     $(div).css("top", pix * data[i].rackid.y);
                  } else if (data[i].position === "FM") {
                     $(div).css("left", pix * data[i].rackid.x);
                     $(div).css("top", (pix * ((data[i].rackid.y + data[i].rackid.y1) / 2)) - 4);
                  } else if (data[i].position === "FB") {
                     $(div).css("left", pix * data[i].rackid.x);
                     $(div).css("top", pix * data[i].rackid.y1 - 15);
                  } else if (data[i].position === "RT") {
                     $(div).css("left", pix * data[i].rackid.x1);
                     $(div).css("top", pix * data[i].rackid.y);
                  } else if (data[i].position === "RM") {
                     $(div).css("left", pix * data[i].rackid.x1);
                     $(div).css("top", (pix * ((data[i].rackid.y + data[i].rackid.y1) / 2)) - 4);
                  } else if (data[i].position === "RB") {
                     $(div).css("left", pix * data[i].rackid.x1);
                     $(div).css("top", pix * data[i].rackid.y1 - 15);
                  }

                  $(div).css("cursor", "pointer");
                  $(div).mouseover(function () {
                     $("#" + data[i].macid).attr({
                        "title":
                           "Sensor ID : " + data[i].macid +
                           "\nPosition : " + data[i].position
                     })
                  })

                  $(div).on("click", () => {
                     this.dailyTempHumiData(data[i].macid);
                  })

                  $("#tracking").append(div);
               }
            }
         })
         .catch((error) => {
            console.log("Sensor Error===>", error)
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
                  message: "Error occurred on Sensors. Please try again.",
               });
            }
         })
   }

   dailyTempHumiData = (macid) => {
      $("#rack_assets").css("display", "none");
      $("#daily_sensor").css("display", "none");
      this.setState({ loading: true })
      console.log("Daily TempHeumi Data MACID=--->", macid);
      axios({ method: "POST", url: "/api/sensor/dailydata?macaddress=" + macid })
         .then((response) => {
            const data = response.data;
            if (data.length !== 0 && response.status === 200) {
               var lbl = [],
                  tempData = [],
                  humidData = [];
               var ct = 1;
               if (data.length > 100) {
                  ct = Math.ceil(data.length / 100);
               }
               for (let i = 0; i < data.length; i = i + ct) {
                  lbl.push(data[i].timestamp.substring(11, 19));
                  tempData.push(data[i].temperature);
                  humidData.push(data[i].humidity);
               }
               $("#daily_sensor").css("display", "block");
               $("#chartID").text(macid);
               if ($("#daily_chart").children().length !== 0)
                  $("#tempChart").remove();
               var cnvs = document.createElement("canvas");
               $(cnvs).attr("id", "tempChart");
               $(cnvs).attr("width", "50px");
               $(cnvs).attr("height", "20px");
               $("#daily_chart").append(cnvs);
               // chart displaying code
               const tempChart = $("#tempChart");
               new Chart(tempChart, {
                  type: "line",
                  data: {
                     //Bring in data
                     labels: lbl,
                     datasets: [
                        {
                           label: "Temperature",
                           data: tempData,
                           backgroundColor: "red",
                           borderColor: "red",
                           borderWidth: 2,
                           pointRadius: 0.5,
                           lineTension: 0.4,
                        },
                        {
                           label: "Humidity",
                           data: humidData,
                           backgroundColor: "green",
                           borderColor: "green",
                           borderWidth: 2,
                           pointRadius: 0.5,
                           lineTension: 0.4,
                        },
                     ],
                  },
                  options: {
                     responsive: true,
                     scales: {
                        xAxes: [{ ticks: { display: true } }],
                        yAxes: [{ ticks: { beginAtZero: true, min: 0, stepSize: 50 } }],
                     },
                     plugins: {
                        legend: {
                           display: true,
                           position: "right",
                           fontSize: 35,
                        },
                     },
                  },
               });
               this.setState({ loading: false });
            } else {
               alert("No daily temperature and humidity on MACID : " + macid);
               this.setState({ loading: false });
            }
         })
         .catch((error) => {
            console.log("Daily TempHeumi Error====>", error);
            if (error.response.status === 403) {
               this.setState({
                  success: false,
                  error: true,
                  loading: false,
                  message: "User session had timed out. Please login again.",
               });
            } else if (error.response.status === 400 || error.response.status === 404) {
               this.setState({
                  success: false,
                  error: true,
                  loading: false,
                  message: "No Data Found.",
               });
            } else {
               this.setState({
                  success: false,
                  error: true,
                  loading: false,
                  message: "Error occurred on daily temperature and humidity. Please try again.",
               });
            }
         })
   }

   rackMouseHoverData = async (macid, floorId, rackcolor) => {
      console.log(macid, '<=========RackMouseHoverData=========>', floorId, rackcolor);
      await axios({ method: "GET", url: "/api/monitor?id=" + floorId })
         .then((response) => {
            let rack = response.data.asset;
            if (rack.length !== 0 && response.status === 200) {

               for (let j = 0; j < rack.length; j++) {
                  if (rackcolor === 'mousehover') {
                     console.log("Rack Mouse Hover Response===>Mouse Hover", response);
                     if (macid === rack[j].rack) {
                        $("#" + macid).attr({
                           "title":
                              "Rack ID: " + rack[j].rack +
                              "\nCapacity: " + rack[j].capacity +
                              "\nCount :" + rack[j].count +
                              "\nOccupancy :" + rack[j].usage
                        })
                     }
                  } else {
                     console.log("Rack Mouse Hover Response===>colorchange");
                     if (macid === rack[j].rack) {
                        if (rack[j].count === 0) {
                           $("#" + macid).css('background-color', '#313531c7')
                        } else if (rack[j].count === 1) {
                           $("#" + macid).css('background-color', '#23bb23c7')
                        } else if (rack[j].count === 2) {
                           $("#" + macid).css('background-color', '#b53b4bc7')
                        } else if (rack[j].count === 3) {
                           $("#" + macid).css('background-color', '#3bb5aac7')
                        } else if (rack[j].count === 4) {
                           $("#" + macid).css('background-color', '#f5c310e0')
                        } else if (rack[j].count === 5) {
                           $("#" + macid).css('background-color', '#f51010cc')
                        }
                     }
                  }
               }
            }
         })
         .catch((error) => {
            console.log("Rack Mouse Hover Error", error);
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
                  message: "Error occurred on Rack mousehover Please try again.",
               });
            }
         })
   }

   componentWillUnmount() {
      clearInterval(this.interval);
   }

   render() {
      const { rackcolor } = this.state;
      return (
         <Fragment>
            <div className="container">

               <p className={common.header}>REALTIME STATUS</p>
               {this.state.error && (
                  <div
                     className="alert alert-danger border-0 rounded-0"
                     style={{ zIndex: "-1" }}
                  >
                     <strong>Error!</strong> {this.state.message}
                  </div>
               )}

               <div className="col-sm-3 mt-4">
                  <label className="text-secondary" style={{ fontSize: '20px' }}>Floor Name *</label>
                  <select
                     className="form-select bg-light text-dark border border-secondary"
                     id="floorName"
                     onChange={this.changeFloor}
                  ></select>
               </div>

               <div id="tracking"></div>

               <div id="rack_assets" style={{ display: "none" }}>
                  <p style={{ fontSize: '25px', marginTop: '10px', fontWeight: 'bold' }}>
                     Asset Details for Rack : <span id="assetId"></span>
                  </p>
                  <table className="table table-dark mt-4 text-center">
                     <thead>
                        <tr>
                           <th>Sl.NO.</th>
                           <th>TAG ID</th>
                           <th>USAGE</th>
                           <th>WEIGHT</th>
                           <th>VOLTAGE</th>
                           <th>CURRENT</th>
                           <th>BATTERY</th>
                           <th>LASTSEEN</th>
                        </tr>
                     </thead>
                     <tbody></tbody>
                  </table>
               </div>

               <div id="daily_sensor" style={{ display: "none" }}>
                  <p style={{ fontSize: '25px', marginTop: '10px', fontWeight: 'bold' }}>
                     Thermal Map for Sensor :<span id="chartID"></span>
                  </p>

                  <div id="daily_chart"></div>
               </div>
            </div>

            {
               this.state.loading && (
                  <div className={common.spinner}>
                     <div className="text-center">
                        <div className="spinner-border"
                           style={{ color: 'red', width: '50px', height: "50px" }}
                           role="status">
                        </div>
                        <p style={{
                           fontSize: '20px', fontWeight: 'bold',
                           paddingTop: '10px', paddingLeft: '10px', color: 'red'
                        }}>Please Wait...</p>
                     </div>
                  </div>
               )
            }

         </Fragment>
      )
   }
}

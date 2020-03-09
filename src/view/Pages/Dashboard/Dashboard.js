import React, { Component } from "react";
import { Chart } from "react-charts"
import BarChart from 'react-bar-chart';
import Sidebar from "../../Components/Sidebar";
import Footer from "../../Components/Footer";
import SearchBar from "../../Components/SearchBar";
import Header from "../../Components/Header";
import ReactApexChart from "react-apexcharts";
import { SEARCH_DATA, ALL_ASSETS } from '../../Graphql/dashboard';
import {VERIFYTOKEN} from '../../Graphql/auth';
import { ALL_VUL_LIST, TOP_MANUFACTURER, TOP_DEVICETYPE, TOP_MOSTACTIVE,TOP_MOSTPASSIVE } from '../../Graphql/scan';

class Dashboard extends Component {
   constructor(props) {
      super(props);
      this.state = {
         allAssets: [],
         allVulList: [],
         searchlist: [],
         macAddressCount: 0,
         vulcount: 0,
         outdateCount: 0,
         discontinuedCount: 0,
         series_device_type: [{
            data: []
         }],
         options_device_type: {
            chart: {
               type: 'bar',
               height: "auto",
               foreColor: '#fff',
               toolbar: {
                  show: false
               }
            },
            plotOptions: {
               bar: {
                  horizontal: true,
               }
            },
            dataLabels: {
               enabled: false
            },
            xaxis: {
               categories: [],
               tickAmount: 6,
               max: 50
            },
            tooltip: {
               enabled: false,
            }
         },
         series_device_manufacture: [
            {
               data: []
            }
         ],
         options_device_manufacture: {
            chart: {
               type: 'bar',
               height: "auto",
               foreColor: '#fff',
               toolbar: {
                  show: false
               }
            },
            plotOptions: {
               bar: {
                  horizontal: true,
               }
            },
            dataLabels: {
               enabled: false
            },
            xaxis: {
               categories: [],
               tickAmount: 6,
               max: 100
            },
            tooltip: {
               enabled: false,
            }
         },
         series_activescan: [{
            name: "High",
            data: []
         }, {
            name: 'Medium',
            data: []
         }, {
            name: 'Critical',
            data: []
         }],
         options_activescan: {
            theme: {
               palette: 'palette8',
            },
            chart: {
               type: 'bar',
               height: "auto",
               foreColor: '#fff',
               toolbar: {
                  show: false
               }
            },
            plotOptions: {
               bar: {
                  horizontal: false,
                  columnWidth: '60%',
                  // endingShape: 'rounded'
               },
            },
            dataLabels: {
               enabled: false,
            },
            stroke: {
               show: true,
               width: 0,
               // colors: ['transparent']
            },
            xaxis: {
               categories: [],
               labels: {
                  style: {
                     colors: ["#fff", "#fff", "#fff", "#fff", "#fff", "#fff", "#fff", "#fff", "#fff"]
                  },
               },
            },
            yaxis: {
               tickAmount: 5,
               max: 10,
               title: {
                  text: 'Serverity Score(Quantity)',
                  style: {
                     color: "#fff",
                     fontSize: "15px"
                  }
               }
            },
            fill: {
               opacity: 1,
            },
            tooltip: {
               enabled: false,
            }
         },
         series_firmwarescan: [],
         options_firmwarescan: {
            theme: {
               palette: 'palette2',
            },
            chart: {
               type: 'bar',
               height: "auto",
               foreColor: '#fff',
               toolbar: {
                  show: false
               }
            },
            plotOptions: {
               bar: {
                  horizontal: false,
                  columnWidth: '60%',
                  // endingShape: 'rounded'
               },
            },
            dataLabels: {
               enabled: false,
            },
            stroke: {
               show: true,
               width: 0,
               // colors: ['transparent']
            },
            xaxis: {
               categories: [],
               labels: {
                  style: {
                     colors: ["#fff", "#fff", "#fff", "#fff", "#fff", "#fff", "#fff", "#fff", "#fff"]
                  },
               },
            },
            yaxis: {
               tickAmount: 5,
               max: 10,
               title: {
                  text: 'Serverity Score(Quantity)',
                  style: {
                     color: "#fff",
                     fontSize: "15px"
                  }
               }
            },
            fill: {
               opacity: 1,
            },
            tooltip: {
               enabled: false,
            }
         },
         series_passivescan: [],
         options_passivescan: {
            theme: {
               palette: 'palette1',
            },
            chart: {
               type: 'bar',
               height: "auto",
               foreColor: '#fff',
               toolbar: {
                  show: false
               }
            },
            plotOptions: {
               bar: {
                  horizontal: false,
                  columnWidth: '60%',
               },
            },
            dataLabels: {
               enabled: false,
            },
            stroke: {
               show: true,
               width: 0,
            },
            xaxis: {
               categories: [],
               labels: {
                  style: {
                     colors: ["#fff", "#fff", "#fff", "#fff", "#fff", "#fff", "#fff", "#fff", "#fff"]
                  },
               },
            },
            yaxis: {
               tickAmount: 5,
               max: 10,
               title: {
                  text: 'Serverity Score(Quantity)',
                  style: {
                     color: "#fff",
                     fontSize: "15px"
                  }
               }
            },
            fill: {
               opacity: 1,
            },
            tooltip: {
               enabled: false,
            }
         },
         series_trend: [
         ],
         options_trend: {
            chart: {
               height: "auto",
               foreColor: '#fff',
               toolbar: {
                  show: false
               },
            },
            stroke: {
               width: [5, 7, 5],
               curve: 'straight',
               dashArray: [0, 8, 5]
            },
            yaxis: {
               tickAmount: 8,
               max: 10,
            },
            xaxis: {
               categories: ['01 Jan', '02 Jan', '03 Jan', '04 Jan', '05 Jan', '06 Jan', '07 Jan', '08 Jan', '09 Jan',
                  '10 Jan', '11 Jan', '12 Jan'
               ],
            },
            tooltip: {
               enabled: false,
            }
         }
      }
   }
   componentDidMount() {
      let islogin = localStorage.getItem("islogin");
      if (!islogin) {
         this.props.history.push('/login');
      }
      let client = this.props.client;
      this.getTopManufacturer();
      this.getTopDeviceType();
      this.getMostActiveScan();
      this.getPassvieScan();
      client.mutate({mutation: VERIFYTOKEN, variables:{token: localStorage.getItem('tokenAuth')}}).then((result) => {
         localStorage.setItem("username", result.data.verifyToken.payload.username);
      }).catch((error) => console.log(error));
   }
   getPassvieScan(){
      let client = this.props.client;
      let _mostPassiveList = [];
      let HighScore = [];
      let MediumScore = [];
      let CriticalScore = [];
      client.query({ query: TOP_MOSTPASSIVE, variables:{username: localStorage.getItem('username')}}).then((result) => {
         result.data.getPassivescan.map((item, index) => {
            let itemOne = [];
            let ipAddress = item.ipAddress;
            let iparray = ipAddress.split(".");
            let _realIp = "";
            iparray.map((d) => {
               _realIp = _realIp + parseInt(d) + ".";
            });
            _realIp = _realIp.substring(0, _realIp.length - 1);
            itemOne.push(_realIp);
            itemOne.push(item.manufacturer);
            itemOne.push(item.model);
            _mostPassiveList.push(itemOne);
            let cvss = 0;
            let m = 0;
            let h = 0;
            let c = 0;
            let count = 0;
            item.assetVulnerabilitesSet.map((i) => {
               count++;
               let cvss = i.vulid.cvss;
               if (cvss >= 4 && cvss <= 6.9) { m = (m + cvss) / count }
               if (cvss >= 7 && cvss <= 8.9) { h = (h + cvss) / count }
               if (cvss >= 9 && cvss <= 10) { c = (c + cvss) / count }
            });
            MediumScore.push(m);
            HighScore.push(h);
            CriticalScore.push(c);
         });
         this.setState({
            series_passivescan: [{
               name: "High",
               data: HighScore
            }, {
               name: 'Medium',
               data: MediumScore
            }, {
               name: 'Critical',
               data: CriticalScore
            }]
         })
         this.setState({
            options_passivescan: {
               ...this.state.options_passivescan,
               xaxis: {
                  categories: _mostPassiveList
               }
            }
         });
      }).catch((error) => {
         console.log(error);
      });
   }
   getMostActiveScan() {
      let client = this.props.client;
      let _mostActiveList = [];
      let HighScore = [];
      let MediumScore = [];
      let CriticalScore = [];
      client.query({ query: TOP_MOSTACTIVE, variables:{username: localStorage.getItem('username')} }).then((result) => {
         result.data.getMostactivescan.map((item, index) => {
            let itemOne = [];
            let ipAddress = item.ipAddress;
            let iparray = ipAddress.split(".");
            let _realIp = "";
            iparray.map((d) => {
               _realIp = _realIp + parseInt(d) + ".";
            });
            _realIp = _realIp.substring(0, _realIp.length - 1);
            itemOne.push(_realIp);
            itemOne.push(item.manufacturer);
            itemOne.push(item.model);
            _mostActiveList.push(itemOne);
            let cvss = 0;
            let m = 0;
            let h = 0;
            let c = 0;
            let count = 0;
            item.assetOvVulnerabilitesSet.map((i) => {
               count++;
               let cvss = i.ovid.severity;
               if (cvss >= 4 && cvss <= 6.9) { m = (m + cvss) / count }
               if (cvss >= 7 && cvss <= 8.9) { h = (h + cvss) / count }
               if (cvss >= 9 && cvss <= 10) { c = (c + cvss) / count }
            });
            MediumScore.push(m);
            HighScore.push(h);
            CriticalScore.push(c);
         });
         this.setState({
            series_activescan: [{
               name: "High",
               data: HighScore
            }, {
               name: 'Medium',
               data: MediumScore
            }, {
               name: 'Critical',
               data: CriticalScore
            }]
         })
         this.setState({
            options_activescan: {
               ...this.state.options_activescan,
               xaxis: {
                  categories: _mostActiveList
               }
            }
         });
      }).catch((error) => {
         console.log(error);
      });
   }
   getTopDeviceType() {
      let client = this.props.client;
      let _topDeviceTypeList = [];
      let _series = [];
      let _categories = [];
      const { series_device_type } = this.state;
      client.query({ query: TOP_DEVICETYPE ,variables:{username: localStorage.getItem('username')}}).then((result) => {
         _topDeviceTypeList = result.data.getTopdevicetype;
         _topDeviceTypeList.map((data) => {
            _series.push(data.count);
            _categories.push(data.name);
         });
         series_device_type[0].data = _series;
         this.setState({ series_device_type: series_device_type });
         this.setState({
            options_device_type: {
               ...this.state.options_device_type,
               xaxis: {
                  categories: _categories
               }
            }
         });
      }).catch((error) => {
         console.log(error);
      });
   }
   getTopManufacturer() {
      let client = this.props.client;
      let _topManufacturerList = [];
      let _series = [];
      let _categories = [];
      const { series_device_manufacture } = this.state;
      client.query({ query: TOP_MANUFACTURER, variables:{username: localStorage.getItem('username')}}).then((result) => {
         _topManufacturerList = result.data.getTopmanufacturetype;
         _topManufacturerList.map((data) => {
            _series.push(data.count);
            _categories.push(data.manufacturer);
         });
         series_device_manufacture[0].data = _series;
         this.setState({ series_device_manufacture: series_device_manufacture });
         this.setState({
            options_device_manufacture: {
               ...this.state.options_device_manufacture,
               xaxis: {
                  categories: _categories
               }
            }
         });
      }).catch((error) => {
         console.log(error);
      });
   }
   trend() {
      const { allAssets } = this.state;
      let vulnerCount = [9, 5, 3];
      let outDateCount = [8, 3, 2];
      let DiscontineudCount = [7, 2, 6];
      let v = 0;
      let o = 0;
      let d = 0;
      allAssets.map((data) => {
         if (data.assetVulnerabilitesSet.length != 0) {
            v = v + 1;
         }
         if (data.outdated == true) {
            o = o + 1;
         }
         if (data.discontinued == true) {
            d = d + 1;
         }
      });
      vulnerCount.push(v);
      outDateCount.push(o);
      DiscontineudCount.push(d);
      this.setState({
         series_trend: [{
            name: "Vulnerable devices",
            data: vulnerCount
         }, {
            name: "Outdated devices",
            data: outDateCount
         }, {
            name: 'Discontinued devices',
            data: DiscontineudCount
         }]
      });
   }
   mostFirmwareScan() {
      const { allAssets, allVulList } = this.state
      let HighScore = [];
      let MediumScore = [];
      let CriticalScore = [];
      let ItemList = [];
      allAssets.map((asset) => {
         if (asset.assetFirmwaredetailSet.length != 0) {
            let manufacturer = asset.manufacturer;
            let ipAddress = asset.ipAddress;
            let iparray = ipAddress.split(".");
            let _realIp = "";
            iparray.map((item) => {
               _realIp = _realIp + parseInt(item) + ".";
            });
            _realIp = _realIp.substring(0, _realIp.length - 1);
            let model = asset.model;
            let itemOne = [];
            itemOne.push(_realIp);
            itemOne.push(manufacturer);
            itemOne.push(model);
            ItemList.push(itemOne);
            let firmwareDetailList = asset.assetFirmwaredetailSet;
            let m = 0;
            let h = 0;
            let c = 0;
            firmwareDetailList.map((firmwareDetail) => {
               let vulner = firmwareDetail.fdetailid.vulnerabilities;
               allVulList.map((vul) => {

                  if (vul.cveid == vulner) {
                     let cvss = vul.cvss;
                     if (cvss > 4 && cvss < 6.9) { m = m + cvss }
                     if (cvss > 7 && cvss < 8.9) { h = h + cvss }
                     if (cvss > 9 && cvss < 10) { c = c + cvss }
                  }
               });
            });
            MediumScore.push(m);
            HighScore.push(h);
            CriticalScore.push(c);
         }
      });
      this.setState({
         series_firmwarescan: [{
            name: "High",
            data: HighScore
         }, {
            name: 'Medium',
            data: MediumScore
         }, {
            name: 'Critical',
            data: CriticalScore
         }]
      })
      this.setState({
         options_firmwarescan: {
            ...this.state.options_passivescan,
            xaxis: {
               categories: ItemList
            }
         }
      });
   }
   mostPassiveScan() {
      const { allAssets } = this.state
      let HighScore = [];
      let MediumScore = [];
      let CriticalScore = [];
      let ItemList = [];
      allAssets.map((asset) => {
         if (asset.assetVulnerabilitesSet.length != 0) {
            let manufacturer = asset.manufacturer;
            let ipAddress = asset.ipAddress;
            let iparray = ipAddress.split(".");
            let _realIp = "";
            iparray.map((item) => {
               _realIp = _realIp + parseInt(item) + ".";
            });
            _realIp = _realIp.substring(0, _realIp.length - 1);
            let model = asset.model;
            let itemOne = [];
            itemOne.push(_realIp);
            itemOne.push(manufacturer);
            itemOne.push(model);
            ItemList.push(itemOne);
            let vulidList = asset.assetVulnerabilitesSet;
            let m = 0;
            let h = 0;
            let c = 0;
            vulidList.map((vul) => {
               let cvss = vul.vulid.cvss;
               if (cvss > 4 && cvss < 6.9) { m = m + cvss }
               if (cvss > 7 && cvss < 8.9) { h = h + cvss }
               if (cvss > 9 && cvss < 10) { c = c + cvss }

            });
            MediumScore.push(m);
            HighScore.push(h);
            CriticalScore.push(c);
         }
      });
      //value get part using cvss
      this.setState({
         series_passivescan: [{
            name: "High",
            data: HighScore
         }, {
            name: 'Medium',
            data: MediumScore
         }, {
            name: 'Critical',
            data: CriticalScore
         }]
      })
      this.setState({
         options_passivescan: {
            ...this.state.options_passivescan,
            xaxis: {
               categories: ItemList
            }
         }
      });
   }
   mostActiveScan() {
      const { allAssets } = this.state
      let HighScore = [];
      let MediumScore = [];
      let CriticalScore = [];
      let ItemList = [];
      allAssets.map((asset) => {
         if (asset.assetVulnerabilitesSet.length != 0) {
            let manufacturer = asset.manufacturer;
            let ipAddress = asset.ipAddress;
            let iparray = ipAddress.split(".");
            let _realIp = "";
            iparray.map((item) => {
               _realIp = _realIp + parseInt(item) + ".";
            });
            _realIp = _realIp.substring(0, _realIp.length - 1);
            let model = asset.model;
            let itemOne = [];
            itemOne.push(_realIp);
            itemOne.push(manufacturer);
            itemOne.push(model);
            ItemList.push(itemOne);
            let vulidList = asset.assetVulnerabilitesSet;
            let m = 0;
            let h = 0;
            let c = 0;
            vulidList.map((vul) => {
               let cvss = vul.vulid.cvss;
               if (cvss > 4 && cvss < 6.9) { m = m + cvss }
               if (cvss > 7 && cvss < 8.9) { h = h + cvss }
               if (cvss > 9 && cvss < 10) { c = c + cvss }

            });
            MediumScore.push(m);
            HighScore.push(h);
            CriticalScore.push(c);
         }
      });
      //value get part using cvss
      this.setState({
         series_activescan: [{
            name: "High",
            data: HighScore
         }, {
            name: 'Medium',
            data: MediumScore
         }, {
            name: 'Critical',
            data: CriticalScore
         }]
      })
      //This is the bottom option value setting part.
      this.setState({
         options_activescan: {
            ...this.state.options_activescan,
            xaxis: {
               categories: ItemList
            }
         }
      });
   }
   onSubmit = (searchInfo) => {
      const client = this.props.client;
      let { searchlist } = this.state;
      client.query({ query: SEARCH_DATA, variables: { data: JSON.stringify(searchInfo) } })
         .then((result) => {
            searchlist = result.data.getGetinfo;
            let macCount = 0;
            let vulCnt = 0;
            let outCnt = 0;
            let disCnt = 0;
            searchlist.map((data) => {
               if (data.macAddress != "") { macCount++ }
               if (data.assetVulnerabilitesSet.length != 0) { vulCnt++ }
               if (data.outdated == true) { outCnt++ }
               if (data.discontinued == true) { disCnt++ }
            });
            this.setState({ macAddressCount: macCount, vulcount: vulCnt, outdateCount: outCnt, discontinuedCount: disCnt });
         }).catch((error) => console.log(error));
   }
   render() {
      let pathname = this.props.location.pathname;
      return (
         <>
            <Sidebar pathname={pathname} />
            <SearchBar event={this.onSubmit} />
            <div className="content-wrapper">
               <div className="container-fluid">
                  <div className="card mt-3">
                     <div className="card-content">
                        <div className="row row-group m-0">
                           <div className="col-12 col-lg-6 col-xl-3 border-light">
                              <div className="card-body">
                                 <div className="my-3">
                                    <h2 className="text-center text-white mb-0">{this.state.macAddressCount}<span className="float-right"></span></h2>
                                 </div>
                                 <p className="text-center mb-0 text-white small-font">Device box<span className="float-right"></span></p>
                              </div>
                           </div>
                           <div className="col-12 col-lg-6 col-xl-3 border-light">
                              <div className="card-body">
                                 <div className="my-3">
                                    <h2 className="text-center text-white mb-0">{this.state.vulcount}<span className="float-right"></span></h2>
                                 </div>
                                 <p className="text-center mb-0 text-white small-font">Vulnerable devices box<span className="float-right"></span></p>
                              </div>
                           </div>
                           <div className="col-12 col-lg-6 col-xl-3 border-light">
                              <div className="card-body">
                                 <div className="my-3">
                                    <h2 className="text-center text-white mb-0">{this.state.outdateCount}<span className="float-right"></span></h2>
                                 </div>
                                 <p className="text-center mb-0 text-white small-font">Outdated devices box<span className="float-right"></span></p>
                              </div>
                           </div>
                           <div className="col-12 col-lg-6 col-xl-3 border-light">
                              <div className="card-body">
                                 <div className="my-3">
                                    <h2 className="text-center text-white mb-0">{this.state.discontinuedCount}<span className="float-right"></span></h2>
                                 </div>
                                 <p className="text-center mb-0 text-white small-font">Discontinued devices box<span className="float-right"></span></p>
                              </div>
                           </div>
                        </div>
                     </div>
                  </div>
                  <div className="row">
                     <div className="col-12 col-lg-12 col-xl-12">
                        <div className="card" style={{ minHeight: '500px' }}>
                           <div className="card-header">Most Vulnerable Devices (Active Scan)
                           </div>
                           <div className="card-body">
                              <div className="chart-container-1">
                                 {/* <canvas id="barChart"></canvas> */}
                                 {/* <Chart data={this.state.data} axes={this.state.axes} /> */}
                                 <ReactApexChart options={this.state.options_activescan} series={this.state.series_activescan} type="bar" height={400} />
                              </div>
                           </div>

                        </div>
                     </div>
                  </div>
                  <div className="row">
                     <div className="col-12 col-lg-12 col-xl-12">
                        <div className="card" style={{ minHeight: '500px' }}>
                           <div className="card-header">Most Vulnerable Devices (Firmware Scan)
                           </div>
                           <div className="card-body">
                              <div className="chart-container-1">
                                 {/* <canvas id="barChart"></canvas> */}
                                 {/* <Chart data={this.state.data} axes={this.state.axes} /> */}
                                 <ReactApexChart options={this.state.options_firmwarescan} series={this.state.series_firmwarescan} type="bar" height={400} />
                              </div>
                           </div>

                        </div>
                     </div>
                  </div>
                  <div className="row">
                     <div className="col-12 col-lg-12 col-xl-12">
                        <div className="card" style={{ minHeight: '500px' }}>
                           <div className="card-header">Most Vulnerable Devices (Passive Scan)
                           </div>
                           <div className="card-body">
                              <div className="chart-container-1">
                                 {/* <canvas id="barChart"></canvas> */}
                                 {/* <Chart data={this.state.data} axes={this.state.axes} /> */}
                                 <ReactApexChart options={this.state.options_passivescan} series={this.state.series_passivescan} type="bar" height={400} />
                              </div>
                           </div>

                        </div>
                     </div>
                  </div>
                  <div className="row">
                     <div className="col-6 col-lg-6 col-xl-6">
                        <div className="card" style={{ minHeight: '500px' }}>
                           <div className="card-header">Device Manufactures
                           </div>
                           <div className="card-body">
                              <div className="chart-container-1">
                                 {/* <canvas id="barChart"></canvas> */}
                                 {/* <Chart data={this.state.data} axes={this.state.axes} /> */}
                                 <ReactApexChart options={this.state.options_device_manufacture} series={this.state.series_device_manufacture} type="bar" height={400} />
                              </div>
                           </div>

                        </div>
                     </div>
                     <div className="col-6 col-lg-6 col-xl-6">
                        <div className="card" style={{ minHeight: '500px' }}>
                           <div className="card-header">Device Types
                           </div>
                           <div className="card-body">
                              <div className="chart-container-1">
                                 {/* <canvas id="barChart"></canvas> */}
                                 {/* <Chart data={this.state.data} axes={this.state.axes} /> */}
                                 <ReactApexChart options={this.state.options_device_type} series={this.state.series_device_type} type="bar" height={400} />
                              </div>
                           </div>
                        </div>
                     </div>
                  </div>
                  <div className="row">
                     <div className="col-12 col-lg-12 col-xl-12">
                        <div className="card" style={{ minHeight: '500px' }}>
                           <div className="card-header">Lisk Trend (Last 90 Days)
                           </div>
                           <div className="card-body">
                              <div className="chart-container-1">
                                 {/* <canvas id="barChart"></canvas> */}
                                 {/* <Chart data={this.state.data} axes={this.state.axes} /> */}
                                 <ReactApexChart options={this.state.options_trend} series={this.state.series_trend} type="line" height={400} />
                              </div>
                           </div>

                        </div>
                     </div>
                  </div>
               </div>
            </div>
         </>
      )
   }
}
export default Dashboard;
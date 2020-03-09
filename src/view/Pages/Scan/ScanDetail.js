import React, { Component } from "react";
import Sidebar from "../../Components/Sidebar";
import Footer from "../../Components/Footer";
import Header from "../../Components/Header";
import { Modal, ModalHeader, ModalBody, ModalFooter, Button, FormGroup, Input, Form } from "reactstrap";
import { Link, withRouter } from "react-router-dom";
import { SCAN_DETAIL_LIST, ALL_VUL_LIST } from "../../Graphql/scan"

class ScanDetail extends Component {
   constructor(props) {
      super(props);
      this.state = {
         scan_name: "",
         scanDetailList: [],
         allVulList: [],
      }
   }
   componentDidMount() {
      let islogin = localStorage.getItem("islogin");
      if (!islogin) {
         this.props.history.push('/login');
      }
      console.log(this.props);
      this.getAllVullist();
      this.getScanDetail();
   }
   getAllVullist() {
      let client = this.props.client;
      let { allVulList } = this.state;
      client.query({ query: ALL_VUL_LIST, variables: {username: localStorage.getItem('username')}})
         .then((result) => {
            allVulList = result.data.allVullist;
            this.setState({ allVulList: allVulList });
         })
         .catch((error) => console.log(error));
   }
   getScanDetail() {
      let { scanDetailList } = this.state;
      const scanid = this.props.match.params.id;
      let scan_name = this.props.match.params.name;
      this.setState({scan_name: scan_name});
      let client = this.props.client;
      client.query({ query: SCAN_DETAIL_LIST, variables: { id: scanid, username: localStorage.getItem('username') } })
         .then((result) => {
            scanDetailList = result.data['getScandetaillist'];
            this.setState({ scanDetailList: scanDetailList });
         })
         .catch((error) => console.log(error));
   }
   onClickCritical = (type, assetId) => {
      this.props.history.push('/assets/scans/vulnerability/' + type + "/" + assetId + "/critical");
   }
   onClickHigh = (type, assetId) => {
      this.props.history.push('/assets/scans/vulnerability/' + type + "/" + assetId + "/high");
   }
   onClickMedium = (type, assetId) => {
      this.props.history.push('/assets/scans/vulnerability/' + type + "/" + assetId + "/medium");
   }
   onClickLow = (type, assetId) => {
      this.props.history.push('/assets/scans/vulnerability/' + type + "/" + assetId + "/low");
   }
   onClickInfo = (type, assetId) => {
      this.props.history.push('/assets/scans/vulnerability/' + type + "/" + assetId + "/info");
   }
   scalList() {
      let { allVulList } = this.state;

      return this.state.scanDetailList.map((data, index) => {
         let asset_ov_vul_critical_count = 0;
         let asset_ov_vul_high_count = 0;
         let asset_ov_vul_medium_count = 0;
         let asset_ov_vul_low_count = 0;
         let asset_ov_vul_info_count = 0;
         let ov_avullist = data.assetOvVulnerabilitesSet;
         ov_avullist.map((vullist) => {
            if (vullist.ovid['severity'] == 0.0) { asset_ov_vul_info_count++; }
            if (vullist.ovid['severity'] >= 0.1 && vullist.ovid['severity'] <= 3.9) { asset_ov_vul_low_count++; }
            if (vullist.ovid['severity'] >= 4 && vullist.ovid['severity'] <= 6.9) { asset_ov_vul_medium_count++; }
            if (vullist.ovid['severity'] >= 7 && vullist.ovid['severity'] <= 8.9) { asset_ov_vul_high_count++; }
            if (vullist.ovid['severity'] >= 9 && vullist.ovid['severity'] <= 10) { asset_ov_vul_critical_count++; }
         });
         let asset_vul_critical_count = 0;
         let asset_vul_high_count = 0;
         let asset_vul_medium_count = 0;
         let asset_vul_low_count = 0;
         let asset_vul_info_count = 0;
         let avullist = data.assetVulnerabilitesSet;
         avullist.map((vullist) => {
            if (vullist.vulid['cvss'] == 0.0) { asset_vul_info_count++; }
            if (vullist.vulid['cvss'] >= 0.1 && vullist.vulid['cvss'] <= 3.9) { asset_vul_low_count++; }
            if (vullist.vulid['cvss'] >= 4 && vullist.vulid['cvss'] <= 6.9) { asset_vul_medium_count++; }
            if (vullist.vulid['cvss'] >= 7 && vullist.vulid['cvss'] <= 8.9) { asset_vul_high_count++; }
            if (vullist.vulid['cvss'] >= 9 && vullist.vulid['cvss'] <= 10) { asset_vul_critical_count++; }
         });
         let afirmwareDetailList = data.assetFirmwaredetailSet;
         let asset_firmware_critical_count = 0;
         let asset_firmware_high_count = 0;
         let asset_firmware_medium_count = 0;
         let asset_firmware_low_count = 0;
         let asset_firmware_info_count = 0;
         afirmwareDetailList.map((detail) => {
            allVulList.map((vul) => {
               var vulist = detail.fdetailid.vulnerabilities.split(",");
               vulist.map((item) => {
                  if (vul.cveid == item) {
                     if (vul.cvss == 0.0) { asset_firmware_info_count++; }
                     if (vul.cvss >= 0.1 && vul.cvss <= 3.9) { asset_firmware_low_count++; }
                     if (vul.cvss >= 4 && vul.cvss <= 6.9) { asset_firmware_medium_count++; }
                     if (vul.cvss >= 7 && vul.cvss <= 8.9) { asset_firmware_high_count++; }
                     if (vul.cvss >= 9 && vul.cvss <= 10) { asset_firmware_critical_count++; }
                   }
               })
            })
         });
         let riskscore = asset_firmware_critical_count
            + asset_firmware_high_count
            + asset_firmware_medium_count
            + asset_firmware_low_count
            + asset_firmware_info_count
            + asset_vul_critical_count
            + asset_vul_high_count
            + asset_vul_medium_count
            + asset_vul_low_count
            + asset_vul_info_count;
         let iparray = data.ipAddress.split(".");
         let _realIp = "";
         iparray.map((item) => {
            _realIp = _realIp + parseInt(item) + ".";
         });
         _realIp = _realIp.substring(0, _realIp.length - 1);
         return (
            <tr key={index} className="text-center">
               <td scope="col" style={{ verticalAlign: 'middle' }}>{index + 1}</td>
               <td scope="col" style={{ verticalAlign: 'middle' }}>
                  <Link to={"/assets/detail/ipaddress" + data.id}><span style={{ color: '#03d0ea' }}>{_realIp}</span></Link>
               </td>
               <td scope="col" style={{ verticalAlign: 'middle' }}>
                  <div className="btn-group row">
                     <div className="col-12 m-1">
                        <button type="button" onClick={() => this.onClickCritical("product", data.id)} className="btn btn-danger mr-1">{asset_vul_critical_count}</button>
                        <button type="button" onClick={() => this.onClickHigh("product", data.id)} className="btn btn-warning mr-1">{asset_vul_high_count}</button>
                        <button type="button" onClick={() => this.onClickMedium("product", data.id)} className="btn btn-success mr-1">{asset_vul_medium_count}</button>
                        <button type="button" onClick={() => this.onClickLow("product", data.id)} className="btn btn-info mr-1">{asset_vul_low_count}</button>
                        <button type="button" onClick={() => this.onClickInfo("product", data.id)} className="btn btn-secondary mr-1">{asset_vul_info_count}</button>
                     </div>
                     <div className="col-12 m-1">
                        <button type="button" onClick={() => this.onClickCritical("product", data.id)} className="btn btn-danger mr-1">{asset_ov_vul_critical_count}</button>
                        <button type="button" onClick={() => this.onClickHigh("product", data.id)} className="btn btn-warning mr-1">{asset_ov_vul_high_count}</button>
                        <button type="button" onClick={() => this.onClickMedium("product", data.id)} className="btn btn-success mr-1">{asset_ov_vul_medium_count}</button>
                        <button type="button" onClick={() => this.onClickLow("product", data.id)} className="btn btn-info mr-1">{asset_ov_vul_low_count}</button>
                        <button type="button" onClick={() => this.onClickInfo("product", data.id)} className="btn btn-secondary mr-1">{asset_ov_vul_info_count}</button>
                     </div>
                  </div>
               </td>
               <td scope="col" style={{ verticalAlign: 'middle' }}>
                  <div className="btn-group row m-1">
                     <div className="col-12">
                        <button type="button" onClick={() => this.onClickCritical("firmware", data.id)} className="btn btn-danger mr-1">{asset_firmware_critical_count}</button>
                        <button type="button" onClick={() => this.onClickHigh("firmware", data.id)} className="btn btn-warning mr-1">{
                           asset_firmware_high_count
                        }</button>
                        <button type="button" onClick={() => this.onClickMedium("firmware", data.id)} className="btn btn-success mr-1">{
                           asset_firmware_medium_count
                        }</button>
                        <button type="button" onClick={() => this.onClickLow("firmware", data.id)} className="btn btn-info mr-1">{
                           asset_firmware_low_count
                        }</button>
                        <button type="button" onClick={() => this.onClickInfo("firmware", data.id)} className="btn btn-secondary mr-1">{
                           asset_firmware_info_count
                        }</button>
                     </div>
                  </div>
               </td>
               <td scope="col" style={{ verticalAlign: 'middle' }}>{riskscore}</td>
            </tr>
         )
      });
   }
   render() {
      let pathname = this.props.location.pathname;
      return (
         <>
            <Sidebar pathname={pathname} />
            <Header />
            <div className="content-wrapper">
               <div className="container-fluid">
                  <div className="row">
                     <div className="col-12 col-lg-12 col-xl-12">
                        <div className="card" style={{ minHeight: '580px' }}>
                           <div className="card-header"><i className="zmdi zmdi-layers"></i><Link to="/scans"><span> 
                              Scan  {this.state.scan_name} </span></Link></div>
                           <div className="card-body">
                              <div className="row">
                                 <div className="col-12">
                                    <div className="table-responsive">
                                       <table className="table table-bordered">
                                          <thead>
                                             <tr className="text-center">
                                                <th scope="col">#</th>
                                                <th scope="col">Ip Address</th>
                                                <th scope="col">Asset Vulnerabilities</th>
                                                <th scope="col">Firmware Risks</th>
                                                <th scope="col">Risk Score</th>
                                             </tr>
                                          </thead>
                                          <tbody>
                                             {this.scalList()}
                                          </tbody>
                                       </table>
                                    </div>
                                 </div>
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

export default (withRouter)(ScanDetail);
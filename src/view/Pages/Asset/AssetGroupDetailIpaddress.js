import React, { Component } from "react";
import Sidebar from "../../Components/Sidebar";
import Footer from "../../Components/Footer";
import Header from "../../Components/Header";
import { Link } from "react-router-dom";
import { ASSET_INFO } from "../../Graphql/asset";

class AssetGroupDetailIpaddress extends Component {
   constructor(props) {
      super(props);
      this.state = {
         assetInfo: {}
      }
   }
   componentDidMount() {
      const { id } = this.props.match.params;
      let islogin = localStorage.getItem("islogin");
      if (!islogin) {
         this.props.history.push('/login');
      }
      this.getAssetDetail(id);
   }
   getAssetDetail(id) {
      let client = this.props.client;
      const { assetInfo } = this.state;
      client.query({ query: ASSET_INFO, variables: { id: id } }).then((result) => {
         let _assetInfo = result.data['getAssetinfo'];
         this.setState({ assetInfo: _assetInfo });
      });
   }
   dispalyProductVul() {
      const { assetInfo } = this.state;
      if (assetInfo.hasOwnProperty('assetVulnerabilitesSet')) {
         return assetInfo.assetVulnerabilitesSet.map((vul) => {
            return (
               <li>{vul.vulid.cveid}(Passive)</li>
            )
         });
      }
   }
   displayProductOVVul() {
      const { assetInfo } = this.state;
      if (assetInfo.hasOwnProperty('assetOvVulnerabilitesSet')) {
         return assetInfo.assetOvVulnerabilitesSet.map((vul) => {
            return (
               <li>{vul.ovid.cveid}(Active)</li>
            )
         });
      }
   }
   issuelist(issuesList) {
      return issuesList.map((data) => {
         return (<div>
            <span>*NAME: {data.name}</span><br></br>*WARNING: {this.warning(data)}
         </div>
         );
      });
   }
   warning(data) {
      return data.warning.map((d) => {
         return (
            <><br></br><span>-{d}</span><br></br></>)
      });
   }
   displayFirmware() {
      const { assetInfo } = this.state;
      if (assetInfo.hasOwnProperty('assetFirmwaredetailSet')) {
         return assetInfo.assetFirmwaredetailSet.map((data) => {
            let issuesList = JSON.parse(data.fdetailid.issues);
            return (
               <div className="row">
                  <div className="col-3">{data.fdetailid.componentname}</div>
                  <div className="col-4">{data.fdetailid.vulnerabilities}</div>
                  <div className="col-5">
                     {this.issuelist(issuesList)}
                  </div>
               </div>
            )
         });
      }
   }
   render() {
      const { assetInfo } = this.state;
      return (
         <>
            <Sidebar />
            <Header />
            <div className="content-wrapper">
               <div className="container-fluid">
                  <div className="row">
                     <div className="col-12 col-lg-12 col-xl-12">
                        <div className="card" style={{ minHeight: '580px' }}>
                           <div className="card-header"><i className="zmdi zmdi-layers"></i>
                              <Link to="/assets"><span> Asset Detail </span></Link> <span> Ipaddress </span>
                           </div>
                           <div className="card-body">
                              <div className="row">
                                 <div className="col-6">
                                    <div className="card">
                                       <div className="card-body">
                                          <div className="row"><div className="col-12 text-right">
                                             {assetInfo.outdated == true && <span className="badge-danger btn-group-round p-1">Outdated</span>}
                                             {assetInfo.discontinued == true && <span className="badge-danger ml-1 btn-group-round p-1">Discontinued</span>}
                                          </div>
                                          </div>
                                          <div className="row"><div className="col-12">Manufacturer : {assetInfo.manufacturer}
                                          </div></div>
                                          <div className="row"><div className="col-12">Model : {assetInfo.model}</div></div>
                                          <div className="row"><div className="col-12">Mac : {assetInfo.macAddress}</div></div>
                                          <div className="row"><div className="col-12">OS : {assetInfo.operatingSystem}</div></div>
                                          <div className="row"><div className="col-12">FirmwareVersion : {assetInfo.firmwareVersion}</div></div>
                                          <div className="row"><div className="col-12">Description : {assetInfo.description}</div></div>
                                       </div>
                                    </div>
                                 </div>
                                 <div className="col-6 text-center">
                                    <div className="row"><div className="col-12"><span>Product Vulnerabilities:</span></div></div>
                                    <ui>
                                       {this.dispalyProductVul()}
                                       {this.displayProductOVVul()}
                                    </ui>
                                 </div>
                              </div>
                              <div className="row">
                                 <div className="col-6">
                                    <div className="card">
                                       <div className="card-body">
                                          <div className="row"><div className="col-12">Rick Score</div></div>
                                       </div>
                                    </div>
                                 </div>
                                 <div className="col-6 text-center">
                                    <div className="row"><div className="col-12">Firmware Vulnerablilites(Risks):</div></div>
                                    <div>
                                       {this.displayFirmware()}
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

export default AssetGroupDetailIpaddress;
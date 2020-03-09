import React, { Component } from "react";
import Sidebar from "../../Components/Sidebar";
import Footer from "../../Components/Footer";
import Header from "../../Components/Header";
import { ASSET_VUL_DETAIL_LIST, ALL_VUL_LIST } from "../../Graphql/scan"
import { Link } from "react-router-dom";
class Vulnerablity extends Component {
   constructor(props) {
      super(props);
      this.state = {
         type: "",
         assetId: "",
         serType: "",
         assetVullist: [],
         firmwareVullist: [],
         allVulList: [],
      }
   }
   componentDidMount() {
      let islogin = localStorage.getItem("islogin");
      if (!islogin) {
         this.props.history.push('/login');
      }
      let type = this.props.match.params.type;
      let assetid = this.props.match.params.id;
      let serType = this.props.match.params.vultype;
      this.setState({ type: type, assetId: assetid, serType: serType }, () => { this.getVulnerablities() });
      this.getAllVullist();
   }
   getAllVullist() {
      let client = this.props.client;
      let { allVulList } = this.state;
      client.query({ query: ALL_VUL_LIST })
         .then((result) => {
            allVulList = result.data.allVullist;
            this.setState({ allVulList: allVulList });
         })
         .catch((error) => console.log(error));
   }
   getVulnerablities() {
      let client = this.props.client;
      client.query({ query: ASSET_VUL_DETAIL_LIST, variables: { id: this.state.assetId } })
         .then((result) => {
            this.setState({ assetVullist: result.data['getAssetvullist'].assetVulnerabilitesSet, firmwareVullist: result.data['getAssetvullist'].assetFirmwaredetailSet })
         })
         .catch((error) => console.log(error));
   }
   showView(index, name, cveid, count) {
      return (
         <tr className="text-center">
            {/* <th scope="col">{index + 1}</th> */}
            <th scope="col">{name}</th>
            <th scope="col"><Link to={"/vuldetail" + cveid}><span style={{ color: '#03d0ea' }}>{cveid}</span></Link></th>
            <th scope="col">{count}</th>
         </tr>
      )
   }
   vulnerList() {
      const { type, serType, allVulList, assetVullist, firmwareVullist } = this.state;
      if (type == "product") {
         return assetVullist.map((vul, index) => {
            let cvss = vul.vulid.cvss;
            if (serType == "critical") {
               if (cvss > 9.0 && cvss < 10) {
                  return this.showView(index + 1, "CRITICAL", vul.vulid.cveid, 1);
               }
            }
            if (serType == "high") {
               if (cvss > 7.0 && cvss < 8.9) {
                  return this.showView(index + 1, "HIGH", vul.vulid.cveid, 1);
               }
            }
            if (serType == "medium") {
               if (cvss > 4 && cvss < 6.9) {
                  return this.showView(index + 1, "MEDIUM", vul.vulid.cveid, 1);
               }
            }
            if (serType == "low") {
               if (cvss > 0.1 && cvss < 3.9) {
                  return this.showView(index + 1, "LOW", vul.vulid.cveid, 1);
               }
            }
            if (serType == "info") {
               if (cvss = 0.0) {
                  return this.showView(index + 1, "INFO", vul.vulid.cveid, 1);
               }
            }
         });
      }
      if (type == "firmware") {
         return firmwareVullist.map((fvul, index) => {
            return allVulList.map((vul) => {
               var vulist = fvul.fdetailid.vulnerabilities.split(",");
               return vulist.map((item) => {
                  if (vul.cveid == item) {
                     let cvss = vul.cvss;
                     if (serType == "critical") {
                        if (cvss > 9.0 && cvss < 10) {
                           return this.showView(index + 1, "CRITICAL", vul.cveid, 1);
                        }
                     }
                     if (serType == "high") {
                        if (cvss > 7.0 && cvss < 8.9) {
                           return this.showView(index + 1, "HIGH", vul.cveid, 1);
                        }
                     }
                     if (serType == "medium") {
                        if (cvss > 4 && cvss < 6.9) {
                           return this.showView(index + 1, "MEDIUM", vul.cveid, 1);
                        }
                     }
                     if (serType == "low") {
                        if (cvss > 0.1 && cvss < 3.9) {
                           return this.showView(index + 1, "LOW", vul.cveid, 1);
                        }
                     }
                     if (serType == "info") {
                        if (cvss = 0.0) {
                           return this.showView(index + 1, "INFO", vul.cveid, 1);
                        }
                     }
                  }
               });
            });
         });
      }
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
                           <div className="card-header"><i className="zmdi zmdi-layers"></i> <span> Vulnerablity </span></div>
                           <div className="card-body">
                              <div className="row">
                                 <div className="col-12">
                                    <div className="table-responsive">
                                       <table className="table table-bordered">
                                          <thead>
                                             <tr className="text-center">
                                                {/* <th scope="col">#</th> */}
                                                <th scope="col">Serverity</th>
                                                <th scope="col">Title</th>
                                                <th scope="col">Count</th>
                                             </tr>
                                          </thead>
                                          <tbody>
                                             {this.vulnerList()}
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

export default Vulnerablity;
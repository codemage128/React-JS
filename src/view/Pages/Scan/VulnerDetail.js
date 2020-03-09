import React, { Component } from "react";
import Sidebar from "../../Components/Sidebar";
import Footer from "../../Components/Footer";
import Header from "../../Components/Header";
import { ALL_VUL_LIST } from "../../Graphql/scan"
class VulnerDetail extends Component {
   constructor(props) {
      super(props);
      this.state = {
         cveid: "",
         allVulList: [],
         vulinfo: {
            cveid:"",
            summary: "",
            cwe: "",
            cvss: "",
            references: "",
         }
      }
   }
   componentDidMount() {
      let islogin = localStorage.getItem("islogin");
      if (!islogin) {
         this.props.history.push('/login');
      }
      this.setState({ cveid: this.props.match.params.cveid }, () => this.getAllVullist());
   }
   getAllVullist() {
      let client = this.props.client;
      let { allVulList, vulinfo } = this.state;
      client.query({ query: ALL_VUL_LIST })
         .then((result) => {
            allVulList = result.data.allVullist;
            allVulList.map((data) => {
               if(this.state.cveid == data.cveid){
                  vulinfo.cveid = this.state.cveid;
                  vulinfo.cvss = data.cvss;
                  vulinfo.summary = data.summary;
                  vulinfo.references = data.references;
                  vulinfo.cwe = data.cwe;
                  this.setState({vulinfo: vulinfo});
               }
            })
         })
         .catch((error) => console.log(error));
   }
   render() {
      let pathname = this.props.location.pathname;
      const {vulinfo} = this.state;
      return (
         <>
            <Sidebar pathname={pathname} />
            <Header />
            <div className="content-wrapper">
               <div className="container-fluid">
                  <div className="row">
                     <div className="col-12 col-lg-12 col-xl-12">
                        <div className="card" style={{ minHeight: '580px' }}>
                           <div className="card-header"><i className="zmdi zmdi-layers"></i> <span>Vulnerablity Detail</span></div>
                           <div className="card-body">
                              <div className="row">
                                 <div className="col-2"></div>
                                 <div className="col-8">
                                    <div className="card">
                                       <div className="card-body">
                                          <div className="row"><div className="col-12">CVE ID : {vulinfo.cveid}</div></div>
                                          <div className="row"><div className="col-12">Summary: {vulinfo.summary}</div></div>
                                          <div className="row"><div className="col-12">References : {vulinfo.references}</div></div>
                                          <div className="row"><div className="col-12">CVSS : {vulinfo.cvss}</div></div>
                                          <div className="row"><div className="col-12">CWE : {vulinfo.cwe}</div></div>
                                       </div>
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

export default VulnerDetail;
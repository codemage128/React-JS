import React, { Component } from "react";
import {
   Table,
   Container,
   Card,
   CardBody,
   Row,
   Col,
   Nav,
   NavItem,
   NavLink,
} from "reactstrap";
import classnames from "classnames";

import Sidebar from "../../Components/Sidebar";
import Footer from "../../Components/Footer";
import Header from "../../Components/Header";
import AssetGroup from "./AssetGroup";
import AssetImport from "./AssetImport";

class Asset extends Component {
   constructor(props) {
      super(props);
      this.state = {
         islogin: false,
         assetGroup: true,
         assetImport: false
      }
   }
   componentDidMount() {
      let islogin = localStorage.getItem("islogin");
      if (!islogin) {
         this.props.history.push('/login');
         this.setState({islogin: true});
      }
   }
   tabview() {
      const { assetGroup, assetImport } = this.state;
      if (assetGroup) {
         return (
            <AssetGroup key="1" {...this.props}/>
         )
      }
      if (assetImport) {
         return (
            <AssetImport key="2" {...this.props}/>
         )
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
                           <div className="card-header"><i className="zmdi zmdi-layers"></i> <span> Asset Group </span>
                           </div>
                           <div className="card-body">
                              <Nav tabs className="nav nav-tabs nav-tabs-info">
                                 <NavItem className="nav-item">
                                    <NavLink className={classnames("nav-link", { 'active': this.state.assetGroup == true })}
                                       onClick={() => this.setState({ assetGroup: true, assetImport: false })} ><i className="icon-home"></i><span className="hidden-xs">Asset Group</span></NavLink>
                                 </NavItem>
                                 <NavItem>
                                    <NavLink className={classnames("nav-link", { 'active': this.state.assetImport == true })}
                                       onClick={() => this.setState({ assetGroup: false, assetImport: true })}><i className="icon-home"></i><span className="hidden-xs">Asset Import</span></NavLink>
                                 </NavItem>
                              </Nav>
                              <div>
                                 {this.tabview()}
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

export default Asset;
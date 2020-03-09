import React, { Component, Children } from "react";
import { Route, Switch, Redirect } from "react-router-dom";
import { withRouter } from 'react-router-dom';

import './sidebar.css';
import './icon.css';

import AssetGroup from "../Pages/Asset/AssetGroup";
import Footer from "../Components/Footer";
import Header from "../Components/Header";
import Sidebar from "../Components/Sidebar";

class AdminLayout extends Component {
   constructor(props) {
      super(props)
      this.state = {
         loggedIn: true
      }
   }
   showView(props) {

   }
   render() {
      return (
         <>
            <Sidebar />
            <Header />
            
            <Footer />
         </>
      )
   }
}
export default withRouter(AdminLayout);
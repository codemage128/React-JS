import React, { Component } from 'react'
import classnames from "classnames";

class Sidebar extends Component {
   constructor(props) {
      super(props)
      this.state = {
         pathname: "",
      }
   }
   componentDidMount(){
      this.setState({pathname: this.props.pathname});
   }
   render() {
      return (
         <div id="wrapper">
            <div id="sidebar-wrapper" data-simplebar="" data-simplebar-auto-hide="true">
               <div className="user-details">
                  <div className="media align-items-center user-pointer collapsed" data-toggle="collapse" data-target="#user-dropdown">
                     <div className="avatar"><img className="mr-3 side-user-img" src="https://via.placeholder.com/110x110" alt="user avatar" /></div>
                     <div className="media-body">
                        <h6 className="side-user-name">Firmalyzer all-in-one platform</h6>
                     </div>
                  </div>
                  <div id="user-dropdown" className="collapse">
                     <ul className="user-setting-menu">
                        <li><a href=""><i className="icon-user"></i>  My Profile</a></li>
                        <li><a href=""><i className="icon-settings"></i> Setting</a></li>
                        <li><a href=""><i className="icon-power"></i> Logout</a></li>
                     </ul>
                  </div>
               </div>
               <ul className="sidebar-menu">
                  <li className="sidebar-header">MAIN NAVIGATION</li>
                  <li className={classnames({'active': this.state.pathname == "/" })}>
                     <a href="#" className="waves-effect">
                        <i className="zmdi zmdi-view-dashboard"></i> <span>Dashboard</span>
                     </a>
                  </li>
                  <li className={classnames({'active': this.state.pathname == "/assets" })}>
                     <a href="#assets" className="waves-effect">
                        <i className="zmdi zmdi-layers"></i> <span>Assets</span>
                     </a>
                  </li>
                  <li className={classnames({'active': this.state.pathname == "/scans" })}>
                     <a href="#scans" className="waves-effect">
                        <i className="zmdi zmdi-chart"></i> <span>Scans</span>
                     </a>
                  </li>
                  <li className={classnames({'active': this.state.pathname == "/reports" })}>
                     <a href="#reports" className="waves-effect">
                        <i className="zmdi zmdi-widgets"></i> <span>Reports</span>
                     </a>
                  </li>
                  <li className={classnames({'active': this.state.pathname == "/settings" })}>
                     <a href="#settings" className="waves-effect">
                        <i className="zmdi zmdi-settings"></i> <span>Settings</span>
                     </a>
                  </li>
               </ul>
            </div>
         </div>

      )
   }
}
export default Sidebar;
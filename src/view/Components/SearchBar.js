import React, { Component } from 'react'
import { Link } from "react-router-dom";
import { Modal, ModalHeader, ModalBody, ModalFooter, Button, FormGroup, Input, Form } from "reactstrap";

import {
   Menu,
   MenuList,
   MenuButton,
   MenuItem,
   MenuItems,
   MenuPopover,
   MenuLink,
} from "@reach/menu-button";
import "@reach/menu-button/styles.css";

class Header extends Component {
   constructor(props) {
      super(props)
      this.state = {
         iprange: false,
         searchInfo: {
            type: "",
            operator: "",
            value: "",
            value_start: "",
            value_end: "",
         }
      }
   }
   handleChangeSelect = (event) => {
      const { searchInfo } = this.state;
      const { name, value } = event.target;
      if (name == "type" && value == "ipAddress") {
         this.setState({ iprange: true })
      } else if (name == "type") {
         this.setState({ iprange: false })
      }
      searchInfo[name] = value;
      this.setState({ searchInfo: searchInfo });
   }

   search = (e) => {
      const { searchInfo } = this.state;
      if (e.key == "Enter") {
         e.preventDefault();
         const { name, value } = e.target;
         if (name == "value") {
            searchInfo.value = value;
         }
         if (name == "value_end") {
            searchInfo.value_end = value;
         }
         this.setState({ searchInfo: searchInfo });
         this.props.event(searchInfo);
      }
   }
   render() {
      return (
         <>
            <header className="topbar-nav">
               <nav className="navbar navbar-expand fixed-top">
                  <ul className="navbar-nav mr-auto align-items-center">
                     <li className="nav-item">
                        <a className="nav-link toggle-menu" href="">
                           <i className="icon-menu menu-icon"></i>
                        </a>
                     </li>
                     <li className="nav-item col-3">
                        <div className="col-12">
                           <Input
                              // key={index}
                              name='type'
                              value={this.state.type}
                              required
                              type="select"
                              onChange={e => this.handleChangeSelect(e)}
                           >
                              <option key="0" value='0'></option>
                              <option key="1" value='assetType'>Type</option>
                              <option key="2" value='ipAddress'>IP Range</option>
                              <option key="3" value='operatingSystem'>OS Model</option>
                              <option key="4" value='manufacturer'>Manufacture</option>
                              <option key="5" value='4'>Risk Score</option>
                           </Input>
                        </div>
                     </li>
                     <li className="nav-item col-2">
                        <div className="col-12">
                           <Input
                              // key={index}
                              name="operator"
                              value={this.state.operator}
                              required
                              type="select"
                              onChange={e => this.handleChangeSelect(e)}
                           >
                              <option key="0" value='0'></option>
                              <option key="1" value='='>Is</option>
                              <option key="2" value='='>Is Not</option>
                              <option key="3" value='='>Contains</option>
                           </Input>
                        </div>
                     </li>
                     {this.state.iprange == false &&
                        <li className="nav-item col-6">
                           <div className="col-12">
                              <Input
                                 // key={index}
                                 name="value"
                                 value={this.state.value}
                                 type="text"
                                 placeholder="Please Type the key value !"
                                 onKeyDown={this.search}
                              />
                           </div>
                        </li>
                     }
                     {this.state.iprange == true &&
                        <>
                           <li className="nav-item col-3">
                              <div className="col-12">
                                 <Input
                                    // key={index}
                                    name="value_start"
                                    value={this.state.value_start}
                                    placeholder="Start IP address"
                                    type="text"
                                    onChange={e => this.handleChangeSelect(e)}
                                 />
                              </div>
                           </li>
                           <li className="nav-item col-3">
                              <div className="col-12">
                                 <Input
                                    // key={index}
                                    name="value_end"
                                    value={this.state.value_end}
                                    placeholder="End IP Address"
                                    type="text"
                                    // onChange={e => this.handleChangeSelect(e)}
                                    onKeyDown={this.search}
                                 />
                              </div>
                           </li>
                        </>
                     }
                  </ul>
                  <ul className="navbar-nav align-items-center right-nav-link">
                     <li className="nav-item">
                        <Menu>
                           <MenuButton className="btn btn-light btn-round">
                              <span aria-hidden>▾</span>
                           </MenuButton>
                           <MenuList className="dropdown-menu dropdown-menu-right">
                              <MenuLink as="a" href="/#/settings">
                                 <i className="icon-settings mr-2"></i> Settings
                              </MenuLink>
                              <MenuLink as="a" href="/" onClick={() => {
                                 localStorage.removeItem('tokenAuth');
                                 localStorage.removeItem('islogin');
                              }}>
                                 <i className="icon-lock mr-2"></i> Sign Out
                              </MenuLink>
                           </MenuList>
                        </Menu>
                     </li>
                  </ul>
               </nav>
            </header>
            <div className="clearfix"></div>
         </>
      )
   }
}
export default Header;
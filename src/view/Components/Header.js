import React, { Component } from 'react'
import { Link } from "react-router-dom";
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
                     <li className="nav-item">
                        <form className="search-bar">
                           <input type="text" className="form-control" placeholder="Enter keywords" />
                           <a href=""><i className="icon-magnifier"></i></a>
                        </form>
                     </li>
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
                        {/* <Link className="nav-link dropdown-toggle dropdown-toggle-nocaret" data-toggle="dropdown" to="/login" onClick={() => {
                           localStorage.removeItem('tokenAuth');
                           localStorage.removeItem('islogin');
                        }}>
                           <span className="user-profile"><img src="https://via.placeholder.com/110x110" className="img-circle" alt="user avatar" /></span>
                        </Link> */}
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
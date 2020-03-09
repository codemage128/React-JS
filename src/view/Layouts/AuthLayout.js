import React, { Component } from "react";
import { Route, Switch } from "react-router-dom";
import { withRouter } from 'react-router-dom';

import Login from "../Pages/auth/Login";

class AuthLayout extends Component {
   constructor(props) {
      super(props)
   }
   render() {
      return (
         <Switch>
            <Route path="/" component={Login}/>
         </Switch>
      )
   }
}
export default withRouter(AuthLayout);
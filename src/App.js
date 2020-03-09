import React, { Component } from 'react';
import { Route, Redirect, Switch, HashRouter } from "react-router-dom";

import AdminLayout from "./view/Layouts/AdminLayout"
import AuthLayout from "./view/Layouts/AuthLayout"
import Login from './view/Pages/auth/Login';
import SignUp from './view/Pages/auth/Signup';
import Asset from './view/Pages/Asset/Asset';
import Dashboard from './view/Pages/Dashboard/Dashboard';
import Scan from './view/Pages/Scan/Scan';
import Report from './view/Pages/Report/Report';
import Setting from './view/Pages/Setting/Setting';
import AssetImport from './view/Pages/Asset/AssetImport';
import AssetGroupDetail from './view/Pages/Asset/AssetGroupDetail';
import AssetGroupDetailIpaddress from './view/Pages/Asset/AssetGroupDetailIpaddress';

import { ApolloProvider } from "react-apollo";
import client from "./view/Graphql/client"
import ScanDetail from './view/Pages/Scan/ScanDetail';
import Vulnerablity from './view/Pages/Scan/Vulnerablity';
import VulnerDetail from './view/Pages/Scan/VulnerDetail';

class App extends Component {
  constructor(props) {
    super(props)
  }
  render() {
    return (
      <ApolloProvider client={client}>
        <HashRouter>
          <Switch>
            <Route exact path="/" component={(props) => <Dashboard {...props} client={client}/>}></Route>
            <Route exact path="/assets" component={(props) => <Asset {...props} client={client}/>}></Route>
            <Route exact path="/assets/scans/vulnerability/:type/:id/:vultype" component={(props) => <Vulnerablity {...props} client={client}/>}></Route>
            <Route exact path="/vuldetail:cveid" component={(props) => <VulnerDetail {...props} client={client}></VulnerDetail>}></Route>
            <Route exact path="/assets/detail:id" component={(props) => <AssetGroupDetail {...props} client={client}/>}></Route>
            <Route exact path="/assets/detail/ipaddress:id" component={(props) => <AssetGroupDetailIpaddress {...props} client={client}/>}></Route>
            <Route exact path="/scans" component={(props) => <Scan {...props} client={client}/>}></Route>
            <Route exact path="/scans/detail/:id/:name" component={(props) => <ScanDetail {...props} client={client}/>}></Route>
            <Route exact path="/reports" component={Report}></Route>
            <Route exact path="/settings" component={(props) => <Setting {...props} client={client}/>}></Route>
            <Route exact path="/login" component={(props) => <Login {...props} client={client}/>}></Route>
            <Route exact path="/signup" component={(props) => <SignUp {...props} client={client}/>}></Route>
          </Switch>
        </HashRouter>
      </ApolloProvider>
    )
  }
}


export default App;

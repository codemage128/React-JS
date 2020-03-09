import React, { Component } from "react";
import Sidebar from "../../Components/Sidebar";
import Footer from "../../Components/Footer";
import Header from "../../Components/Header";
import { Button, Input } from "reactstrap";
import { GET_UERID, GET_API, UPDATE_API } from "../../Graphql/auth";
class Setting extends Component {
   constructor(props) {
      super(props);
      this.state = {
         password: "",
         repeatpassword: "",
         apikey: "",
         success: "Update Successfully!",
         error: "You can't connect server.",
         isok: false,
         isfail: false
      }
   }
   componentDidMount() {
      let islogin = localStorage.getItem("islogin");
      let client = this.props.client;
      let _username = localStorage.getItem('username');
      if (!islogin) {
         this.props.history.push('/login');
      }
      client.query({ query: GET_API, variables: { username: _username } }).then((result) => {
         console.log(result.data["apikey"].apikey);
         this.setState({ apikey: result.data["apikey"].apikey });
      }).catch((error) => console.log(error));
   }
   update = () => {
      let client = this.props.client;
      let username = localStorage.getItem('username');
      let { apikey, password, repeatpassword } = this.state;
      if (password == repeatpassword) {
         client.mutate({ mutation: UPDATE_API, variables: { password: password, apikey: apikey, username: username } }).then((result) => {
            this.setState({ apikey: result.data['updateApi'].customer.apikey, isok: true });
         }).catch((error) => console.log(error));
      }else {
         let string = "Passwords don't match."
         this.setState({isfail: true, error: string});
      }
   }
   handleChange = (event) => {
      this.setState({isfail: false, isok: false});
      if (event.target.name == "password") {
         this.setState({ password: event.target.value });
      }
      if (event.target.name == "repeatpassword") {
         this.setState({ repeatpassword: event.target.value });
      }
      if (event.target.name == "apikey") {
         this.setState({ apikey: event.target.value });
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
                           <div className="card-header"><i className="zmdi zmdi-layers"></i> <span> Setting </span></div>
                           <div className="card-body">
                              <div className="row">
                                 <div className="col-12 col-lg-12 col-xl-12">
                                    <div className="card-body">
                                       <div className="form-group">
                                          {this.state.isok &&
                                             <div className="col-6">
                                                <div className="alert alert-success p-3">
                                                   {this.state.success}
                                                </div>
                                             </div>
                                          }
                                          {this.state.isfail &&
                                             <div className="col-6">
                                                <div className="alert alert-danger p-3">{this.state.error}</div>
                                             </div>
                                          }
                                       </div>
                                       <div className="form-group">
                                          <div className="col-6 mb-3">New Password : </div>
                                          <div className="col-6">
                                             <Input placeholder="New Password" name="password" type="password" onChange={this.handleChange.bind(this)} required className="form-control" />
                                          </div>
                                       </div>
                                       <div className="form-group">
                                          <div className="col-6 mb-3">Confirm Password : </div>
                                          <div className="col-6">
                                             <Input placeholder="Confirm Password" onChange={this.handleChange.bind(this)} name="repeatpassword" type="password" required className="form-control" />
                                          </div>
                                       </div>
                                       <div className="form-group">
                                          <div className="col-6 mb-3">Api Key : </div>
                                          <div className="col-6">
                                             <Input placeholder="Enter Api Key" value={this.state.apikey} onChange={this.handleChange.bind(this)} name="apikey" required className="form-control" />
                                          </div>
                                       </div>
                                       <div className="form-group">
                                          <hr />
                                          <div className="col-6">
                                             <Button placeholder="New Password" type="button" onClick={this.update} className="form-control btn btn-light">Update</Button>
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
            </div>
            <Footer />
         </>
      )
   }
}

export default Setting;
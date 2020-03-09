import React, { Component } from "react";
import { withRouter } from 'react-router-dom';
import './app-style.css';
import { useApolloClient, useQuery } from "@apollo/react-hooks";
import { Input, Form} from "reactstrap";
import { CREAT_USER } from "../../Graphql/auth";

class Signup extends Component {
   constructor(props) {
      super(props);
      this.state = {
         SignUpData: {
            firstname:"",
            lastname: "",
            email: "",
            password: "",
            phone: "",
            companyname: "",
            jobtitle: "",
            repeatpassword: ""
         },
         error: "",
         issamePassword: "true"
      }
   }
   onSignup(event) {
      event.preventDefault();
      const client = this.props.client;
      let {error, issamePassword} = this.state;
      const {firstname, lastname, email, phone, companyname, jobtitle, password, repeatpassword} = this.state.SignUpData;
      if(password == repeatpassword){
      client.mutate({ mutation: CREAT_USER, variables: { firstname: firstname, lastname: lastname, phone: phone, companyname: companyname,
         jobtitle: jobtitle, password: password, email: email } })
         .then((result) => {
            this.props.history.push('/login');
         })
         .catch((errors) => {
            // console.log(errors.data);
            this.setState({issamePassword: false, error: "You can't connect server!"});
         });
      } else {
         var errorstring = "Passwords don't match";
         issamePassword = false;
         this.setState({error: errorstring, issamePassword: issamePassword});
      }
   }
   componentDidMount() {
      let islogin = localStorage.getItem("islogin");
      if (islogin) {
         this.props.history.push('/');
      }
   }
   handleChange(event) {
      const { name, value } = event.target;
      const { SignUpData } = this.state;
      SignUpData[name] = value;
      this.setState({ SignUpData: SignUpData, issamePassword: true});
   }
   render() {
      return (
         <>
            <div id="wrapper">
               <div className="height-100v d-flex align-items-center justify-content-center">
                  <div className="height-100v d-flex align-items-center justify-content-center">
                     <div className="card card-authentication1 mb-0">
                        <div className="card-body">
                           <div className="card-content p-2">
                              <div className="card-title text-uppercase text-center py-3">Sign Up</div>
                              {this.state.issamePassword == false &&
                              <div className="alert alert-warning">
                                 <div className="alert-message text-center">
                                    <span className="text-center">{this.state.error}</span>
                                 </div>
                              </div>
                              }
                              <Form method="post" onSubmit={this.onSignup.bind(this)}>
                                 <div className="form-group">
                                    <div className="position-relative has-icon-right">
                                       <Input type="text" required name="firstname" className="form-control input-shadow"
                                          placeholder="Enter Firstname" onChange={this.handleChange.bind(this)} />
                                       <div className="form-control-position">
                                          <i className="icon-user"></i>
                                       </div>
                                    </div>
                                 </div>
                                 <div className="form-group">
                                    <div className="position-relative has-icon-right">
                                       <Input type="text" required name="lastname" className="form-control input-shadow"
                                          placeholder="Enter Lastname" onChange={this.handleChange.bind(this)} />
                                       <div className="form-control-position">
                                          <i className="icon-user"></i>
                                       </div>
                                    </div>
                                 </div>
                                 <div className="form-group">
                                    <div className="position-relative has-icon-right">
                                       <Input type="email" required name="email" className="form-control input-shadow" placeholder="Enter Your Email"
                                          onChange={this.handleChange.bind(this)} />
                                       <div className="form-control-position">
                                          <i className="icon-envelope-open"></i>
                                       </div>
                                    </div>
                                 </div>
                                 <div className="form-group">
                                    <div className="position-relative has-icon-right">
                                       <Input type="text" required name="phone" className="form-control input-shadow" placeholder="Enter Your Phone Number"
                                          onChange={this.handleChange.bind(this)} />
                                       <div className="form-control-position">
                                          <i className="icon-phone"></i>
                                       </div>
                                    </div>
                                 </div>
                                 <div className="form-group">
                                    <div className="position-relative has-icon-right">
                                       <Input type="text" required name="companyname" className="form-control input-shadow"
                                          placeholder="Enter Company Name" onChange={this.handleChange.bind(this)} />
                                       <div className="form-control-position">
                                          <i className="icon-organization"></i>
                                       </div>
                                    </div>
                                 </div>
                                 <div className="form-group">
                                    <div className="position-relative has-icon-right">
                                       <Input type="text" required name="jobtitle" className="form-control input-shadow"
                                          placeholder="Enter Job Title" onChange={this.handleChange.bind(this)} />
                                       <div className="form-control-position">
                                          <i className="icon-grid"></i>
                                       </div>
                                    </div>
                                 </div>
                                 <div className="form-group">
                                    <div className="position-relative has-icon-right">
                                       <Input type="password" required className="form-control input-shadow"
                                          placeholder="Enter Password" name="password" onChange={this.handleChange.bind(this)} />
                                       <div className="form-control-position">
                                          <i className="icon-lock"></i>
                                       </div>
                                    </div>
                                 </div>
                                 <div className="form-group">
                                    <div className="position-relative has-icon-right">
                                       <Input type="password" required className="form-control input-shadow"
                                          placeholder="Confirm Password" name="repeatpassword" onChange={this.handleChange.bind(this)} />
                                       <div className="form-control-position">
                                          <i className="icon-lock"></i>
                                       </div>
                                    </div>
                                 </div>
                                 <button type="submit" className="btn btn-light btn-block" >Sign Up</button>
                              </Form>
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

export default withRouter(Signup);
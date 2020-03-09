import React, { Component, useState, useEffect } from "react";
import { withRouter, Link } from 'react-router-dom';
import './app-style.css';
import { GETTOKEN, GETUSERS, GET_UERID } from "../../Graphql/auth"
// import { useQuery, useMutation, gql } from "@apollo/client";
import { Input } from "reactstrap";
import { graphql, Mutation } from "react-apollo";
import { useApolloClient, useMutation, useQuery } from "@apollo/react-hooks";
import gql from "graphql-tag";

const Login = (props) => {
   const [loading, setLoading] = useState(false);
   const [email, setEmail] = useState("");
   const [username, setUsername] = useState("");
   const [password, setPassword] = useState("");
   const [isFail, setisFail] = useState(false);
   const [errors, setErrors] = useState("");
   const client = props.client;
   //const{token} = useMutation(GETTOKEN, {variables:{username: username, password: password}})
   // useEffect(() => {
   //    // login_function();
   // }, [loading]);

   const handleChange = (event) => {
      setisFail(false);
      if (event.target.name == 'password')
         setPassword(event.target.value);
      if (event.target.name == 'email')
         setEmail(event.target.value);
   }
   const login_function = (_username) => {
      client.mutate({ mutation: GETTOKEN, variables: { username: _username, password: password } })
         .then((result) => {
            const tokenAuth = result.data.tokenAuth.token;
            localStorage.setItem('tokenAuth', tokenAuth);
            localStorage.setItem('islogin', true);
            props.history.push('/');
         })
         .catch((error) => {
            setisFail(true);
            let _error = error.graphQLErrors[0].message;
            setErrors(_error);
            localStorage.removeItem('tokenAuth');
            localStorage.removeItem('islogin');
         });
   }
   const onLoginclick = (event) => {
      event.preventDefault();
      client.query({ query: GET_UERID, variables: { email: email } }).then((result) => {
         let _username = result.data['me'].id;
         login_function(_username);
      }).catch((error) => {
         let _error = "You can't connect server.";
         setisFail(true);
         setErrors(_error);
         localStorage.removeItem('tokenAuth');
         localStorage.removeItem('islogin');
      });
   }
   return (
      <>
         <div id="wrapper">
            <div className="height-100v d-flex align-items-center justify-content-center">
               <div className="height-100v d-flex align-items-center justify-content-center">
                  <div className="card card-authentication1 mb-0">
                     <div className="card-body">
                        <div className="card-content p-2">
                           <div className="card-title text-uppercase text-center py-3">Sign In</div>
                           {isFail &&
                              <div className="alert alert-warning">
                                 <div className="alert-message text-center">
                                    <span className="text-center">{errors}</span>
                                 </div>
                              </div>
                           }
                           <form method="post" onSubmit={onLoginclick}>
                              <div className="form-group">
                                 <label className="sr-only">Username</label>
                                 <div className="position-relative has-icon-right">
                                    <Input type="email" name="email" required className="form-control input-shadow"
                                       placeholder="Enter Your Email" onChange={handleChange} />
                                    <div className="form-control-position">
                                       <i className="icon-user"></i>
                                    </div>
                                 </div>
                              </div>
                              <div className="form-group">
                                 <label className="sr-only">Password</label>
                                 <div className="position-relative has-icon-right">
                                    <Input type="password" name="password" required className="form-control input-shadow"
                                       placeholder="Enter Password" onChange={handleChange} />
                                    <div className="form-control-position">
                                       <i className="icon-lock"></i>
                                    </div>
                                 </div>
                              </div>
                              <button type="submit" className="btn btn-light btn-block" >Sign In</button>
                              <div className="form-group">
                                 <div className="row mt-3">
                                    <div className="col-12 text-right">
                                       <Link to='/signup'>Sign Up</Link>
                                    </div>
                                 </div>
                              </div>

                           </form>
                        </div>
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </>
   )
}
export default Login;

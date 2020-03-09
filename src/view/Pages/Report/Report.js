import React, { Component } from "react";
import Sidebar from "../../Components/Sidebar";
import Footer from "../../Components/Footer";
import Header from "../../Components/Header";

class Report extends Component {
   constructor(props) {
      super(props);
   }
   componentDidMount() {
      let islogin = localStorage.getItem("islogin");
      if (!islogin) {
         this.props.history.push('/login');
      }
   }
   render() {
      let pathname = this.props.location.pathname;
      return (
         <>
            <Sidebar pathname={pathname} />
            <Header />
            <div class="content-wrapper">
               <div class="container-fluid">
                  <div class="row">
                     <div class="col-12 col-lg-12 col-xl-12">
                        <div class="card" style={{ minHeight: '580px' }}>
                           <div class="card-header"><i class="zmdi zmdi-layers"></i> <span> Report </span></div>
                           <div class="card-body">
                              This is the Report Page.
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

export default Report;
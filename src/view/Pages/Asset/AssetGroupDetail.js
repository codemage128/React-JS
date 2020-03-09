import React, { Component } from "react";
import { Link } from "react-router-dom";
import Sidebar from "../../Components/Sidebar";
import Footer from "../../Components/Footer";
import Header from "../../Components/Header";
import { ASSET_GROUP_DETAIL_LIST } from "../../Graphql/asset";

class AssetGroupDetail extends Component {
   constructor(props) {
      super(props);
      this.state = {
         assetGroupDetailList: [],
      }
   }
   componentDidMount() {
      let islogin = localStorage.getItem("islogin");
      if (!islogin) {
         this.props.history.push('/login');
      }
      this.getAssetGroupDetailList();
   }
   getAssetGroupDetailList() {
      let client = this.props.client;
      let { assetGroupDetailList } = this.state;
      const assetGroupId = this.props.match.params.id;
      client.query({ query: ASSET_GROUP_DETAIL_LIST, variables: { id: assetGroupId } })
         .then((result) => {
            let resultdata = result.data;
            assetGroupDetailList = resultdata['getAssetgroupdetaillist'];
            this.setState({ assetGroupDetailList: assetGroupDetailList });
         })
         .catch((error) => console.log(error));
   }
   assetGroupDetailList() {
      return this.state.assetGroupDetailList.map((column, index) => {
         let iparray = column.ipAddress.split(".");
         let _realIp = "";
         iparray.map((item) => {
            _realIp = _realIp + parseInt(item) + ".";
         });
         _realIp = _realIp.substring(0, _realIp.length - 1);
         return (
            <tr className="text-center">
               <td scope="col">{index + 1}</td>
               <td scope="col">
                  <Link to={"detail/ipaddress" + column.id}><span style={{ color: '#03d0ea' }}>{_realIp}</span></Link>
               </td>
               <td scope="col">{column.macAddress}</td>
               <td scope="col">{column.manufacturer}</td>
               <td scope="col">{column.model}</td>
               {/* <td scope="col">#</td> */}
            </tr>
         )
      });
   }
   render() {
      return (
         <>
            <Sidebar />
            <Header />
            <div className="content-wrapper">
               <div className="container-fluid">
                  <div className="row">
                     <div className="col-12 col-lg-12 col-xl-12">
                        <div className="card" style={{ minHeight: '580px' }}>
                           <div className="card-header"><i className="zmdi zmdi-layers"></i>
                              <Link to="/assets"><span> Asset Detail </span></Link></div>
                           <div className="card-body">
                              <div className="row">
                                 <div className="col-12">
                                    <div className="table-responsive">
                                       <table className="table table-bordered">
                                          <thead>
                                             <tr className="text-center">
                                                <th scope="col">#</th>
                                                <th scope="col">Ip Address</th>
                                                <th scope="col">Mac Address</th>
                                                <th scope="col">Manufacture</th>
                                                <th scope="col">Model</th>
                                                {/* <th scope="col">Risk Score</th> */}
                                             </tr>
                                          </thead>
                                          <tbody>
                                             {this.assetGroupDetailList()}

                                          </tbody>
                                       </table>
                                    </div>
                                 </div>
                              </div>
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
export default AssetGroupDetail;
import React, { Component } from "react";
import Sidebar from "../../Components/Sidebar";
import Footer from "../../Components/Footer";
import Header from "../../Components/Header";
import { Modal, ModalHeader, ModalBody, ModalFooter, Button, FormGroup, Input, Form } from "reactstrap";
import { Link } from "react-router-dom";
import { GET_SCAN_LIST, CREATE_SCAN, CHECK_RESULT } from "../../Graphql/scan";
import { ASSET_GROUP_LIST } from "../../Graphql/asset";
import { split } from "apollo-boost";

class Scan extends Component {
   constructor(props) {
      super(props);
      this.state = {
         modalTitle: "Add New Scan",
         newScanModal: false,
         scanInfo: {
            id: 0,
            name: "",
            iprange: "",
            assetgroupid: 0,
            scantype: "",
            tasktype: 1,
         },
         scanList: [],
         assetGrouList: [],
         isiprange: false,
         lightweight: false,
         fullactive: false,
         vulnerabilityscan: false,
         firmwarescan: false,
      }
   }
   componentDidMount() {
      let islogin = localStorage.getItem("islogin");
      if (!islogin) {
         this.props.history.push('/login');
      }
      this.getScanList();
      setInterval(this.checkResult.bind(this), 1000);
   }
   checkResult(){
      const {scanList} = this.state;
      let client = this.props.client;
      let statusList = [];
      scanList.map((scan) => {
         let status = [];
         // client.query({query: CHECK_RESULT, variables:{ task: scan.status}}).then((result) => {
         // })
      })
   }
   getScanList() {
      let client = this.props.client;
      let { scanList, assetGrouList } = this.state;
      client.query({ query: GET_SCAN_LIST, variables: { username: localStorage.getItem('username') } }).then((result) => {
         scanList = result.data.allScanlist;
         this.setState({ scanList: scanList });
      });
      client.query({ query: ASSET_GROUP_LIST, variables: { username: localStorage.getItem('username') } }).then((result) => {
         assetGrouList = result.data.allAssetgrouplist;
         this.setState({ assetGrouList: assetGrouList })
      });
   }
   scalList() {
      return this.state.scanList.map((data, index) => {
         return (
            <tr key={index} className="text-center">
               <td scope="col" style={{ verticalAlign: 'middle' }}>{index + 1}</td>
               <td scope="col" style={{ verticalAlign: 'middle' }}>
                  <Link to={"/scans/detail/" + data.id + "/" + data.name}><span style={{ color: '#03d0ea' }}>{data.name}</span>
                  </Link>
               </td>
               <td scope="col" style={{ verticalAlign: 'middle' }}>{Date(data.updatedAt)}</td>
               <td scope="col" style={{ verticalAlign: 'middle' }}>
                  {/* This part is status progress bar*/}
                  {data.status == 1 && <button className="btn btn-info btn-round btn-sm">Scanning</button>}
               </td>
               <td scope="col" style={{ verticalAlign: 'middle' }}>
                  <button className="btn btn-light" onClick={e => this.onModify(data.id)}>Modifiy</button>
               </td>
            </tr>
         )
      });
   }
   handleChange(event) {
      const { name, value } = event.target;
      let { scanInfo } = this.state;
      scanInfo[name] = value;
      this.setState({ scanInfo: scanInfo });
   }
   handleSelectChange(event) {
      const { name, value } = event.target;
      let { scanInfo } = this.state;
      scanInfo[name] = value;
      if (name == "assetgroupid") {
         if (value == -1) {
            this.setState({ isiprange: true })
         } else {
            this.setState({ isiprange: false })
         }
      }
      this.setState({ scanInfo: scanInfo });
   }
   handleCheckBoxClick(event) {
      let { checked, name } = event.target;
      let { scanInfo } = this.state;
      this.setState({ [name]: checked });
      if (checked) {
         scanInfo.scantype = scanInfo.scantype.concat(name + ",");
      }
      if (!checked) {
         scanInfo.scantype = scanInfo.scantype.replace(name + ",", "");
      }
      this.setState({ scanInfo: scanInfo });
   }
   onSubmit = (event) => {
      event.preventDefault();
      const { scanInfo, scanList } = this.state;
      const { client } = this.props;
      const { id, name, iprange_start, iprange_end, assetgroupid, scantype, tasktype } = scanInfo;
      let iprange = iprange_start + "," + iprange_end;
      client.mutate({
         mutation: CREATE_SCAN, variables: {
            id: id, name: name, assetgroupid: assetgroupid, iprange: iprange, scantype: scantype, tasktype: tasktype, username: localStorage.getItem('username')
         }
      }).then((result) => {
         const _scan = result.data.createScan.scan;
         if (scanInfo.id == 0) {
            scanList.push(_scan);
         } else {
            scanList.map((data, index) => {
               if (data.id == _scan.id) {
                  scanList[index] = _scan;
               }
            });
         }
         let scantype = _scan.scantype;
         this.setState({ newScanModal: false, scalList: scanList });
      }).catch((error) => console.log(error));
   }
   newScan() {
      let { ...scanInfo } = this.state.scanInfo;
      scanInfo.id = 0;
      scanInfo.name = "";
      scanInfo.assetgroupid = -2;
      scanInfo.scantype = "";
      scanInfo.tasktype = 1;
      this.setState({ newScanModal: true, scanInfo: scanInfo, isiprange: false });
   }
   onModify(id) {
      let { scanList, scanInfo } = this.state;
      scanList.map((data, index) => {
         if (data.id == id) {
            scanInfo = scanList[index];
         }
      })
      if (scanInfo.assetgroupid == -1) {
         this.setState({ isiprange: true })
         var iplist = scanInfo.iprange.split(",");
         scanInfo.iprange_start = iplist[0];
         scanInfo.iprange_end = iplist[1];
      } else {
         this.setState({ isiprange: false })
      }
      let scantype = scanInfo.scantype;
      let scantypename = scantype.split(",");
      scantypename.map((data) => {
         this.setState({ [data]: true });
      });
      this.setState({ newScanModal: true, scanInfo: scanInfo, modalTitle: "Modify " + scanInfo.name});
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
                           <div className="card-header"><i className="zmdi zmdi-layers"></i> <span> Scan </span></div>
                           <div className="card-body">
                              <div className="row m-2">
                                 <div className="col-8">
                                    <Button className="btn btn-light waves-effect waves-light m-1" onClick={this.newScan.bind(this)}>Add New Scan</Button>
                                 </div>
                                 {/* <div className='col-4'>
                                    <input type="text" className="form-control m-1" placeholder="Enter keywords" />
                                 </div> */}
                              </div>
                              <div className="row">
                                 <div className="col-12">
                                    <div className="table-responsive">
                                       <table className="table table-bordered">
                                          <thead>
                                             <tr className="text-center">
                                                <th scope="col">#</th>
                                                <th scope="col">Name</th>
                                                <th scope="col">Last updated</th>
                                                <th scope="col">Status</th>
                                                <th scope="col">Action</th>
                                             </tr>
                                          </thead>
                                          <tbody>
                                             {this.scalList()}
                                          </tbody>
                                       </table>
                                    </div>
                                 </div>
                              </div>
                           </div>
                           <Modal
                              className="modal-dialog modal-lg modal-dialog-centered"
                              isOpen={this.state.newScanModal}
                              toggle={() => {
                                 this.setState({
                                    newScanModal: !this.state.newScanModal
                                 });
                              }}
                           >
                              <Form method="post" onSubmit={this.onSubmit.bind(this)}>
                                 <ModalHeader>{this.state.modalTitle}</ModalHeader>
                                 <ModalBody className="m-3">
                                    <div className="row m-2">
                                       <div className="col-2 text-right">
                                          <label>Name</label>
                                       </div>
                                       <div className="col-10">
                                          <Input
                                             name="name"
                                             required
                                             value={this.state.scanInfo.name}
                                             placeholder="Enter New Scan Name"
                                             type="text"
                                             // onBlur={this.handleBlur}
                                             onChange={this.handleChange.bind(this)}
                                          />
                                       </div>
                                    </div>
                                    <div className="row m-2">
                                       <div className="col-2 text-right">
                                          <label>Target</label>
                                       </div>
                                       <div className="col-4">
                                          <Input type="select"
                                             value={this.state.scanInfo.assetgroupid}
                                             name="assetgroupid"
                                             placeholder="IP Address range / Asset Groups"
                                             onChange={this.handleSelectChange.bind(this)}
                                          >
                                             <option key="-2" value="-2"></option>
                                             <option key="-1" value="-1">Ip Range</option>
                                             {this.state.assetGrouList.map((result) => {
                                                return (<option value={result.id} key={result.id}>{result.name}</option>)
                                             })}
                                          </Input>
                                       </div>
                                       {this.state.isiprange &&
                                          <div className="col-6">
                                             <Input type="text"
                                                value={this.state.scanInfo.iprange_start}
                                                name="iprange_start"
                                                placeholder="Start IP Address"
                                                onChange={this.handleChange.bind(this)}
                                             />
                                             <div className="mt-1">
                                                <Input type="text"
                                                   value={this.state.scanInfo.iprange_end}
                                                   name="iprange_end"
                                                   placeholder="End IP Address"
                                                   onChange={this.handleChange.bind(this)}
                                                />
                                             </div>
                                          </div>
                                       }
                                    </div>
                                    <div className="row m-2">
                                       <div className="col-6 text-right">
                                          <label>Lightweight Active scan</label>
                                       </div>
                                       <div className="col-6">
                                          <Input type="checkbox" checked={this.state.lightweight} name="lightweight" style={{ width: "100px" }} onChange={this.handleCheckBoxClick.bind(this)}></Input>
                                       </div>
                                    </div>
                                    <div className="row m-2">
                                       <div className="col-6 text-right">
                                          <label>Full Active Scan</label>
                                       </div>
                                       <div className="col-6">
                                          <Input type="checkbox" checked={this.state.fullactive} name="fullactive" style={{ width: "100px" }} onChange={this.handleCheckBoxClick.bind(this)}></Input>
                                       </div>
                                    </div>
                                    <div className="row m-2">
                                       <div className="col-6 text-right">
                                          <label>Passive Vulnerability Scan</label>
                                       </div>
                                       <div className="col-6">
                                          <Input type="checkbox" checked={this.state.vulnerabilityscan} name="vulnerabilityscan" style={{ width: "100px" }}
                                             onChange={this.handleCheckBoxClick.bind(this)}></Input>
                                       </div>
                                    </div>
                                    <div className="row m-2">
                                       <div className="col-6 text-right">
                                          <label>Firmware Scan(Passive)</label>
                                       </div>
                                       <div className="col-6">
                                          <Input type="checkbox" checked={this.state.firmwarescan} name="firmwarescan" style={{ width: "100px" }}
                                             onChange={this.handleCheckBoxClick.bind(this)}></Input>
                                       </div>
                                    </div>
                                    <div className="row m-2">
                                       <div className="col-2 text-right">
                                          <label>TaskType</label>
                                       </div>
                                       <div className="col-4">
                                          <Input type="select"
                                             value={this.state.scanInfo.tasktype}
                                             name="tasktype"
                                             placeholder="IP Address range / Asset Groups"
                                             onChange={this.handleSelectChange.bind(this)}
                                          >
                                             <option key="1" value="1">Now</option>
                                             <option key="2" value="2">Hourly</option>
                                             <option key="3" value="3">Monthly</option>
                                             <option key="4" value="4">Quartely</option>
                                             <option key="5" value="5">Yearly</option>
                                          </Input>
                                       </div>
                                    </div>
                                 </ModalBody>
                                 <ModalFooter>
                                    <Button
                                       className="btn btn-light"
                                       onClick={e => {
                                          this.setState({ newScanModal: false });
                                       }}
                                    >
                                       Cancel
                        </Button>
                                    <Button className="btn btn-white" type="submit">
                                       Submit
                        </Button>
                                 </ModalFooter>
                              </Form>
                           </Modal>
                        </div>
                     </div>
                  </div>
               </div>
            </div>
         </>
      )
   }
}

export default Scan;
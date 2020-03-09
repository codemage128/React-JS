import React, { Component } from "react";
import { Link } from "react-router-dom";
import { Modal, ModalHeader, ModalBody, ModalFooter, Button, FormGroup, Input, Form } from "reactstrap";
import Sidebar from "../../Components/Sidebar";
import Footer from "../../Components/Footer";
import Header from "../../Components/Header";
import { ASSET_IMPORT_LIST, CREATE_ASSET_IMPORT } from "../../Graphql/asset";

class AssetImport extends Component {
   constructor(props) {
      super(props);
      this.input = React.createRef();
      this.state = {
         importmodal: false,
         importType: 1, // 0: null , 1: DB, 2: csv
         productType: 1, //0: null, 1: lansweeper, 2: rumble, ...
         assetImportList: [

         ],
         assetImportData: {
         }
      }
   }
   componentDidMount() {
      let islogin = localStorage.getItem("islogin");
      if (!islogin) {
         this.props.history.push('/login');
      }
      const { assetImportData } = this.state;
      assetImportData['product'] = this.state.productType;
      assetImportData['importtype'] = this.state.importType;
      this.getAssetImportList();
   }
   getAssetImportList() {
      let client = this.props.client;
      let { assetImportList } = this.state;
      client.query({ query: ASSET_IMPORT_LIST, variables: { username: localStorage.getItem('username') } })
         .then((result) => {
            let resultdata = result.data.allAssetimportlist;
            assetImportList = resultdata;
            this.setState({ assetImportList: assetImportList });
         })
         .catch((error) => console.log(error));
   }
   import() {
      const { assetImportData } = this.state;
      assetImportData.id = 0;
      assetImportData.name = "";
      assetImportData.product = "";
      assetImportData.importtype = "";
      assetImportData.information = "";
      this.setState({ importmodal: true, assetImportData: assetImportData });
   }
   handleChangeSelect(event) {
      const { name, value } = event.target;
      const { assetImportData } = this.state;
      if (name == "importType") {
         this.setState({ importType: value });
         assetImportData['importtype'] = value;
      }
      if (name == "productType") {
         this.setState({ productType: value });
         assetImportData['product'] = value;
      }
      this.setState({ assetImportData: assetImportData });
   }
   handleChange(event) {
      const { name, value } = event.target;
      const { assetImportData } = this.state;
      assetImportData[name] = value;
      assetImportData['fileupload'] = "";
      if (assetImportData['importtype'] == "2") {
         assetImportData['fileupload'] = event.target.files;
      }
      this.setState({ assetImportData: assetImportData });
   }
   importTypeView() {
      const { importType } = this.state;
      if (importType == 1) //DB
      {
         return (
            <div className="row m-2">
               <div className="col-3 text-right">
                  <label>DB Information</label>
               </div>
               <div className="col-9">
                  <Input
                     name="information"
                     required
                     placeholder="Enter Database Information"
                     type="text"
                     ref={this.input}
                     value={this.state.assetImportData.information}
                     // onBlur={this.handleBlur}
                     onChange={this.handleChange.bind(this)}
                  // invalid={"name" in errors}
                  />
               </div>
            </div>
         )
      }
      if (importType == 2) {
         return (
            <div className="row m-2">
               <div className="col-3 text-right">
                  <label>Import CSV File</label>
               </div>
               <div className="col-9">
                  <Input
                     name="information"
                     placeholder="Enter Database Information"
                     type="file"
                     className="form-control"
                     // onBlur={this.handleBlur}
                     onChange={this.handleChange.bind(this)}
                  // invalid={"name" in errors}
                  />
               </div>
            </div>
         )
      } else {
         return (
            <div className="row m-2">
               <div className="col-12 text-center">
                  Please Choose Import Type!
               </div>
            </div>
         )
      }
   }
   onModify(id) {
      const { assetImportData, assetImportList } = this.state;
      assetImportList.forEach(element => {
         if (element.id == id) {
            assetImportData.id = element.id;
            assetImportData.name = element.name;
            assetImportData.product = element.product;
            assetImportData.importtype = element.importtype;
            assetImportData.information = element.info;
            this.setState({ assetImportData: assetImportData });
         }
      });
      this.setState({ importmodal: true });
   }
   assetImportList() {
      if (this.state.assetImportList.length > 0) {
         return this.state.assetImportList.map((column, index) => {
            return (
               <tr className="text-center">
                  <td scope="col" style={{ verticalAlign: 'middle' }}>{index + 1}</td>
                  <td scope="col" style={{ verticalAlign: 'middle' }}>
                     {column.name}
                  </td>
                  {column.product == 1 && <td scope="col" style={{ verticalAlign: 'middle' }}>Lansweeper</td>}
                  {column.product == 2 && <td scope="col" style={{ verticalAlign: 'middle' }}>Rumble</td>}
                  {column.importtype == 1 && <td scope="col" style={{ verticalAlign: 'middle' }}>DB</td>}
                  {column.importtype == 2 && <td scope="col" style={{ verticalAlign: 'middle' }}>CSV</td>}
                  <td scope="col" style={{ verticalAlign: 'middle' }}>{Date(column.updatedAt)}</td>
                  <td scope="col" style={{ verticalAlign: 'middle' }}>
                     {column.importtype == 1 &&
                        <button className="btn btn-light" onClick={e => this.onModify(column.id)}>Modifiy</button>
                     }
                  </td>
               </tr>
            );
         });
      } else {
         return (
            <tr>
               <td colSpan={7} className="text-center td-noredords">
                  No AssetGroup List Found.
            </td>
            </tr>
         )
      }
   }
   onSubmit(event) {
      event.preventDefault();
      const { assetImportData, assetImportList } = this.state;
      const { client } = this.props;
      const { id, name, product, importtype, information, fileupload } = this.state.assetImportData;
      const username = localStorage.getItem('username');
      client.mutate({
         mutation: CREATE_ASSET_IMPORT, variables: {
            id: id,
            name: name, product: product, importtype: importtype, information: information, fileupload: fileupload, username: username
         }
      })
         .then((result) => {
            if (result.data.createAssetimport.createSuccess) {
               const _assetImport = result.data.createAssetimport.assetImport;
               if (assetImportData.id == 0) {
                  assetImportList.push(_assetImport);
               } else {
                  assetImportList.map((data, index) => {
                     if (data.id == _assetImport.id) {
                        assetImportList[index] = _assetImport;
                     }
                  });
               }
               this.setState({ importmodal: false, assetImportList: assetImportList });
            }
         })
         .catch((error) => console.log(error));
   }
   render() {
      return (
         <>
            <div className="row m-2">
               <div className="col-8">
                  <button className="btn btn-light waves-effect waves-light m-1" type="button" onClick={this.import.bind(this)}>Import Asset</button>
               </div>
            </div>
            <div className="row">
               <div className="col-12">
                  <div className="table-responsive">
                     <table className="table table-bordered">
                        <thead>
                           <tr className="text-center">
                              <th scope="col">#</th>
                              <th scope="col">Name</th>
                              <th scope="col">Product</th>
                              <th scope="col">Type</th>
                              <th scope="col">Date</th>
                              <th scope="col">Action</th>
                           </tr>
                        </thead>
                        <tbody>
                           {this.assetImportList()}
                        </tbody>
                     </table>
                  </div>
               </div>
            </div>
            <Modal
               className="modal-dialog modal-lg modal-dialog-centered"
               isOpen={this.state.importmodal}
               toggle={() => {
                  this.setState({
                     importmodal: !this.state.importmodal
                  });
               }}
            >
               <Form onSubmit={this.onSubmit.bind(this)} method="post">
                  <ModalHeader>Import Asset</ModalHeader>
                  <ModalBody className="m-3">
                     <div className="row m-2">
                        <div className="col-3 text-right">
                           <label>Name</label>
                        </div>
                        <div className="col-9">
                           <Input
                              name="name"
                              required
                              placeholder="Enter Asset Group Name"
                              type="text"
                              value={this.state.assetImportData.name}
                              // onBlur={this.handleBlur}
                              onChange={this.handleChange.bind(this)}
                           // invalid={"name" in errors}
                           />
                        </div>
                     </div>
                     <div className="row m-2">
                        <div className="col-3 text-right">
                           <label>Product Type</label>
                        </div>
                        <div className="col-9">
                           <Input
                              name="productType"
                              required
                              type="select"
                              value={this.state.assetImportData.product}
                              onChange={this.handleChangeSelect.bind(this)}
                           >
                              <option key="0" value='0'></option>
                              <option key="1" value='1'>Lansweeper</option>
                              <option key="2" value='2'>Rumble</option>
                           </Input>
                        </div>
                     </div>
                     <div className="row m-2">
                        <div className="col-3 text-right">
                           <label>Import Type</label>
                        </div>
                        <div className="col-9">
                           <Input
                              name="importType"
                              required
                              type="select"
                              value={this.state.assetImportData.importtype}
                              onChange={this.handleChangeSelect.bind(this)}
                           >
                              <option key="0" value='0'></option>
                              <option key="1" value='1'>DB</option>
                              <option key="2" value='2'>CSV</option>
                           </Input>
                        </div>
                     </div>
                     {this.importTypeView()}
                  </ModalBody>
                  <ModalFooter>
                     <Button
                        className="btn btn-light"
                        onClick={e => {
                           this.setState({ importmodal: false });
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
         </>
      )
   }
}

export default AssetImport;
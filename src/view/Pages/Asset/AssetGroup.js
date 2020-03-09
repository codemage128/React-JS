import React, { Component } from "react";
import Sidebar from "../../Components/Sidebar";
import Footer from "../../Components/Footer";
import Header from "../../Components/Header";
import { Link } from "react-router-dom";
import { Modal, ModalHeader, ModalBody, ModalFooter, Button, FormGroup, Input, Form } from "reactstrap";
import { ASSET_GROUP_LIST, CREATE_ASSET_GROUP } from "../../Graphql/asset";
import gql from "graphql-tag";
import { GETUSERS } from "../../Graphql/auth";



class AssetGroup extends Component {
   constructor(props) {
      super(props);
      this.state = {
         modalTitle : "Add New Asset Group",
         newAssetGroupModal: false,
         definitionDataList: [
            {
               type: "",
               operator1: "",
               value: "",
               value_start:"",
               value_end: "",
               operator2: "",
               isiprange: false
            }
         ],
         assetGroupList: [],
         assetGroupInfo: {
            id: 0,
            name: "",
            description: "",
            tag: "",
            definition: "",
         }
      }
   }
   componentDidMount() {
      let islogin = localStorage.getItem("islogin");
      if (!islogin) {
         this.props.history.push('/login');
      }
      this.getAssetGroupList();
   }
   getAssetGroupList = () => {
      let client = this.props.client;
      let { assetGroupList } = this.state;
      client.query({ query: ASSET_GROUP_LIST,  variables: { username: localStorage.getItem('username')}})
         .then((result) => {
            let resultdata = result.data.allAssetgrouplist;
            assetGroupList = resultdata;
            this.setState({ assetGroupList: assetGroupList });
         })
         .catch((error) => console.log(error));
   }
   addnewAsset() {
      let { assetGroupInfo ,definitionDataList} = this.state;
      assetGroupInfo.id = 0;
      assetGroupInfo.name = "";
      assetGroupInfo.description = "";
      assetGroupInfo.tag = "";
      assetGroupInfo.definition = "";
      definitionDataList = [];
      const initialData = {
         type: "",
         operator1: "",
         value: "",
         operator2: "",
         isiprange: false
      };
      definitionDataList.push(initialData);
      this.setState({ newAssetGroupModal: true, assetGroupInfo: assetGroupInfo, definitionDataList:definitionDataList});
   }
   addDefinitionData() {
      const { definitionDataList } = this.state;
      const initialData = {
         type: "",
         operator1: "",
         value: "",
         value_start: "",
         value_end: "",
         operator2: "",
         isiprange: false
      };
      definitionDataList.push(initialData);
      this.setState({ definitionDataList: definitionDataList });
   }
   handleChangeSelect = (event, index) => {
      const { name, value } = event.target;
      const { definitionDataList } = this.state;
      definitionDataList[index][name] = value;
      if (name == "type" && value == "ipAddress") {
         definitionDataList[index]['isiprange'] = true
      } else if(name == "type") {
         definitionDataList[index]['isiprange'] = false
      }
      this.setState({ definitionDataList: definitionDataList });
   }
   definition() {
      const length = this.state.definitionDataList.length;
      return this.state.definitionDataList.map((data, index) => {
         return (
            <>
               <div className="row mt-2">
                  <div className="col-3">
                     <Input
                        key={index}
                        name='type'
                        value={data.type}
                        required
                        type="select"
                        onChange={e => this.handleChangeSelect(e, index)}
                     >
                        <option key="0" value='0'></option>
                        <option key="1" value='assetType'>Type</option>
                        <option key="2" value='ipAddress'>IP Range</option>
                        <option key="3" value='operatingSystem'>OS Model</option>
                        <option key="4" value='manufacturer'>Manufacture</option>
                        <option key="5" value='4'>Risk Score</option>
                     </Input>
                  </div>
                  <div className="col-2">
                     <Input
                        key={index}
                        name="operator1"
                        value={data.operator1}
                        required
                        type="select"
                        onChange={e => this.handleChangeSelect(e, index)}
                     >
                        <option key="0" value='0'></option>
                        <option key="1" value='='>=</option>
                     </Input>
                  </div>
                  <div className="col-3">
                     {data.isiprange == false &&
                        <Input
                           key={index}
                           name="value"
                           value={data.value}
                           type="text"
                           onChange={e => this.handleChangeSelect(e, index)}
                        />
                     }
                     {data.isiprange == true &&
                        <>
                           <Input
                              key={index}
                              name="value_start"
                              value={data.value_start}
                              type="text"
                              placeholder="Start IpAddress"
                              onChange={e => this.handleChangeSelect(e, index)}
                           />
                           <div className="mt-1">
                              <Input
                                 key={index}
                                 name="value_end"
                                 value={data.value_end}
                                 type="text"
                                 placeholder="End IpAddress"
                                 onChange={e => this.handleChangeSelect(e, index)}
                              />
                           </div>
                        </>
                     }
                  </div>
                  <div className="col-2">
                     <Input
                        key={index}
                        name="operator2"
                        value={data.operator2}
                        required
                        type="select"
                        onChange={e => this.handleChangeSelect(e, index)}
                     >
                        <option key="0" value='0'></option>
                        <option key="1" value='and'>&&</option>
                        <option key="2" value='or'>||</option>
                     </Input>
                  </div>
                  {index == length - 1 &&
                     <div className="col-1">
                        <Button className="btn btn-light" onClick={this.addDefinitionData.bind(this)}>ADD</Button>
                     </div>
                  }
               </div>
            </>
         )
      })
   }
   onModify(id) {
      let { assetGroupList, assetGroupInfo, definitionDataList } = this.state;
      assetGroupList.forEach(element => {
         if (element.id == id) {
            assetGroupInfo.id = element.id;
            assetGroupInfo.name = element.name;
            assetGroupInfo.description = element.description;
            assetGroupInfo.tag = element.tag;
            assetGroupInfo.definition = element.definition;
            definitionDataList = JSON.parse(assetGroupInfo.definition);
            definitionDataList.map((data, index) => {
               if(data.type == "ipAddress"){
                  definitionDataList[index].isiprange = true;
               }
            });
            this.setState({modalTitle: "Modify Asset " + assetGroupInfo.name});
            this.setState({ assetGroupInfo: assetGroupInfo, definitionDataList: definitionDataList });
         }
      });
      this.setState({ newAssetGroupModal: true })
   }
   assetGroupList() {
      if (this.state.assetGroupList.length > 0) {
         return this.state.assetGroupList.map((column, index) => {
            return (
               <tr className="text-center">
                  <td scope="col" style={{ verticalAlign: 'middle' }}>{index + 1}</td>
                  <td scope="col" style={{ verticalAlign: 'middle' }}>
                     <Link to={"assets/detail" + column.id} ><span style={{ color: '#03d0ea' }}>{column.name}</span></Link>
                  </td>
                  <td scope="col" style={{ verticalAlign: 'middle' }}>{column.tag}</td>
                  <td scope="col" style={{ verticalAlign: 'middle' }}>{column.ipCount}</td>
                  <td scope="col" style={{ verticalAlign: 'middle' }}>{Date(column.updatedAt)}</td>
                  <td scope="col" style={{ verticalAlign: 'middle' }}>
                     <button className="btn btn-light" onClick={e => this.onModify(column.id)}>Modifiy</button>
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
   handleChange(event) {
      const { assetGroupInfo, newAssetGroupModal } = this.state;
      const { name, value } = event.target;
      if (newAssetGroupModal) {
         assetGroupInfo[name] = value;
         assetGroupInfo['definition'] = this.addDefinitionData;
      }
      this.setState({ assetGroupInfo: assetGroupInfo });
   }
   onSubmit(event) {
      event.preventDefault();
      const { assetGroupInfo, assetGroupList, definitionDataList } = this.state;
      assetGroupInfo['definition'] = JSON.stringify(definitionDataList);
      this.setState({ assetGroupInfo: assetGroupInfo });
      const { client } = this.props;
      let { name, description, tag, definition, id } = this.state.assetGroupInfo;
      const username = localStorage.getItem('username');
      client.mutate({ mutation: CREATE_ASSET_GROUP, variables: { id: id, name: name, description: description, tag: tag, definition: definition, username: username} })
         .then((result) => {
            if (result.data.createAssetgroup.createSuccess) {
               const _assetGroup = result.data.createAssetgroup.assetGroup;
               if (assetGroupInfo.id == 0) {
                  assetGroupList.push(_assetGroup);
               } else {
                  assetGroupList.map((data, index) => {
                     if (data.id == _assetGroup.id) {
                        assetGroupList[index] = _assetGroup;
                     }
                  });
               }
               this.setState({ newAssetGroupModal: false, assetGroupList: assetGroupList });
            }
         })
         .catch((error) => console.log(error));
   }
   render() {
      return (
         <>
            <div className="row m-2">
               <div className="col-8">
                  <Button className="btn btn-light waves-effect waves-light m-1" onClick={this.addnewAsset.bind(this)}>New Asset Group</Button>
               </div>
               <div className='col-4'>
                  <input type="text" className="form-control m-1" placeholder="Enter keywords" />
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
                              <th scope="col">Tag</th>
                              <th scope="col">IPs</th>
                              <th scope="col">Last Modified</th>
                              <th scope="col">Action</th>
                           </tr>
                        </thead>
                        <tbody>
                           {this.assetGroupList()}
                        </tbody>
                     </table>
                  </div>
               </div>
            </div>
            <Modal
               className="modal-dialog modal-lg modal-dialog-centered"
               isOpen={this.state.newAssetGroupModal}
               toggle={() => {
                  this.setState({
                     newAssetGroupModal: !this.state.newAssetGroupModal
                  });
               }}
            >
               <Form onSubmit={this.onSubmit.bind(this)} method="post">
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
                              value={this.state.assetGroupInfo.name}
                              placeholder="Enter Asset Group Name"
                              type="text"
                              // onBlur={this.handleBlur}
                              onChange={this.handleChange.bind(this)}
                           />
                        </div>
                     </div>
                     <div className="row m-2">
                        <div className="col-2 text-right">
                           <label>Description</label>
                        </div>
                        <div className="col-10">
                           <Input type="textarea"
                              value={this.state.assetGroupInfo.description}
                              name="description" onChange={this.handleChange.bind(this)} />
                        </div>
                     </div>
                     <div className="row m-2">
                        <div className="col-2 text-right">
                           <label>Tag</label>
                        </div>
                        <div className="col-10">
                           <Input
                              name="tag"
                              value={this.state.assetGroupInfo.tag}
                              placeholder="Enter Tag"
                              type="number"
                              // onBlur={this.handleBlur}
                              onChange={this.handleChange.bind(this)}
                           // invalid={"name" in errors}
                           />
                        </div>
                     </div>
                     <div className="row m-2">
                        <div className="col-2 text-right">
                           <label>Definition</label>
                        </div>
                        <div className="col-10">
                           {this.definition()}
                        </div>
                     </div>
                  </ModalBody>
                  <ModalFooter>
                     <Button
                        className="btn btn-light"
                        onClick={e => {
                           this.setState({ newAssetGroupModal: false });
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

export default AssetGroup;
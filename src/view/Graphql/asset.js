import { gql } from '@apollo/client';

export const ASSET_GROUP_LIST = gql`query($username: String){
  allAssetgrouplist(username: $username){
    id
    name
    description
    tag
    ipCount
    definition
    updatedAt
  }
}`;
export const ASSET_IMPORT_LIST = gql`query($username: String){
   allAssetimportlist(username: $username){
     id
     name
     product
     importtype
     info
     updatedAt
   }
 }`;
export const ASSET_INFO = gql`query($id: Int){
   getAssetinfo(id: $id){
      id
      ipAddress
      manufacturer
      model
      macAddress
      assetType
      operatingSystem
      description
      isFirmwareScanned
      name
      firmwareVersion
      discontinued
      outdated
      assetOvVulnerabilitesSet{
         ovid{
            cveid
            severity
         }
      }
      assetVulnerabilitesSet{
         vulid{
            cvss
            cveid
         }
      }
      assetFirmwaredetailSet{
         fdetailid{
            componentname
            vulnerabilities
            issues
         }
       }
      }
}`
export const ASSET_GROUP_DETAIL_LIST = gql`
query($id: Int){
   getAssetgroupdetaillist(id:$id){
      id
      ipAddress
      macAddress
      manufacturer
      model
   }
}`;

export const CREATE_ASSET_GROUP = gql`
   mutation($id: Int!, $name: String!, $description: String!, $tag: String!, $definition: String!, $username: String!){
   createAssetgroup(id: $id, name: $name, description: $description, tag: $tag, definition:$definition, username: $username){
      createSuccess
      assetGroup{
         id
         name
         description
         tag
         ipCount
         definition
         updatedAt
      }
      }
   }`
export const CREATE_ASSET_IMPORT = gql`
mutation($id: Int!, $name: String!, $product: String!, $importtype:String!, $information: String!, $fileupload: Upload!, $username: String!){
   createAssetimport(id: $id,name: $name, product: $product, importtype:$importtype, information: $information, fileupload:$fileupload, username: $username){
      createSuccess
      assetImport{
         id
         name
         product
         importtype
         info
         updatedAt
      }
   }
}`

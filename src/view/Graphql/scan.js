import { gql } from '@apollo/client';

export const GET_SCAN_LIST = gql`query($username: String!){
   allScanlist(username: $username){
      id
      name
      assetgroupid
      iprange
      status
      scantype
      tasktype
      tags
      updatedAt
      status
   }
}`;
export const CHECK_RESULT = gql`query($task: String){
   getTaskResult(task: $task){
      status
   }
}`
export const CREATE_SCAN = gql`
mutation($id: Int!, $name: String!, $assetgroupid: Int!, $iprange: String!, $scantype: String!, $tasktype: Int!, $username: String!){
   createScan(id: $id, name: $name, assetgroupid: $assetgroupid, iprange: $iprange, scantype: $scantype, tasktype: $tasktype, username: $username){
      scan{
         id
         name
         assetgroupid
         iprange
         status
         scantype
         tasktype
         tags
         updatedAt
         status
      }
      createSuccess
   }
}`

export const SCAN_DETAIL_LIST = gql`query($id: Int!, $username: String!){
   getScandetaillist(id: $id, username: $username){
      id
      ipAddress
      assetVulnerabilitesSet{
         id
         vulid{
            cveid
            cvss
         }
      }
      assetOvVulnerabilitesSet{
         id
         ovid{
            cveid
            severity
         }
      }
      assetFirmwaredetailSet{
         id
         fdetailid{
            firmwarename
            vulnerabilities
         }
      }
   }
}`
export const ASSET_VUL_DETAIL_LIST = gql`query($id: Int!){
   getAssetvullist(id: $id){
      id
      ipAddress
      assetVulnerabilitesSet{
         id
         vulid{
            cveid
            cvss
         }
      }
      assetFirmwaredetailSet{
         id
         fdetailid{
            firmwarename
            vulnerabilities
         }
      }
   }
}`
export const TOP_MANUFACTURER = gql`query($username: String!){
   getTopmanufacturetype(username: $username){
      manufacturer
      count
   }
}`
export const TOP_DEVICETYPE = gql`query($username: String!){
   getTopdevicetype(username: $username){
      name
      count
   }
}`
export const TOP_MOSTACTIVE = gql`query($username: String!){
   getMostactivescan(username: $username){
      ipAddress
      model
      manufacturer
      assetOvVulnerabilitesSet{
         ovid{
            severity
         }
      }
   }
}`
export const TOP_MOSTPASSIVE = gql`query($username: String!){
   getPassivescan(username: $username){
    ipAddress
    model
    manufacturer
    assetVulnerabilitesSet{
      vulid{
        cvss
      }
    }
  }
}`
export const ALL_VUL_LIST = gql`query($username: String!){
   allVullist(username: $username){
      id
      cveid
      cwe
      cvss
      summary
      references
   }
}`
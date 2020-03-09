import { gql } from '@apollo/client';

export const GET_UERID = gql`
query($email: String!){
  me(email: $email){
  id
  email
  apikey
  }
}`

export const GET_API = gql`
query($username: String!){
  apikey(username: $username){
    apikey
  }
}`

export const UPDATE_API = gql`
mutation($password: String!, $apikey: String!, $username: String!){
  updateApi(password: $password, apikey: $apikey, username: $username){
    customer{
      apikey
    }
  }
}`

export const GETTOKEN = gql`
  mutation($username: String!, $password: String!) { 
    tokenAuth(username: $username, password: $password) {
      token
    }
  }
`;
export const VERIFYTOKEN = gql`
  mutation($token: String!){
    verifyToken(token: $token){
      payload
    }
  }
`;
export const GETUSERS = gql`
{
  users{
    id
    username
    password
    email
  }
}
`
export const CREAT_USER = gql`
  mutation($firstname: String!, $lastname: String!, $companyname: String!, $jobtitle: String!, $phone: String!, $email: String!, $password: String!){
  createUser(firstname: $firstname, lastname: $lastname, companyname: $companyname, jobtitle: $jobtitle, phone: $phone, email: $email, password:$password){
    user{
      username
      email
    }
  }
}
`
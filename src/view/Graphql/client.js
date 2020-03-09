import { ApolloClient } from "apollo-boost";
import { createHttpLink } from "apollo-link-http";
import { InMemoryCache } from "apollo-cache-inmemory";
import { ApolloLink } from 'apollo-link';
import { createUploadLink} from "apollo-upload-client";
import {backend_url} from "../../setting";

const httpLink = createUploadLink({
   uri: backend_url,
   credentials: 'same-origin'
})

const middlewareLink = new ApolloLink((operation, forward) => {
   const token = localStorage.getItem('authToken')
   const authorizationHeader = token ? `Bearer ${token}` : null
   operation.setContext({
      headers: {
         authorization: authorizationHeader
      }
   })
   return forward(operation)
})

const httpLinkWithAuthToken = middlewareLink.concat(httpLink)

const client = new ApolloClient({
   link: httpLinkWithAuthToken,
   cache: new InMemoryCache()
})
export default client;
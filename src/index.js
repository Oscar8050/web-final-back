import React from 'react'
import ReactDOM from 'react-dom'
import {
    ApolloClient,
    InMemoryCache,
    ApolloProvider,
    HttpLink,
} from "@apollo/client";
import { split } from "apollo-link";
import { WebSocketLink } from "apollo-link-ws";
import { getMainDefinition } from "apollo-utilities";
import './index.css'
import App from './App.js'
import 'antd/dist/antd.min.css'

// Create an http link:
const httpLink = new HttpLink({
    uri: 'https://web-programmingb09.herokuapp.com/',
});

// Create a WebSocket link:
const wsLink = new WebSocketLink({
    uri: `ws://web-programmingb09.herokuapp.com`,
    options: { reconnect: true },
});

// using the ability to split links, you can send data to each link
// depending on what kind of operation is being sent
const link = split(
    // split based on operation type
    ({ query }) => {
        const definition = getMainDefinition(query);
        return (
            definition.kind === 'OperationDefinition' &&
            definition.operation === 'subscription'
        );
    },
    wsLink,
    httpLink,
);

const client = new ApolloClient({
    link,
    cache: new InMemoryCache().restore({}),
});

ReactDOM.render(
    <ApolloProvider client={client}>
        <App />
    </ApolloProvider>,
    document.getElementById('root')
)


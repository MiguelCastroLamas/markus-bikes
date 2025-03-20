import { ApolloClient, InMemoryCache, HttpLink, from } from '@apollo/client';
import { onError } from '@apollo/client/link/error';

// Error handling link
const errorLink = onError(({ graphQLErrors, networkError }) => {
    if (graphQLErrors) {
        graphQLErrors.forEach(({ message, locations, path }) => {
            console.error(
                `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
            );
        });
    }
    if (networkError) {
        console.error(`[Network error]: ${networkError}`);
    }
});

const httpLink = new HttpLink({
    uri: 'http://localhost:4000/graphql',
    credentials: 'same-origin'
});

const link = from([errorLink, httpLink]);

export const client = new ApolloClient({
    link,
    cache: new InMemoryCache(),
    defaultOptions: {
        watchQuery: {
            fetchPolicy: 'cache-and-network',
        },
        query: {
            fetchPolicy: 'cache-first',
        },
    },
}); 
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import express, { Request } from 'express';
import http from 'http';
import cors from 'cors';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';

import { typeDefs } from './schema';
import { resolvers } from './resolvers';
import { ProductAPI } from './dataSources/ProductAPI';

// Load environment variables
dotenv.config();

// Simple interface for request with timestamp
interface TimedRequest extends Request {
    timestamp?: number;
}

const PORT = process.env.PORT || 4000;

async function startServer() {
    const app = express();

    // Basic middleware
    app.use(cors());
    app.use(bodyParser.json());

    // Configure Apollo Server without caching
    const apolloServer = new ApolloServer({
        typeDefs,
        resolvers,
        introspection: true,
    });

    await apolloServer.start();

    // Create data sources
    const dataSources = {
        productAPI: new ProductAPI({
            baseURL: process.env.PRODUCT_SERVICE_URL || 'http://localhost:3001',
        }),
    };

    // Apply Apollo Server middleware
    app.use(
        '/graphql',
        cors<cors.CorsRequest>(),
        bodyParser.json(),
        expressMiddleware(apolloServer, {
            context: async ({ req }) => ({
                token: req.headers.authorization || '',
                dataSources,
            }),
        }),
    );

    // Add a healthcheck endpoint
    app.get('/health', (_, res) => {
        res.status(200).json({ status: 'ok' });
    });

    // Start HTTP server
    const httpServer = http.createServer(app);
    await new Promise<void>((resolve) => httpServer.listen({ port: PORT }, resolve));
    console.log(`Server ready at http://localhost:${PORT}/graphql`);
}

// Start the server
startServer().catch((err) => {
    console.error('Failed to start server:', err);
}); 
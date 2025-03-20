import React from 'react';
import ReactDOM from 'react-dom/client';
import './globals.css';
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import * as Sentry from '@sentry/react';
import { CartProvider } from './context/CartContext';
import { ApolloProvider } from '@apollo/client';
import { client } from './services/apollo/client';

// Initialize Sentry (would use actual DSN in production)
Sentry.init({
  dsn: "https://example@sentry.io/example",
  integrations: [],
  tracesSampleRate: 1.0,
});

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <React.StrictMode>
    <BrowserRouter>
      <ApolloProvider client={client}>
        <CartProvider>
          <App />
        </CartProvider>
      </ApolloProvider>
    </BrowserRouter>
  </React.StrictMode>
); 
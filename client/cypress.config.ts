import { defineConfig } from 'cypress';

export default defineConfig({
    e2e: {
        baseUrl: 'http://localhost:3000',
        setupNodeEvents(on, config) {
            // implement node event listeners here
        },
        testIsolation: false,
        defaultCommandTimeout: 10000,
        viewportWidth: 1920,
        viewportHeight: 1080,
        video: false,
        screenshotOnRunFailure: false
    },
    component: {
        devServer: {
            framework: 'react',
            bundler: 'webpack',
        },
    },
}); 
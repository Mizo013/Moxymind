import { test as base } from '@playwright/test';
import PomManager from '../pages/ManagePage';

/**
 * Custom test fixtures for Playwright
 * Extends the base test with Page Object Manager (POM) fixture
 * Provides centralized access to all page objects in tests
 */
type MyFixtures = {
    pm: PomManager; // Page Object Manager - provides access to all page objects
};

/**
 * Extended test function with custom fixtures
 * The 'pm' fixture instantiates a new PomManager for each test,
 * ensuring clean page object instances per test execution
 */
export const test = base.extend<MyFixtures>({

    pm: async ({ page }, use) => {
        // Create a new PomManager instance for each test
        // This ensures test isolation and prevents state leakage between tests
        await use(new PomManager(page));
    },


});

export { expect } from '@playwright/test';
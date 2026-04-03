import { Page, expect } from "@playwright/test";

/**
 * LoginPage - Handles login page interactions
 * Provides methods for navigating to login page, entering credentials, and verifying login state
 */
export class LoginPage {
    constructor(private readonly page: Page) {}

    /**
     * Navigate to the login page (root URL)
     */
    async openLoginPage() {
        await this.page.goto('/');
    }

    /**
     * Perform user login with provided credentials
     * @param username - The username to enter in the login form
     * @param password - The password to enter in the login form
     */
    async userLogin(username: string, password: string){
        await this.page.locator('[data-test="username"]').fill(username);
        await this.page.locator('[data-test="password"]').fill(password);
        await this.page.locator('[data-test="login-button"]').click();
    }

    /**
     * Assert that logout was successful by verifying login button is visible
     * This indicates the user has been redirected back to the login page
     */
    async assertSuccessLogout(){
        await expect(this.page.locator('[data-test="login-button"]')).toBeVisible();
    }
}
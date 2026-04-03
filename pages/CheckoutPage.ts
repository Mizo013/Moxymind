import { Page, expect } from "@playwright/test";

/**
 * CheckoutPage - Handles checkout flow interactions
 * Manages checkout form filling, order overview verification, and order completion
 * Note: Contains repetitive switch statements that could be refactored to a product mapping object
 */
export class CheckoutPage {
    constructor(private readonly page: Page) {}

    /**
     * Fill the checkout information form
     * @param firstName - Customer's first name
     * @param lastName - Customer's last name
     * @param postalCode - Customer's postal code
     */
    async fillCheckoutForm(firstName: string, lastName: string, postalCode: string){
        await this.page.locator('[data-test="firstName"]').fill(firstName);
        await this.page.locator('[data-test="lastName"]').fill(lastName);
        await this.page.locator('[data-test="postalCode"]').fill(postalCode);
    }

    /**
     * Continue to the checkout overview page
     */
    async continueCheckout(){
        await this.page.locator('[data-test="continue"]').click();
    }

    /**
     * Verify that the checkout overview page is loaded
     */
    async accessCheckoutOverview(){
        await expect(this.page).toHaveURL(/checkout-step-two.html/);
        await expect(this.page.locator('[data-test="checkout_summary_container"]')).toBeVisible();
    }

    /**
     * Assert that a product appears correctly in the checkout overview
     * Note: This method uses a switch statement to map product names to display text.
     * Consider refactoring to use a product mapping object for better maintainability.
     * @param product - The product name to verify
     * @param rank - The position/index of the product in the checkout list (1-based)
     * @param count - The quantity of the product
     * @param price - The expected price of the product
     */
    async assertCheckoutOverview(product: string, rank: number, count: number, price: number){
        // Product name mapping - maps internal product names to display names       

        switch ( product ) {
            case 'Sauce Labs Backpack':
                await expect(this.page.locator(`[data-test="inventory-item-name"]`).nth(rank-1)).toContainText('Sauce Labs Backpack');
                break;
            case 'Sauce Labs Bike Light':
                await expect(this.page.locator(`[data-test="inventory-item-name"]`).nth(rank-1)).toContainText('Sauce Labs Bike Light');
                break;
            case 'Sauce Labs Bolt T-Shirt':
                await expect(this.page.locator(`[data-test="inventory-item-name"]`).nth(rank-1)).toContainText('Sauce Labs Bolt T-Shirt');
                break;
            case 'Sauce Labs Fleece Jacket':
                await expect(this.page.locator(`[data-test="inventory-item-name"]`).nth(rank-1)).toContainText('Sauce Labs Fleece Jacket');
                break;
            case 'Sauce Labs Onesie':
                await expect(this.page.locator(`[data-test="inventory-item-name"]`).nth(rank-1)).toContainText('Sauce Labs Onesie');
                break;
            case 'T-Shirt':
                await expect(this.page.locator(`[data-test="inventory-item-name"]`).nth(rank-1)).toContainText('Test.allTheThings() T-Shirt (Red)');
                break;
            default:
                throw new Error(`Product ${product} not found`);
        }

        // Verify quantity and price for the product at the specified rank
        await expect(this.page.locator('[data-test="item-quantity"]').nth(rank-1)).toContainText(count.toString());
        await expect(this.page.locator('[data-test="inventory-item-price"]').nth(rank-1)).toHaveText(`$${price.toFixed(2)}`);
    }

    /**
     * Assert that the checkout summary displays correct subtotal, tax, and total
     * @param subtotal - The expected item subtotal
     * @param tax - The expected tax amount
     * @param total - The expected total amount
     */
    async assertCheckoutSummary(subtotal: number, tax: number, total: number){
        await expect(this.page.locator('[data-test="subtotal-label"]')).toContainText(`Item total: $${subtotal.toFixed(2)}`);
        await expect(this.page.locator('[data-test="tax-label"]')).toContainText(`Tax: $${tax.toFixed(2)}`);
        await expect(this.page.locator('[data-test="total-label"]')).toContainText(`Total: $${total.toFixed(2)}`);
    }

    /**
     * Complete the checkout process
     */
    async finishCheckout(){
        await this.page.locator('[data-test="finish"]').click();
    }

    /**
     * Assert that the checkout completion page is displayed with success message
     */
    async assertCheckoutComplete(){
        await expect(this.page).toHaveURL(/checkout-complete.html/);
        await expect(this.page.locator('[data-test="complete-header"]')).toContainText('Thank you for your order!');
        await expect(this.page.locator('[data-test="complete-text"]')).toContainText('Your order has been dispatched, and will arrive just as fast as the pony can get there!');
    }

}
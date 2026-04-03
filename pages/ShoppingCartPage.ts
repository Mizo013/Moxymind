import { Page, expect } from "@playwright/test";

/**
 * ShoppingCartPage - Handles shopping cart page interactions
 * Manages cart verification, product removal, and navigation to checkout
 * Note: Contains repetitive switch statements that could be refactored to a product mapping object
 */
export class ShoppingCartPage {
    constructor(private readonly page: Page) {}

    /**
     * Navigate directly to the shopping cart page
     */
    async openShoppingCart() {
        await this.page.goto('/cart.html');
    }

    /**
     * Verify the shopping cart badge shows the expected item count
     * @param count - The expected number of items in the cart
     */
    async accessShoppingCartCount(count: number){
        await expect(this.page.locator('[data-test="shopping-cart-badge"]')).toHaveText(count.toString());
    }

    /**
     * Verify that a product appears correctly in the shopping cart
     * Note: This method uses a switch statement to map product names to display text.
     * Consider refactoring to use a product mapping object for better maintainability.
     * @param product - The product name to verify
     * @param rank - The position/index of the product in the cart (1-based)
     * @param count - The quantity of the product
     * @param price - The expected price of the product
     */
    async accessProductInCart(product: string, rank: number, count: number, price: number){
        // Product name mapping - maps internal product names to display names
        // TODO: Refactor this switch statement to a lookup object for better maintainability
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
     * Remove a product from the shopping cart
     * Note: This method uses a switch statement to map product names to remove button selectors.
     * Consider refactoring to use a product mapping object for better maintainability.
     * @param product - The product name to remove from cart
     */
    async removeProduct(product: string){
        // Product removal mapping - maps product names to their remove button data-test attributes
        // TODO: Refactor this switch statement to a lookup object for better maintainability
        switch ( product ) {
            case 'Sauce Labs Backpack':
                await this.page.locator('[data-test="remove-sauce-labs-backpack"]').click();
                break;
            case 'Sauce Labs Bike Light':
                await this.page.locator('[data-test="remove-sauce-labs-bike-light"]').click();
                break;
            case 'Sauce Labs Bolt T-Shirt':
                await this.page.locator('[data-test="remove-sauce-labs-bolt-t-shirt"]').click();
                break;
            case 'Sauce Labs Fleece Jacket':
                await this.page.locator('[data-test="remove-sauce-labs-fleece-jacket"]').click();
                break;
            case 'Sauce Labs Onesie':
                await this.page.locator('[data-test="remove-sauce-labs-onesie"]').click();
                break;
            case 'T-Shirt':
                await this.page.locator('[data-test="remove-test.allthethings()-t-shirt-(red)"]').click();
                break;
            default:
                throw new Error(`Product ${product} not found`);
        }
    }

    /**
     * Assert that a product has been removed from the cart (remove button is hidden)
     * Note: This method uses a switch statement to map product names to remove button selectors.
     * Consider refactoring to use a product mapping object for better maintainability.
     * @param product - The product name to verify has been removed
     */
    async assertProductRemoved(product: string){
        // Product removal verification - maps product names to their remove button selectors
        // TODO: Refactor this switch statement to a lookup object for better maintainability
        switch ( product ) {
            case 'Sauce Labs Backpack':
                await expect(this.page.locator('[data-test="remove-sauce-labs-backpack"]')).toBeHidden();
                break;
            case 'Sauce Labs Bike Light':
                await expect(this.page.locator('[data-test="remove-sauce-labs-bike-light"]')).toBeHidden();
                break;
            case 'Sauce Labs Bolt T-Shirt':
                await expect(this.page.locator('[data-test="remove-sauce-labs-bolt-t-shirt"]')).toBeHidden();
                break;
            case 'Sauce Labs Fleece Jacket':
                await expect(this.page.locator('[data-test="remove-sauce-labs-fleece-jacket"]')).toBeHidden();
                break;
            case 'Sauce Labs Onesie':
                await expect(this.page.locator('[data-test="remove-sauce-labs-onesie"]')).toBeHidden();
                break;
            case 'T-Shirt':
                await expect(this.page.locator('[data-test="remove-test.allthethings()-t-shirt-(red)"]')).toBeHidden();
                break;
            default:
                throw new Error(`Product ${product} not found`);
        }
    }

    /**
     * Navigate to the checkout page from the shopping cart
     */
    async goToCheckout(){
        await this.page.locator('[data-test="checkout"]').click();
    }

}
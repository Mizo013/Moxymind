import { Page, expect } from "@playwright/test";

/**
 * InventoryPage - Handles interactions with the product inventory page
 * Provides methods for product management, filtering/sorting and navigation to shopping cart
 */
export class InventoryPage {
    constructor(private readonly page: Page) {}

    /**
     * Verify successful login by checking URL and inventory container visibility
     */
    async accessSuccessLogin(){
        await expect(this.page).toHaveURL(/inventory.html/);
        await expect(this.page.locator('[data-test="inventory-container"]')).toBeVisible();
    }

    /**
     * Perform user logout by clicking menu and logout link
     */
    async userLogout(){
        await this.page.getByRole('button', { name: 'Open Menu' }).click();
        await this.page.locator('[data-test="logout-sidebar-link"]').click();;
    }

    /**
     * Convert product display name to the internal data-test attribute format
     * Special handling for "T-Shirt" which has a unique naming convention
     * @param product - The display name of the product (e.g., "Sauce Labs Backpack")
     * @returns The formatted product name for data-test attributes
     */
    private async getProductName(product: string): Promise<string> {
        if ( product === 'T-Shirt' ) {
            // Special case: T-Shirt has a unique internal name
            return 'test.allthethings()-t-shirt-(red)';
        }
        else {
            // Standard conversion: lowercase and replace spaces with hyphens
            return product.toLowerCase().replace(/ /g, '-');
        }
    }

    /**
     * Add a product to the shopping cart
     * @param product - The display name of the product to add
     */
    async addProduct(product: string){
        const productName = await this.getProductName(product);
        await this.page.locator(`[data-test="add-to-cart-${productName}"]`).click();
    }

    /**
     * Remove a product from the shopping cart
     * @param product - The display name of the product to remove
     */
    async removeProduct(product: string){
        const productName = await this.getProductName(product);
        await this.page.locator(`[data-test="remove-${productName}"]`).click();
    }

    /**
     * Assert that a product has been added to cart (remove button is visible)
     * @param product - The display name of the product to verify
     */
    async assertProductAdded(product: string){
        const productName = await this.getProductName(product);
        await expect(this.page.locator(`[data-test="remove-${productName}"]`)).toBeVisible();
    }

    /**
     * Assert that a product has been removed from cart (remove button is hidden)
     * @param product - The display name of the product to verify
     */
    async assertProductRemoved(product: string){
        const productName = await this.getProductName(product);
        await expect(this.page.locator(`[data-test="remove-${productName}"]`)).toBeHidden();
    }

    /**
     * Assert that a product at a specific position has the expected price
     * @param product - The product name (for documentation, not used in assertion)
     * @param price - The expected price as a number
     * @param position - The zero-based position of the product in the inventory list
     */
    async assertProductPrice(product: string, price: number, position: number){
        await expect(this.page.locator('[data-test="inventory-item-price"]').nth(position-1)).toHaveText(`$${price.toFixed(2)}`);
    }

    /**
     * Verify the shopping cart badge shows the expected item count
     * @param count - The expected number of items in the cart
     */
    async accessShoppingCartCount(count: number){
        await expect(this.page.locator('[data-test="shopping-cart-badge"]')).toHaveText(count.toString());
    }

    /**
     * Navigate to the shopping cart page
     */
    async goToShoppingCart(){
        await this.page.locator('[data-test="shopping-cart-link"]').click();
    }

    /**
     * Apply a product filter/sort option
     * @param filter - The sort option: 'az' (A-Z), 'za' (Z-A), 'lohi' (low-high price), 'hilo' (high-low price)
     */
    async filterProducts(filter: 'az' | 'za' | 'lohi' | 'hilo'){
        const filterFullName = {
            'az': 'Name (A to Z)',
            'za': 'Name (Z to A)',
            'lohi': 'Price (low to high)',
            'hilo': 'Price (high to low)'
        }[filter];

        await this.page.locator('[data-test="product-sort-container"]').selectOption(filter);       
        await expect(this.page.locator('[data-test="product-sort-container"]')).toContainText(filterFullName);
    }

    /**
     * Verify that products are correctly sorted according to the selected option
     * This method scrapes the current product list and compares it against expected sorting
     * @param sortOption - The sort option to verify: 'az', 'za', 'lohi', 'hilo'
     */
    async verifyProductSorting(sortOption: 'az' | 'za' | 'lohi' | 'hilo') {
        // Step 1: Determine sorting criteria and direction
        const isPriceSort = sortOption === 'lohi' || sortOption === 'hilo'; // Price-based sorting
        const isDescending = sortOption === 'za' || sortOption === 'hilo'; // Reverse order sorting

        let displayedList: (string | number)[];

        if (isPriceSort) {
            // Scrape prices from DOM, remove '$' symbol, and convert to numbers for comparison
            displayedList = await this.page.$$eval('.inventory_item_price', els => els.map(el => parseFloat(el.textContent!.replace('$', ''))));
        } else {
            // Scrape product names as strings for alphabetical comparison
            displayedList = await this.page.$$eval('.inventory_item_name', els => els.map(el => el.textContent!.trim()));
        }

        // Step 2: Create expected sorted array for comparison
        const expectedList = [...displayedList].sort((a, b) => {
            if (typeof a === 'number' && typeof b === 'number') {
                // Numerical sort for prices
                return isDescending ? b - a : a - b;
            }
            // Alphabetical sort for product names
            return isDescending
            ? String(b).localeCompare(String(a))
            : String(a).localeCompare(String(b));
        });

        // Step 3: Assert that the displayed list matches the expected sorted order
        expect(displayedList).toEqual(expectedList);
    }

}
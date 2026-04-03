import { test, expect } from '../../fixtures/pom.fixtures';

test.describe('Sauce Demo Tests', ()=> {

    /**
     * TC01: Successful login and logout
     * Verifies that a user can successfully log in with valid credentials
     * and then log out, returning to the login page
     */
    test('TC01: Successful login and logout', async ({pm}) => {
        await pm.loginPage.openLoginPage();
        await pm.loginPage.userLogin('standard_user', 'secret_sauce');
        await pm.inventoryPage.accessSuccessLogin();
        await pm.inventoryPage.userLogout();
        await pm.loginPage.assertSuccessLogout();
    });

    /**
     * TS02: Complete an E2E purchase
     * Tests the full shopping workflow: login → add products → remove items →
     * checkout → verify order → complete purchase → logout
     * Uses standard_user credentials and tests cart management functionality
     */
    test('TS02: Complete an E2E purchase', async ({pm}) => {
        await pm.loginPage.openLoginPage();
        await pm.loginPage.userLogin('standard_user', 'secret_sauce');
        await pm.inventoryPage.accessSuccessLogin();

        // Add multiple products to cart and verify they're added with correct prices
        await pm.inventoryPage.addProduct('Sauce Labs Backpack');
        await pm.inventoryPage.assertProductAdded('Sauce Labs Backpack');
        await pm.inventoryPage.assertProductPrice('Sauce Labs Backpack', 29.99, 1);

        await pm.inventoryPage.addProduct('Sauce Labs Bike Light');
        await pm.inventoryPage.assertProductAdded('Sauce Labs Bike Light');
        await pm.inventoryPage.assertProductPrice('Sauce Labs Bike Light', 9.99, 2);

        await pm.inventoryPage.addProduct('Sauce Labs Bolt T-Shirt');
        await pm.inventoryPage.assertProductAdded('Sauce Labs Bolt T-Shirt');
        await pm.inventoryPage.assertProductPrice('Sauce Labs Bolt T-Shirt', 15.99, 3);

        await pm.inventoryPage.addProduct('Sauce Labs Fleece Jacket');
        await pm.inventoryPage.assertProductAdded('Sauce Labs Fleece Jacket');
        await pm.inventoryPage.assertProductPrice('Sauce Labs Fleece Jacket', 49.99, 4);

        // Verify cart count and remove one item
        await pm.inventoryPage.accessShoppingCartCount(4);
        await pm.inventoryPage.removeProduct('Sauce Labs Fleece Jacket');
        await pm.inventoryPage.accessShoppingCartCount(3);

        // Navigate to cart and verify remaining products
        await pm.inventoryPage.goToShoppingCart();

        await pm.shoppingCartPage.accessProductInCart('Sauce Labs Backpack', 1, 1, 29.99);
        await pm.shoppingCartPage.accessProductInCart('Sauce Labs Bike Light', 2, 1, 9.99);
        await pm.shoppingCartPage.accessProductInCart('Sauce Labs Bolt T-Shirt', 3, 1, 15.99);

        // Remove another item from cart
        await pm.shoppingCartPage.removeProduct('Sauce Labs Bolt T-Shirt');
        await pm.shoppingCartPage.assertProductRemoved('Sauce Labs Bolt T-Shirt');

        // Proceed to checkout
        await pm.shoppingCartPage.goToCheckout();

        await pm.checkoutPage.fillCheckoutForm('Michal', 'Tkac', '9191');
        await pm.checkoutPage.continueCheckout();

        await pm.checkoutPage.assertCheckoutOverview('Sauce Labs Backpack', 1, 1, 29.99);
        await pm.checkoutPage.assertCheckoutOverview('Sauce Labs Bike Light', 2, 1, 9.99);
        await pm.checkoutPage.assertCheckoutSummary(39.98, 3.20, 43.18);

        await pm.checkoutPage.finishCheckout();
        await pm.checkoutPage.assertCheckoutComplete();

        await pm.inventoryPage.userLogout();
        await pm.loginPage.assertSuccessLogout();
    });


    /**
     * TS03: Sort products and verify sorting
     * Tests product sorting functionality by name (A-Z, Z-A) and price (low-high, high-low)
     * Verifies that the UI correctly displays products in the expected sorted order
     */
    test('TS03: Sort products and verify sorting', async ({pm}) => {
        await pm.loginPage.openLoginPage();
        await pm.loginPage.userLogin('standard_user', 'secret_sauce');

        await pm.inventoryPage.accessSuccessLogin();

        // Test alphabetical sorting (A-Z)
        await pm.inventoryPage.filterProducts('az');
        await pm.inventoryPage.verifyProductSorting('az');

        // Test reverse alphabetical sorting (Z-A)
        await pm.inventoryPage.filterProducts('za');
        await pm.inventoryPage.verifyProductSorting('za');

        // Test price sorting (low to high)
        await pm.inventoryPage.filterProducts('lohi');
        await pm.inventoryPage.verifyProductSorting('lohi');

        // Test price sorting (high to low)
        await pm.inventoryPage.filterProducts('hilo');
        await pm.inventoryPage.verifyProductSorting('hilo');

        await pm.inventoryPage.userLogout();
        await pm.loginPage.assertSuccessLogout();
    });


});
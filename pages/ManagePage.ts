import { Page } from "@playwright/test";
import { LoginPage } from "./LoginPage";
import { InventoryPage } from "./InventoryPage";
import { ShoppingCartPage } from "./ShoppingCartPage";
import { CheckoutPage } from "./CheckoutPage";

/**
 * ManagePage (Page Object Manager)
 * Centralizes all page objects and manages their lifecycle
 * Uses lazy initialization pattern - pages are only instantiated when first accessed
 * This reduces memory usage and improves test performance by avoiding unnecessary object creation
 */
export default class ManagePage {
    constructor(private readonly page: Page){}

    // Private cache for page objects - uses nullish coalescing assignment (??=) for lazy initialization
    private _login?: LoginPage;
    private _inventory?: InventoryPage;
    private _shoppingCart?: ShoppingCartPage;
    private _checkout?: CheckoutPage;

    /**
     * Get the LoginPage instance (lazy initialized)
     * @returns LoginPage instance for login-related interactions
     */
    get loginPage(): LoginPage{
        return this._login ??= new LoginPage(this.page);
    }

    /**
     * Get the InventoryPage instance (lazy initialized)
     * @returns InventoryPage instance for product inventory interactions
     */
    get inventoryPage(): InventoryPage{
        return this._inventory ??= new InventoryPage(this.page);
    }

    /**
     * Get the ShoppingCartPage instance (lazy initialized)
     * @returns ShoppingCartPage instance for shopping cart interactions
     */
    get shoppingCartPage(): ShoppingCartPage{
        return this._shoppingCart ??= new ShoppingCartPage(this.page);
    }

    /**
     * Get the CheckoutPage instance (lazy initialized)
     * @returns CheckoutPage instance for checkout flow interactions
     */
    get checkoutPage(): CheckoutPage{
        return this._checkout ??= new CheckoutPage(this.page);
    }
}
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var oas_1 = __importDefault(require("oas"));
var core_1 = __importDefault(require("api/dist/core"));
var openapi_json_1 = __importDefault(require("./openapi.json"));
var SDK = /** @class */ (function () {
    function SDK() {
        this.spec = oas_1.default.init(openapi_json_1.default);
        this.core = new core_1.default(this.spec, 'shopier/1.0 (api/6.1.3)');
    }
    /**
     * Optionally configure various options that the SDK allows.
     *
     * @param config Object of supported SDK options and toggles.
     * @param config.timeout Override the default `fetch` request timeout of 30 seconds. This number
     * should be represented in milliseconds.
     */
    SDK.prototype.config = function (config) {
        this.core.setConfig(config);
    };
    /**
     * If the API you're using requires authentication you can supply the required credentials
     * through this method and the library will magically determine how they should be used
     * within your API request.
     *
     * With the exception of OpenID and MutualTLS, it supports all forms of authentication
     * supported by the OpenAPI specification.
     *
     * @example <caption>HTTP Basic auth</caption>
     * sdk.auth('username', 'password');
     *
     * @example <caption>Bearer tokens (HTTP or OAuth 2)</caption>
     * sdk.auth('myBearerToken');
     *
     * @example <caption>API Keys</caption>
     * sdk.auth('myApiKey');
     *
     * @see {@link https://spec.openapis.org/oas/v3.0.3#fixed-fields-22}
     * @see {@link https://spec.openapis.org/oas/v3.1.0#fixed-fields-22}
     * @param values Your auth credentials for the API; can specify up to two strings or numbers.
     */
    SDK.prototype.auth = function () {
        var _a;
        var values = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            values[_i] = arguments[_i];
        }
        (_a = this.core).setAuth.apply(_a, values);
        return this;
    };
    /**
     * If the API you're using offers alternate server URLs, and server variables, you can tell
     * the SDK which one to use with this method. To use it you can supply either one of the
     * server URLs that are contained within the OpenAPI definition (along with any server
     * variables), or you can pass it a fully qualified URL to use (that may or may not exist
     * within the OpenAPI definition).
     *
     * @example <caption>Server URL with server variables</caption>
     * sdk.server('https://{region}.api.example.com/{basePath}', {
     *   name: 'eu',
     *   basePath: 'v14',
     * });
     *
     * @example <caption>Fully qualified server URL</caption>
     * sdk.server('https://eu.api.example.com/v14');
     *
     * @param url Server URL
     * @param variables An object of variables to replace into the server URL.
     */
    SDK.prototype.server = function (url, variables) {
        if (variables === void 0) { variables = {}; }
        this.core.setServer(url, variables);
    };
    /**
     * Returns a list of products with the provided limit, paging, sorting and filters. By
     * default, products are returned in sorted order, with the most recent product listings
     * appearing first.
     *
     * @summary List all products
     */
    SDK.prototype.getProducts = function (metadata) {
        return this.core.fetch('/products', 'get', metadata);
    };
    /**
     * Creates a new product.
     *
     * @summary Create a product
     */
    SDK.prototype.postProducts = function (body) {
        return this.core.fetch('/products', 'post', body);
    };
    /**
     * Returns a single product with the provided product ID.
     *
     * @summary Get a product
     */
    SDK.prototype.getProductsId = function (metadata) {
        return this.core.fetch('/products/{id}', 'get', metadata);
    };
    /**
     * Deletes a product with the provided product ID.
     *
     * @summary Delete a product
     */
    SDK.prototype.deleteProductsId = function (metadata) {
        return this.core.fetch('/products/{id}', 'delete', metadata);
    };
    SDK.prototype.putProductsId = function (body, metadata) {
        return this.core.fetch('/products/{id}', 'put', body, metadata);
    };
    /**
     * Returns a list of product categories with the provided limit, paging and sorting. By
     * default, categories are returned in sorted order according to their placement in
     * storefront.
     *
     * @summary List all product categories
     */
    SDK.prototype.getCategories = function (metadata) {
        return this.core.fetch('/categories', 'get', metadata);
    };
    /**
     * Creates a new product category.
     *
     * @summary Create a product category
     */
    SDK.prototype.postCategories = function (body) {
        return this.core.fetch('/categories', 'post', body);
    };
    /**
     * Returns a single product category with the provided category ID.
     *
     * @summary Get a product category
     */
    SDK.prototype.getCategoriesId = function (metadata) {
        return this.core.fetch('/categories/{id}', 'get', metadata);
    };
    /**
     * Deletes a product category with the provided category ID.
     *
     * @summary Delete a product category
     */
    SDK.prototype.deleteCategoriesId = function (metadata) {
        return this.core.fetch('/categories/{id}', 'delete', metadata);
    };
    SDK.prototype.putCategoriesId = function (body, metadata) {
        return this.core.fetch('/categories/{id}', 'put', body, metadata);
    };
    /**
     * Returns a list of product variations with the provided limit, paging and sorting. By
     * default, variations are returned in sorted order according to their placement in
     * storefront.
     *
     * @summary List all product variations
     */
    SDK.prototype.getVariations = function () {
        return this.core.fetch('/variations', 'get');
    };
    /**
     * Creates a new product variation.
     *
     * @summary Create a product variation
     */
    SDK.prototype.postVariations = function (body) {
        return this.core.fetch('/variations', 'post', body);
    };
    /**
     * Returns a single product variation with the provided variation ID.
     *
     * @summary Get a product variation
     */
    SDK.prototype.getVariationsId = function (metadata) {
        return this.core.fetch('/variations/{id}', 'get', metadata);
    };
    /**
     * Deletes a product variation with the provided variation ID.
     *
     * @summary Delete a product variation
     */
    SDK.prototype.deleteVariationsId = function (metadata) {
        return this.core.fetch('/variations/{id}', 'delete', metadata);
    };
    SDK.prototype.putVariationsId = function (body, metadata) {
        return this.core.fetch('/variations/{id}', 'put', body, metadata);
    };
    /**
     * Returns a list of product selections with the provided limit, paging, sorting and
     * filters. By default, selections are returned in sorted order according to their creation
     * order.
     *
     * @summary List all product selections
     */
    SDK.prototype.getSelections = function (metadata) {
        return this.core.fetch('/selections', 'get', metadata);
    };
    /**
     * Creates a new product selection.
     *
     * @summary Create a product selection
     */
    SDK.prototype.postSelections = function (body) {
        return this.core.fetch('/selections', 'post', body);
    };
    /**
     * Returns a single product selection with the provided selection ID.
     *
     * @summary Get a product selection
     */
    SDK.prototype.getSelectionsId = function (metadata) {
        return this.core.fetch('/selections/{id}', 'get', metadata);
    };
    SDK.prototype.putSelectionsId = function (body, metadata) {
        return this.core.fetch('/selections/{id}', 'put', body, metadata);
    };
    /**
     * Deletes a product selection with the provided selection ID.
     *
     * @summary Delete a product selection
     */
    SDK.prototype.deleteSelectionsId = function (metadata) {
        return this.core.fetch('/selections/{id}', 'delete', metadata);
    };
    /**
     * Returns a list of discount codes with the provided limit, paging and sorting. By
     * default, discount codes are returned in sorted order, with the most recent discount
     * codes appearing first.
     *
     * @summary List all discount codes
     */
    SDK.prototype.getDiscountsCodes = function (metadata) {
        return this.core.fetch('/discounts/codes', 'get', metadata);
    };
    /**
     * Creates a new discount code.
     *
     * @summary Create a discount code
     */
    SDK.prototype.postDiscountsCodes = function (body) {
        return this.core.fetch('/discounts/codes', 'post', body);
    };
    /**
     * Returns a single discount code with the provided discount code ID.
     *
     * @summary Get a discount code
     */
    SDK.prototype.getDiscountsCodesId = function (metadata) {
        return this.core.fetch('/discounts/codes/{id}', 'get', metadata);
    };
    /**
     * Deletes a discount code with the provided discount code ID.
     *
     * @summary Delete a discount code
     */
    SDK.prototype.deleteDiscountsCodesId = function (metadata) {
        return this.core.fetch('/discounts/codes/{id}', 'delete', metadata);
    };
    SDK.prototype.putDiscountsCodesId = function (body, metadata) {
        return this.core.fetch('/discounts/codes/{id}', 'put', body, metadata);
    };
    /**
     * Returns a list of automatic discounts with the provided limit, paging and sorting. By
     * default, automatic discounts are returned in sorted order, with the most recent
     * discounts appearing first.
     *
     * @summary List all automatic discounts
     */
    SDK.prototype.getDiscountsAutomatic = function (metadata) {
        return this.core.fetch('/discounts/automatic', 'get', metadata);
    };
    /**
     * Creates a new automatic discount.
     *
     * @summary Create an automatic discount
     */
    SDK.prototype.postDiscountsAutomatic = function (body) {
        return this.core.fetch('/discounts/automatic', 'post', body);
    };
    /**
     * Returns a single automatic discount with the provided discount ID.
     *
     * @summary Get an automatic discount
     */
    SDK.prototype.getDiscountsAutomaticId = function (metadata) {
        return this.core.fetch('/discounts/automatic/{id}', 'get', metadata);
    };
    SDK.prototype.putDiscountsAutomaticId = function (body, metadata) {
        return this.core.fetch('/discounts/automatic/{id}', 'put', body, metadata);
    };
    /**
     * Deletes an automatic discount with the provided discount ID.
     *
     * @summary Delete an automatic discount
     */
    SDK.prototype.deleteDiscountsAutomaticId = function (metadata) {
        return this.core.fetch('/discounts/automatic/{id}', 'delete', metadata);
    };
    /**
     * Returns a list of orders with the provided limit, paging, sorting and filters. By
     * default, orders are returned in sorted order, with the most recent orders appearing
     * first.
     *
     * @summary List all orders
     */
    SDK.prototype.getOrders = function (metadata) {
        return this.core.fetch('/orders', 'get', metadata);
    };
    /**
     * Returns a single order with the provided order ID.
     *
     * @summary Get an order
     */
    SDK.prototype.getOrdersId = function (metadata) {
        return this.core.fetch('/orders/{id}', 'get', metadata);
    };
    SDK.prototype.putOrdersId = function (body, metadata) {
        return this.core.fetch('/orders/{id}', 'put', body, metadata);
    };
    /**
     * Returns the order transaction with the provided order ID. Used for collecting additional
     * financial information about the order.
     *
     * @summary Get an order transaction
     */
    SDK.prototype.getOrdersTransactionsOrderId = function (metadata) {
        return this.core.fetch('/orders/transactions/{orderId}', 'get', metadata);
    };
    /**
     * Returns a list of Shopier Contracted Shippings with the provided limit, paging, sorting
     * and filters. By default, shippings are returned in sorted order, with the recently
     * created shipping codes appearing first.
     *
     * @summary List all shippings
     */
    SDK.prototype.getShippings = function (metadata) {
        return this.core.fetch('/shippings', 'get', metadata);
    };
    /**
     * Creates a new shipping code.
     *
     * @summary Create a shipping code
     */
    SDK.prototype.postShippings = function (body) {
        return this.core.fetch('/shippings', 'post', body);
    };
    /**
     * Returns the details of a single shipping with the provided shipping code.
     *
     * @summary Get a shipping
     */
    SDK.prototype.getShippingsCode = function (metadata) {
        return this.core.fetch('/shippings/{code}', 'get', metadata);
    };
    /**
     * Deletes a shipping code. Shipping codes can be deleted if the shipment is not delivered
     * to shipping company.
     *
     * @summary Delete a shipping code
     */
    SDK.prototype.deleteShippingsCode = function (metadata) {
        return this.core.fetch('/shippings/{code}', 'delete', metadata);
    };
    /**
     * Returns the current account balance.
     *
     * @summary Get current balance
     */
    SDK.prototype.getBalance = function () {
        return this.core.fetch('/balance', 'get');
    };
    /**
     * Returns a list of balance transactions, that have contributed to balance, with the
     * provided limit, paging and sorting. By default, balance transactions are returned in
     * sorted order, with the most recent balance transactions appearing first.
     *
     * @summary List all balance transactions
     */
    SDK.prototype.getBalanceTransactions = function (metadata) {
        return this.core.fetch('/balance/transactions', 'get', metadata);
    };
    /**
     * Returns a single balance transaction with the provided order ID.
     *
     * @summary Get a balance transaction
     */
    SDK.prototype.getBalanceTransactionsOrderId = function (metadata) {
        return this.core.fetch('/balance/transactions/{orderId}', 'get', metadata);
    };
    /**
     * Returns a list of payouts sent to external bank accounts with the provided limit, paging
     * and sorting. By default, payouts are returned in sorted order, with the most recent
     * payouts appearing first.
     *
     * @summary List all payouts
     */
    SDK.prototype.getPayouts = function (metadata) {
        return this.core.fetch('/payouts', 'get', metadata);
    };
    /**
     * Returns a single payout with the provided payout ID.
     *
     * @summary Get a payout
     */
    SDK.prototype.getPayoutsId = function (metadata) {
        return this.core.fetch('/payouts/{id}', 'get', metadata);
    };
    /**
     * Returns a list of payout transactions for a specific payout with the provided limit,
     * paging and sorting. By default, payout transactions are returned in sorted order, with
     * the most recent payout transactions appearing first.
     *
     * @summary List all payout transactions
     */
    SDK.prototype.getPayoutsTransactionsId = function (metadata) {
        return this.core.fetch('/payouts/transactions/{id}', 'get', metadata);
    };
    /**
     * Returns a list of refunds with the provided limit, paging and sorting. By default,
     * refunds are returned in sorted order, with the most recent refunds appearing first.
     *
     * @summary List all refunds
     */
    SDK.prototype.getRefunds = function (metadata) {
        return this.core.fetch('/refunds', 'get', metadata);
    };
    /**
     * Creates a new refund.
     *
     * @summary Create a refund
     */
    SDK.prototype.postRefunds = function (body) {
        return this.core.fetch('/refunds', 'post', body);
    };
    /**
     * Returns the details of a single refund with the provided refund ID.
     *
     * @summary Get a refund
     */
    SDK.prototype.getRefundsId = function (metadata) {
        return this.core.fetch('/refunds/{id}', 'get', metadata);
    };
    /**
     * Returns information about the shop's owner.
     *
     * @summary Get the shop’s owner information
     */
    SDK.prototype.getShopOwner = function () {
        return this.core.fetch('/shop/owner', 'get');
    };
    /**
     * Returns the current settings of the shop.
     *
     * @summary Get the shop’s settings
     */
    SDK.prototype.getShopSettings = function () {
        return this.core.fetch('/shop/settings', 'get');
    };
    /**
     * Updates the settings of the shop.
     *
     * @summary Update the shop’s settings
     */
    SDK.prototype.putShopSettings = function (body) {
        return this.core.fetch('/shop/settings', 'put', body);
    };
    /**
     * Returns a list of webhook event subscriptions with the provided limit, paging and
     * sorting. By default, webhook event subscriptions are returned in alphabetical order.
     *
     * @summary List all webhook subscriptions
     */
    SDK.prototype.getWebhooks = function (metadata) {
        return this.core.fetch('/webhooks', 'get', metadata);
    };
    /**
     * Creates a new webhook event subscription.
     *
     * @summary Create a webhook subscription
     */
    SDK.prototype.postWebhooks = function (body) {
        return this.core.fetch('/webhooks', 'post', body);
    };
    /**
     * Deletes a webhook event subscription with the provided webhook subscription ID.
     *
     * @summary Delete a webhook subscription
     */
    SDK.prototype.deleteWebhooksId = function (metadata) {
        return this.core.fetch('/webhooks/{id}', 'delete', metadata);
    };
    return SDK;
}());
var createSDK = (function () { return new SDK(); })();
module.exports = createSDK;

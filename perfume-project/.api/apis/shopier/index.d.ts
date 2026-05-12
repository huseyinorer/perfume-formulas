import type * as types from './types';
import type { ConfigOptions, FetchResponse } from 'api/dist/core';
import Oas from 'oas';
import APICore from 'api/dist/core';
declare class SDK {
    spec: Oas;
    core: APICore;
    constructor();
    /**
     * Optionally configure various options that the SDK allows.
     *
     * @param config Object of supported SDK options and toggles.
     * @param config.timeout Override the default `fetch` request timeout of 30 seconds. This number
     * should be represented in milliseconds.
     */
    config(config: ConfigOptions): void;
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
    auth(...values: string[] | number[]): this;
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
    server(url: string, variables?: {}): void;
    /**
     * Returns a list of products with the provided limit, paging, sorting and filters. By
     * default, products are returned in sorted order, with the most recent product listings
     * appearing first.
     *
     * @summary List all products
     */
    getProducts(metadata?: types.GetProductsMetadataParam): Promise<FetchResponse<200, types.GetProductsResponse200>>;
    /**
     * Creates a new product.
     *
     * @summary Create a product
     */
    postProducts(body: types.PostProductsBodyParam): Promise<FetchResponse<200, types.PostProductsResponse200>>;
    /**
     * Returns a single product with the provided product ID.
     *
     * @summary Get a product
     */
    getProductsId(metadata: types.GetProductsIdMetadataParam): Promise<FetchResponse<200, types.GetProductsIdResponse200>>;
    /**
     * Deletes a product with the provided product ID.
     *
     * @summary Delete a product
     */
    deleteProductsId(metadata: types.DeleteProductsIdMetadataParam): Promise<FetchResponse<number, unknown>>;
    /**
     * Updates a product with the provided product ID.
     *
     * @summary Update a product
     */
    putProductsId(body: types.PutProductsIdBodyParam, metadata: types.PutProductsIdMetadataParam): Promise<FetchResponse<200, types.PutProductsIdResponse200>>;
    putProductsId(metadata: types.PutProductsIdMetadataParam): Promise<FetchResponse<200, types.PutProductsIdResponse200>>;
    /**
     * Returns a list of product categories with the provided limit, paging and sorting. By
     * default, categories are returned in sorted order according to their placement in
     * storefront.
     *
     * @summary List all product categories
     */
    getCategories(metadata?: types.GetCategoriesMetadataParam): Promise<FetchResponse<200, types.GetCategoriesResponse200>>;
    /**
     * Creates a new product category.
     *
     * @summary Create a product category
     */
    postCategories(body: types.PostCategoriesBodyParam): Promise<FetchResponse<200, types.PostCategoriesResponse200>>;
    /**
     * Returns a single product category with the provided category ID.
     *
     * @summary Get a product category
     */
    getCategoriesId(metadata: types.GetCategoriesIdMetadataParam): Promise<FetchResponse<200, types.GetCategoriesIdResponse200>>;
    /**
     * Deletes a product category with the provided category ID.
     *
     * @summary Delete a product category
     */
    deleteCategoriesId(metadata: types.DeleteCategoriesIdMetadataParam): Promise<FetchResponse<number, unknown>>;
    /**
     * Updates a product category with the provided category ID.
     *
     * @summary Update a product category
     */
    putCategoriesId(body: types.PutCategoriesIdBodyParam, metadata: types.PutCategoriesIdMetadataParam): Promise<FetchResponse<200, types.PutCategoriesIdResponse200>>;
    putCategoriesId(metadata: types.PutCategoriesIdMetadataParam): Promise<FetchResponse<200, types.PutCategoriesIdResponse200>>;
    /**
     * Returns a list of product variations with the provided limit, paging and sorting. By
     * default, variations are returned in sorted order according to their placement in
     * storefront.
     *
     * @summary List all product variations
     */
    getVariations(): Promise<FetchResponse<200, types.GetVariationsResponse200>>;
    /**
     * Creates a new product variation.
     *
     * @summary Create a product variation
     */
    postVariations(body: types.PostVariationsBodyParam): Promise<FetchResponse<200, types.PostVariationsResponse200>>;
    /**
     * Returns a single product variation with the provided variation ID.
     *
     * @summary Get a product variation
     */
    getVariationsId(metadata: types.GetVariationsIdMetadataParam): Promise<FetchResponse<200, types.GetVariationsIdResponse200>>;
    /**
     * Deletes a product variation with the provided variation ID.
     *
     * @summary Delete a product variation
     */
    deleteVariationsId(metadata: types.DeleteVariationsIdMetadataParam): Promise<FetchResponse<number, unknown>>;
    /**
     * Updates a product variation with the provided variation ID.
     *
     * @summary Update a product variation
     */
    putVariationsId(body: types.PutVariationsIdBodyParam, metadata: types.PutVariationsIdMetadataParam): Promise<FetchResponse<200, types.PutVariationsIdResponse200>>;
    putVariationsId(metadata: types.PutVariationsIdMetadataParam): Promise<FetchResponse<200, types.PutVariationsIdResponse200>>;
    /**
     * Returns a list of product selections with the provided limit, paging, sorting and
     * filters. By default, selections are returned in sorted order according to their creation
     * order.
     *
     * @summary List all product selections
     */
    getSelections(metadata?: types.GetSelectionsMetadataParam): Promise<FetchResponse<200, types.GetSelectionsResponse200>>;
    /**
     * Creates a new product selection.
     *
     * @summary Create a product selection
     */
    postSelections(body: types.PostSelectionsBodyParam): Promise<FetchResponse<200, types.PostSelectionsResponse200>>;
    /**
     * Returns a single product selection with the provided selection ID.
     *
     * @summary Get a product selection
     */
    getSelectionsId(metadata: types.GetSelectionsIdMetadataParam): Promise<FetchResponse<200, types.GetSelectionsIdResponse200>>;
    /**
     * Updates a product selection with the provided selection ID.
     *
     * @summary Update a product selection
     */
    putSelectionsId(body: types.PutSelectionsIdBodyParam, metadata: types.PutSelectionsIdMetadataParam): Promise<FetchResponse<200, types.PutSelectionsIdResponse200>>;
    putSelectionsId(metadata: types.PutSelectionsIdMetadataParam): Promise<FetchResponse<200, types.PutSelectionsIdResponse200>>;
    /**
     * Deletes a product selection with the provided selection ID.
     *
     * @summary Delete a product selection
     */
    deleteSelectionsId(metadata: types.DeleteSelectionsIdMetadataParam): Promise<FetchResponse<number, unknown>>;
    /**
     * Returns a list of discount codes with the provided limit, paging and sorting. By
     * default, discount codes are returned in sorted order, with the most recent discount
     * codes appearing first.
     *
     * @summary List all discount codes
     */
    getDiscountsCodes(metadata?: types.GetDiscountsCodesMetadataParam): Promise<FetchResponse<200, types.GetDiscountsCodesResponse200>>;
    /**
     * Creates a new discount code.
     *
     * @summary Create a discount code
     */
    postDiscountsCodes(body: types.PostDiscountsCodesBodyParam): Promise<FetchResponse<200, types.PostDiscountsCodesResponse200>>;
    /**
     * Returns a single discount code with the provided discount code ID.
     *
     * @summary Get a discount code
     */
    getDiscountsCodesId(metadata: types.GetDiscountsCodesIdMetadataParam): Promise<FetchResponse<200, types.GetDiscountsCodesIdResponse200>>;
    /**
     * Deletes a discount code with the provided discount code ID.
     *
     * @summary Delete a discount code
     */
    deleteDiscountsCodesId(metadata: types.DeleteDiscountsCodesIdMetadataParam): Promise<FetchResponse<number, unknown>>;
    /**
     * Updates a discount code with the provided discount code ID.
     *
     * @summary Update a discount code
     */
    putDiscountsCodesId(body: types.PutDiscountsCodesIdBodyParam, metadata: types.PutDiscountsCodesIdMetadataParam): Promise<FetchResponse<200, types.PutDiscountsCodesIdResponse200>>;
    putDiscountsCodesId(metadata: types.PutDiscountsCodesIdMetadataParam): Promise<FetchResponse<200, types.PutDiscountsCodesIdResponse200>>;
    /**
     * Returns a list of automatic discounts with the provided limit, paging and sorting. By
     * default, automatic discounts are returned in sorted order, with the most recent
     * discounts appearing first.
     *
     * @summary List all automatic discounts
     */
    getDiscountsAutomatic(metadata?: types.GetDiscountsAutomaticMetadataParam): Promise<FetchResponse<200, types.GetDiscountsAutomaticResponse200>>;
    /**
     * Creates a new automatic discount.
     *
     * @summary Create an automatic discount
     */
    postDiscountsAutomatic(body: types.PostDiscountsAutomaticBodyParam): Promise<FetchResponse<200, types.PostDiscountsAutomaticResponse200>>;
    /**
     * Returns a single automatic discount with the provided discount ID.
     *
     * @summary Get an automatic discount
     */
    getDiscountsAutomaticId(metadata: types.GetDiscountsAutomaticIdMetadataParam): Promise<FetchResponse<200, types.GetDiscountsAutomaticIdResponse200>>;
    /**
     * Updates an automatic discount with the provided discount ID.
     *
     * @summary Update an automatic discount
     */
    putDiscountsAutomaticId(body: types.PutDiscountsAutomaticIdBodyParam, metadata: types.PutDiscountsAutomaticIdMetadataParam): Promise<FetchResponse<200, types.PutDiscountsAutomaticIdResponse200>>;
    putDiscountsAutomaticId(metadata: types.PutDiscountsAutomaticIdMetadataParam): Promise<FetchResponse<200, types.PutDiscountsAutomaticIdResponse200>>;
    /**
     * Deletes an automatic discount with the provided discount ID.
     *
     * @summary Delete an automatic discount
     */
    deleteDiscountsAutomaticId(metadata: types.DeleteDiscountsAutomaticIdMetadataParam): Promise<FetchResponse<number, unknown>>;
    /**
     * Returns a list of orders with the provided limit, paging, sorting and filters. By
     * default, orders are returned in sorted order, with the most recent orders appearing
     * first.
     *
     * @summary List all orders
     */
    getOrders(metadata?: types.GetOrdersMetadataParam): Promise<FetchResponse<200, types.GetOrdersResponse200>>;
    /**
     * Returns a single order with the provided order ID.
     *
     * @summary Get an order
     */
    getOrdersId(metadata: types.GetOrdersIdMetadataParam): Promise<FetchResponse<200, types.GetOrdersIdResponse200>>;
    /**
     * Updates an order with the provided order ID. Used for closing the order and/or changing
     * the shipping address.
     *
     * @summary Update an order
     */
    putOrdersId(body: types.PutOrdersIdBodyParam, metadata: types.PutOrdersIdMetadataParam): Promise<FetchResponse<200, types.PutOrdersIdResponse200>>;
    putOrdersId(metadata: types.PutOrdersIdMetadataParam): Promise<FetchResponse<200, types.PutOrdersIdResponse200>>;
    /**
     * Returns the order transaction with the provided order ID. Used for collecting additional
     * financial information about the order.
     *
     * @summary Get an order transaction
     */
    getOrdersTransactionsOrderId(metadata: types.GetOrdersTransactionsOrderIdMetadataParam): Promise<FetchResponse<200, types.GetOrdersTransactionsOrderIdResponse200>>;
    /**
     * Returns a list of Shopier Contracted Shippings with the provided limit, paging, sorting
     * and filters. By default, shippings are returned in sorted order, with the recently
     * created shipping codes appearing first.
     *
     * @summary List all shippings
     */
    getShippings(metadata?: types.GetShippingsMetadataParam): Promise<FetchResponse<200, types.GetShippingsResponse200>>;
    /**
     * Creates a new shipping code.
     *
     * @summary Create a shipping code
     */
    postShippings(body: types.PostShippingsBodyParam): Promise<FetchResponse<200, types.PostShippingsResponse200>>;
    /**
     * Returns the details of a single shipping with the provided shipping code.
     *
     * @summary Get a shipping
     */
    getShippingsCode(metadata: types.GetShippingsCodeMetadataParam): Promise<FetchResponse<200, types.GetShippingsCodeResponse200>>;
    /**
     * Deletes a shipping code. Shipping codes can be deleted if the shipment is not delivered
     * to shipping company.
     *
     * @summary Delete a shipping code
     */
    deleteShippingsCode(metadata: types.DeleteShippingsCodeMetadataParam): Promise<FetchResponse<number, unknown>>;
    /**
     * Returns the current account balance.
     *
     * @summary Get current balance
     */
    getBalance(): Promise<FetchResponse<200, types.GetBalanceResponse200>>;
    /**
     * Returns a list of balance transactions, that have contributed to balance, with the
     * provided limit, paging and sorting. By default, balance transactions are returned in
     * sorted order, with the most recent balance transactions appearing first.
     *
     * @summary List all balance transactions
     */
    getBalanceTransactions(metadata?: types.GetBalanceTransactionsMetadataParam): Promise<FetchResponse<200, types.GetBalanceTransactionsResponse200>>;
    /**
     * Returns a single balance transaction with the provided order ID.
     *
     * @summary Get a balance transaction
     */
    getBalanceTransactionsOrderId(metadata: types.GetBalanceTransactionsOrderIdMetadataParam): Promise<FetchResponse<200, types.GetBalanceTransactionsOrderIdResponse200>>;
    /**
     * Returns a list of payouts sent to external bank accounts with the provided limit, paging
     * and sorting. By default, payouts are returned in sorted order, with the most recent
     * payouts appearing first.
     *
     * @summary List all payouts
     */
    getPayouts(metadata?: types.GetPayoutsMetadataParam): Promise<FetchResponse<200, types.GetPayoutsResponse200>>;
    /**
     * Returns a single payout with the provided payout ID.
     *
     * @summary Get a payout
     */
    getPayoutsId(metadata: types.GetPayoutsIdMetadataParam): Promise<FetchResponse<200, types.GetPayoutsIdResponse200>>;
    /**
     * Returns a list of payout transactions for a specific payout with the provided limit,
     * paging and sorting. By default, payout transactions are returned in sorted order, with
     * the most recent payout transactions appearing first.
     *
     * @summary List all payout transactions
     */
    getPayoutsTransactionsId(metadata: types.GetPayoutsTransactionsIdMetadataParam): Promise<FetchResponse<200, types.GetPayoutsTransactionsIdResponse200>>;
    /**
     * Returns a list of refunds with the provided limit, paging and sorting. By default,
     * refunds are returned in sorted order, with the most recent refunds appearing first.
     *
     * @summary List all refunds
     */
    getRefunds(metadata?: types.GetRefundsMetadataParam): Promise<FetchResponse<200, types.GetRefundsResponse200>>;
    /**
     * Creates a new refund.
     *
     * @summary Create a refund
     */
    postRefunds(body: types.PostRefundsBodyParam): Promise<FetchResponse<200, types.PostRefundsResponse200>>;
    /**
     * Returns the details of a single refund with the provided refund ID.
     *
     * @summary Get a refund
     */
    getRefundsId(metadata: types.GetRefundsIdMetadataParam): Promise<FetchResponse<200, types.GetRefundsIdResponse200>>;
    /**
     * Returns information about the shop's owner.
     *
     * @summary Get the shop’s owner information
     */
    getShopOwner(): Promise<FetchResponse<200, types.GetShopOwnerResponse200>>;
    /**
     * Returns the current settings of the shop.
     *
     * @summary Get the shop’s settings
     */
    getShopSettings(): Promise<FetchResponse<200, types.GetShopSettingsResponse200>>;
    /**
     * Updates the settings of the shop.
     *
     * @summary Update the shop’s settings
     */
    putShopSettings(body?: types.PutShopSettingsBodyParam): Promise<FetchResponse<200, types.PutShopSettingsResponse200>>;
    /**
     * Returns a list of webhook event subscriptions with the provided limit, paging and
     * sorting. By default, webhook event subscriptions are returned in alphabetical order.
     *
     * @summary List all webhook subscriptions
     */
    getWebhooks(metadata?: types.GetWebhooksMetadataParam): Promise<FetchResponse<200, types.GetWebhooksResponse200>>;
    /**
     * Creates a new webhook event subscription.
     *
     * @summary Create a webhook subscription
     */
    postWebhooks(body: types.PostWebhooksBodyParam): Promise<FetchResponse<200, types.PostWebhooksResponse200>>;
    /**
     * Deletes a webhook event subscription with the provided webhook subscription ID.
     *
     * @summary Delete a webhook subscription
     */
    deleteWebhooksId(metadata: types.DeleteWebhooksIdMetadataParam): Promise<FetchResponse<number, unknown>>;
}
declare const createSDK: SDK;
export = createSDK;

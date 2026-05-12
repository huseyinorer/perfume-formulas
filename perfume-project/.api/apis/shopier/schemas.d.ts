declare const DeleteCategoriesId: {
    readonly metadata: {
        readonly allOf: readonly [{
            readonly type: "object";
            readonly properties: {
                readonly id: {
                    readonly type: "string";
                    readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
                    readonly description: "Specify the category ID to retrieve the category.";
                };
            };
            readonly required: readonly ["id"];
        }];
    };
};
declare const DeleteDiscountsAutomaticId: {
    readonly metadata: {
        readonly allOf: readonly [{
            readonly type: "object";
            readonly properties: {
                readonly id: {
                    readonly type: "string";
                    readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
                    readonly description: "Specify the automatic discount ID to retrieve the automatic discount.";
                };
            };
            readonly required: readonly ["id"];
        }];
    };
};
declare const DeleteDiscountsCodesId: {
    readonly metadata: {
        readonly allOf: readonly [{
            readonly type: "object";
            readonly properties: {
                readonly id: {
                    readonly type: "string";
                    readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
                    readonly description: "Specify the discount code ID to retrieve the discount code.";
                };
            };
            readonly required: readonly ["id"];
        }];
    };
};
declare const DeleteProductsId: {
    readonly metadata: {
        readonly allOf: readonly [{
            readonly type: "object";
            readonly properties: {
                readonly id: {
                    readonly type: "string";
                    readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
                    readonly description: "Specify the product ID to retrieve the product.";
                };
            };
            readonly required: readonly ["id"];
        }];
    };
};
declare const DeleteSelectionsId: {
    readonly metadata: {
        readonly allOf: readonly [{
            readonly type: "object";
            readonly properties: {
                readonly id: {
                    readonly type: "string";
                    readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
                    readonly description: "Specify the selection ID to retrieve the selection.";
                };
            };
            readonly required: readonly ["id"];
        }];
    };
};
declare const DeleteShippingsCode: {
    readonly metadata: {
        readonly allOf: readonly [{
            readonly type: "object";
            readonly properties: {
                readonly code: {
                    readonly type: "string";
                    readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
                    readonly description: "Specify the shipping code to retrieve the shipping.";
                };
            };
            readonly required: readonly ["code"];
        }];
    };
};
declare const DeleteVariationsId: {
    readonly metadata: {
        readonly allOf: readonly [{
            readonly type: "object";
            readonly properties: {
                readonly id: {
                    readonly type: "string";
                    readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
                    readonly description: "Specify the variation ID to retrieve the variation.";
                };
            };
            readonly required: readonly ["id"];
        }];
    };
};
declare const DeleteWebhooksId: {
    readonly metadata: {
        readonly allOf: readonly [{
            readonly type: "object";
            readonly properties: {
                readonly id: {
                    readonly type: "string";
                    readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
                };
            };
            readonly required: readonly ["id"];
        }];
    };
};
declare const GetBalance: {
    readonly response: {
        readonly "200": {
            readonly title: "Balance";
            readonly type: "array";
            readonly description: "Balance model.";
            readonly items: {
                readonly type: "object";
                readonly properties: {
                    readonly currency: {
                        readonly type: "string";
                        readonly enum: readonly ["TRY", "USD", "EUR"];
                        readonly description: "Currency of balance.\n\n`TRY` `USD` `EUR`";
                    };
                    readonly amount: {
                        readonly type: "string";
                        readonly description: "Net amount, i.e., current balance.";
                    };
                };
            };
            readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
        };
    };
};
declare const GetBalanceTransactions: {
    readonly metadata: {
        readonly allOf: readonly [{
            readonly type: "object";
            readonly properties: {
                readonly dateStart: {
                    readonly type: "string";
                    readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
                    readonly description: "Show balance transactions created at or after datetime. yyyy-MM-ddTHH:mm:ssZ format is used (e.g., 2022-07-21T13:24:51+0300)";
                };
                readonly dateEnd: {
                    readonly type: "string";
                    readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
                    readonly description: "Show balance transactions created at or before datetime. yyyy-MM-ddTHH:mm:ssZ format is used (e.g., 2022-07-25T13:24:51+0300) ";
                };
                readonly limit: {
                    readonly type: "integer";
                    readonly minimum: 1;
                    readonly maximum: 50;
                    readonly multipleOf: 1;
                    readonly default: 10;
                    readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
                    readonly description: "The maximum number of items to be returned in result set.";
                };
                readonly page: {
                    readonly type: "integer";
                    readonly default: 1;
                    readonly minimum: 1;
                    readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
                    readonly description: "Current page of the collection.";
                };
                readonly sort: {
                    readonly type: "string";
                    readonly default: "dateDesc";
                    readonly enum: readonly ["dateAsc", "dateDesc"];
                    readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
                    readonly description: "Sort results by date. ";
                };
            };
            readonly required: readonly [];
        }];
    };
    readonly response: {
        readonly "200": {
            readonly type: "array";
            readonly items: {
                readonly title: "Transaction";
                readonly type: "object";
                readonly description: "Transaction model.";
                readonly properties: {
                    readonly orderId: {
                        readonly type: "string";
                        readonly description: "The ID of the order.";
                    };
                    readonly type: {
                        readonly type: "string";
                        readonly enum: readonly ["charge", "adjustment"];
                        readonly description: "Type of the transaction.\n\n`charge` `adjustment`";
                    };
                    readonly description: {
                        readonly type: "string";
                        readonly description: "Description of the transaction.";
                    };
                    readonly dateCreated: {
                        readonly type: "string";
                        readonly description: "The date and time for the creation of the transaction. yyyy-MM-ddTHH:mm:ssZ format is used (e.g. 2022-07-21T13:24:51+0300).";
                    };
                    readonly gross: {
                        readonly type: "object";
                        readonly description: "The gross amounts of the transaction.";
                        readonly properties: {
                            readonly originCurrency: {
                                readonly type: "string";
                                readonly description: "Origin currency of the transaction.\n\n`TRY` `USD` `EUR`";
                                readonly enum: readonly ["TRY", "USD", "EUR"];
                            };
                            readonly originAmount: {
                                readonly type: "string";
                                readonly description: "Total origin amount paid by the buyer.";
                            };
                            readonly payoutCurrency: {
                                readonly type: "string";
                                readonly description: "Payout currency of the transaction.\n\n`TRY` `USD` `EUR`";
                                readonly enum: readonly ["TRY", "USD", "EUR"];
                            };
                            readonly payoutAmount: {
                                readonly type: "string";
                                readonly description: "Gross payout amount. Fees will be deducted from this during payout. ";
                            };
                            readonly exchangeRate: {
                                readonly type: "string";
                                readonly description: "Exchange rate used for the transaction if the originCurrency and payoutCurrency are different. Returns \"1\" if these currencies are same.";
                            };
                        };
                    };
                    readonly fee: {
                        readonly type: "array";
                        readonly description: "Total fees of the transaction.";
                        readonly items: {
                            readonly type: "object";
                            readonly properties: {
                                readonly currency: {
                                    readonly type: "string";
                                    readonly enum: readonly ["TRY", "USD", "EUR"];
                                    readonly description: "Fee currency of the transaction.\n\n`TRY` `USD` `EUR`";
                                };
                                readonly amount: {
                                    readonly type: "string";
                                    readonly description: "Total fee amount of the transaction for the returned currency.";
                                };
                            };
                        };
                    };
                    readonly feeDetails: {
                        readonly type: "array";
                        readonly description: "Details of fee(s) of the transaction.";
                        readonly items: {
                            readonly type: "object";
                            readonly properties: {
                                readonly type: {
                                    readonly type: "string";
                                    readonly enum: readonly ["serviceFee", "shippingFee", "vat", "wht"];
                                    readonly description: "Type of the single fee item.\n\n`serviceFee` `shippingFee` `vat` `wht`";
                                };
                                readonly currency: {
                                    readonly type: "string";
                                    readonly description: "Fee currency of the single fee item.\n\n`TRY` `USD` `EUR`";
                                    readonly enum: readonly ["TRY", "USD", "EUR"];
                                };
                                readonly amount: {
                                    readonly type: "string";
                                    readonly description: "Fee amount of the single fee item.";
                                };
                            };
                        };
                    };
                    readonly installments: {
                        readonly type: "object";
                        readonly description: "Returns the details of installment payments. Returns empty in case of an advance payment.";
                        readonly properties: {
                            readonly term: {
                                readonly type: "integer";
                                readonly description: "Installment term in months.";
                            };
                            readonly currency: {
                                readonly type: "string";
                                readonly description: "Currency of the interest cost.\n\n`TRY` `USD` `EUR`";
                                readonly enum: readonly ["TRY", "USD", "EUR"];
                            };
                            readonly interestCost: {
                                readonly type: "string";
                                readonly description: "Total interest cost over the term of installments.";
                            };
                            readonly costBearer: {
                                readonly type: "string";
                                readonly enum: readonly ["buyer", "seller"];
                                readonly description: "Bearer of the interest cost.\n\n`buyer` `seller`";
                            };
                        };
                    };
                    readonly net: {
                        readonly type: "array";
                        readonly description: "The net amount of the transaction. ";
                        readonly items: {
                            readonly type: "object";
                            readonly properties: {
                                readonly payoutCurrency: {
                                    readonly type: "string";
                                    readonly enum: readonly ["TRY", "USD", "EUR"];
                                    readonly description: "Payout currency of the transaction.\n\n`TRY` `USD` `EUR`";
                                };
                                readonly payoutAmount: {
                                    readonly type: "string";
                                    readonly description: "Net payout amount. Fees are already deducted to calculate net payout amount.";
                                };
                            };
                        };
                    };
                };
            };
            readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
        };
    };
};
declare const GetBalanceTransactionsOrderId: {
    readonly metadata: {
        readonly allOf: readonly [{
            readonly type: "object";
            readonly properties: {
                readonly orderId: {
                    readonly type: "string";
                    readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
                    readonly description: "Specify the order ID to retrieve the balance transaction.";
                };
            };
            readonly required: readonly ["orderId"];
        }];
    };
    readonly response: {
        readonly "200": {
            readonly title: "Transaction";
            readonly type: "object";
            readonly description: "Transaction model.";
            readonly properties: {
                readonly orderId: {
                    readonly type: "string";
                    readonly description: "The ID of the order.";
                };
                readonly type: {
                    readonly type: "string";
                    readonly enum: readonly ["charge", "adjustment"];
                    readonly description: "Type of the transaction.\n\n`charge` `adjustment`";
                };
                readonly description: {
                    readonly type: "string";
                    readonly description: "Description of the transaction.";
                };
                readonly dateCreated: {
                    readonly type: "string";
                    readonly description: "The date and time for the creation of the transaction. yyyy-MM-ddTHH:mm:ssZ format is used (e.g. 2022-07-21T13:24:51+0300).";
                };
                readonly gross: {
                    readonly type: "object";
                    readonly description: "The gross amounts of the transaction.";
                    readonly properties: {
                        readonly originCurrency: {
                            readonly type: "string";
                            readonly description: "Origin currency of the transaction.\n\n`TRY` `USD` `EUR`";
                            readonly enum: readonly ["TRY", "USD", "EUR"];
                        };
                        readonly originAmount: {
                            readonly type: "string";
                            readonly description: "Total origin amount paid by the buyer.";
                        };
                        readonly payoutCurrency: {
                            readonly type: "string";
                            readonly description: "Payout currency of the transaction.\n\n`TRY` `USD` `EUR`";
                            readonly enum: readonly ["TRY", "USD", "EUR"];
                        };
                        readonly payoutAmount: {
                            readonly type: "string";
                            readonly description: "Gross payout amount. Fees will be deducted from this during payout. ";
                        };
                        readonly exchangeRate: {
                            readonly type: "string";
                            readonly description: "Exchange rate used for the transaction if the originCurrency and payoutCurrency are different. Returns \"1\" if these currencies are same.";
                        };
                    };
                };
                readonly fee: {
                    readonly type: "array";
                    readonly description: "Total fees of the transaction.";
                    readonly items: {
                        readonly type: "object";
                        readonly properties: {
                            readonly currency: {
                                readonly type: "string";
                                readonly enum: readonly ["TRY", "USD", "EUR"];
                                readonly description: "Fee currency of the transaction.\n\n`TRY` `USD` `EUR`";
                            };
                            readonly amount: {
                                readonly type: "string";
                                readonly description: "Total fee amount of the transaction for the returned currency.";
                            };
                        };
                    };
                };
                readonly feeDetails: {
                    readonly type: "array";
                    readonly description: "Details of fee(s) of the transaction.";
                    readonly items: {
                        readonly type: "object";
                        readonly properties: {
                            readonly type: {
                                readonly type: "string";
                                readonly enum: readonly ["serviceFee", "shippingFee", "vat", "wht"];
                                readonly description: "Type of the single fee item.\n\n`serviceFee` `shippingFee` `vat` `wht`";
                            };
                            readonly currency: {
                                readonly type: "string";
                                readonly description: "Fee currency of the single fee item.\n\n`TRY` `USD` `EUR`";
                                readonly enum: readonly ["TRY", "USD", "EUR"];
                            };
                            readonly amount: {
                                readonly type: "string";
                                readonly description: "Fee amount of the single fee item.";
                            };
                        };
                    };
                };
                readonly installments: {
                    readonly type: "object";
                    readonly description: "Returns the details of installment payments. Returns empty in case of an advance payment.";
                    readonly properties: {
                        readonly term: {
                            readonly type: "integer";
                            readonly description: "Installment term in months.";
                        };
                        readonly currency: {
                            readonly type: "string";
                            readonly description: "Currency of the interest cost.\n\n`TRY` `USD` `EUR`";
                            readonly enum: readonly ["TRY", "USD", "EUR"];
                        };
                        readonly interestCost: {
                            readonly type: "string";
                            readonly description: "Total interest cost over the term of installments.";
                        };
                        readonly costBearer: {
                            readonly type: "string";
                            readonly enum: readonly ["buyer", "seller"];
                            readonly description: "Bearer of the interest cost.\n\n`buyer` `seller`";
                        };
                    };
                };
                readonly net: {
                    readonly type: "array";
                    readonly description: "The net amount of the transaction. ";
                    readonly items: {
                        readonly type: "object";
                        readonly properties: {
                            readonly payoutCurrency: {
                                readonly type: "string";
                                readonly enum: readonly ["TRY", "USD", "EUR"];
                                readonly description: "Payout currency of the transaction.\n\n`TRY` `USD` `EUR`";
                            };
                            readonly payoutAmount: {
                                readonly type: "string";
                                readonly description: "Net payout amount. Fees are already deducted to calculate net payout amount.";
                            };
                        };
                    };
                };
            };
            readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
        };
    };
};
declare const GetCategories: {
    readonly metadata: {
        readonly allOf: readonly [{
            readonly type: "object";
            readonly properties: {
                readonly limit: {
                    readonly type: "integer";
                    readonly minimum: 1;
                    readonly maximum: 50;
                    readonly multipleOf: 1;
                    readonly default: 10;
                    readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
                    readonly description: "The maximum number of items to be returned in result set.";
                };
                readonly page: {
                    readonly type: "integer";
                    readonly default: 1;
                    readonly minimum: 1;
                    readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
                    readonly description: "Current page of the collection.";
                };
                readonly sort: {
                    readonly type: "string";
                    readonly enum: readonly ["asc", "desc"];
                    readonly default: "asc";
                    readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
                    readonly description: "Sort results by their placements in storefront.";
                };
            };
            readonly required: readonly [];
        }];
    };
    readonly response: {
        readonly "200": {
            readonly type: "array";
            readonly items: {
                readonly title: "Category";
                readonly type: "object";
                readonly description: "Category model.";
                readonly properties: {
                    readonly id: {
                        readonly type: "string";
                        readonly description: "The ID of the product category.";
                    };
                    readonly title: {
                        readonly type: "string";
                        readonly description: "The title of the product category.";
                    };
                    readonly placement: {
                        readonly type: "integer";
                        readonly minimum: 1;
                        readonly multipleOf: 1;
                        readonly description: "Ranking of the product category in the shop. Returns \"1\" for the first category, increments accordingly.";
                    };
                };
            };
            readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
        };
    };
};
declare const GetCategoriesId: {
    readonly metadata: {
        readonly allOf: readonly [{
            readonly type: "object";
            readonly properties: {
                readonly id: {
                    readonly type: "string";
                    readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
                    readonly description: "Specify the category ID to retrieve the category.";
                };
            };
            readonly required: readonly ["id"];
        }];
    };
    readonly response: {
        readonly "200": {
            readonly title: "Category";
            readonly type: "object";
            readonly description: "Category model.";
            readonly properties: {
                readonly id: {
                    readonly type: "string";
                    readonly description: "The ID of the product category.";
                };
                readonly title: {
                    readonly type: "string";
                    readonly description: "The title of the product category.";
                };
                readonly placement: {
                    readonly type: "integer";
                    readonly minimum: 1;
                    readonly multipleOf: 1;
                    readonly description: "Ranking of the product category in the shop. Returns \"1\" for the first category, increments accordingly.";
                };
            };
            readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
        };
    };
};
declare const GetDiscountsAutomatic: {
    readonly metadata: {
        readonly allOf: readonly [{
            readonly type: "object";
            readonly properties: {
                readonly limit: {
                    readonly type: "integer";
                    readonly minimum: 1;
                    readonly maximum: 50;
                    readonly multipleOf: 1;
                    readonly default: 10;
                    readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
                    readonly description: "The maximum number of items to be returned in result set.";
                };
                readonly page: {
                    readonly type: "integer";
                    readonly default: 1;
                    readonly minimum: 1;
                    readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
                    readonly description: "Current page of the collection.";
                };
                readonly sort: {
                    readonly type: "string";
                    readonly default: "dateDesc";
                    readonly enum: readonly ["dateAsc", "dateDesc"];
                    readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
                    readonly description: "Sort results by date. ";
                };
            };
            readonly required: readonly [];
        }];
    };
    readonly response: {
        readonly "200": {
            readonly type: "array";
            readonly items: {
                readonly title: "AutomaticDiscount";
                readonly type: "object";
                readonly description: "Automatic discount model.";
                readonly properties: {
                    readonly id: {
                        readonly type: "string";
                        readonly description: "The ID of the automatic discount.";
                    };
                    readonly title: {
                        readonly type: "string";
                        readonly description: "The title of the automatic discount.";
                    };
                    readonly scope: {
                        readonly type: "string";
                        readonly enum: readonly ["all", "selectedProducts", "selectedCategories"];
                        readonly description: "The scope of the automatic discount. Automatic discounts can be applied for all or some of the products or categories.\n\n`all` `selectedProducts` `selectedCategories`";
                    };
                    readonly productIds: {
                        readonly type: "array";
                        readonly description: "List of product IDs the automatic discount is applicable. Used when the scope is \"all\" or \"selectedProducts\".";
                        readonly items: {
                            readonly type: "string";
                        };
                    };
                    readonly categoryIds: {
                        readonly type: "array";
                        readonly description: "List of category IDs the automatic discount is applicable. Used when the scope is \"all\" or \"selectedCategories\".";
                        readonly items: {
                            readonly type: "string";
                        };
                    };
                    readonly dateCreated: {
                        readonly type: "string";
                        readonly description: "The date and time for the creation of the automatic discount. yyyy-MM-ddTHH:mm:ssZ format is used (e.g., 2022-07-21T13:24:51+0300).";
                    };
                    readonly type: {
                        readonly type: "string";
                        readonly description: "Type of the discount.\n\n`amount` `percent`";
                        readonly enum: readonly ["amount", "percent"];
                    };
                    readonly amountOff: {
                        readonly type: "string";
                        readonly description: "The absolute value of the discount amount. Used when the automatic discount type is \"amount\".";
                    };
                    readonly percentOff: {
                        readonly type: "string";
                        readonly description: "The percentage rate of the discount. Used when the automatic discount type is \"percent\".";
                    };
                    readonly requirement: {
                        readonly type: "string";
                        readonly enum: readonly ["amount", "quantity"];
                        readonly description: "The requirement type of the automatic discount.\n\n`amount` `quantity`";
                    };
                    readonly amountMinimum: {
                        readonly type: "string";
                        readonly description: "The minimum purchase amount for the automatic discount to be applicable. Used when the automatic discount requirement is \"amount\".";
                    };
                    readonly quantityMinimum: {
                        readonly type: "integer";
                        readonly description: "The minimum number of items to be purchased for the automatic discount to be applicable. Used when the automatic discount requirement is \"quantity\".";
                    };
                    readonly currency: {
                        readonly type: "string";
                        readonly enum: readonly ["TRY", "USD", "EUR"];
                        readonly description: "Currency of the automatic discount.\n\n`TRY` `USD` `EUR`";
                    };
                    readonly startsAt: {
                        readonly type: "string";
                        readonly description: "Start date of the automatic discount. yyyy-MM-ddZ format is used (e.g., 2022-07-21+0300).";
                    };
                    readonly expiresAt: {
                        readonly type: "string";
                        readonly description: "Expiry date of the automatic discount. yyyy-MM-ddZ format is used (e.g., 2022-07-21+0300).";
                    };
                };
            };
            readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
        };
    };
};
declare const GetDiscountsAutomaticId: {
    readonly metadata: {
        readonly allOf: readonly [{
            readonly type: "object";
            readonly properties: {
                readonly id: {
                    readonly type: "string";
                    readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
                    readonly description: "Specify the automatic discount ID to retrieve the automatic discount.";
                };
            };
            readonly required: readonly ["id"];
        }];
    };
    readonly response: {
        readonly "200": {
            readonly title: "AutomaticDiscount";
            readonly type: "object";
            readonly description: "Automatic discount model.";
            readonly properties: {
                readonly id: {
                    readonly type: "string";
                    readonly description: "The ID of the automatic discount.";
                };
                readonly title: {
                    readonly type: "string";
                    readonly description: "The title of the automatic discount.";
                };
                readonly scope: {
                    readonly type: "string";
                    readonly enum: readonly ["all", "selectedProducts", "selectedCategories"];
                    readonly description: "The scope of the automatic discount. Automatic discounts can be applied for all or some of the products or categories.\n\n`all` `selectedProducts` `selectedCategories`";
                };
                readonly productIds: {
                    readonly type: "array";
                    readonly description: "List of product IDs the automatic discount is applicable. Used when the scope is \"all\" or \"selectedProducts\".";
                    readonly items: {
                        readonly type: "string";
                    };
                };
                readonly categoryIds: {
                    readonly type: "array";
                    readonly description: "List of category IDs the automatic discount is applicable. Used when the scope is \"all\" or \"selectedCategories\".";
                    readonly items: {
                        readonly type: "string";
                    };
                };
                readonly dateCreated: {
                    readonly type: "string";
                    readonly description: "The date and time for the creation of the automatic discount. yyyy-MM-ddTHH:mm:ssZ format is used (e.g., 2022-07-21T13:24:51+0300).";
                };
                readonly type: {
                    readonly type: "string";
                    readonly description: "Type of the discount.\n\n`amount` `percent`";
                    readonly enum: readonly ["amount", "percent"];
                };
                readonly amountOff: {
                    readonly type: "string";
                    readonly description: "The absolute value of the discount amount. Used when the automatic discount type is \"amount\".";
                };
                readonly percentOff: {
                    readonly type: "string";
                    readonly description: "The percentage rate of the discount. Used when the automatic discount type is \"percent\".";
                };
                readonly requirement: {
                    readonly type: "string";
                    readonly enum: readonly ["amount", "quantity"];
                    readonly description: "The requirement type of the automatic discount.\n\n`amount` `quantity`";
                };
                readonly amountMinimum: {
                    readonly type: "string";
                    readonly description: "The minimum purchase amount for the automatic discount to be applicable. Used when the automatic discount requirement is \"amount\".";
                };
                readonly quantityMinimum: {
                    readonly type: "integer";
                    readonly description: "The minimum number of items to be purchased for the automatic discount to be applicable. Used when the automatic discount requirement is \"quantity\".";
                };
                readonly currency: {
                    readonly type: "string";
                    readonly enum: readonly ["TRY", "USD", "EUR"];
                    readonly description: "Currency of the automatic discount.\n\n`TRY` `USD` `EUR`";
                };
                readonly startsAt: {
                    readonly type: "string";
                    readonly description: "Start date of the automatic discount. yyyy-MM-ddZ format is used (e.g., 2022-07-21+0300).";
                };
                readonly expiresAt: {
                    readonly type: "string";
                    readonly description: "Expiry date of the automatic discount. yyyy-MM-ddZ format is used (e.g., 2022-07-21+0300).";
                };
            };
            readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
        };
    };
};
declare const GetDiscountsCodes: {
    readonly metadata: {
        readonly allOf: readonly [{
            readonly type: "object";
            readonly properties: {
                readonly limit: {
                    readonly type: "integer";
                    readonly minimum: 1;
                    readonly maximum: 50;
                    readonly multipleOf: 1;
                    readonly default: 10;
                    readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
                    readonly description: "The maximum number of items to be returned in result set.";
                };
                readonly page: {
                    readonly type: "integer";
                    readonly default: 1;
                    readonly minimum: 1;
                    readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
                    readonly description: "Current page of the collection.";
                };
                readonly sort: {
                    readonly type: "string";
                    readonly default: "dateDesc";
                    readonly enum: readonly ["dateAsc", "dateDesc"];
                    readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
                    readonly description: "Sort results by date. ";
                };
            };
            readonly required: readonly [];
        }];
    };
    readonly response: {
        readonly "200": {
            readonly type: "array";
            readonly items: {
                readonly title: "DiscountCode";
                readonly type: "object";
                readonly description: "Discount code model.";
                readonly properties: {
                    readonly id: {
                        readonly type: "string";
                        readonly description: "The ID of discount code.";
                    };
                    readonly code: {
                        readonly type: "string";
                        readonly description: "The discount code for the buyers used at the checkout.";
                    };
                    readonly dateCreated: {
                        readonly type: "string";
                        readonly description: "The date and time for the creation of the discount code. yyyy-MM-ddTHH:mm:ssZ format is used (e.g., 2022-07-21T13:24:51+0300).";
                    };
                    readonly type: {
                        readonly type: "string";
                        readonly description: "Type of the discount.\n\n`amount` `percent`";
                        readonly enum: readonly ["amount", "percent"];
                    };
                    readonly amountOff: {
                        readonly type: "string";
                        readonly description: "The absolute value of the discount amount. Used when the discount code type is \"amount\".";
                    };
                    readonly percentOff: {
                        readonly type: "string";
                        readonly description: "The percentage rate of the discount. Used when the discount code type is \"percent\".";
                    };
                    readonly amountMinimum: {
                        readonly type: "string";
                        readonly description: "Required minimum order amount for the discount code to be applicable. ";
                    };
                    readonly currency: {
                        readonly type: "string";
                        readonly enum: readonly ["TRY", "USD", "EUR"];
                        readonly description: "Currency of the discount code.\n\n`TRY` `USD` `EUR`";
                    };
                    readonly numAvailable: {
                        readonly type: "integer";
                        readonly description: "Number of remaining discount codes that can be used.";
                    };
                    readonly numUsed: {
                        readonly type: "integer";
                        readonly description: "Number of times the discount code has been used.";
                    };
                    readonly expiresAt: {
                        readonly type: "string";
                        readonly description: "Expiry date of the discount code. yyyy-MM-ddZ format is used (e.g., 2022-07-21+0300).";
                    };
                };
            };
            readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
        };
    };
};
declare const GetDiscountsCodesId: {
    readonly metadata: {
        readonly allOf: readonly [{
            readonly type: "object";
            readonly properties: {
                readonly id: {
                    readonly type: "string";
                    readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
                    readonly description: "Specify the discount code ID to retrieve the discount code.";
                };
            };
            readonly required: readonly ["id"];
        }];
    };
    readonly response: {
        readonly "200": {
            readonly title: "DiscountCode";
            readonly type: "object";
            readonly description: "Discount code model.";
            readonly properties: {
                readonly id: {
                    readonly type: "string";
                    readonly description: "The ID of discount code.";
                };
                readonly code: {
                    readonly type: "string";
                    readonly description: "The discount code for the buyers used at the checkout.";
                };
                readonly dateCreated: {
                    readonly type: "string";
                    readonly description: "The date and time for the creation of the discount code. yyyy-MM-ddTHH:mm:ssZ format is used (e.g., 2022-07-21T13:24:51+0300).";
                };
                readonly type: {
                    readonly type: "string";
                    readonly description: "Type of the discount.\n\n`amount` `percent`";
                    readonly enum: readonly ["amount", "percent"];
                };
                readonly amountOff: {
                    readonly type: "string";
                    readonly description: "The absolute value of the discount amount. Used when the discount code type is \"amount\".";
                };
                readonly percentOff: {
                    readonly type: "string";
                    readonly description: "The percentage rate of the discount. Used when the discount code type is \"percent\".";
                };
                readonly amountMinimum: {
                    readonly type: "string";
                    readonly description: "Required minimum order amount for the discount code to be applicable. ";
                };
                readonly currency: {
                    readonly type: "string";
                    readonly enum: readonly ["TRY", "USD", "EUR"];
                    readonly description: "Currency of the discount code.\n\n`TRY` `USD` `EUR`";
                };
                readonly numAvailable: {
                    readonly type: "integer";
                    readonly description: "Number of remaining discount codes that can be used.";
                };
                readonly numUsed: {
                    readonly type: "integer";
                    readonly description: "Number of times the discount code has been used.";
                };
                readonly expiresAt: {
                    readonly type: "string";
                    readonly description: "Expiry date of the discount code. yyyy-MM-ddZ format is used (e.g., 2022-07-21+0300).";
                };
            };
            readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
        };
    };
};
declare const GetOrders: {
    readonly metadata: {
        readonly allOf: readonly [{
            readonly type: "object";
            readonly properties: {
                readonly dateStart: {
                    readonly type: "string";
                    readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
                    readonly description: "Show orders created at or after datetime. yyyy-MM-ddTHH:mm:ssZ format is used (e.g., 2022-07-21T13:24:51+0300)";
                };
                readonly dateEnd: {
                    readonly type: "string";
                    readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
                    readonly description: "Show orders created at or before datetime. yyyy-MM-ddTHH:mm:ssZ format is used (e.g., 2022-07-25T13:24:51+0300)";
                };
                readonly fulfillmentStatus: {
                    readonly type: "string";
                    readonly enum: readonly ["unfulfilled", "fulfilled"];
                    readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
                    readonly description: "Filter by fulfillment status.";
                };
                readonly refundType: {
                    readonly type: "string";
                    readonly enum: readonly ["none", "partial", "full"];
                    readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
                    readonly description: "Filter by refund type.";
                };
                readonly customerEmail: {
                    readonly type: "string";
                    readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
                    readonly description: "Filter by a customer's email address.";
                };
                readonly customerPhone: {
                    readonly type: "string";
                    readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
                    readonly description: "Filter by a customer's phone number.";
                };
                readonly productId: {
                    readonly type: "string";
                    readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
                    readonly description: "Filter by a product by specifying product ID.";
                };
                readonly limit: {
                    readonly type: "integer";
                    readonly minimum: 1;
                    readonly maximum: 50;
                    readonly multipleOf: 1;
                    readonly default: 10;
                    readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
                    readonly description: "The maximum number of items to be returned in result set.";
                };
                readonly page: {
                    readonly type: "integer";
                    readonly default: 1;
                    readonly minimum: 1;
                    readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
                    readonly description: "Current page of the collection.";
                };
                readonly sort: {
                    readonly type: "string";
                    readonly default: "dateDesc";
                    readonly enum: readonly ["dateAsc", "dateDesc"];
                    readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
                    readonly description: "Sort results by date. ";
                };
            };
            readonly required: readonly [];
        }];
    };
    readonly response: {
        readonly "200": {
            readonly type: "array";
            readonly items: {
                readonly title: "Order";
                readonly type: "object";
                readonly description: "Order model.";
                readonly properties: {
                    readonly id: {
                        readonly type: "string";
                        readonly description: "The ID of the order.";
                    };
                    readonly status: {
                        readonly type: "string";
                        readonly enum: readonly ["fulfilled", "unfulfilled"];
                        readonly description: "Current fulfillment status of the order.\n\n`fulfilled` `unfulfilled`";
                    };
                    readonly paymentStatus: {
                        readonly type: "string";
                        readonly description: "Current payment status of the order (Currently only paid orders are in scope, unpaid is reserved for future use).\n\n`paid` `unpaid`";
                        readonly enum: readonly ["paid", "unpaid"];
                    };
                    readonly installments: {
                        readonly type: "boolean";
                        readonly description: "Returns true if the payment is done in installments.";
                    };
                    readonly dateCreated: {
                        readonly type: "string";
                        readonly description: "The date and time for the creation of the order. yyyy-MM-ddTHH:mm:ssZ format is used (e.g., 2022-07-21T13:24:51+0300).";
                    };
                    readonly currency: {
                        readonly type: "string";
                        readonly enum: readonly ["TRY", "USD", "EUR"];
                        readonly description: "Currency of the order.\n\n`TRY` `USD` `EUR`";
                    };
                    readonly paymentMethod: {
                        readonly type: "string";
                        readonly enum: readonly ["debitCard", "creditCard"];
                        readonly description: "Buyer's method of payment.\n\n`debitCard` `creditCard`";
                    };
                    readonly totals: {
                        readonly type: "object";
                        readonly description: "The total amounts for all order line items.";
                        readonly properties: {
                            readonly subtotal: {
                                readonly type: "string";
                                readonly description: "Subtotal amount for all the products and/or services sold.";
                            };
                            readonly shipping: {
                                readonly type: "string";
                                readonly description: "Shipping amount of the order.";
                            };
                            readonly discount: {
                                readonly type: "string";
                                readonly description: "Discount amount of the order.";
                            };
                            readonly total: {
                                readonly type: "string";
                                readonly description: "Grand total amount of the order.";
                            };
                        };
                    };
                    readonly discounts: {
                        readonly type: "array";
                        readonly description: "Details of the discounts applied.";
                        readonly items: {
                            readonly type: "object";
                            readonly properties: {
                                readonly id: {
                                    readonly type: "string";
                                    readonly description: "The ID of the discount.";
                                };
                                readonly method: {
                                    readonly type: "string";
                                    readonly enum: readonly ["discountCode", "automaticDiscount"];
                                    readonly description: "Discount method.\n\n`discountCode` `automaticDiscount`";
                                };
                            };
                        };
                    };
                    readonly shippingInfo: {
                        readonly type: "object";
                        readonly description: "Buyer's shipping address and details.";
                        readonly properties: {
                            readonly firstName: {
                                readonly type: "string";
                                readonly description: "Buyer's first name for shipping.";
                            };
                            readonly lastName: {
                                readonly type: "string";
                                readonly description: "Buyer's last name for shipping.";
                            };
                            readonly nationalId: {
                                readonly type: "string";
                                readonly description: "Buyer's national identification number for shipping.";
                            };
                            readonly email: {
                                readonly type: "string";
                                readonly description: "Buyer's email address for shipping.";
                            };
                            readonly phone: {
                                readonly type: "string";
                                readonly description: "Buyer's phone number for shipping.";
                            };
                            readonly company: {
                                readonly type: "string";
                                readonly description: "Buyer company's name for shipping.";
                            };
                            readonly address: {
                                readonly type: "string";
                                readonly description: "Buyer's physical address for shipping.";
                            };
                            readonly district: {
                                readonly type: "string";
                                readonly description: "Buyer's district for shipping.";
                            };
                            readonly city: {
                                readonly type: "string";
                                readonly description: "Buyer's city for shipping.";
                            };
                            readonly state: {
                                readonly type: "string";
                                readonly description: "Buyer's state for shipping.";
                            };
                            readonly postcode: {
                                readonly type: "string";
                                readonly description: "Buyer's postcode for shipping.";
                            };
                            readonly country: {
                                readonly type: "string";
                                readonly description: "Buyer's country for shipping.";
                            };
                        };
                    };
                    readonly billingInfo: {
                        readonly type: "object";
                        readonly description: "Buyer's billing address and details. Separate billing information can only be present if the seller uses a special purpose app to collect this information. ";
                        readonly properties: {
                            readonly firstName: {
                                readonly type: "string";
                                readonly description: "Buyer's first name for billing.";
                            };
                            readonly lastName: {
                                readonly type: "string";
                                readonly description: "Buyer's last name for billing.";
                            };
                            readonly nationalId: {
                                readonly type: "string";
                                readonly description: "Buyer's national identification number for billing.";
                            };
                            readonly email: {
                                readonly type: "string";
                                readonly description: "Buyer's email address for billing.";
                            };
                            readonly phone: {
                                readonly type: "string";
                                readonly description: "Buyer's phone number for billing.";
                            };
                            readonly company: {
                                readonly type: "string";
                                readonly description: "Buyer company's name for billing.";
                            };
                            readonly taxOffice: {
                                readonly type: "string";
                                readonly description: "Buyer company's tax office name for billing.";
                            };
                            readonly taxNumber: {
                                readonly type: "string";
                                readonly description: "Buyer company's tax number for billing.";
                            };
                            readonly address: {
                                readonly type: "string";
                                readonly description: "Buyer's physical address for billing.";
                            };
                            readonly district: {
                                readonly type: "string";
                                readonly description: "Buyer's district for billing.";
                            };
                            readonly city: {
                                readonly type: "string";
                                readonly description: "Buyer's city for billing.";
                            };
                            readonly state: {
                                readonly type: "string";
                                readonly description: "Buyer's state for billing.";
                            };
                            readonly postcode: {
                                readonly type: "string";
                                readonly description: "Buyer's postcode for billing.";
                            };
                            readonly country: {
                                readonly type: "string";
                                readonly description: "Buyer's country for billing.";
                            };
                        };
                    };
                    readonly note: {
                        readonly type: "string";
                        readonly description: "Buyer's order note.";
                    };
                    readonly lineItems: {
                        readonly type: "array";
                        readonly description: "Order line items for all the products and/or services sold.";
                        readonly items: {
                            readonly type: "object";
                            readonly properties: {
                                readonly productId: {
                                    readonly type: "string";
                                    readonly description: "The ID of the product.";
                                };
                                readonly title: {
                                    readonly type: "string";
                                    readonly description: "The title of the product.";
                                };
                                readonly type: {
                                    readonly type: "string";
                                    readonly description: "The type of the product.\n\n`physical` `digital`";
                                    readonly enum: readonly ["physical", "digital"];
                                };
                                readonly selection: {
                                    readonly type: "array";
                                    readonly description: "Selection details of the product sold.";
                                    readonly items: {
                                        readonly type: "object";
                                        readonly properties: {
                                            readonly id: {
                                                readonly type: "string";
                                                readonly description: "The ID of the product's selection, a subset of product's variation.";
                                            };
                                            readonly title: {
                                                readonly type: "string";
                                                readonly description: "The title of the product's selection, a subset of product's variation.";
                                            };
                                            readonly variationTitle: {
                                                readonly type: "string";
                                                readonly description: "The title of the main product variation.";
                                            };
                                        };
                                    };
                                };
                                readonly options: {
                                    readonly type: "array";
                                    readonly description: "Option details of the product.";
                                    readonly items: {
                                        readonly type: "object";
                                        readonly properties: {
                                            readonly id: {
                                                readonly type: "string";
                                                readonly description: "The ID of the product's option.";
                                            };
                                            readonly title: {
                                                readonly type: "string";
                                                readonly description: "The title of the product's option.";
                                            };
                                        };
                                    };
                                };
                                readonly quantity: {
                                    readonly type: "integer";
                                    readonly description: "Quantity ordered.";
                                };
                                readonly price: {
                                    readonly type: "string";
                                    readonly description: "Unit price of the product.";
                                };
                                readonly total: {
                                    readonly type: "string";
                                    readonly description: "Total price of the order line item.";
                                };
                            };
                        };
                    };
                    readonly fulfillments: {
                        readonly type: "array";
                        readonly description: "Details of the order fulfillments. Direction of fulfillments is seller to buyer.";
                        readonly items: {
                            readonly title: "Shipping";
                            readonly type: "object";
                            readonly description: "Shipping model.";
                            readonly properties: {
                                readonly orderId: {
                                    readonly type: "string";
                                    readonly description: "The ID of the order.";
                                };
                                readonly status: {
                                    readonly type: "string";
                                    readonly enum: readonly ["shipped", "notShipped"];
                                    readonly description: "Current status of the shipping.\n\n`shipped` `notShipped`";
                                };
                                readonly method: {
                                    readonly type: "string";
                                    readonly enum: readonly ["standard", "contracted"];
                                    readonly description: "Method of the shipping.\n\n`standard` `contracted`";
                                };
                                readonly type: {
                                    readonly type: "string";
                                    readonly enum: readonly ["firstShipment", "secondShipment", "returnShipment"];
                                    readonly description: "Type of the shipping. firstShipment and secondShipment are used for seller to buyer direction, returnShipment is used for buyer to seller direction.\n\n`firstShipment` `secondShipment` `returnShipment`";
                                };
                                readonly dateCreated: {
                                    readonly type: "string";
                                    readonly description: "For standard shipping, this is the date and time of the order closure. For contracted shipping, this is the date and time for the creation of the shipping code. yyyy-MM-ddTHH:mm:ssZ format is used (e.g., 2022-07-21T13:24:51+0300).";
                                };
                                readonly dateDispatched: {
                                    readonly type: "string";
                                    readonly description: "The date and time of the initial dispatch. It is provided by the shipping company and only present for contracted shipping. yyyy-MM-ddTHH:mm:ssZ format is used (e.g., 2022-07-21T13:24:51+0300).";
                                };
                                readonly company: {
                                    readonly type: "string";
                                    readonly enum: readonly ["yurtici", "mng", "ptt", "aras", "surat", "ups", "fedex", "dhl", "tnt", "pts", "aramex", "interGlobal", "other"];
                                    readonly description: "Shipping company.\n\n`yurtici` `mng` `ptt` `aras` `surat` `ups` `fedex` `dhl` `tnt` `pts` `aramex` `interGlobal` `other`";
                                };
                                readonly code: {
                                    readonly type: "string";
                                    readonly description: "Generated shipping code. ";
                                };
                                readonly trackingNumber: {
                                    readonly type: "string";
                                    readonly description: "Tracking number of the shipping. For standard shipping, it is provided by the seller while closing the order. For contracted shipping, it is provided by the shipping company with the initial dispatch. ";
                                };
                                readonly trackingUrl: {
                                    readonly type: "string";
                                    readonly description: "Tracking URL of the shipping. It is provided by the shipping company and only present for contracted shipping.";
                                };
                                readonly size: {
                                    readonly type: "string";
                                    readonly description: "Size of the shipping load. It is provided by some of the shipping companies and only present for contracted shipping.";
                                };
                                readonly sizeUnit: {
                                    readonly type: "string";
                                    readonly description: "Size unit of the shipping load. It is provided by some of the shipping companies and only present for contracted shipping.\n\n`deci`";
                                    readonly enum: readonly ["deci"];
                                };
                                readonly weight: {
                                    readonly type: "string";
                                    readonly description: "Weight of the shipping load. It is provided by some of the shipping companies and only present for contracted shipping.";
                                };
                                readonly weightUnit: {
                                    readonly type: "string";
                                    readonly description: "Weight unit of the shipping load. It is provided by some of the shipping companies and only present for contracted shipping.\n\n`gram` `kilogram`";
                                    readonly enum: readonly ["gram", "kilogram"];
                                };
                                readonly cost: {
                                    readonly type: "string";
                                    readonly description: "Cost of the shipping. It is provided by the shipping company and only present for contracted shipping.";
                                };
                                readonly currency: {
                                    readonly type: "string";
                                    readonly enum: readonly ["TRY", "USD", "EUR"];
                                    readonly description: "Currency of the shipping cost. It is provided by the shipping company and only present for contracted shipping.\n\n`TRY` `USD` `EUR`";
                                };
                            };
                        };
                    };
                    readonly returns: {
                        readonly type: "array";
                        readonly description: "Details of the order returns. Direction of returns is buyer to seller.";
                        readonly items: {
                            readonly title: "Shipping";
                            readonly type: "object";
                            readonly description: "Shipping model.";
                            readonly properties: {
                                readonly orderId: {
                                    readonly type: "string";
                                    readonly description: "The ID of the order.";
                                };
                                readonly status: {
                                    readonly type: "string";
                                    readonly enum: readonly ["shipped", "notShipped"];
                                    readonly description: "Current status of the shipping.\n\n`shipped` `notShipped`";
                                };
                                readonly method: {
                                    readonly type: "string";
                                    readonly enum: readonly ["standard", "contracted"];
                                    readonly description: "Method of the shipping.\n\n`standard` `contracted`";
                                };
                                readonly type: {
                                    readonly type: "string";
                                    readonly enum: readonly ["firstShipment", "secondShipment", "returnShipment"];
                                    readonly description: "Type of the shipping. firstShipment and secondShipment are used for seller to buyer direction, returnShipment is used for buyer to seller direction.\n\n`firstShipment` `secondShipment` `returnShipment`";
                                };
                                readonly dateCreated: {
                                    readonly type: "string";
                                    readonly description: "For standard shipping, this is the date and time of the order closure. For contracted shipping, this is the date and time for the creation of the shipping code. yyyy-MM-ddTHH:mm:ssZ format is used (e.g., 2022-07-21T13:24:51+0300).";
                                };
                                readonly dateDispatched: {
                                    readonly type: "string";
                                    readonly description: "The date and time of the initial dispatch. It is provided by the shipping company and only present for contracted shipping. yyyy-MM-ddTHH:mm:ssZ format is used (e.g., 2022-07-21T13:24:51+0300).";
                                };
                                readonly company: {
                                    readonly type: "string";
                                    readonly enum: readonly ["yurtici", "mng", "ptt", "aras", "surat", "ups", "fedex", "dhl", "tnt", "pts", "aramex", "interGlobal", "other"];
                                    readonly description: "Shipping company.\n\n`yurtici` `mng` `ptt` `aras` `surat` `ups` `fedex` `dhl` `tnt` `pts` `aramex` `interGlobal` `other`";
                                };
                                readonly code: {
                                    readonly type: "string";
                                    readonly description: "Generated shipping code. ";
                                };
                                readonly trackingNumber: {
                                    readonly type: "string";
                                    readonly description: "Tracking number of the shipping. For standard shipping, it is provided by the seller while closing the order. For contracted shipping, it is provided by the shipping company with the initial dispatch. ";
                                };
                                readonly trackingUrl: {
                                    readonly type: "string";
                                    readonly description: "Tracking URL of the shipping. It is provided by the shipping company and only present for contracted shipping.";
                                };
                                readonly size: {
                                    readonly type: "string";
                                    readonly description: "Size of the shipping load. It is provided by some of the shipping companies and only present for contracted shipping.";
                                };
                                readonly sizeUnit: {
                                    readonly type: "string";
                                    readonly description: "Size unit of the shipping load. It is provided by some of the shipping companies and only present for contracted shipping.\n\n`deci`";
                                    readonly enum: readonly ["deci"];
                                };
                                readonly weight: {
                                    readonly type: "string";
                                    readonly description: "Weight of the shipping load. It is provided by some of the shipping companies and only present for contracted shipping.";
                                };
                                readonly weightUnit: {
                                    readonly type: "string";
                                    readonly description: "Weight unit of the shipping load. It is provided by some of the shipping companies and only present for contracted shipping.\n\n`gram` `kilogram`";
                                    readonly enum: readonly ["gram", "kilogram"];
                                };
                                readonly cost: {
                                    readonly type: "string";
                                    readonly description: "Cost of the shipping. It is provided by the shipping company and only present for contracted shipping.";
                                };
                                readonly currency: {
                                    readonly type: "string";
                                    readonly enum: readonly ["TRY", "USD", "EUR"];
                                    readonly description: "Currency of the shipping cost. It is provided by the shipping company and only present for contracted shipping.\n\n`TRY` `USD` `EUR`";
                                };
                            };
                        };
                    };
                    readonly refunds: {
                        readonly type: "array";
                        readonly description: "Details of the refunds issued.";
                        readonly items: {
                            readonly type: "object";
                            readonly properties: {
                                readonly id: {
                                    readonly type: "string";
                                    readonly description: "The ID of the refund.";
                                };
                                readonly type: {
                                    readonly type: "string";
                                    readonly enum: readonly ["full", "partial"];
                                    readonly description: "The type of the refund.\n\n`full` `partial`";
                                };
                                readonly status: {
                                    readonly type: "string";
                                    readonly enum: readonly ["pending", "failed", "succeeded"];
                                    readonly description: "Current status of the refund.\n\n`pending` `failed` `succeeded`";
                                };
                                readonly dateCreated: {
                                    readonly type: "string";
                                    readonly description: "The date and time for the creation of the refund request. yyyy-MM-ddTHH:mm:ssZ format is used (e.g., 2022-07-21T13:24:51+0300).";
                                };
                                readonly dateRefunded: {
                                    readonly type: "string";
                                    readonly description: "The date and time for the actual refund transaction submitted to the payment provider. yyyy-MM-ddTHH:mm:ssZ format is used (e.g., 2022-07-21T13:24:51+0300).";
                                };
                                readonly total: {
                                    readonly type: "string";
                                    readonly description: "Total amount of the refund.";
                                };
                            };
                        };
                    };
                };
            };
            readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
        };
    };
};
declare const GetOrdersId: {
    readonly metadata: {
        readonly allOf: readonly [{
            readonly type: "object";
            readonly properties: {
                readonly id: {
                    readonly type: "string";
                    readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
                    readonly description: "Specify the order ID to retrieve the order.";
                };
            };
            readonly required: readonly ["id"];
        }];
    };
    readonly response: {
        readonly "200": {
            readonly title: "Order";
            readonly type: "object";
            readonly description: "Order model.";
            readonly properties: {
                readonly id: {
                    readonly type: "string";
                    readonly description: "The ID of the order.";
                };
                readonly status: {
                    readonly type: "string";
                    readonly enum: readonly ["fulfilled", "unfulfilled"];
                    readonly description: "Current fulfillment status of the order.\n\n`fulfilled` `unfulfilled`";
                };
                readonly paymentStatus: {
                    readonly type: "string";
                    readonly description: "Current payment status of the order (Currently only paid orders are in scope, unpaid is reserved for future use).\n\n`paid` `unpaid`";
                    readonly enum: readonly ["paid", "unpaid"];
                };
                readonly installments: {
                    readonly type: "boolean";
                    readonly description: "Returns true if the payment is done in installments.";
                };
                readonly dateCreated: {
                    readonly type: "string";
                    readonly description: "The date and time for the creation of the order. yyyy-MM-ddTHH:mm:ssZ format is used (e.g., 2022-07-21T13:24:51+0300).";
                };
                readonly currency: {
                    readonly type: "string";
                    readonly enum: readonly ["TRY", "USD", "EUR"];
                    readonly description: "Currency of the order.\n\n`TRY` `USD` `EUR`";
                };
                readonly paymentMethod: {
                    readonly type: "string";
                    readonly enum: readonly ["debitCard", "creditCard"];
                    readonly description: "Buyer's method of payment.\n\n`debitCard` `creditCard`";
                };
                readonly totals: {
                    readonly type: "object";
                    readonly description: "The total amounts for all order line items.";
                    readonly properties: {
                        readonly subtotal: {
                            readonly type: "string";
                            readonly description: "Subtotal amount for all the products and/or services sold.";
                        };
                        readonly shipping: {
                            readonly type: "string";
                            readonly description: "Shipping amount of the order.";
                        };
                        readonly discount: {
                            readonly type: "string";
                            readonly description: "Discount amount of the order.";
                        };
                        readonly total: {
                            readonly type: "string";
                            readonly description: "Grand total amount of the order.";
                        };
                    };
                };
                readonly discounts: {
                    readonly type: "array";
                    readonly description: "Details of the discounts applied.";
                    readonly items: {
                        readonly type: "object";
                        readonly properties: {
                            readonly id: {
                                readonly type: "string";
                                readonly description: "The ID of the discount.";
                            };
                            readonly method: {
                                readonly type: "string";
                                readonly enum: readonly ["discountCode", "automaticDiscount"];
                                readonly description: "Discount method.\n\n`discountCode` `automaticDiscount`";
                            };
                        };
                    };
                };
                readonly shippingInfo: {
                    readonly type: "object";
                    readonly description: "Buyer's shipping address and details.";
                    readonly properties: {
                        readonly firstName: {
                            readonly type: "string";
                            readonly description: "Buyer's first name for shipping.";
                        };
                        readonly lastName: {
                            readonly type: "string";
                            readonly description: "Buyer's last name for shipping.";
                        };
                        readonly nationalId: {
                            readonly type: "string";
                            readonly description: "Buyer's national identification number for shipping.";
                        };
                        readonly email: {
                            readonly type: "string";
                            readonly description: "Buyer's email address for shipping.";
                        };
                        readonly phone: {
                            readonly type: "string";
                            readonly description: "Buyer's phone number for shipping.";
                        };
                        readonly company: {
                            readonly type: "string";
                            readonly description: "Buyer company's name for shipping.";
                        };
                        readonly address: {
                            readonly type: "string";
                            readonly description: "Buyer's physical address for shipping.";
                        };
                        readonly district: {
                            readonly type: "string";
                            readonly description: "Buyer's district for shipping.";
                        };
                        readonly city: {
                            readonly type: "string";
                            readonly description: "Buyer's city for shipping.";
                        };
                        readonly state: {
                            readonly type: "string";
                            readonly description: "Buyer's state for shipping.";
                        };
                        readonly postcode: {
                            readonly type: "string";
                            readonly description: "Buyer's postcode for shipping.";
                        };
                        readonly country: {
                            readonly type: "string";
                            readonly description: "Buyer's country for shipping.";
                        };
                    };
                };
                readonly billingInfo: {
                    readonly type: "object";
                    readonly description: "Buyer's billing address and details. Separate billing information can only be present if the seller uses a special purpose app to collect this information. ";
                    readonly properties: {
                        readonly firstName: {
                            readonly type: "string";
                            readonly description: "Buyer's first name for billing.";
                        };
                        readonly lastName: {
                            readonly type: "string";
                            readonly description: "Buyer's last name for billing.";
                        };
                        readonly nationalId: {
                            readonly type: "string";
                            readonly description: "Buyer's national identification number for billing.";
                        };
                        readonly email: {
                            readonly type: "string";
                            readonly description: "Buyer's email address for billing.";
                        };
                        readonly phone: {
                            readonly type: "string";
                            readonly description: "Buyer's phone number for billing.";
                        };
                        readonly company: {
                            readonly type: "string";
                            readonly description: "Buyer company's name for billing.";
                        };
                        readonly taxOffice: {
                            readonly type: "string";
                            readonly description: "Buyer company's tax office name for billing.";
                        };
                        readonly taxNumber: {
                            readonly type: "string";
                            readonly description: "Buyer company's tax number for billing.";
                        };
                        readonly address: {
                            readonly type: "string";
                            readonly description: "Buyer's physical address for billing.";
                        };
                        readonly district: {
                            readonly type: "string";
                            readonly description: "Buyer's district for billing.";
                        };
                        readonly city: {
                            readonly type: "string";
                            readonly description: "Buyer's city for billing.";
                        };
                        readonly state: {
                            readonly type: "string";
                            readonly description: "Buyer's state for billing.";
                        };
                        readonly postcode: {
                            readonly type: "string";
                            readonly description: "Buyer's postcode for billing.";
                        };
                        readonly country: {
                            readonly type: "string";
                            readonly description: "Buyer's country for billing.";
                        };
                    };
                };
                readonly note: {
                    readonly type: "string";
                    readonly description: "Buyer's order note.";
                };
                readonly lineItems: {
                    readonly type: "array";
                    readonly description: "Order line items for all the products and/or services sold.";
                    readonly items: {
                        readonly type: "object";
                        readonly properties: {
                            readonly productId: {
                                readonly type: "string";
                                readonly description: "The ID of the product.";
                            };
                            readonly title: {
                                readonly type: "string";
                                readonly description: "The title of the product.";
                            };
                            readonly type: {
                                readonly type: "string";
                                readonly description: "The type of the product.\n\n`physical` `digital`";
                                readonly enum: readonly ["physical", "digital"];
                            };
                            readonly selection: {
                                readonly type: "array";
                                readonly description: "Selection details of the product sold.";
                                readonly items: {
                                    readonly type: "object";
                                    readonly properties: {
                                        readonly id: {
                                            readonly type: "string";
                                            readonly description: "The ID of the product's selection, a subset of product's variation.";
                                        };
                                        readonly title: {
                                            readonly type: "string";
                                            readonly description: "The title of the product's selection, a subset of product's variation.";
                                        };
                                        readonly variationTitle: {
                                            readonly type: "string";
                                            readonly description: "The title of the main product variation.";
                                        };
                                    };
                                };
                            };
                            readonly options: {
                                readonly type: "array";
                                readonly description: "Option details of the product.";
                                readonly items: {
                                    readonly type: "object";
                                    readonly properties: {
                                        readonly id: {
                                            readonly type: "string";
                                            readonly description: "The ID of the product's option.";
                                        };
                                        readonly title: {
                                            readonly type: "string";
                                            readonly description: "The title of the product's option.";
                                        };
                                    };
                                };
                            };
                            readonly quantity: {
                                readonly type: "integer";
                                readonly description: "Quantity ordered.";
                            };
                            readonly price: {
                                readonly type: "string";
                                readonly description: "Unit price of the product.";
                            };
                            readonly total: {
                                readonly type: "string";
                                readonly description: "Total price of the order line item.";
                            };
                        };
                    };
                };
                readonly fulfillments: {
                    readonly type: "array";
                    readonly description: "Details of the order fulfillments. Direction of fulfillments is seller to buyer.";
                    readonly items: {
                        readonly title: "Shipping";
                        readonly type: "object";
                        readonly description: "Shipping model.";
                        readonly properties: {
                            readonly orderId: {
                                readonly type: "string";
                                readonly description: "The ID of the order.";
                            };
                            readonly status: {
                                readonly type: "string";
                                readonly enum: readonly ["shipped", "notShipped"];
                                readonly description: "Current status of the shipping.\n\n`shipped` `notShipped`";
                            };
                            readonly method: {
                                readonly type: "string";
                                readonly enum: readonly ["standard", "contracted"];
                                readonly description: "Method of the shipping.\n\n`standard` `contracted`";
                            };
                            readonly type: {
                                readonly type: "string";
                                readonly enum: readonly ["firstShipment", "secondShipment", "returnShipment"];
                                readonly description: "Type of the shipping. firstShipment and secondShipment are used for seller to buyer direction, returnShipment is used for buyer to seller direction.\n\n`firstShipment` `secondShipment` `returnShipment`";
                            };
                            readonly dateCreated: {
                                readonly type: "string";
                                readonly description: "For standard shipping, this is the date and time of the order closure. For contracted shipping, this is the date and time for the creation of the shipping code. yyyy-MM-ddTHH:mm:ssZ format is used (e.g., 2022-07-21T13:24:51+0300).";
                            };
                            readonly dateDispatched: {
                                readonly type: "string";
                                readonly description: "The date and time of the initial dispatch. It is provided by the shipping company and only present for contracted shipping. yyyy-MM-ddTHH:mm:ssZ format is used (e.g., 2022-07-21T13:24:51+0300).";
                            };
                            readonly company: {
                                readonly type: "string";
                                readonly enum: readonly ["yurtici", "mng", "ptt", "aras", "surat", "ups", "fedex", "dhl", "tnt", "pts", "aramex", "interGlobal", "other"];
                                readonly description: "Shipping company.\n\n`yurtici` `mng` `ptt` `aras` `surat` `ups` `fedex` `dhl` `tnt` `pts` `aramex` `interGlobal` `other`";
                            };
                            readonly code: {
                                readonly type: "string";
                                readonly description: "Generated shipping code. ";
                            };
                            readonly trackingNumber: {
                                readonly type: "string";
                                readonly description: "Tracking number of the shipping. For standard shipping, it is provided by the seller while closing the order. For contracted shipping, it is provided by the shipping company with the initial dispatch. ";
                            };
                            readonly trackingUrl: {
                                readonly type: "string";
                                readonly description: "Tracking URL of the shipping. It is provided by the shipping company and only present for contracted shipping.";
                            };
                            readonly size: {
                                readonly type: "string";
                                readonly description: "Size of the shipping load. It is provided by some of the shipping companies and only present for contracted shipping.";
                            };
                            readonly sizeUnit: {
                                readonly type: "string";
                                readonly description: "Size unit of the shipping load. It is provided by some of the shipping companies and only present for contracted shipping.\n\n`deci`";
                                readonly enum: readonly ["deci"];
                            };
                            readonly weight: {
                                readonly type: "string";
                                readonly description: "Weight of the shipping load. It is provided by some of the shipping companies and only present for contracted shipping.";
                            };
                            readonly weightUnit: {
                                readonly type: "string";
                                readonly description: "Weight unit of the shipping load. It is provided by some of the shipping companies and only present for contracted shipping.\n\n`gram` `kilogram`";
                                readonly enum: readonly ["gram", "kilogram"];
                            };
                            readonly cost: {
                                readonly type: "string";
                                readonly description: "Cost of the shipping. It is provided by the shipping company and only present for contracted shipping.";
                            };
                            readonly currency: {
                                readonly type: "string";
                                readonly enum: readonly ["TRY", "USD", "EUR"];
                                readonly description: "Currency of the shipping cost. It is provided by the shipping company and only present for contracted shipping.\n\n`TRY` `USD` `EUR`";
                            };
                        };
                    };
                };
                readonly returns: {
                    readonly type: "array";
                    readonly description: "Details of the order returns. Direction of returns is buyer to seller.";
                    readonly items: {
                        readonly title: "Shipping";
                        readonly type: "object";
                        readonly description: "Shipping model.";
                        readonly properties: {
                            readonly orderId: {
                                readonly type: "string";
                                readonly description: "The ID of the order.";
                            };
                            readonly status: {
                                readonly type: "string";
                                readonly enum: readonly ["shipped", "notShipped"];
                                readonly description: "Current status of the shipping.\n\n`shipped` `notShipped`";
                            };
                            readonly method: {
                                readonly type: "string";
                                readonly enum: readonly ["standard", "contracted"];
                                readonly description: "Method of the shipping.\n\n`standard` `contracted`";
                            };
                            readonly type: {
                                readonly type: "string";
                                readonly enum: readonly ["firstShipment", "secondShipment", "returnShipment"];
                                readonly description: "Type of the shipping. firstShipment and secondShipment are used for seller to buyer direction, returnShipment is used for buyer to seller direction.\n\n`firstShipment` `secondShipment` `returnShipment`";
                            };
                            readonly dateCreated: {
                                readonly type: "string";
                                readonly description: "For standard shipping, this is the date and time of the order closure. For contracted shipping, this is the date and time for the creation of the shipping code. yyyy-MM-ddTHH:mm:ssZ format is used (e.g., 2022-07-21T13:24:51+0300).";
                            };
                            readonly dateDispatched: {
                                readonly type: "string";
                                readonly description: "The date and time of the initial dispatch. It is provided by the shipping company and only present for contracted shipping. yyyy-MM-ddTHH:mm:ssZ format is used (e.g., 2022-07-21T13:24:51+0300).";
                            };
                            readonly company: {
                                readonly type: "string";
                                readonly enum: readonly ["yurtici", "mng", "ptt", "aras", "surat", "ups", "fedex", "dhl", "tnt", "pts", "aramex", "interGlobal", "other"];
                                readonly description: "Shipping company.\n\n`yurtici` `mng` `ptt` `aras` `surat` `ups` `fedex` `dhl` `tnt` `pts` `aramex` `interGlobal` `other`";
                            };
                            readonly code: {
                                readonly type: "string";
                                readonly description: "Generated shipping code. ";
                            };
                            readonly trackingNumber: {
                                readonly type: "string";
                                readonly description: "Tracking number of the shipping. For standard shipping, it is provided by the seller while closing the order. For contracted shipping, it is provided by the shipping company with the initial dispatch. ";
                            };
                            readonly trackingUrl: {
                                readonly type: "string";
                                readonly description: "Tracking URL of the shipping. It is provided by the shipping company and only present for contracted shipping.";
                            };
                            readonly size: {
                                readonly type: "string";
                                readonly description: "Size of the shipping load. It is provided by some of the shipping companies and only present for contracted shipping.";
                            };
                            readonly sizeUnit: {
                                readonly type: "string";
                                readonly description: "Size unit of the shipping load. It is provided by some of the shipping companies and only present for contracted shipping.\n\n`deci`";
                                readonly enum: readonly ["deci"];
                            };
                            readonly weight: {
                                readonly type: "string";
                                readonly description: "Weight of the shipping load. It is provided by some of the shipping companies and only present for contracted shipping.";
                            };
                            readonly weightUnit: {
                                readonly type: "string";
                                readonly description: "Weight unit of the shipping load. It is provided by some of the shipping companies and only present for contracted shipping.\n\n`gram` `kilogram`";
                                readonly enum: readonly ["gram", "kilogram"];
                            };
                            readonly cost: {
                                readonly type: "string";
                                readonly description: "Cost of the shipping. It is provided by the shipping company and only present for contracted shipping.";
                            };
                            readonly currency: {
                                readonly type: "string";
                                readonly enum: readonly ["TRY", "USD", "EUR"];
                                readonly description: "Currency of the shipping cost. It is provided by the shipping company and only present for contracted shipping.\n\n`TRY` `USD` `EUR`";
                            };
                        };
                    };
                };
                readonly refunds: {
                    readonly type: "array";
                    readonly description: "Details of the refunds issued.";
                    readonly items: {
                        readonly type: "object";
                        readonly properties: {
                            readonly id: {
                                readonly type: "string";
                                readonly description: "The ID of the refund.";
                            };
                            readonly type: {
                                readonly type: "string";
                                readonly enum: readonly ["full", "partial"];
                                readonly description: "The type of the refund.\n\n`full` `partial`";
                            };
                            readonly status: {
                                readonly type: "string";
                                readonly enum: readonly ["pending", "failed", "succeeded"];
                                readonly description: "Current status of the refund.\n\n`pending` `failed` `succeeded`";
                            };
                            readonly dateCreated: {
                                readonly type: "string";
                                readonly description: "The date and time for the creation of the refund request. yyyy-MM-ddTHH:mm:ssZ format is used (e.g., 2022-07-21T13:24:51+0300).";
                            };
                            readonly dateRefunded: {
                                readonly type: "string";
                                readonly description: "The date and time for the actual refund transaction submitted to the payment provider. yyyy-MM-ddTHH:mm:ssZ format is used (e.g., 2022-07-21T13:24:51+0300).";
                            };
                            readonly total: {
                                readonly type: "string";
                                readonly description: "Total amount of the refund.";
                            };
                        };
                    };
                };
            };
            readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
        };
    };
};
declare const GetOrdersTransactionsOrderId: {
    readonly metadata: {
        readonly allOf: readonly [{
            readonly type: "object";
            readonly properties: {
                readonly orderId: {
                    readonly type: "string";
                    readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
                };
            };
            readonly required: readonly ["orderId"];
        }];
    };
    readonly response: {
        readonly "200": {
            readonly title: "Transaction";
            readonly type: "object";
            readonly description: "Transaction model.";
            readonly properties: {
                readonly orderId: {
                    readonly type: "string";
                    readonly description: "The ID of the order.";
                };
                readonly type: {
                    readonly type: "string";
                    readonly enum: readonly ["charge", "adjustment"];
                    readonly description: "Type of the transaction.\n\n`charge` `adjustment`";
                };
                readonly description: {
                    readonly type: "string";
                    readonly description: "Description of the transaction.";
                };
                readonly dateCreated: {
                    readonly type: "string";
                    readonly description: "The date and time for the creation of the transaction. yyyy-MM-ddTHH:mm:ssZ format is used (e.g. 2022-07-21T13:24:51+0300).";
                };
                readonly gross: {
                    readonly type: "object";
                    readonly description: "The gross amounts of the transaction.";
                    readonly properties: {
                        readonly originCurrency: {
                            readonly type: "string";
                            readonly description: "Origin currency of the transaction.\n\n`TRY` `USD` `EUR`";
                            readonly enum: readonly ["TRY", "USD", "EUR"];
                        };
                        readonly originAmount: {
                            readonly type: "string";
                            readonly description: "Total origin amount paid by the buyer.";
                        };
                        readonly payoutCurrency: {
                            readonly type: "string";
                            readonly description: "Payout currency of the transaction.\n\n`TRY` `USD` `EUR`";
                            readonly enum: readonly ["TRY", "USD", "EUR"];
                        };
                        readonly payoutAmount: {
                            readonly type: "string";
                            readonly description: "Gross payout amount. Fees will be deducted from this during payout. ";
                        };
                        readonly exchangeRate: {
                            readonly type: "string";
                            readonly description: "Exchange rate used for the transaction if the originCurrency and payoutCurrency are different. Returns \"1\" if these currencies are same.";
                        };
                    };
                };
                readonly fee: {
                    readonly type: "array";
                    readonly description: "Total fees of the transaction.";
                    readonly items: {
                        readonly type: "object";
                        readonly properties: {
                            readonly currency: {
                                readonly type: "string";
                                readonly enum: readonly ["TRY", "USD", "EUR"];
                                readonly description: "Fee currency of the transaction.\n\n`TRY` `USD` `EUR`";
                            };
                            readonly amount: {
                                readonly type: "string";
                                readonly description: "Total fee amount of the transaction for the returned currency.";
                            };
                        };
                    };
                };
                readonly feeDetails: {
                    readonly type: "array";
                    readonly description: "Details of fee(s) of the transaction.";
                    readonly items: {
                        readonly type: "object";
                        readonly properties: {
                            readonly type: {
                                readonly type: "string";
                                readonly enum: readonly ["serviceFee", "shippingFee", "vat", "wht"];
                                readonly description: "Type of the single fee item.\n\n`serviceFee` `shippingFee` `vat` `wht`";
                            };
                            readonly currency: {
                                readonly type: "string";
                                readonly description: "Fee currency of the single fee item.\n\n`TRY` `USD` `EUR`";
                                readonly enum: readonly ["TRY", "USD", "EUR"];
                            };
                            readonly amount: {
                                readonly type: "string";
                                readonly description: "Fee amount of the single fee item.";
                            };
                        };
                    };
                };
                readonly installments: {
                    readonly type: "object";
                    readonly description: "Returns the details of installment payments. Returns empty in case of an advance payment.";
                    readonly properties: {
                        readonly term: {
                            readonly type: "integer";
                            readonly description: "Installment term in months.";
                        };
                        readonly currency: {
                            readonly type: "string";
                            readonly description: "Currency of the interest cost.\n\n`TRY` `USD` `EUR`";
                            readonly enum: readonly ["TRY", "USD", "EUR"];
                        };
                        readonly interestCost: {
                            readonly type: "string";
                            readonly description: "Total interest cost over the term of installments.";
                        };
                        readonly costBearer: {
                            readonly type: "string";
                            readonly enum: readonly ["buyer", "seller"];
                            readonly description: "Bearer of the interest cost.\n\n`buyer` `seller`";
                        };
                    };
                };
                readonly net: {
                    readonly type: "array";
                    readonly description: "The net amount of the transaction. ";
                    readonly items: {
                        readonly type: "object";
                        readonly properties: {
                            readonly payoutCurrency: {
                                readonly type: "string";
                                readonly enum: readonly ["TRY", "USD", "EUR"];
                                readonly description: "Payout currency of the transaction.\n\n`TRY` `USD` `EUR`";
                            };
                            readonly payoutAmount: {
                                readonly type: "string";
                                readonly description: "Net payout amount. Fees are already deducted to calculate net payout amount.";
                            };
                        };
                    };
                };
            };
            readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
        };
    };
};
declare const GetPayouts: {
    readonly metadata: {
        readonly allOf: readonly [{
            readonly type: "object";
            readonly properties: {
                readonly dateStart: {
                    readonly type: "string";
                    readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
                    readonly description: "Show payouts created at or after datetime. yyyy-MM-ddTHH:mm:ssZ format is used (e.g., 2022-07-21T13:24:51+0300) ";
                };
                readonly dateEnd: {
                    readonly type: "string";
                    readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
                    readonly description: "Show payouts created at or before datetime. yyyy-MM-ddTHH:mm:ssZ format is used (e.g., 2022-07-25T13:24:51+0300)";
                };
                readonly limit: {
                    readonly type: "integer";
                    readonly minimum: 1;
                    readonly maximum: 50;
                    readonly multipleOf: 1;
                    readonly default: 10;
                    readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
                    readonly description: "The maximum number of items to be returned in result set.";
                };
                readonly page: {
                    readonly type: "integer";
                    readonly default: 1;
                    readonly minimum: 1;
                    readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
                    readonly description: "Current page of the collection.";
                };
                readonly sort: {
                    readonly type: "string";
                    readonly default: "dateDesc";
                    readonly enum: readonly ["dateAsc", "dateDesc"];
                    readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
                    readonly description: "Sort results by date. ";
                };
            };
            readonly required: readonly [];
        }];
    };
    readonly response: {
        readonly "200": {
            readonly type: "array";
            readonly items: {
                readonly title: "Payout";
                readonly type: "object";
                readonly description: "Payout model.";
                readonly properties: {
                    readonly id: {
                        readonly type: "string";
                        readonly description: "The ID of the payout.";
                    };
                    readonly status: {
                        readonly type: "string";
                        readonly enum: readonly ["pending", "paid"];
                        readonly description: "Current status of the payout.\n\n`pending` `paid`";
                    };
                    readonly dateCreated: {
                        readonly type: "string";
                        readonly description: "The date when the payout is initiated. yyyy-MM-ddZ format is used (e.g., 2022-07-21+0300).";
                    };
                    readonly amount: {
                        readonly type: "string";
                        readonly description: "Net amount that is transferred.";
                    };
                    readonly currency: {
                        readonly type: "string";
                        readonly enum: readonly ["TRY", "USD", "EUR"];
                        readonly description: "Currency of the payout.\n\n`TRY` `USD` `EUR`";
                    };
                    readonly destination: {
                        readonly type: "object";
                        readonly description: "Information about seller's payout destination.";
                        readonly properties: {
                            readonly type: {
                                readonly type: "string";
                                readonly enum: readonly ["bankAccount"];
                                readonly description: "Type of destination for the payout. \n\n`bankAccount`";
                            };
                            readonly iban: {
                                readonly type: "string";
                                readonly description: "International Bank Account Number (IBAN) of the seller.";
                            };
                        };
                    };
                };
            };
            readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
        };
    };
};
declare const GetPayoutsId: {
    readonly metadata: {
        readonly allOf: readonly [{
            readonly type: "object";
            readonly properties: {
                readonly id: {
                    readonly type: "string";
                    readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
                    readonly description: "Specify the payout ID to retrieve the payout.";
                };
            };
            readonly required: readonly ["id"];
        }];
    };
    readonly response: {
        readonly "200": {
            readonly title: "Payout";
            readonly type: "object";
            readonly description: "Payout model.";
            readonly properties: {
                readonly id: {
                    readonly type: "string";
                    readonly description: "The ID of the payout.";
                };
                readonly status: {
                    readonly type: "string";
                    readonly enum: readonly ["pending", "paid"];
                    readonly description: "Current status of the payout.\n\n`pending` `paid`";
                };
                readonly dateCreated: {
                    readonly type: "string";
                    readonly description: "The date when the payout is initiated. yyyy-MM-ddZ format is used (e.g., 2022-07-21+0300).";
                };
                readonly amount: {
                    readonly type: "string";
                    readonly description: "Net amount that is transferred.";
                };
                readonly currency: {
                    readonly type: "string";
                    readonly enum: readonly ["TRY", "USD", "EUR"];
                    readonly description: "Currency of the payout.\n\n`TRY` `USD` `EUR`";
                };
                readonly destination: {
                    readonly type: "object";
                    readonly description: "Information about seller's payout destination.";
                    readonly properties: {
                        readonly type: {
                            readonly type: "string";
                            readonly enum: readonly ["bankAccount"];
                            readonly description: "Type of destination for the payout. \n\n`bankAccount`";
                        };
                        readonly iban: {
                            readonly type: "string";
                            readonly description: "International Bank Account Number (IBAN) of the seller.";
                        };
                    };
                };
            };
            readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
        };
    };
};
declare const GetPayoutsTransactionsId: {
    readonly metadata: {
        readonly allOf: readonly [{
            readonly type: "object";
            readonly properties: {
                readonly id: {
                    readonly type: "string";
                    readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
                    readonly description: "Specify the payout ID to retrieve the payout transactions.";
                };
            };
            readonly required: readonly ["id"];
        }, {
            readonly type: "object";
            readonly properties: {
                readonly limit: {
                    readonly type: "integer";
                    readonly minimum: 1;
                    readonly maximum: 50;
                    readonly multipleOf: 1;
                    readonly default: 10;
                    readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
                    readonly description: "The maximum number of items to be returned in result set.";
                };
                readonly page: {
                    readonly type: "integer";
                    readonly default: 1;
                    readonly minimum: 1;
                    readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
                    readonly description: "Current page of the collection.";
                };
                readonly sort: {
                    readonly type: "string";
                    readonly default: "dateDesc";
                    readonly enum: readonly ["dateAsc", "dateDesc"];
                    readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
                    readonly description: "Sort results by date. ";
                };
            };
            readonly required: readonly [];
        }];
    };
    readonly response: {
        readonly "200": {
            readonly type: "array";
            readonly items: {
                readonly title: "Transaction";
                readonly type: "object";
                readonly description: "Transaction model.";
                readonly properties: {
                    readonly orderId: {
                        readonly type: "string";
                        readonly description: "The ID of the order.";
                    };
                    readonly type: {
                        readonly type: "string";
                        readonly enum: readonly ["charge", "adjustment"];
                        readonly description: "Type of the transaction.\n\n`charge` `adjustment`";
                    };
                    readonly description: {
                        readonly type: "string";
                        readonly description: "Description of the transaction.";
                    };
                    readonly dateCreated: {
                        readonly type: "string";
                        readonly description: "The date and time for the creation of the transaction. yyyy-MM-ddTHH:mm:ssZ format is used (e.g. 2022-07-21T13:24:51+0300).";
                    };
                    readonly gross: {
                        readonly type: "object";
                        readonly description: "The gross amounts of the transaction.";
                        readonly properties: {
                            readonly originCurrency: {
                                readonly type: "string";
                                readonly description: "Origin currency of the transaction.\n\n`TRY` `USD` `EUR`";
                                readonly enum: readonly ["TRY", "USD", "EUR"];
                            };
                            readonly originAmount: {
                                readonly type: "string";
                                readonly description: "Total origin amount paid by the buyer.";
                            };
                            readonly payoutCurrency: {
                                readonly type: "string";
                                readonly description: "Payout currency of the transaction.\n\n`TRY` `USD` `EUR`";
                                readonly enum: readonly ["TRY", "USD", "EUR"];
                            };
                            readonly payoutAmount: {
                                readonly type: "string";
                                readonly description: "Gross payout amount. Fees will be deducted from this during payout. ";
                            };
                            readonly exchangeRate: {
                                readonly type: "string";
                                readonly description: "Exchange rate used for the transaction if the originCurrency and payoutCurrency are different. Returns \"1\" if these currencies are same.";
                            };
                        };
                    };
                    readonly fee: {
                        readonly type: "array";
                        readonly description: "Total fees of the transaction.";
                        readonly items: {
                            readonly type: "object";
                            readonly properties: {
                                readonly currency: {
                                    readonly type: "string";
                                    readonly enum: readonly ["TRY", "USD", "EUR"];
                                    readonly description: "Fee currency of the transaction.\n\n`TRY` `USD` `EUR`";
                                };
                                readonly amount: {
                                    readonly type: "string";
                                    readonly description: "Total fee amount of the transaction for the returned currency.";
                                };
                            };
                        };
                    };
                    readonly feeDetails: {
                        readonly type: "array";
                        readonly description: "Details of fee(s) of the transaction.";
                        readonly items: {
                            readonly type: "object";
                            readonly properties: {
                                readonly type: {
                                    readonly type: "string";
                                    readonly enum: readonly ["serviceFee", "shippingFee", "vat", "wht"];
                                    readonly description: "Type of the single fee item.\n\n`serviceFee` `shippingFee` `vat` `wht`";
                                };
                                readonly currency: {
                                    readonly type: "string";
                                    readonly description: "Fee currency of the single fee item.\n\n`TRY` `USD` `EUR`";
                                    readonly enum: readonly ["TRY", "USD", "EUR"];
                                };
                                readonly amount: {
                                    readonly type: "string";
                                    readonly description: "Fee amount of the single fee item.";
                                };
                            };
                        };
                    };
                    readonly installments: {
                        readonly type: "object";
                        readonly description: "Returns the details of installment payments. Returns empty in case of an advance payment.";
                        readonly properties: {
                            readonly term: {
                                readonly type: "integer";
                                readonly description: "Installment term in months.";
                            };
                            readonly currency: {
                                readonly type: "string";
                                readonly description: "Currency of the interest cost.\n\n`TRY` `USD` `EUR`";
                                readonly enum: readonly ["TRY", "USD", "EUR"];
                            };
                            readonly interestCost: {
                                readonly type: "string";
                                readonly description: "Total interest cost over the term of installments.";
                            };
                            readonly costBearer: {
                                readonly type: "string";
                                readonly enum: readonly ["buyer", "seller"];
                                readonly description: "Bearer of the interest cost.\n\n`buyer` `seller`";
                            };
                        };
                    };
                    readonly net: {
                        readonly type: "array";
                        readonly description: "The net amount of the transaction. ";
                        readonly items: {
                            readonly type: "object";
                            readonly properties: {
                                readonly payoutCurrency: {
                                    readonly type: "string";
                                    readonly enum: readonly ["TRY", "USD", "EUR"];
                                    readonly description: "Payout currency of the transaction.\n\n`TRY` `USD` `EUR`";
                                };
                                readonly payoutAmount: {
                                    readonly type: "string";
                                    readonly description: "Net payout amount. Fees are already deducted to calculate net payout amount.";
                                };
                            };
                        };
                    };
                };
            };
            readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
        };
    };
};
declare const GetProducts: {
    readonly metadata: {
        readonly allOf: readonly [{
            readonly type: "object";
            readonly properties: {
                readonly dateStart: {
                    readonly type: "string";
                    readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
                    readonly description: "Show products listed at or after datetime. yyyy-MM-ddTHH:mm:ssZ format is used (e.g., 2022-07-21T13:24:51+0300)";
                };
                readonly dateEnd: {
                    readonly type: "string";
                    readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
                    readonly description: "Show products listed at or before datetime. yyyy-MM-ddTHH:mm:ssZ format is used (e.g., 2022-07-25T13:24:51+0300)";
                };
                readonly productType: {
                    readonly type: "string";
                    readonly enum: readonly ["physical", "digital"];
                    readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
                    readonly description: "Filter by a product type. ";
                };
                readonly shippingPayer: {
                    readonly type: "string";
                    readonly enum: readonly ["buyerPays", "sellerPays"];
                    readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
                    readonly description: "Filter by who pays for shipping. ";
                };
                readonly stockStatus: {
                    readonly type: "string";
                    readonly items: {
                        readonly type: "string";
                    };
                    readonly enum: readonly ["inStock", "outOfStock"];
                    readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
                    readonly description: "Filter by a stock status.";
                };
                readonly categoryId: {
                    readonly type: "array";
                    readonly items: {
                        readonly type: "string";
                    };
                    readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
                    readonly description: "Filter by product categories by specifying category ID(s).";
                };
                readonly selectionId: {
                    readonly type: "array";
                    readonly items: {
                        readonly type: "string";
                    };
                    readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
                    readonly description: "Filter by product selections by specifying selection ID(s).";
                };
                readonly discount: {
                    readonly type: "boolean";
                    readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
                    readonly description: "Filter by products with discounts.";
                };
                readonly customListing: {
                    readonly type: "boolean";
                    readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
                    readonly description: "Filter by customized listings.";
                };
                readonly limit: {
                    readonly type: "integer";
                    readonly minimum: 1;
                    readonly maximum: 50;
                    readonly multipleOf: 1;
                    readonly default: 10;
                    readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
                    readonly description: "The maximum number of items to be returned in result set.";
                };
                readonly page: {
                    readonly type: "integer";
                    readonly default: 1;
                    readonly minimum: 1;
                    readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
                    readonly description: "Current page of the collection.";
                };
                readonly sort: {
                    readonly type: "string";
                    readonly default: "dateDesc";
                    readonly enum: readonly ["dateAsc", "dateDesc"];
                    readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
                    readonly description: "Sort results by date. ";
                };
            };
            readonly required: readonly [];
        }];
    };
    readonly response: {
        readonly "200": {
            readonly type: "array";
            readonly items: {
                readonly title: "Product";
                readonly type: "object";
                readonly description: "Product model.";
                readonly properties: {
                    readonly id: {
                        readonly type: "string";
                        readonly description: "The ID of the product.";
                    };
                    readonly title: {
                        readonly type: "string";
                        readonly description: "Title of the product.";
                    };
                    readonly description: {
                        readonly type: "string";
                        readonly description: "Detailed description of the product.";
                    };
                    readonly type: {
                        readonly type: "string";
                        readonly enum: readonly ["physical", "digital"];
                        readonly description: "Type of the product.\n\n`physical` `digital`";
                    };
                    readonly dateCreated: {
                        readonly type: "string";
                        readonly description: "The date and time of the initial product listing. yyyy-MM-ddTHH:mm:ssZ format is used (e.g., 2022-07-21T13:24:51+0300).";
                    };
                    readonly dateUpdated: {
                        readonly type: "string";
                        readonly description: "The date and time of the product update. yyyy-MM-ddTHH:mm:ssZ format is used (e.g., 2022-07-21T13:24:51+0300).";
                    };
                    readonly url: {
                        readonly type: "string";
                        readonly description: "The URL of the product. \n(e.g., https://www.shopier.com/696547)";
                    };
                    readonly media: {
                        readonly type: "array";
                        readonly description: "Details of product media files.";
                        readonly items: {
                            readonly type: "object";
                            readonly properties: {
                                readonly id: {
                                    readonly type: "string";
                                    readonly description: "The ID of media file.";
                                };
                                readonly type: {
                                    readonly type: "string";
                                    readonly enum: readonly ["image"];
                                    readonly description: "Type of media file.\n\n`image`";
                                };
                                readonly url: {
                                    readonly type: "string";
                                    readonly description: "The URL of media file.\n(e.g., https://dmih5ui1qqea9.cloudfront.net/pictures_large/Camiseta6855_cobalt-blue-t-shirt.jpg)";
                                };
                                readonly placement: {
                                    readonly type: "integer";
                                    readonly description: "Ranking of the media file in product pages. Returns \"1\" for the primary media file.";
                                    readonly minimum: 1;
                                    readonly multipleOf: 1;
                                    readonly maximum: 5;
                                };
                            };
                        };
                    };
                    readonly priceData: {
                        readonly type: "object";
                        readonly description: "Details of the price information.";
                        readonly properties: {
                            readonly currency: {
                                readonly type: "string";
                                readonly enum: readonly ["TRY", "USD", "EUR"];
                                readonly description: "Currency of the product.\n\n`TRY` `USD` `EUR`";
                            };
                            readonly price: {
                                readonly type: "string";
                                readonly description: "Unit price of the product.";
                            };
                            readonly discount: {
                                readonly type: "boolean";
                                readonly description: "Represents whether there is a product based discount.";
                            };
                            readonly discountedPrice: {
                                readonly type: "string";
                                readonly description: "Discounted price of the product.";
                            };
                            readonly shippingPrice: {
                                readonly type: "string";
                                readonly description: "Shipping price of the product.";
                            };
                        };
                    };
                    readonly stockStatus: {
                        readonly type: "string";
                        readonly enum: readonly ["inStock", "outOfStock"];
                        readonly description: "Current stock status of the product.\n\n`inStock` `outOfStock`";
                    };
                    readonly stockQuantity: {
                        readonly type: "integer";
                        readonly description: "Current stock quantity of the product.";
                    };
                    readonly shippingPayer: {
                        readonly type: "string";
                        readonly enum: readonly ["sellerPays", "buyerPays"];
                        readonly description: "Represents who pays for shipping during dispatch or delivery.\n\n`sellerPays` `buyerPays`";
                    };
                    readonly categories: {
                        readonly type: "array";
                        readonly description: "List of categories that product belongs to.";
                        readonly items: {
                            readonly type: "object";
                            readonly properties: {
                                readonly id: {
                                    readonly type: "string";
                                    readonly description: "The ID of category.";
                                };
                                readonly title: {
                                    readonly type: "string";
                                    readonly description: "The title of category.";
                                };
                            };
                        };
                    };
                    readonly variants: {
                        readonly type: "array";
                        readonly description: "List of variants of the product.";
                        readonly items: {
                            readonly type: "object";
                            readonly properties: {
                                readonly variationId: {
                                    readonly type: "array";
                                    readonly description: "The ID of variation.";
                                    readonly items: {
                                        readonly type: "string";
                                    };
                                };
                                readonly variationTitle: {
                                    readonly type: "array";
                                    readonly description: "The title of variation.";
                                    readonly items: {
                                        readonly type: "string";
                                    };
                                };
                                readonly selectionId: {
                                    readonly type: "array";
                                    readonly description: "The ID of selection.";
                                    readonly items: {
                                        readonly type: "string";
                                    };
                                };
                                readonly selectionTitle: {
                                    readonly type: "array";
                                    readonly description: "The title of selection.";
                                    readonly items: {
                                        readonly type: "string";
                                    };
                                };
                                readonly stockStatus: {
                                    readonly type: "string";
                                    readonly enum: readonly ["inStock", "outOfStock"];
                                    readonly description: "Current stock status of the variant.\n\n`inStock` `outOfStock`";
                                };
                                readonly stockQuantity: {
                                    readonly type: "integer";
                                    readonly description: "Current stock quantity of the variant.";
                                };
                                readonly media: {
                                    readonly type: "array";
                                    readonly description: "Details of variant media files. Currently variant has a maximum of one media file.";
                                    readonly items: {
                                        readonly type: "object";
                                        readonly properties: {
                                            readonly id: {
                                                readonly type: "string";
                                                readonly description: "The ID of media file.";
                                            };
                                            readonly type: {
                                                readonly type: "string";
                                                readonly enum: readonly ["image"];
                                                readonly description: "Type of media file.\n\n`image`";
                                            };
                                            readonly url: {
                                                readonly type: "string";
                                                readonly description: "The URL of media file.\n(e.g., https://dmih5ui1qqea9.cloudfront.net/pictures_large/Camiseta6855_cobalt-blue-t-shirt.jpg)";
                                            };
                                        };
                                    };
                                };
                                readonly priceData: {
                                    readonly type: "object";
                                    readonly description: "Details of the price information for the variant.";
                                    readonly properties: {
                                        readonly currency: {
                                            readonly type: "string";
                                            readonly enum: readonly ["TRY", "USD", "EUR"];
                                            readonly description: "Currency of the variant.\n\n`TRY` `USD` `EUR`";
                                        };
                                        readonly price: {
                                            readonly type: "string";
                                            readonly description: "Unit price of the variant.";
                                        };
                                    };
                                };
                                readonly primary: {
                                    readonly type: "boolean";
                                    readonly description: "Represents the primary variant. Only one variant can be primary.";
                                };
                            };
                        };
                    };
                    readonly options: {
                        readonly type: "array";
                        readonly description: "List of options of the product.";
                        readonly items: {
                            readonly type: "object";
                            readonly properties: {
                                readonly id: {
                                    readonly type: "string";
                                    readonly description: "The ID of option.";
                                };
                                readonly title: {
                                    readonly type: "string";
                                    readonly description: "The title of option.";
                                };
                                readonly price: {
                                    readonly type: "string";
                                    readonly description: "The price of option.";
                                };
                            };
                        };
                    };
                    readonly singleOption: {
                        readonly type: "boolean";
                        readonly description: "Represents whether a single option or multiple options can be selected during chekout.";
                    };
                    readonly customListing: {
                        readonly type: "boolean";
                        readonly description: "Represents whether the listing is a custom or standard one.";
                    };
                    readonly customNote: {
                        readonly type: "string";
                        readonly description: "Overrides the placeholder for note to seller field. Used for collecting a custom information from the buyer during checkout.";
                    };
                    readonly placementScore: {
                        readonly type: "integer";
                        readonly minimum: 1;
                        readonly multipleOf: 1;
                        readonly description: "Placement score of the product. Products with higher values are placed first in the store.";
                    };
                    readonly dispatchDuration: {
                        readonly type: "integer";
                        readonly minimum: 1;
                        readonly maximum: 3;
                        readonly multipleOf: 1;
                        readonly description: "Dispatch duration in terms of days from seller to shipping company.";
                    };
                };
            };
            readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
        };
    };
};
declare const GetProductsId: {
    readonly metadata: {
        readonly allOf: readonly [{
            readonly type: "object";
            readonly properties: {
                readonly id: {
                    readonly type: "string";
                    readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
                    readonly description: "Specify the product ID to retrieve the product.";
                };
            };
            readonly required: readonly ["id"];
        }];
    };
    readonly response: {
        readonly "200": {
            readonly title: "Product";
            readonly type: "object";
            readonly description: "Product model.";
            readonly properties: {
                readonly id: {
                    readonly type: "string";
                    readonly description: "The ID of the product.";
                };
                readonly title: {
                    readonly type: "string";
                    readonly description: "Title of the product.";
                };
                readonly description: {
                    readonly type: "string";
                    readonly description: "Detailed description of the product.";
                };
                readonly type: {
                    readonly type: "string";
                    readonly enum: readonly ["physical", "digital"];
                    readonly description: "Type of the product.\n\n`physical` `digital`";
                };
                readonly dateCreated: {
                    readonly type: "string";
                    readonly description: "The date and time of the initial product listing. yyyy-MM-ddTHH:mm:ssZ format is used (e.g., 2022-07-21T13:24:51+0300).";
                };
                readonly dateUpdated: {
                    readonly type: "string";
                    readonly description: "The date and time of the product update. yyyy-MM-ddTHH:mm:ssZ format is used (e.g., 2022-07-21T13:24:51+0300).";
                };
                readonly url: {
                    readonly type: "string";
                    readonly description: "The URL of the product. \n(e.g., https://www.shopier.com/696547)";
                };
                readonly media: {
                    readonly type: "array";
                    readonly description: "Details of product media files.";
                    readonly items: {
                        readonly type: "object";
                        readonly properties: {
                            readonly id: {
                                readonly type: "string";
                                readonly description: "The ID of media file.";
                            };
                            readonly type: {
                                readonly type: "string";
                                readonly enum: readonly ["image"];
                                readonly description: "Type of media file.\n\n`image`";
                            };
                            readonly url: {
                                readonly type: "string";
                                readonly description: "The URL of media file.\n(e.g., https://dmih5ui1qqea9.cloudfront.net/pictures_large/Camiseta6855_cobalt-blue-t-shirt.jpg)";
                            };
                            readonly placement: {
                                readonly type: "integer";
                                readonly description: "Ranking of the media file in product pages. Returns \"1\" for the primary media file.";
                                readonly minimum: 1;
                                readonly multipleOf: 1;
                                readonly maximum: 5;
                            };
                        };
                    };
                };
                readonly priceData: {
                    readonly type: "object";
                    readonly description: "Details of the price information.";
                    readonly properties: {
                        readonly currency: {
                            readonly type: "string";
                            readonly enum: readonly ["TRY", "USD", "EUR"];
                            readonly description: "Currency of the product.\n\n`TRY` `USD` `EUR`";
                        };
                        readonly price: {
                            readonly type: "string";
                            readonly description: "Unit price of the product.";
                        };
                        readonly discount: {
                            readonly type: "boolean";
                            readonly description: "Represents whether there is a product based discount.";
                        };
                        readonly discountedPrice: {
                            readonly type: "string";
                            readonly description: "Discounted price of the product.";
                        };
                        readonly shippingPrice: {
                            readonly type: "string";
                            readonly description: "Shipping price of the product.";
                        };
                    };
                };
                readonly stockStatus: {
                    readonly type: "string";
                    readonly enum: readonly ["inStock", "outOfStock"];
                    readonly description: "Current stock status of the product.\n\n`inStock` `outOfStock`";
                };
                readonly stockQuantity: {
                    readonly type: "integer";
                    readonly description: "Current stock quantity of the product.";
                };
                readonly shippingPayer: {
                    readonly type: "string";
                    readonly enum: readonly ["sellerPays", "buyerPays"];
                    readonly description: "Represents who pays for shipping during dispatch or delivery.\n\n`sellerPays` `buyerPays`";
                };
                readonly categories: {
                    readonly type: "array";
                    readonly description: "List of categories that product belongs to.";
                    readonly items: {
                        readonly type: "object";
                        readonly properties: {
                            readonly id: {
                                readonly type: "string";
                                readonly description: "The ID of category.";
                            };
                            readonly title: {
                                readonly type: "string";
                                readonly description: "The title of category.";
                            };
                        };
                    };
                };
                readonly variants: {
                    readonly type: "array";
                    readonly description: "List of variants of the product.";
                    readonly items: {
                        readonly type: "object";
                        readonly properties: {
                            readonly variationId: {
                                readonly type: "array";
                                readonly description: "The ID of variation.";
                                readonly items: {
                                    readonly type: "string";
                                };
                            };
                            readonly variationTitle: {
                                readonly type: "array";
                                readonly description: "The title of variation.";
                                readonly items: {
                                    readonly type: "string";
                                };
                            };
                            readonly selectionId: {
                                readonly type: "array";
                                readonly description: "The ID of selection.";
                                readonly items: {
                                    readonly type: "string";
                                };
                            };
                            readonly selectionTitle: {
                                readonly type: "array";
                                readonly description: "The title of selection.";
                                readonly items: {
                                    readonly type: "string";
                                };
                            };
                            readonly stockStatus: {
                                readonly type: "string";
                                readonly enum: readonly ["inStock", "outOfStock"];
                                readonly description: "Current stock status of the variant.\n\n`inStock` `outOfStock`";
                            };
                            readonly stockQuantity: {
                                readonly type: "integer";
                                readonly description: "Current stock quantity of the variant.";
                            };
                            readonly media: {
                                readonly type: "array";
                                readonly description: "Details of variant media files. Currently variant has a maximum of one media file.";
                                readonly items: {
                                    readonly type: "object";
                                    readonly properties: {
                                        readonly id: {
                                            readonly type: "string";
                                            readonly description: "The ID of media file.";
                                        };
                                        readonly type: {
                                            readonly type: "string";
                                            readonly enum: readonly ["image"];
                                            readonly description: "Type of media file.\n\n`image`";
                                        };
                                        readonly url: {
                                            readonly type: "string";
                                            readonly description: "The URL of media file.\n(e.g., https://dmih5ui1qqea9.cloudfront.net/pictures_large/Camiseta6855_cobalt-blue-t-shirt.jpg)";
                                        };
                                    };
                                };
                            };
                            readonly priceData: {
                                readonly type: "object";
                                readonly description: "Details of the price information for the variant.";
                                readonly properties: {
                                    readonly currency: {
                                        readonly type: "string";
                                        readonly enum: readonly ["TRY", "USD", "EUR"];
                                        readonly description: "Currency of the variant.\n\n`TRY` `USD` `EUR`";
                                    };
                                    readonly price: {
                                        readonly type: "string";
                                        readonly description: "Unit price of the variant.";
                                    };
                                };
                            };
                            readonly primary: {
                                readonly type: "boolean";
                                readonly description: "Represents the primary variant. Only one variant can be primary.";
                            };
                        };
                    };
                };
                readonly options: {
                    readonly type: "array";
                    readonly description: "List of options of the product.";
                    readonly items: {
                        readonly type: "object";
                        readonly properties: {
                            readonly id: {
                                readonly type: "string";
                                readonly description: "The ID of option.";
                            };
                            readonly title: {
                                readonly type: "string";
                                readonly description: "The title of option.";
                            };
                            readonly price: {
                                readonly type: "string";
                                readonly description: "The price of option.";
                            };
                        };
                    };
                };
                readonly singleOption: {
                    readonly type: "boolean";
                    readonly description: "Represents whether a single option or multiple options can be selected during chekout.";
                };
                readonly customListing: {
                    readonly type: "boolean";
                    readonly description: "Represents whether the listing is a custom or standard one.";
                };
                readonly customNote: {
                    readonly type: "string";
                    readonly description: "Overrides the placeholder for note to seller field. Used for collecting a custom information from the buyer during checkout.";
                };
                readonly placementScore: {
                    readonly type: "integer";
                    readonly minimum: 1;
                    readonly multipleOf: 1;
                    readonly description: "Placement score of the product. Products with higher values are placed first in the store.";
                };
                readonly dispatchDuration: {
                    readonly type: "integer";
                    readonly minimum: 1;
                    readonly maximum: 3;
                    readonly multipleOf: 1;
                    readonly description: "Dispatch duration in terms of days from seller to shipping company.";
                };
            };
            readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
        };
    };
};
declare const GetRefunds: {
    readonly metadata: {
        readonly allOf: readonly [{
            readonly type: "object";
            readonly properties: {
                readonly dateStart: {
                    readonly type: "string";
                    readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
                    readonly description: "Show refunds processed at or after datetime. yyyy-MM-ddTHH:mm:ssZ format is used (e.g., 2022-07-21T13:24:51+0300)";
                };
                readonly dateEnd: {
                    readonly type: "string";
                    readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
                    readonly description: "Show refunds processed at or before datetime. yyyy-MM-ddTHH:mm:ssZ format is used (e.g., 2022-07-25T13:24:51+0300)";
                };
                readonly orderId: {
                    readonly type: "string";
                    readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
                    readonly description: "Filter by order ID.";
                };
                readonly status: {
                    readonly type: "string";
                    readonly enum: readonly ["pending", "failed", "succeeded"];
                    readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
                    readonly description: "Filter by refund status.";
                };
                readonly limit: {
                    readonly type: "integer";
                    readonly minimum: 1;
                    readonly maximum: 50;
                    readonly multipleOf: 1;
                    readonly default: 10;
                    readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
                    readonly description: "The maximum number of items to be returned in result set.";
                };
                readonly page: {
                    readonly type: "integer";
                    readonly default: 1;
                    readonly minimum: 1;
                    readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
                    readonly description: "Current page of the collection.";
                };
                readonly sort: {
                    readonly type: "string";
                    readonly default: "dateDesc";
                    readonly enum: readonly ["dateAsc", "dateDesc"];
                    readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
                    readonly description: "Sort results by date. ";
                };
            };
            readonly required: readonly [];
        }];
    };
    readonly response: {
        readonly "200": {
            readonly type: "array";
            readonly items: {
                readonly title: "Refund";
                readonly type: "object";
                readonly description: "Refund model.";
                readonly properties: {
                    readonly id: {
                        readonly type: "string";
                        readonly description: "The ID of the refund.";
                    };
                    readonly type: {
                        readonly type: "string";
                        readonly description: "The type of the refund.\n\n`full` `partial`";
                        readonly enum: readonly ["full", "partial"];
                    };
                    readonly status: {
                        readonly type: "string";
                        readonly enum: readonly ["pending", "failed", "succeeded"];
                        readonly description: "Current status of the refund.\n\n`pending` `failed` `succeeded`";
                    };
                    readonly orderId: {
                        readonly type: "string";
                        readonly description: "The order ID related with the refund.";
                    };
                    readonly dateCreated: {
                        readonly type: "string";
                        readonly description: "The date and time for the creation of the refund request. yyyy-MM-ddTHH:mm:ssZ format is used (e.g., 2022-07-21T13:24:51+0300).";
                    };
                    readonly dateRefunded: {
                        readonly type: "string";
                        readonly description: "The date and time for the actual refund transaction submitted to the payment provider. yyyy-MM-ddTHH:mm:ssZ format is used (e.g., 2022-07-21T13:24:51+0300).";
                    };
                    readonly currency: {
                        readonly type: "string";
                        readonly description: "Currency of the refund.\n\n`TRY` `USD` `EUR`";
                        readonly enum: readonly ["TRY", "USD", "EUR"];
                    };
                    readonly total: {
                        readonly type: "string";
                        readonly description: "Total amount of the refund.";
                    };
                    readonly note: {
                        readonly type: "string";
                        readonly description: "Seller's note to buyer about the refund.";
                    };
                };
            };
            readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
        };
    };
};
declare const GetRefundsId: {
    readonly metadata: {
        readonly allOf: readonly [{
            readonly type: "object";
            readonly properties: {
                readonly id: {
                    readonly type: "string";
                    readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
                    readonly description: "Specify the refund ID to retrieve the refund.";
                };
            };
            readonly required: readonly ["id"];
        }];
    };
    readonly response: {
        readonly "200": {
            readonly title: "Refund";
            readonly type: "object";
            readonly description: "Refund model.";
            readonly properties: {
                readonly id: {
                    readonly type: "string";
                    readonly description: "The ID of the refund.";
                };
                readonly type: {
                    readonly type: "string";
                    readonly description: "The type of the refund.\n\n`full` `partial`";
                    readonly enum: readonly ["full", "partial"];
                };
                readonly status: {
                    readonly type: "string";
                    readonly enum: readonly ["pending", "failed", "succeeded"];
                    readonly description: "Current status of the refund.\n\n`pending` `failed` `succeeded`";
                };
                readonly orderId: {
                    readonly type: "string";
                    readonly description: "The order ID related with the refund.";
                };
                readonly dateCreated: {
                    readonly type: "string";
                    readonly description: "The date and time for the creation of the refund request. yyyy-MM-ddTHH:mm:ssZ format is used (e.g., 2022-07-21T13:24:51+0300).";
                };
                readonly dateRefunded: {
                    readonly type: "string";
                    readonly description: "The date and time for the actual refund transaction submitted to the payment provider. yyyy-MM-ddTHH:mm:ssZ format is used (e.g., 2022-07-21T13:24:51+0300).";
                };
                readonly currency: {
                    readonly type: "string";
                    readonly description: "Currency of the refund.\n\n`TRY` `USD` `EUR`";
                    readonly enum: readonly ["TRY", "USD", "EUR"];
                };
                readonly total: {
                    readonly type: "string";
                    readonly description: "Total amount of the refund.";
                };
                readonly note: {
                    readonly type: "string";
                    readonly description: "Seller's note to buyer about the refund.";
                };
            };
            readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
        };
    };
};
declare const GetSelections: {
    readonly metadata: {
        readonly allOf: readonly [{
            readonly type: "object";
            readonly properties: {
                readonly variationId: {
                    readonly type: "array";
                    readonly items: {
                        readonly type: "string";
                    };
                    readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
                    readonly description: "Filter by product variations by specifying variation ID(s).";
                };
                readonly limit: {
                    readonly type: "integer";
                    readonly minimum: 1;
                    readonly maximum: 50;
                    readonly multipleOf: 1;
                    readonly default: 10;
                    readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
                    readonly description: "The maximum number of items to be returned in result set.";
                };
                readonly page: {
                    readonly type: "integer";
                    readonly default: 1;
                    readonly minimum: 1;
                    readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
                    readonly description: "Current page of the collection.";
                };
            };
            readonly required: readonly [];
        }];
    };
    readonly response: {
        readonly "200": {
            readonly type: "array";
            readonly items: {
                readonly title: "Selection";
                readonly type: "object";
                readonly description: "Selection model.";
                readonly properties: {
                    readonly id: {
                        readonly type: "string";
                        readonly description: "The ID of the product selection, a subset of product variation.";
                    };
                    readonly title: {
                        readonly type: "string";
                        readonly description: "The title of the product selection, a subset of product variation.";
                    };
                    readonly variationId: {
                        readonly type: "string";
                        readonly description: "The ID of the related product variation.";
                    };
                };
            };
            readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
        };
    };
};
declare const GetSelectionsId: {
    readonly metadata: {
        readonly allOf: readonly [{
            readonly type: "object";
            readonly properties: {
                readonly id: {
                    readonly type: "string";
                    readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
                    readonly description: "Specify the selection ID to retrieve the selection.";
                };
            };
            readonly required: readonly ["id"];
        }];
    };
    readonly response: {
        readonly "200": {
            readonly title: "Selection";
            readonly type: "object";
            readonly description: "Selection model.";
            readonly properties: {
                readonly id: {
                    readonly type: "string";
                    readonly description: "The ID of the product selection, a subset of product variation.";
                };
                readonly title: {
                    readonly type: "string";
                    readonly description: "The title of the product selection, a subset of product variation.";
                };
                readonly variationId: {
                    readonly type: "string";
                    readonly description: "The ID of the related product variation.";
                };
            };
            readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
        };
    };
};
declare const GetShippings: {
    readonly metadata: {
        readonly allOf: readonly [{
            readonly type: "object";
            readonly properties: {
                readonly status: {
                    readonly type: "string";
                    readonly enum: readonly ["shipped", "notShipped"];
                    readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
                    readonly description: "Filter by a shipping status.";
                };
                readonly type: {
                    readonly type: "string";
                    readonly enum: readonly ["firstShipment", "secondShipment", "returnShipment"];
                    readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
                    readonly description: "Filter by a shipping type.";
                };
                readonly company: {
                    readonly type: "string";
                    readonly enum: readonly ["yurtici", "mng", "ptt"];
                    readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
                    readonly description: "Filter by a shipping company.";
                };
                readonly dateCreatedStart: {
                    readonly type: "string";
                    readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
                    readonly description: "Show shipping codes that are created at or after datetime. yyyy-MM-ddTHH:mm:ssZ format is used (e.g., 2022-07-21T13:24:51+0300)";
                };
                readonly dateCreatedEnd: {
                    readonly type: "string";
                    readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
                    readonly description: "Show shipping codes that are created at or before datetime. yyyy-MM-ddTHH:mm:ssZ format is used (e.g., 2022-07-25T13:24:51+0300)";
                };
                readonly dateDispatchedStart: {
                    readonly type: "string";
                    readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
                    readonly description: "Show shippings that are dispatched at or after datetime. yyyy-MM-ddTHH:mm:ssZ format is used (e.g., 2022-07-21T13:24:51+0300)";
                };
                readonly dateDispatchedEnd: {
                    readonly type: "string";
                    readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
                    readonly description: "Show shippings that are dispatched at or before datetime. yyyy-MM-ddTHH:mm:ssZ format is used (e.g., 2022-07-25T13:24:51+0300)";
                };
                readonly limit: {
                    readonly type: "integer";
                    readonly minimum: 1;
                    readonly maximum: 50;
                    readonly multipleOf: 1;
                    readonly default: 10;
                    readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
                    readonly description: "The maximum number of items to be returned in result set.";
                };
                readonly page: {
                    readonly type: "integer";
                    readonly default: 1;
                    readonly minimum: 1;
                    readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
                    readonly description: "Current page of the collection.";
                };
                readonly sort: {
                    readonly type: "string";
                    readonly default: "dateDesc";
                    readonly enum: readonly ["dateAsc", "dateDesc"];
                    readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
                    readonly description: "Sort results by date. ";
                };
            };
            readonly required: readonly [];
        }];
    };
    readonly response: {
        readonly "200": {
            readonly type: "array";
            readonly items: {
                readonly title: "Shipping";
                readonly type: "object";
                readonly description: "Shipping model.";
                readonly properties: {
                    readonly orderId: {
                        readonly type: "string";
                        readonly description: "The ID of the order.";
                    };
                    readonly status: {
                        readonly type: "string";
                        readonly enum: readonly ["shipped", "notShipped"];
                        readonly description: "Current status of the shipping.\n\n`shipped` `notShipped`";
                    };
                    readonly method: {
                        readonly type: "string";
                        readonly enum: readonly ["standard", "contracted"];
                        readonly description: "Method of the shipping.\n\n`standard` `contracted`";
                    };
                    readonly type: {
                        readonly type: "string";
                        readonly enum: readonly ["firstShipment", "secondShipment", "returnShipment"];
                        readonly description: "Type of the shipping. firstShipment and secondShipment are used for seller to buyer direction, returnShipment is used for buyer to seller direction.\n\n`firstShipment` `secondShipment` `returnShipment`";
                    };
                    readonly dateCreated: {
                        readonly type: "string";
                        readonly description: "For standard shipping, this is the date and time of the order closure. For contracted shipping, this is the date and time for the creation of the shipping code. yyyy-MM-ddTHH:mm:ssZ format is used (e.g., 2022-07-21T13:24:51+0300).";
                    };
                    readonly dateDispatched: {
                        readonly type: "string";
                        readonly description: "The date and time of the initial dispatch. It is provided by the shipping company and only present for contracted shipping. yyyy-MM-ddTHH:mm:ssZ format is used (e.g., 2022-07-21T13:24:51+0300).";
                    };
                    readonly company: {
                        readonly type: "string";
                        readonly enum: readonly ["yurtici", "mng", "ptt", "aras", "surat", "ups", "fedex", "dhl", "tnt", "pts", "aramex", "interGlobal", "other"];
                        readonly description: "Shipping company.\n\n`yurtici` `mng` `ptt` `aras` `surat` `ups` `fedex` `dhl` `tnt` `pts` `aramex` `interGlobal` `other`";
                    };
                    readonly code: {
                        readonly type: "string";
                        readonly description: "Generated shipping code. ";
                    };
                    readonly trackingNumber: {
                        readonly type: "string";
                        readonly description: "Tracking number of the shipping. For standard shipping, it is provided by the seller while closing the order. For contracted shipping, it is provided by the shipping company with the initial dispatch. ";
                    };
                    readonly trackingUrl: {
                        readonly type: "string";
                        readonly description: "Tracking URL of the shipping. It is provided by the shipping company and only present for contracted shipping.";
                    };
                    readonly size: {
                        readonly type: "string";
                        readonly description: "Size of the shipping load. It is provided by some of the shipping companies and only present for contracted shipping.";
                    };
                    readonly sizeUnit: {
                        readonly type: "string";
                        readonly description: "Size unit of the shipping load. It is provided by some of the shipping companies and only present for contracted shipping.\n\n`deci`";
                        readonly enum: readonly ["deci"];
                    };
                    readonly weight: {
                        readonly type: "string";
                        readonly description: "Weight of the shipping load. It is provided by some of the shipping companies and only present for contracted shipping.";
                    };
                    readonly weightUnit: {
                        readonly type: "string";
                        readonly description: "Weight unit of the shipping load. It is provided by some of the shipping companies and only present for contracted shipping.\n\n`gram` `kilogram`";
                        readonly enum: readonly ["gram", "kilogram"];
                    };
                    readonly cost: {
                        readonly type: "string";
                        readonly description: "Cost of the shipping. It is provided by the shipping company and only present for contracted shipping.";
                    };
                    readonly currency: {
                        readonly type: "string";
                        readonly enum: readonly ["TRY", "USD", "EUR"];
                        readonly description: "Currency of the shipping cost. It is provided by the shipping company and only present for contracted shipping.\n\n`TRY` `USD` `EUR`";
                    };
                };
            };
            readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
        };
    };
};
declare const GetShippingsCode: {
    readonly metadata: {
        readonly allOf: readonly [{
            readonly type: "object";
            readonly properties: {
                readonly code: {
                    readonly type: "string";
                    readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
                    readonly description: "Specify the shipping code to retrieve the shipping.";
                };
            };
            readonly required: readonly ["code"];
        }];
    };
    readonly response: {
        readonly "200": {
            readonly title: "Shipping";
            readonly type: "object";
            readonly description: "Shipping model.";
            readonly properties: {
                readonly orderId: {
                    readonly type: "string";
                    readonly description: "The ID of the order.";
                };
                readonly status: {
                    readonly type: "string";
                    readonly enum: readonly ["shipped", "notShipped"];
                    readonly description: "Current status of the shipping.\n\n`shipped` `notShipped`";
                };
                readonly method: {
                    readonly type: "string";
                    readonly enum: readonly ["standard", "contracted"];
                    readonly description: "Method of the shipping.\n\n`standard` `contracted`";
                };
                readonly type: {
                    readonly type: "string";
                    readonly enum: readonly ["firstShipment", "secondShipment", "returnShipment"];
                    readonly description: "Type of the shipping. firstShipment and secondShipment are used for seller to buyer direction, returnShipment is used for buyer to seller direction.\n\n`firstShipment` `secondShipment` `returnShipment`";
                };
                readonly dateCreated: {
                    readonly type: "string";
                    readonly description: "For standard shipping, this is the date and time of the order closure. For contracted shipping, this is the date and time for the creation of the shipping code. yyyy-MM-ddTHH:mm:ssZ format is used (e.g., 2022-07-21T13:24:51+0300).";
                };
                readonly dateDispatched: {
                    readonly type: "string";
                    readonly description: "The date and time of the initial dispatch. It is provided by the shipping company and only present for contracted shipping. yyyy-MM-ddTHH:mm:ssZ format is used (e.g., 2022-07-21T13:24:51+0300).";
                };
                readonly company: {
                    readonly type: "string";
                    readonly enum: readonly ["yurtici", "mng", "ptt", "aras", "surat", "ups", "fedex", "dhl", "tnt", "pts", "aramex", "interGlobal", "other"];
                    readonly description: "Shipping company.\n\n`yurtici` `mng` `ptt` `aras` `surat` `ups` `fedex` `dhl` `tnt` `pts` `aramex` `interGlobal` `other`";
                };
                readonly code: {
                    readonly type: "string";
                    readonly description: "Generated shipping code. ";
                };
                readonly trackingNumber: {
                    readonly type: "string";
                    readonly description: "Tracking number of the shipping. For standard shipping, it is provided by the seller while closing the order. For contracted shipping, it is provided by the shipping company with the initial dispatch. ";
                };
                readonly trackingUrl: {
                    readonly type: "string";
                    readonly description: "Tracking URL of the shipping. It is provided by the shipping company and only present for contracted shipping.";
                };
                readonly size: {
                    readonly type: "string";
                    readonly description: "Size of the shipping load. It is provided by some of the shipping companies and only present for contracted shipping.";
                };
                readonly sizeUnit: {
                    readonly type: "string";
                    readonly description: "Size unit of the shipping load. It is provided by some of the shipping companies and only present for contracted shipping.\n\n`deci`";
                    readonly enum: readonly ["deci"];
                };
                readonly weight: {
                    readonly type: "string";
                    readonly description: "Weight of the shipping load. It is provided by some of the shipping companies and only present for contracted shipping.";
                };
                readonly weightUnit: {
                    readonly type: "string";
                    readonly description: "Weight unit of the shipping load. It is provided by some of the shipping companies and only present for contracted shipping.\n\n`gram` `kilogram`";
                    readonly enum: readonly ["gram", "kilogram"];
                };
                readonly cost: {
                    readonly type: "string";
                    readonly description: "Cost of the shipping. It is provided by the shipping company and only present for contracted shipping.";
                };
                readonly currency: {
                    readonly type: "string";
                    readonly enum: readonly ["TRY", "USD", "EUR"];
                    readonly description: "Currency of the shipping cost. It is provided by the shipping company and only present for contracted shipping.\n\n`TRY` `USD` `EUR`";
                };
            };
            readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
        };
    };
};
declare const GetShopOwner: {
    readonly response: {
        readonly "200": {
            readonly title: "ShopOwner";
            readonly type: "object";
            readonly description: "Shop owner model.";
            readonly properties: {
                readonly id: {
                    readonly type: "string";
                    readonly description: "The account ID of the shop.";
                };
                readonly type: {
                    readonly type: "string";
                    readonly description: "Type of the membership.\n\n`personal` `business`";
                    readonly enum: readonly ["personal", "business"];
                };
                readonly firstName: {
                    readonly type: "string";
                    readonly description: "Name of the shop owner.";
                };
                readonly lastName: {
                    readonly type: "string";
                    readonly description: "Surname of the shop owner.";
                };
                readonly contact: {
                    readonly type: "object";
                    readonly description: "Shop owner's contact details.";
                    readonly properties: {
                        readonly email: {
                            readonly type: "string";
                            readonly description: "Shop owner's email address. ";
                        };
                        readonly phone: {
                            readonly type: "string";
                            readonly description: "Shop owner's phone number.";
                        };
                        readonly address: {
                            readonly type: "string";
                            readonly description: "Shop owner's physical address.";
                        };
                        readonly district: {
                            readonly type: "string";
                            readonly description: "Shop owner's district.";
                        };
                        readonly city: {
                            readonly type: "string";
                            readonly description: "Shop owner's city.";
                        };
                        readonly state: {
                            readonly type: "string";
                            readonly description: "Shop owner's state.";
                        };
                        readonly postcode: {
                            readonly type: "string";
                            readonly description: "Shop owner's postcode.";
                        };
                        readonly country: {
                            readonly type: "string";
                            readonly description: "Shop owner's country.";
                        };
                    };
                };
                readonly company: {
                    readonly type: "object";
                    readonly description: "Shop owner's company information. This is present when the shop's type is business. ";
                    readonly properties: {
                        readonly name: {
                            readonly type: "string";
                            readonly description: "Name of the company.";
                        };
                        readonly taxOffice: {
                            readonly type: "string";
                            readonly description: "Tax office of the company.";
                        };
                        readonly taxNumber: {
                            readonly type: "string";
                            readonly description: "Tax number of the company.";
                        };
                    };
                };
                readonly bankAccount: {
                    readonly type: "object";
                    readonly description: "Shop owner's bank account information.";
                    readonly properties: {
                        readonly accountHolder: {
                            readonly type: "string";
                            readonly description: "Account holder information for the bank account.";
                        };
                        readonly iban: {
                            readonly type: "string";
                            readonly description: "International Bank Account Number (IBAN).";
                        };
                    };
                };
            };
            readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
        };
    };
};
declare const GetShopSettings: {
    readonly response: {
        readonly "200": {
            readonly title: "ShopSetting";
            readonly type: "object";
            readonly description: "Shop setting model.";
            readonly properties: {
                readonly name: {
                    readonly type: "string";
                    readonly description: "Name of the shop. This is the unique variable that appears at the end of the URL of the shop.";
                };
                readonly url: {
                    readonly type: "string";
                    readonly description: "URL of the shop.\n(e.g., https://www.shopier.com/tshirtshop)";
                };
                readonly title: {
                    readonly type: "string";
                    readonly description: "Title of the shop. This the brief heading located at the shop's main page.";
                };
                readonly slogan: {
                    readonly type: "string";
                    readonly description: "Slogan or catchword located at the shop's main page.";
                };
                readonly announcement: {
                    readonly type: "string";
                    readonly description: "Announcement to buyers located at the shop's main page.";
                };
                readonly confirmation: {
                    readonly type: "string";
                    readonly description: "Order confirmation text. Is shown to buyers when an order is created after a successful payment.";
                };
                readonly email: {
                    readonly type: "string";
                    readonly description: "Email address located at the shop's main page. This can be different than the shop owner's email.";
                };
                readonly phone: {
                    readonly type: "string";
                    readonly description: "Phone number located at the shop's main page. This can be different than the shop owner's phone number.";
                };
                readonly access: {
                    readonly type: "boolean";
                    readonly description: "Represents whether the shop URL is publicly accessible.";
                };
                readonly cart: {
                    readonly type: "boolean";
                    readonly description: "Represents whether the shopping cart is used during checkouts. If the cart value is FALSE multiple products can not be purchased at the shop, only a single product can be purchased for each order.";
                };
                readonly mobileView: {
                    readonly type: "string";
                    readonly enum: readonly ["singleColumn", "doubleColumn"];
                    readonly description: "Shop's appearance for mobile devices. Products can be placed either on a single column or on double columns.\n\n`singleColumn` `doubleColumn`";
                };
                readonly filter: {
                    readonly type: "boolean";
                    readonly description: "Represents whether the product filter options are present or not.";
                };
                readonly outOfStock: {
                    readonly type: "boolean";
                    readonly description: "Represents whether the out of stock products are shown to buyers.";
                };
                readonly language: {
                    readonly type: "string";
                    readonly enum: readonly ["TR", "EN"];
                    readonly description: "Language selection of the shop. \n\n`TR` `EN`";
                };
                readonly vacation: {
                    readonly type: "boolean";
                    readonly description: "Represents whether the seller accepts orders. Returns TRUE if the shop is closed for orders, returns FALSE if the shop is open for orders.";
                };
            };
            readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
        };
    };
};
declare const GetVariations: {
    readonly response: {
        readonly "200": {
            readonly type: "array";
            readonly items: {
                readonly title: "Variation";
                readonly type: "object";
                readonly description: "Variation model.";
                readonly properties: {
                    readonly id: {
                        readonly type: "string";
                        readonly description: "The ID of the product variation.";
                    };
                    readonly title: {
                        readonly type: "string";
                        readonly description: "The title of the product variation.";
                    };
                    readonly placement: {
                        readonly type: "integer";
                        readonly minimum: 1;
                        readonly maximum: 2;
                        readonly multipleOf: 1;
                        readonly description: "Ranking of the product variation in the shop. Returns \"1\" for the first variation, returns \"2\" for the second variation.";
                    };
                };
            };
            readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
        };
    };
};
declare const GetVariationsId: {
    readonly metadata: {
        readonly allOf: readonly [{
            readonly type: "object";
            readonly properties: {
                readonly id: {
                    readonly type: "string";
                    readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
                    readonly description: "Specify the variation ID to retrieve the variation.";
                };
            };
            readonly required: readonly ["id"];
        }];
    };
    readonly response: {
        readonly "200": {
            readonly title: "Variation";
            readonly type: "object";
            readonly description: "Variation model.";
            readonly properties: {
                readonly id: {
                    readonly type: "string";
                    readonly description: "The ID of the product variation.";
                };
                readonly title: {
                    readonly type: "string";
                    readonly description: "The title of the product variation.";
                };
                readonly placement: {
                    readonly type: "integer";
                    readonly minimum: 1;
                    readonly maximum: 2;
                    readonly multipleOf: 1;
                    readonly description: "Ranking of the product variation in the shop. Returns \"1\" for the first variation, returns \"2\" for the second variation.";
                };
            };
            readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
        };
    };
};
declare const GetWebhooks: {
    readonly metadata: {
        readonly allOf: readonly [{
            readonly type: "object";
            readonly properties: {
                readonly limit: {
                    readonly type: "integer";
                    readonly minimum: 1;
                    readonly maximum: 50;
                    readonly multipleOf: 1;
                    readonly default: 10;
                    readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
                    readonly description: "The maximum number of items to be returned in result set.";
                };
                readonly page: {
                    readonly type: "integer";
                    readonly default: 1;
                    readonly minimum: 1;
                    readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
                    readonly description: "Current page of the collection.";
                };
                readonly sort: {
                    readonly type: "string";
                    readonly enum: readonly ["asc", "desc"];
                    readonly default: "asc";
                    readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
                    readonly description: "Sort by alphabetical order";
                };
            };
            readonly required: readonly [];
        }];
    };
    readonly response: {
        readonly "200": {
            readonly type: "array";
            readonly items: {
                readonly title: "Webhook";
                readonly type: "object";
                readonly description: "Webhook model.";
                readonly properties: {
                    readonly id: {
                        readonly type: "string";
                        readonly description: "The ID of the webhook event subscription.";
                    };
                    readonly event: {
                        readonly description: "The type of event that triggers the webhook.";
                        readonly enum: readonly ["order.addressUpdated", "order.created", "order.fulfilled", "product.created", "product.updated", "refund.requested", "refund.updated"];
                    };
                    readonly url: {
                        readonly type: "string";
                        readonly description: "The notification URL for the webhook event. In other words, this is the URL where the event notifications are sent.";
                    };
                    readonly token: {
                        readonly type: "string";
                        readonly description: "The webhook token used to sign webhook payloads. Token is returned only on the initial create response.";
                    };
                };
            };
            readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
        };
    };
};
declare const PostCategories: {
    readonly body: {
        readonly type: "object";
        readonly properties: {
            readonly title: {
                readonly type: "string";
                readonly description: "The title of the product category.";
            };
            readonly placement: {
                readonly type: "integer";
                readonly minimum: 1;
                readonly description: "Ranking of the product category in the shop. Accepts values in accordance with the number of categories in the shop. When an allocated  placement value is send, following placement values shift.";
            };
        };
        readonly required: readonly ["title"];
        readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
    };
    readonly response: {
        readonly "200": {
            readonly title: "Category";
            readonly type: "object";
            readonly description: "Category model.";
            readonly properties: {
                readonly id: {
                    readonly type: "string";
                    readonly description: "The ID of the product category.";
                };
                readonly title: {
                    readonly type: "string";
                    readonly description: "The title of the product category.";
                };
                readonly placement: {
                    readonly type: "integer";
                    readonly minimum: 1;
                    readonly multipleOf: 1;
                    readonly description: "Ranking of the product category in the shop. Returns \"1\" for the first category, increments accordingly.";
                };
            };
            readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
        };
    };
};
declare const PostDiscountsAutomatic: {
    readonly body: {
        readonly type: "object";
        readonly properties: {
            readonly title: {
                readonly type: "string";
                readonly description: "The title of the automatic discount.";
            };
            readonly scope: {
                readonly type: "string";
                readonly enum: readonly ["all", "selectedProducts", "selectedCategories"];
                readonly description: "The scope of the automatic discount. Automatic discounts can be applied for all or some of the products or categories.";
            };
            readonly productIds: {
                readonly type: "array";
                readonly description: "List of product IDs the automatic discount is applicable. Used when the scope is \"all\" or \"selectedProducts\".";
                readonly items: {
                    readonly type: "string";
                };
            };
            readonly categoryIds: {
                readonly type: "array";
                readonly description: "List of category IDs the automatic discount is applicable. Used when the scope is \"all\" or \"selectedCategories\".";
                readonly items: {
                    readonly type: "string";
                };
            };
            readonly type: {
                readonly type: "string";
                readonly enum: readonly ["percent", "amount"];
                readonly description: "Type of the discount.";
            };
            readonly amountOff: {
                readonly type: "string";
                readonly description: "The absolute value of the discount amount. Used when the automatic discount type is \"amount\".";
            };
            readonly percentOff: {
                readonly type: "string";
                readonly description: "The percentage rate of the discount. Used when the automatic discount type is \"percent\".";
            };
            readonly currency: {
                readonly type: "string";
                readonly enum: readonly ["TRY", "USD", "EUR"];
                readonly description: "Currency of the automatic discount.";
            };
            readonly requirement: {
                readonly type: "string";
                readonly enum: readonly ["amount", "quantity"];
                readonly description: "The requirement type of the automatic discount.";
            };
            readonly amountMinimum: {
                readonly type: "string";
                readonly description: "The minimum purchase amount for the automatic discount to be applicable. Used when the automatic discount requirement is \"amount\".";
            };
            readonly quantityMinimum: {
                readonly type: "integer";
                readonly description: "The minimum number of items to be purchased for the automatic discount to be applicable. Used when the automatic discount requirement is \"quantity\".";
            };
            readonly startsAt: {
                readonly type: "string";
                readonly description: "Start date of the automatic discount. yyyy-MM-ddZ format is used (e.g., 2022-07-21+0300).";
            };
            readonly expiresAt: {
                readonly type: "string";
                readonly description: "Expiry date of the automatic discount. yyyy-MM-ddZ format is used (e.g., 2022-07-21+0300).";
            };
        };
        readonly required: readonly ["title", "scope", "type", "currency", "requirement", "startsAt", "expiresAt"];
        readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
    };
    readonly response: {
        readonly "200": {
            readonly title: "AutomaticDiscount";
            readonly type: "object";
            readonly description: "Automatic discount model.";
            readonly properties: {
                readonly id: {
                    readonly type: "string";
                    readonly description: "The ID of the automatic discount.";
                };
                readonly title: {
                    readonly type: "string";
                    readonly description: "The title of the automatic discount.";
                };
                readonly scope: {
                    readonly type: "string";
                    readonly enum: readonly ["all", "selectedProducts", "selectedCategories"];
                    readonly description: "The scope of the automatic discount. Automatic discounts can be applied for all or some of the products or categories.\n\n`all` `selectedProducts` `selectedCategories`";
                };
                readonly productIds: {
                    readonly type: "array";
                    readonly description: "List of product IDs the automatic discount is applicable. Used when the scope is \"all\" or \"selectedProducts\".";
                    readonly items: {
                        readonly type: "string";
                    };
                };
                readonly categoryIds: {
                    readonly type: "array";
                    readonly description: "List of category IDs the automatic discount is applicable. Used when the scope is \"all\" or \"selectedCategories\".";
                    readonly items: {
                        readonly type: "string";
                    };
                };
                readonly dateCreated: {
                    readonly type: "string";
                    readonly description: "The date and time for the creation of the automatic discount. yyyy-MM-ddTHH:mm:ssZ format is used (e.g., 2022-07-21T13:24:51+0300).";
                };
                readonly type: {
                    readonly type: "string";
                    readonly description: "Type of the discount.\n\n`amount` `percent`";
                    readonly enum: readonly ["amount", "percent"];
                };
                readonly amountOff: {
                    readonly type: "string";
                    readonly description: "The absolute value of the discount amount. Used when the automatic discount type is \"amount\".";
                };
                readonly percentOff: {
                    readonly type: "string";
                    readonly description: "The percentage rate of the discount. Used when the automatic discount type is \"percent\".";
                };
                readonly requirement: {
                    readonly type: "string";
                    readonly enum: readonly ["amount", "quantity"];
                    readonly description: "The requirement type of the automatic discount.\n\n`amount` `quantity`";
                };
                readonly amountMinimum: {
                    readonly type: "string";
                    readonly description: "The minimum purchase amount for the automatic discount to be applicable. Used when the automatic discount requirement is \"amount\".";
                };
                readonly quantityMinimum: {
                    readonly type: "integer";
                    readonly description: "The minimum number of items to be purchased for the automatic discount to be applicable. Used when the automatic discount requirement is \"quantity\".";
                };
                readonly currency: {
                    readonly type: "string";
                    readonly enum: readonly ["TRY", "USD", "EUR"];
                    readonly description: "Currency of the automatic discount.\n\n`TRY` `USD` `EUR`";
                };
                readonly startsAt: {
                    readonly type: "string";
                    readonly description: "Start date of the automatic discount. yyyy-MM-ddZ format is used (e.g., 2022-07-21+0300).";
                };
                readonly expiresAt: {
                    readonly type: "string";
                    readonly description: "Expiry date of the automatic discount. yyyy-MM-ddZ format is used (e.g., 2022-07-21+0300).";
                };
            };
            readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
        };
    };
};
declare const PostDiscountsCodes: {
    readonly body: {
        readonly type: "object";
        readonly properties: {
            readonly code: {
                readonly type: "string";
                readonly description: "The discount code for the buyers used at the checkout.";
            };
            readonly type: {
                readonly type: "string";
                readonly enum: readonly ["amount", "percent"];
                readonly description: "Type of the discount.";
            };
            readonly amountOff: {
                readonly type: "string";
                readonly description: "The absolute value of the discount amount. Required when the discount code type is \"amount\".";
            };
            readonly percentOff: {
                readonly type: "string";
                readonly description: "The percentage rate of the discount. Required when the discount code type is \"percent\".";
            };
            readonly amountMinimum: {
                readonly type: "string";
                readonly description: "Required minimum order amount for the discount code to be applicable.";
            };
            readonly currency: {
                readonly type: "string";
                readonly enum: readonly ["TRY", "USD", "EUR"];
                readonly description: "Currency of the discount code.";
            };
            readonly numAvailable: {
                readonly type: "integer";
                readonly description: "Number of discount codes that can be used.";
            };
            readonly expiresAt: {
                readonly type: "string";
                readonly description: "Expiry date of the discount code. yyyy-MM-ddZ format is used (e.g., 2022-07-21+0300).";
            };
        };
        readonly required: readonly ["code", "type", "amountMinimum", "currency", "numAvailable", "expiresAt"];
        readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
    };
    readonly response: {
        readonly "200": {
            readonly title: "DiscountCode";
            readonly type: "object";
            readonly description: "Discount code model.";
            readonly properties: {
                readonly id: {
                    readonly type: "string";
                    readonly description: "The ID of discount code.";
                };
                readonly code: {
                    readonly type: "string";
                    readonly description: "The discount code for the buyers used at the checkout.";
                };
                readonly dateCreated: {
                    readonly type: "string";
                    readonly description: "The date and time for the creation of the discount code. yyyy-MM-ddTHH:mm:ssZ format is used (e.g., 2022-07-21T13:24:51+0300).";
                };
                readonly type: {
                    readonly type: "string";
                    readonly description: "Type of the discount.\n\n`amount` `percent`";
                    readonly enum: readonly ["amount", "percent"];
                };
                readonly amountOff: {
                    readonly type: "string";
                    readonly description: "The absolute value of the discount amount. Used when the discount code type is \"amount\".";
                };
                readonly percentOff: {
                    readonly type: "string";
                    readonly description: "The percentage rate of the discount. Used when the discount code type is \"percent\".";
                };
                readonly amountMinimum: {
                    readonly type: "string";
                    readonly description: "Required minimum order amount for the discount code to be applicable. ";
                };
                readonly currency: {
                    readonly type: "string";
                    readonly enum: readonly ["TRY", "USD", "EUR"];
                    readonly description: "Currency of the discount code.\n\n`TRY` `USD` `EUR`";
                };
                readonly numAvailable: {
                    readonly type: "integer";
                    readonly description: "Number of remaining discount codes that can be used.";
                };
                readonly numUsed: {
                    readonly type: "integer";
                    readonly description: "Number of times the discount code has been used.";
                };
                readonly expiresAt: {
                    readonly type: "string";
                    readonly description: "Expiry date of the discount code. yyyy-MM-ddZ format is used (e.g., 2022-07-21+0300).";
                };
            };
            readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
        };
    };
};
declare const PostProducts: {
    readonly body: {
        readonly type: "object";
        readonly required: readonly ["title", "type", "media", "priceData", "shippingPayer"];
        readonly properties: {
            readonly title: {
                readonly type: "string";
                readonly description: "Title of the product.";
            };
            readonly description: {
                readonly type: "string";
                readonly description: "Detailed description of the product.";
            };
            readonly type: {
                readonly type: "string";
                readonly enum: readonly ["physical", "digital"];
                readonly description: "Type of the product.";
            };
            readonly media: {
                readonly type: "array";
                readonly description: "Details of product media files. There can be a maximum of 5 media files.";
                readonly items: {
                    readonly type: "object";
                    readonly required: readonly ["type", "url", "placement"];
                    readonly properties: {
                        readonly type: {
                            readonly type: "string";
                            readonly enum: readonly ["image"];
                            readonly description: "Type of media file.";
                        };
                        readonly url: {
                            readonly type: "string";
                            readonly description: "The URL of media file. Formats supported: jpg, jpeg, png, bmp.";
                        };
                        readonly placement: {
                            readonly type: "integer";
                            readonly minimum: 1;
                            readonly maximum: 5;
                            readonly multipleOf: 1;
                            readonly description: "Ranking of the media file in product pages. Send \"1\" for the primary media file.";
                        };
                    };
                };
            };
            readonly priceData: {
                readonly type: "object";
                readonly description: "Details of the price information.";
                readonly required: readonly ["currency", "price"];
                readonly properties: {
                    readonly currency: {
                        readonly type: "string";
                        readonly enum: readonly ["TRY", "USD", "EUR"];
                        readonly description: "Currency of the product.";
                    };
                    readonly price: {
                        readonly type: "string";
                        readonly description: "Unit price of the product.";
                    };
                    readonly discount: {
                        readonly type: "boolean";
                        readonly description: "Represents whether there is a product based discount.";
                    };
                    readonly discountedPrice: {
                        readonly type: "string";
                        readonly description: "Discounted price of the product.";
                    };
                    readonly shippingPrice: {
                        readonly type: "string";
                        readonly description: "Shipping price of the product.";
                    };
                };
            };
            readonly stockQuantity: {
                readonly type: "integer";
                readonly description: "Stock quantity of the product.";
            };
            readonly shippingPayer: {
                readonly type: "string";
                readonly enum: readonly ["sellerPays", "buyerPays"];
                readonly description: "Represents who pays for shipping during dispatch or delivery.";
            };
            readonly categories: {
                readonly type: "array";
                readonly description: "List of categories that product belongs to.";
                readonly items: {
                    readonly type: "object";
                    readonly properties: {
                        readonly categoryId: {
                            readonly type: "string";
                            readonly description: "The ID of category.";
                        };
                    };
                };
            };
            readonly variants: {
                readonly type: "array";
                readonly description: "List of variants of the product.";
                readonly items: {
                    readonly type: "object";
                    readonly properties: {
                        readonly selectionId: {
                            readonly type: "array";
                            readonly description: "The ID of selection.";
                            readonly items: {
                                readonly type: "string";
                            };
                        };
                        readonly stockQuantity: {
                            readonly type: "integer";
                            readonly description: "Stock quantity of the variant.";
                        };
                        readonly media: {
                            readonly type: "array";
                            readonly description: "Details of variant media files. Currently there can be a maximum of 1 media file.";
                            readonly items: {
                                readonly type: "object";
                                readonly properties: {
                                    readonly type: {
                                        readonly type: "string";
                                        readonly enum: readonly ["image"];
                                        readonly description: "Type of media file.";
                                    };
                                    readonly url: {
                                        readonly type: "string";
                                        readonly description: "The URL of media file. Formats supported: jpg, jpeg, png, bmp.";
                                    };
                                };
                            };
                        };
                        readonly priceData: {
                            readonly type: "object";
                            readonly description: "Details of the price information for the variant.";
                            readonly properties: {
                                readonly currency: {
                                    readonly type: "string";
                                    readonly description: "Currency of the variant.";
                                    readonly enum: readonly ["TRY", "USD", "EUR"];
                                };
                                readonly price: {
                                    readonly type: "string";
                                    readonly description: "Unit price of the variant.";
                                };
                            };
                        };
                        readonly primary: {
                            readonly type: "boolean";
                            readonly description: "Represents the primary variant. Only one variant can be primary.";
                        };
                    };
                };
            };
            readonly options: {
                readonly type: "array";
                readonly description: "List of options of the product. There can be a maximum of 3 options.";
                readonly items: {
                    readonly type: "object";
                    readonly properties: {
                        readonly optionId: {
                            readonly type: "string";
                            readonly description: "The ID of option.";
                        };
                        readonly optionTitle: {
                            readonly type: "string";
                            readonly description: "The title of option.";
                        };
                        readonly optionPrice: {
                            readonly type: "string";
                            readonly description: "The price of option.";
                        };
                    };
                };
            };
            readonly singleOption: {
                readonly type: "boolean";
                readonly description: "Represents whether a single option or multiple options can be selected during chekout.";
            };
            readonly customListing: {
                readonly type: "boolean";
                readonly description: "Represents whether the listing is a custom or standard one.";
            };
            readonly customNote: {
                readonly type: "string";
                readonly description: "Overrides the placeholder for note to seller field. Used for collecting a custom information from the buyer during checkout.";
            };
            readonly placementScore: {
                readonly type: "integer";
                readonly minimum: 1;
                readonly multipleOf: 1;
                readonly description: "Placement score of the product. Products with higher values are placed first in the store.";
            };
            readonly dispatchDuration: {
                readonly type: "integer";
                readonly minimum: 1;
                readonly maximum: 3;
                readonly multipleOf: 1;
                readonly description: "Dispatch duration in terms of days from seller to shipping company.";
            };
        };
        readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
    };
    readonly response: {
        readonly "200": {
            readonly title: "Product";
            readonly type: "object";
            readonly description: "Product model.";
            readonly properties: {
                readonly id: {
                    readonly type: "string";
                    readonly description: "The ID of the product.";
                };
                readonly title: {
                    readonly type: "string";
                    readonly description: "Title of the product.";
                };
                readonly description: {
                    readonly type: "string";
                    readonly description: "Detailed description of the product.";
                };
                readonly type: {
                    readonly type: "string";
                    readonly enum: readonly ["physical", "digital"];
                    readonly description: "Type of the product.\n\n`physical` `digital`";
                };
                readonly dateCreated: {
                    readonly type: "string";
                    readonly description: "The date and time of the initial product listing. yyyy-MM-ddTHH:mm:ssZ format is used (e.g., 2022-07-21T13:24:51+0300).";
                };
                readonly dateUpdated: {
                    readonly type: "string";
                    readonly description: "The date and time of the product update. yyyy-MM-ddTHH:mm:ssZ format is used (e.g., 2022-07-21T13:24:51+0300).";
                };
                readonly url: {
                    readonly type: "string";
                    readonly description: "The URL of the product. \n(e.g., https://www.shopier.com/696547)";
                };
                readonly media: {
                    readonly type: "array";
                    readonly description: "Details of product media files.";
                    readonly items: {
                        readonly type: "object";
                        readonly properties: {
                            readonly id: {
                                readonly type: "string";
                                readonly description: "The ID of media file.";
                            };
                            readonly type: {
                                readonly type: "string";
                                readonly enum: readonly ["image"];
                                readonly description: "Type of media file.\n\n`image`";
                            };
                            readonly url: {
                                readonly type: "string";
                                readonly description: "The URL of media file.\n(e.g., https://dmih5ui1qqea9.cloudfront.net/pictures_large/Camiseta6855_cobalt-blue-t-shirt.jpg)";
                            };
                            readonly placement: {
                                readonly type: "integer";
                                readonly description: "Ranking of the media file in product pages. Returns \"1\" for the primary media file.";
                                readonly minimum: 1;
                                readonly multipleOf: 1;
                                readonly maximum: 5;
                            };
                        };
                    };
                };
                readonly priceData: {
                    readonly type: "object";
                    readonly description: "Details of the price information.";
                    readonly properties: {
                        readonly currency: {
                            readonly type: "string";
                            readonly enum: readonly ["TRY", "USD", "EUR"];
                            readonly description: "Currency of the product.\n\n`TRY` `USD` `EUR`";
                        };
                        readonly price: {
                            readonly type: "string";
                            readonly description: "Unit price of the product.";
                        };
                        readonly discount: {
                            readonly type: "boolean";
                            readonly description: "Represents whether there is a product based discount.";
                        };
                        readonly discountedPrice: {
                            readonly type: "string";
                            readonly description: "Discounted price of the product.";
                        };
                        readonly shippingPrice: {
                            readonly type: "string";
                            readonly description: "Shipping price of the product.";
                        };
                    };
                };
                readonly stockStatus: {
                    readonly type: "string";
                    readonly enum: readonly ["inStock", "outOfStock"];
                    readonly description: "Current stock status of the product.\n\n`inStock` `outOfStock`";
                };
                readonly stockQuantity: {
                    readonly type: "integer";
                    readonly description: "Current stock quantity of the product.";
                };
                readonly shippingPayer: {
                    readonly type: "string";
                    readonly enum: readonly ["sellerPays", "buyerPays"];
                    readonly description: "Represents who pays for shipping during dispatch or delivery.\n\n`sellerPays` `buyerPays`";
                };
                readonly categories: {
                    readonly type: "array";
                    readonly description: "List of categories that product belongs to.";
                    readonly items: {
                        readonly type: "object";
                        readonly properties: {
                            readonly id: {
                                readonly type: "string";
                                readonly description: "The ID of category.";
                            };
                            readonly title: {
                                readonly type: "string";
                                readonly description: "The title of category.";
                            };
                        };
                    };
                };
                readonly variants: {
                    readonly type: "array";
                    readonly description: "List of variants of the product.";
                    readonly items: {
                        readonly type: "object";
                        readonly properties: {
                            readonly variationId: {
                                readonly type: "array";
                                readonly description: "The ID of variation.";
                                readonly items: {
                                    readonly type: "string";
                                };
                            };
                            readonly variationTitle: {
                                readonly type: "array";
                                readonly description: "The title of variation.";
                                readonly items: {
                                    readonly type: "string";
                                };
                            };
                            readonly selectionId: {
                                readonly type: "array";
                                readonly description: "The ID of selection.";
                                readonly items: {
                                    readonly type: "string";
                                };
                            };
                            readonly selectionTitle: {
                                readonly type: "array";
                                readonly description: "The title of selection.";
                                readonly items: {
                                    readonly type: "string";
                                };
                            };
                            readonly stockStatus: {
                                readonly type: "string";
                                readonly enum: readonly ["inStock", "outOfStock"];
                                readonly description: "Current stock status of the variant.\n\n`inStock` `outOfStock`";
                            };
                            readonly stockQuantity: {
                                readonly type: "integer";
                                readonly description: "Current stock quantity of the variant.";
                            };
                            readonly media: {
                                readonly type: "array";
                                readonly description: "Details of variant media files. Currently variant has a maximum of one media file.";
                                readonly items: {
                                    readonly type: "object";
                                    readonly properties: {
                                        readonly id: {
                                            readonly type: "string";
                                            readonly description: "The ID of media file.";
                                        };
                                        readonly type: {
                                            readonly type: "string";
                                            readonly enum: readonly ["image"];
                                            readonly description: "Type of media file.\n\n`image`";
                                        };
                                        readonly url: {
                                            readonly type: "string";
                                            readonly description: "The URL of media file.\n(e.g., https://dmih5ui1qqea9.cloudfront.net/pictures_large/Camiseta6855_cobalt-blue-t-shirt.jpg)";
                                        };
                                    };
                                };
                            };
                            readonly priceData: {
                                readonly type: "object";
                                readonly description: "Details of the price information for the variant.";
                                readonly properties: {
                                    readonly currency: {
                                        readonly type: "string";
                                        readonly enum: readonly ["TRY", "USD", "EUR"];
                                        readonly description: "Currency of the variant.\n\n`TRY` `USD` `EUR`";
                                    };
                                    readonly price: {
                                        readonly type: "string";
                                        readonly description: "Unit price of the variant.";
                                    };
                                };
                            };
                            readonly primary: {
                                readonly type: "boolean";
                                readonly description: "Represents the primary variant. Only one variant can be primary.";
                            };
                        };
                    };
                };
                readonly options: {
                    readonly type: "array";
                    readonly description: "List of options of the product.";
                    readonly items: {
                        readonly type: "object";
                        readonly properties: {
                            readonly id: {
                                readonly type: "string";
                                readonly description: "The ID of option.";
                            };
                            readonly title: {
                                readonly type: "string";
                                readonly description: "The title of option.";
                            };
                            readonly price: {
                                readonly type: "string";
                                readonly description: "The price of option.";
                            };
                        };
                    };
                };
                readonly singleOption: {
                    readonly type: "boolean";
                    readonly description: "Represents whether a single option or multiple options can be selected during chekout.";
                };
                readonly customListing: {
                    readonly type: "boolean";
                    readonly description: "Represents whether the listing is a custom or standard one.";
                };
                readonly customNote: {
                    readonly type: "string";
                    readonly description: "Overrides the placeholder for note to seller field. Used for collecting a custom information from the buyer during checkout.";
                };
                readonly placementScore: {
                    readonly type: "integer";
                    readonly minimum: 1;
                    readonly multipleOf: 1;
                    readonly description: "Placement score of the product. Products with higher values are placed first in the store.";
                };
                readonly dispatchDuration: {
                    readonly type: "integer";
                    readonly minimum: 1;
                    readonly maximum: 3;
                    readonly multipleOf: 1;
                    readonly description: "Dispatch duration in terms of days from seller to shipping company.";
                };
            };
            readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
        };
    };
};
declare const PostRefunds: {
    readonly body: {
        readonly type: "object";
        readonly properties: {
            readonly orderId: {
                readonly type: "string";
                readonly description: "The ID of the order.";
            };
            readonly amount: {
                readonly type: "string";
                readonly description: "Amount to be refunded.";
            };
            readonly note: {
                readonly type: "string";
                readonly description: "Seller's note to buyer about the refund.";
            };
        };
        readonly required: readonly ["orderId", "amount"];
        readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
    };
    readonly response: {
        readonly "200": {
            readonly title: "Refund";
            readonly type: "object";
            readonly description: "Refund model.";
            readonly properties: {
                readonly id: {
                    readonly type: "string";
                    readonly description: "The ID of the refund.";
                };
                readonly type: {
                    readonly type: "string";
                    readonly description: "The type of the refund.\n\n`full` `partial`";
                    readonly enum: readonly ["full", "partial"];
                };
                readonly status: {
                    readonly type: "string";
                    readonly enum: readonly ["pending", "failed", "succeeded"];
                    readonly description: "Current status of the refund.\n\n`pending` `failed` `succeeded`";
                };
                readonly orderId: {
                    readonly type: "string";
                    readonly description: "The order ID related with the refund.";
                };
                readonly dateCreated: {
                    readonly type: "string";
                    readonly description: "The date and time for the creation of the refund request. yyyy-MM-ddTHH:mm:ssZ format is used (e.g., 2022-07-21T13:24:51+0300).";
                };
                readonly dateRefunded: {
                    readonly type: "string";
                    readonly description: "The date and time for the actual refund transaction submitted to the payment provider. yyyy-MM-ddTHH:mm:ssZ format is used (e.g., 2022-07-21T13:24:51+0300).";
                };
                readonly currency: {
                    readonly type: "string";
                    readonly description: "Currency of the refund.\n\n`TRY` `USD` `EUR`";
                    readonly enum: readonly ["TRY", "USD", "EUR"];
                };
                readonly total: {
                    readonly type: "string";
                    readonly description: "Total amount of the refund.";
                };
                readonly note: {
                    readonly type: "string";
                    readonly description: "Seller's note to buyer about the refund.";
                };
            };
            readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
        };
    };
};
declare const PostSelections: {
    readonly body: {
        readonly type: "object";
        readonly properties: {
            readonly variationId: {
                readonly type: "string";
                readonly description: "The ID of the product variation.";
            };
            readonly title: {
                readonly type: "string";
                readonly description: "The title of the product selection, a subset of product variation.";
            };
        };
        readonly required: readonly ["variationId", "title"];
        readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
    };
    readonly response: {
        readonly "200": {
            readonly title: "Selection";
            readonly type: "object";
            readonly description: "Selection model.";
            readonly properties: {
                readonly id: {
                    readonly type: "string";
                    readonly description: "The ID of the product selection, a subset of product variation.";
                };
                readonly title: {
                    readonly type: "string";
                    readonly description: "The title of the product selection, a subset of product variation.";
                };
                readonly variationId: {
                    readonly type: "string";
                    readonly description: "The ID of the related product variation.";
                };
            };
            readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
        };
    };
};
declare const PostShippings: {
    readonly body: {
        readonly type: "object";
        readonly properties: {
            readonly orderId: {
                readonly type: "string";
                readonly description: "The ID of the order.";
            };
            readonly company: {
                readonly type: "string";
                readonly enum: readonly ["yurtici", "mng", "ptt"];
                readonly description: "Shipping company.";
            };
            readonly type: {
                readonly type: "string";
                readonly default: "firstShipment";
                readonly enum: readonly ["firstShipment", "secondShipment", "returnShipment"];
                readonly description: "Type of the shipping. firstShipment and secondShipment are used for seller to buyer direction, returnShipment is used for buyer to seller direction.";
            };
        };
        readonly required: readonly ["orderId", "company"];
        readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
    };
    readonly response: {
        readonly "200": {
            readonly title: "Shipping";
            readonly type: "object";
            readonly description: "Shipping model.";
            readonly properties: {
                readonly orderId: {
                    readonly type: "string";
                    readonly description: "The ID of the order.";
                };
                readonly status: {
                    readonly type: "string";
                    readonly enum: readonly ["shipped", "notShipped"];
                    readonly description: "Current status of the shipping.\n\n`shipped` `notShipped`";
                };
                readonly method: {
                    readonly type: "string";
                    readonly enum: readonly ["standard", "contracted"];
                    readonly description: "Method of the shipping.\n\n`standard` `contracted`";
                };
                readonly type: {
                    readonly type: "string";
                    readonly enum: readonly ["firstShipment", "secondShipment", "returnShipment"];
                    readonly description: "Type of the shipping. firstShipment and secondShipment are used for seller to buyer direction, returnShipment is used for buyer to seller direction.\n\n`firstShipment` `secondShipment` `returnShipment`";
                };
                readonly dateCreated: {
                    readonly type: "string";
                    readonly description: "For standard shipping, this is the date and time of the order closure. For contracted shipping, this is the date and time for the creation of the shipping code. yyyy-MM-ddTHH:mm:ssZ format is used (e.g., 2022-07-21T13:24:51+0300).";
                };
                readonly dateDispatched: {
                    readonly type: "string";
                    readonly description: "The date and time of the initial dispatch. It is provided by the shipping company and only present for contracted shipping. yyyy-MM-ddTHH:mm:ssZ format is used (e.g., 2022-07-21T13:24:51+0300).";
                };
                readonly company: {
                    readonly type: "string";
                    readonly enum: readonly ["yurtici", "mng", "ptt", "aras", "surat", "ups", "fedex", "dhl", "tnt", "pts", "aramex", "interGlobal", "other"];
                    readonly description: "Shipping company.\n\n`yurtici` `mng` `ptt` `aras` `surat` `ups` `fedex` `dhl` `tnt` `pts` `aramex` `interGlobal` `other`";
                };
                readonly code: {
                    readonly type: "string";
                    readonly description: "Generated shipping code. ";
                };
                readonly trackingNumber: {
                    readonly type: "string";
                    readonly description: "Tracking number of the shipping. For standard shipping, it is provided by the seller while closing the order. For contracted shipping, it is provided by the shipping company with the initial dispatch. ";
                };
                readonly trackingUrl: {
                    readonly type: "string";
                    readonly description: "Tracking URL of the shipping. It is provided by the shipping company and only present for contracted shipping.";
                };
                readonly size: {
                    readonly type: "string";
                    readonly description: "Size of the shipping load. It is provided by some of the shipping companies and only present for contracted shipping.";
                };
                readonly sizeUnit: {
                    readonly type: "string";
                    readonly description: "Size unit of the shipping load. It is provided by some of the shipping companies and only present for contracted shipping.\n\n`deci`";
                    readonly enum: readonly ["deci"];
                };
                readonly weight: {
                    readonly type: "string";
                    readonly description: "Weight of the shipping load. It is provided by some of the shipping companies and only present for contracted shipping.";
                };
                readonly weightUnit: {
                    readonly type: "string";
                    readonly description: "Weight unit of the shipping load. It is provided by some of the shipping companies and only present for contracted shipping.\n\n`gram` `kilogram`";
                    readonly enum: readonly ["gram", "kilogram"];
                };
                readonly cost: {
                    readonly type: "string";
                    readonly description: "Cost of the shipping. It is provided by the shipping company and only present for contracted shipping.";
                };
                readonly currency: {
                    readonly type: "string";
                    readonly enum: readonly ["TRY", "USD", "EUR"];
                    readonly description: "Currency of the shipping cost. It is provided by the shipping company and only present for contracted shipping.\n\n`TRY` `USD` `EUR`";
                };
            };
            readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
        };
    };
};
declare const PostVariations: {
    readonly body: {
        readonly type: "object";
        readonly properties: {
            readonly title: {
                readonly type: "string";
                readonly description: "The title of the product variation.";
            };
        };
        readonly required: readonly ["title"];
        readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
    };
    readonly response: {
        readonly "200": {
            readonly title: "Variation";
            readonly type: "object";
            readonly description: "Variation model.";
            readonly properties: {
                readonly id: {
                    readonly type: "string";
                    readonly description: "The ID of the product variation.";
                };
                readonly title: {
                    readonly type: "string";
                    readonly description: "The title of the product variation.";
                };
                readonly placement: {
                    readonly type: "integer";
                    readonly minimum: 1;
                    readonly maximum: 2;
                    readonly multipleOf: 1;
                    readonly description: "Ranking of the product variation in the shop. Returns \"1\" for the first variation, returns \"2\" for the second variation.";
                };
            };
            readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
        };
    };
};
declare const PostWebhooks: {
    readonly body: {
        readonly type: "object";
        readonly required: readonly ["event", "url"];
        readonly properties: {
            readonly event: {
                readonly description: "The type of event that triggers the webhook.";
                readonly enum: readonly ["order.addressUpdated", "order.created", "order.fulfilled", "product.created", "product.updated", "refund.requested", "refund.updated"];
            };
            readonly url: {
                readonly type: "string";
                readonly description: "The notification URL for the webhook event. In other words, this is the URL where the event notifications will be sent.";
            };
        };
        readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
    };
    readonly response: {
        readonly "200": {
            readonly title: "Webhook";
            readonly type: "object";
            readonly description: "Webhook model.";
            readonly properties: {
                readonly id: {
                    readonly type: "string";
                    readonly description: "The ID of the webhook event subscription.";
                };
                readonly event: {
                    readonly description: "The type of event that triggers the webhook.";
                    readonly enum: readonly ["order.addressUpdated", "order.created", "order.fulfilled", "product.created", "product.updated", "refund.requested", "refund.updated"];
                };
                readonly url: {
                    readonly type: "string";
                    readonly description: "The notification URL for the webhook event. In other words, this is the URL where the event notifications are sent.";
                };
                readonly token: {
                    readonly type: "string";
                    readonly description: "The webhook token used to sign webhook payloads. Token is returned only on the initial create response.";
                };
            };
            readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
        };
    };
};
declare const PutCategoriesId: {
    readonly body: {
        readonly type: "object";
        readonly properties: {
            readonly title: {
                readonly type: "string";
                readonly description: "The title of the product category.";
            };
            readonly placement: {
                readonly type: "integer";
                readonly minimum: 1;
                readonly description: "Ranking of the product category in the shop. Accepts values in accordance with the number of categories in the shop. When an allocated  placement value is send, following placement values shift.";
            };
        };
        readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
    };
    readonly metadata: {
        readonly allOf: readonly [{
            readonly type: "object";
            readonly properties: {
                readonly id: {
                    readonly type: "string";
                    readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
                    readonly description: "Specify the category ID to retrieve the category.";
                };
            };
            readonly required: readonly ["id"];
        }];
    };
    readonly response: {
        readonly "200": {
            readonly title: "Category";
            readonly type: "object";
            readonly description: "Category model.";
            readonly properties: {
                readonly id: {
                    readonly type: "string";
                    readonly description: "The ID of the product category.";
                };
                readonly title: {
                    readonly type: "string";
                    readonly description: "The title of the product category.";
                };
                readonly placement: {
                    readonly type: "integer";
                    readonly minimum: 1;
                    readonly multipleOf: 1;
                    readonly description: "Ranking of the product category in the shop. Returns \"1\" for the first category, increments accordingly.";
                };
            };
            readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
        };
    };
};
declare const PutDiscountsAutomaticId: {
    readonly body: {
        readonly type: "object";
        readonly properties: {
            readonly startsAt: {
                readonly type: "string";
                readonly description: "Start date of the automatic discount. yyyy-MM-ddZ format is used (e.g., 2022-07-21+0300).";
            };
            readonly expiresAt: {
                readonly type: "string";
                readonly description: "Expiry date of the automatic discount. yyyy-MM-ddZ format is used (e.g., 2022-07-21+0300).";
            };
        };
        readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
    };
    readonly metadata: {
        readonly allOf: readonly [{
            readonly type: "object";
            readonly properties: {
                readonly id: {
                    readonly type: "string";
                    readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
                    readonly description: "Specify the automatic discount ID to retrieve the automatic discount.";
                };
            };
            readonly required: readonly ["id"];
        }];
    };
    readonly response: {
        readonly "200": {
            readonly title: "AutomaticDiscount";
            readonly type: "object";
            readonly description: "Automatic discount model.";
            readonly properties: {
                readonly id: {
                    readonly type: "string";
                    readonly description: "The ID of the automatic discount.";
                };
                readonly title: {
                    readonly type: "string";
                    readonly description: "The title of the automatic discount.";
                };
                readonly scope: {
                    readonly type: "string";
                    readonly enum: readonly ["all", "selectedProducts", "selectedCategories"];
                    readonly description: "The scope of the automatic discount. Automatic discounts can be applied for all or some of the products or categories.\n\n`all` `selectedProducts` `selectedCategories`";
                };
                readonly productIds: {
                    readonly type: "array";
                    readonly description: "List of product IDs the automatic discount is applicable. Used when the scope is \"all\" or \"selectedProducts\".";
                    readonly items: {
                        readonly type: "string";
                    };
                };
                readonly categoryIds: {
                    readonly type: "array";
                    readonly description: "List of category IDs the automatic discount is applicable. Used when the scope is \"all\" or \"selectedCategories\".";
                    readonly items: {
                        readonly type: "string";
                    };
                };
                readonly dateCreated: {
                    readonly type: "string";
                    readonly description: "The date and time for the creation of the automatic discount. yyyy-MM-ddTHH:mm:ssZ format is used (e.g., 2022-07-21T13:24:51+0300).";
                };
                readonly type: {
                    readonly type: "string";
                    readonly description: "Type of the discount.\n\n`amount` `percent`";
                    readonly enum: readonly ["amount", "percent"];
                };
                readonly amountOff: {
                    readonly type: "string";
                    readonly description: "The absolute value of the discount amount. Used when the automatic discount type is \"amount\".";
                };
                readonly percentOff: {
                    readonly type: "string";
                    readonly description: "The percentage rate of the discount. Used when the automatic discount type is \"percent\".";
                };
                readonly requirement: {
                    readonly type: "string";
                    readonly enum: readonly ["amount", "quantity"];
                    readonly description: "The requirement type of the automatic discount.\n\n`amount` `quantity`";
                };
                readonly amountMinimum: {
                    readonly type: "string";
                    readonly description: "The minimum purchase amount for the automatic discount to be applicable. Used when the automatic discount requirement is \"amount\".";
                };
                readonly quantityMinimum: {
                    readonly type: "integer";
                    readonly description: "The minimum number of items to be purchased for the automatic discount to be applicable. Used when the automatic discount requirement is \"quantity\".";
                };
                readonly currency: {
                    readonly type: "string";
                    readonly enum: readonly ["TRY", "USD", "EUR"];
                    readonly description: "Currency of the automatic discount.\n\n`TRY` `USD` `EUR`";
                };
                readonly startsAt: {
                    readonly type: "string";
                    readonly description: "Start date of the automatic discount. yyyy-MM-ddZ format is used (e.g., 2022-07-21+0300).";
                };
                readonly expiresAt: {
                    readonly type: "string";
                    readonly description: "Expiry date of the automatic discount. yyyy-MM-ddZ format is used (e.g., 2022-07-21+0300).";
                };
            };
            readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
        };
    };
};
declare const PutDiscountsCodesId: {
    readonly body: {
        readonly type: "object";
        readonly properties: {
            readonly numAvailable: {
                readonly type: "integer";
                readonly description: "Number of discount codes that can be used.";
            };
            readonly expiresAt: {
                readonly type: "string";
                readonly description: "Expiry date of the discount code. yyyy-MM-ddZ format is used (e.g., 2022-07-21+0300).";
            };
        };
        readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
    };
    readonly metadata: {
        readonly allOf: readonly [{
            readonly type: "object";
            readonly properties: {
                readonly id: {
                    readonly type: "string";
                    readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
                    readonly description: "Specify the discount code ID to retrieve the discount code.";
                };
            };
            readonly required: readonly ["id"];
        }];
    };
    readonly response: {
        readonly "200": {
            readonly title: "DiscountCode";
            readonly type: "object";
            readonly description: "Discount code model.";
            readonly properties: {
                readonly id: {
                    readonly type: "string";
                    readonly description: "The ID of discount code.";
                };
                readonly code: {
                    readonly type: "string";
                    readonly description: "The discount code for the buyers used at the checkout.";
                };
                readonly dateCreated: {
                    readonly type: "string";
                    readonly description: "The date and time for the creation of the discount code. yyyy-MM-ddTHH:mm:ssZ format is used (e.g., 2022-07-21T13:24:51+0300).";
                };
                readonly type: {
                    readonly type: "string";
                    readonly description: "Type of the discount.\n\n`amount` `percent`";
                    readonly enum: readonly ["amount", "percent"];
                };
                readonly amountOff: {
                    readonly type: "string";
                    readonly description: "The absolute value of the discount amount. Used when the discount code type is \"amount\".";
                };
                readonly percentOff: {
                    readonly type: "string";
                    readonly description: "The percentage rate of the discount. Used when the discount code type is \"percent\".";
                };
                readonly amountMinimum: {
                    readonly type: "string";
                    readonly description: "Required minimum order amount for the discount code to be applicable. ";
                };
                readonly currency: {
                    readonly type: "string";
                    readonly enum: readonly ["TRY", "USD", "EUR"];
                    readonly description: "Currency of the discount code.\n\n`TRY` `USD` `EUR`";
                };
                readonly numAvailable: {
                    readonly type: "integer";
                    readonly description: "Number of remaining discount codes that can be used.";
                };
                readonly numUsed: {
                    readonly type: "integer";
                    readonly description: "Number of times the discount code has been used.";
                };
                readonly expiresAt: {
                    readonly type: "string";
                    readonly description: "Expiry date of the discount code. yyyy-MM-ddZ format is used (e.g., 2022-07-21+0300).";
                };
            };
            readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
        };
    };
};
declare const PutOrdersId: {
    readonly body: {
        readonly type: "object";
        readonly properties: {
            readonly fulfillments: {
                readonly type: "object";
                readonly description: "Details of the delivery.";
                readonly properties: {
                    readonly productType: {
                        readonly type: "string";
                        readonly enum: readonly ["physical", "digital"];
                        readonly description: "Type of the delivery.";
                    };
                    readonly shippingCompany: {
                        readonly type: "string";
                        readonly enum: readonly ["yurtici", "mng", "ptt", "aras", "surat", "ups", "fedex", "dhl", "tnt", "pts", "aramex", "interGlobal", "other"];
                        readonly description: "Shipping company used for the delivery.";
                    };
                    readonly trackingNumber: {
                        readonly type: "string";
                        readonly description: "Tracking number of the shipping.";
                    };
                    readonly note: {
                        readonly type: "string";
                        readonly description: "Required for digital deliveries, represents how the delivery is done.";
                    };
                };
            };
            readonly shippingInfo: {
                readonly type: "object";
                readonly description: "Buyer's shipping address and details.";
                readonly properties: {
                    readonly firstName: {
                        readonly type: "string";
                        readonly description: "Buyer's first name for shipping.";
                    };
                    readonly lastName: {
                        readonly type: "string";
                        readonly description: "Buyer's last name for shipping.";
                    };
                    readonly nationalId: {
                        readonly type: "string";
                        readonly description: "Buyer's national identification number for shipping.";
                    };
                    readonly email: {
                        readonly type: "string";
                        readonly description: "Buyer's email address for shipping.";
                    };
                    readonly phone: {
                        readonly type: "string";
                        readonly description: "Buyer's phone number for shipping.";
                    };
                    readonly company: {
                        readonly type: "string";
                        readonly description: "Buyer company's name for shipping.";
                    };
                    readonly address: {
                        readonly type: "string";
                        readonly description: "Buyer's physical address for shipping.";
                    };
                    readonly district: {
                        readonly type: "string";
                        readonly description: "Buyer's district for shipping.";
                    };
                    readonly city: {
                        readonly type: "string";
                        readonly description: "Buyer's city for shipping.";
                    };
                    readonly state: {
                        readonly type: "string";
                        readonly description: "Buyer's state for shipping.";
                    };
                    readonly postcode: {
                        readonly type: "string";
                        readonly description: "Buyer's postcode for shipping.";
                    };
                    readonly country: {
                        readonly type: "string";
                        readonly description: "Buyer's country for shipping.";
                    };
                };
            };
        };
        readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
    };
    readonly metadata: {
        readonly allOf: readonly [{
            readonly type: "object";
            readonly properties: {
                readonly id: {
                    readonly type: "string";
                    readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
                    readonly description: "Specify the order ID to retrieve the order.";
                };
            };
            readonly required: readonly ["id"];
        }];
    };
    readonly response: {
        readonly "200": {
            readonly title: "Order";
            readonly type: "object";
            readonly description: "Order model.";
            readonly properties: {
                readonly id: {
                    readonly type: "string";
                    readonly description: "The ID of the order.";
                };
                readonly status: {
                    readonly type: "string";
                    readonly enum: readonly ["fulfilled", "unfulfilled"];
                    readonly description: "Current fulfillment status of the order.\n\n`fulfilled` `unfulfilled`";
                };
                readonly paymentStatus: {
                    readonly type: "string";
                    readonly description: "Current payment status of the order (Currently only paid orders are in scope, unpaid is reserved for future use).\n\n`paid` `unpaid`";
                    readonly enum: readonly ["paid", "unpaid"];
                };
                readonly installments: {
                    readonly type: "boolean";
                    readonly description: "Returns true if the payment is done in installments.";
                };
                readonly dateCreated: {
                    readonly type: "string";
                    readonly description: "The date and time for the creation of the order. yyyy-MM-ddTHH:mm:ssZ format is used (e.g., 2022-07-21T13:24:51+0300).";
                };
                readonly currency: {
                    readonly type: "string";
                    readonly enum: readonly ["TRY", "USD", "EUR"];
                    readonly description: "Currency of the order.\n\n`TRY` `USD` `EUR`";
                };
                readonly paymentMethod: {
                    readonly type: "string";
                    readonly enum: readonly ["debitCard", "creditCard"];
                    readonly description: "Buyer's method of payment.\n\n`debitCard` `creditCard`";
                };
                readonly totals: {
                    readonly type: "object";
                    readonly description: "The total amounts for all order line items.";
                    readonly properties: {
                        readonly subtotal: {
                            readonly type: "string";
                            readonly description: "Subtotal amount for all the products and/or services sold.";
                        };
                        readonly shipping: {
                            readonly type: "string";
                            readonly description: "Shipping amount of the order.";
                        };
                        readonly discount: {
                            readonly type: "string";
                            readonly description: "Discount amount of the order.";
                        };
                        readonly total: {
                            readonly type: "string";
                            readonly description: "Grand total amount of the order.";
                        };
                    };
                };
                readonly discounts: {
                    readonly type: "array";
                    readonly description: "Details of the discounts applied.";
                    readonly items: {
                        readonly type: "object";
                        readonly properties: {
                            readonly id: {
                                readonly type: "string";
                                readonly description: "The ID of the discount.";
                            };
                            readonly method: {
                                readonly type: "string";
                                readonly enum: readonly ["discountCode", "automaticDiscount"];
                                readonly description: "Discount method.\n\n`discountCode` `automaticDiscount`";
                            };
                        };
                    };
                };
                readonly shippingInfo: {
                    readonly type: "object";
                    readonly description: "Buyer's shipping address and details.";
                    readonly properties: {
                        readonly firstName: {
                            readonly type: "string";
                            readonly description: "Buyer's first name for shipping.";
                        };
                        readonly lastName: {
                            readonly type: "string";
                            readonly description: "Buyer's last name for shipping.";
                        };
                        readonly nationalId: {
                            readonly type: "string";
                            readonly description: "Buyer's national identification number for shipping.";
                        };
                        readonly email: {
                            readonly type: "string";
                            readonly description: "Buyer's email address for shipping.";
                        };
                        readonly phone: {
                            readonly type: "string";
                            readonly description: "Buyer's phone number for shipping.";
                        };
                        readonly company: {
                            readonly type: "string";
                            readonly description: "Buyer company's name for shipping.";
                        };
                        readonly address: {
                            readonly type: "string";
                            readonly description: "Buyer's physical address for shipping.";
                        };
                        readonly district: {
                            readonly type: "string";
                            readonly description: "Buyer's district for shipping.";
                        };
                        readonly city: {
                            readonly type: "string";
                            readonly description: "Buyer's city for shipping.";
                        };
                        readonly state: {
                            readonly type: "string";
                            readonly description: "Buyer's state for shipping.";
                        };
                        readonly postcode: {
                            readonly type: "string";
                            readonly description: "Buyer's postcode for shipping.";
                        };
                        readonly country: {
                            readonly type: "string";
                            readonly description: "Buyer's country for shipping.";
                        };
                    };
                };
                readonly billingInfo: {
                    readonly type: "object";
                    readonly description: "Buyer's billing address and details. Separate billing information can only be present if the seller uses a special purpose app to collect this information. ";
                    readonly properties: {
                        readonly firstName: {
                            readonly type: "string";
                            readonly description: "Buyer's first name for billing.";
                        };
                        readonly lastName: {
                            readonly type: "string";
                            readonly description: "Buyer's last name for billing.";
                        };
                        readonly nationalId: {
                            readonly type: "string";
                            readonly description: "Buyer's national identification number for billing.";
                        };
                        readonly email: {
                            readonly type: "string";
                            readonly description: "Buyer's email address for billing.";
                        };
                        readonly phone: {
                            readonly type: "string";
                            readonly description: "Buyer's phone number for billing.";
                        };
                        readonly company: {
                            readonly type: "string";
                            readonly description: "Buyer company's name for billing.";
                        };
                        readonly taxOffice: {
                            readonly type: "string";
                            readonly description: "Buyer company's tax office name for billing.";
                        };
                        readonly taxNumber: {
                            readonly type: "string";
                            readonly description: "Buyer company's tax number for billing.";
                        };
                        readonly address: {
                            readonly type: "string";
                            readonly description: "Buyer's physical address for billing.";
                        };
                        readonly district: {
                            readonly type: "string";
                            readonly description: "Buyer's district for billing.";
                        };
                        readonly city: {
                            readonly type: "string";
                            readonly description: "Buyer's city for billing.";
                        };
                        readonly state: {
                            readonly type: "string";
                            readonly description: "Buyer's state for billing.";
                        };
                        readonly postcode: {
                            readonly type: "string";
                            readonly description: "Buyer's postcode for billing.";
                        };
                        readonly country: {
                            readonly type: "string";
                            readonly description: "Buyer's country for billing.";
                        };
                    };
                };
                readonly note: {
                    readonly type: "string";
                    readonly description: "Buyer's order note.";
                };
                readonly lineItems: {
                    readonly type: "array";
                    readonly description: "Order line items for all the products and/or services sold.";
                    readonly items: {
                        readonly type: "object";
                        readonly properties: {
                            readonly productId: {
                                readonly type: "string";
                                readonly description: "The ID of the product.";
                            };
                            readonly title: {
                                readonly type: "string";
                                readonly description: "The title of the product.";
                            };
                            readonly type: {
                                readonly type: "string";
                                readonly description: "The type of the product.\n\n`physical` `digital`";
                                readonly enum: readonly ["physical", "digital"];
                            };
                            readonly selection: {
                                readonly type: "array";
                                readonly description: "Selection details of the product sold.";
                                readonly items: {
                                    readonly type: "object";
                                    readonly properties: {
                                        readonly id: {
                                            readonly type: "string";
                                            readonly description: "The ID of the product's selection, a subset of product's variation.";
                                        };
                                        readonly title: {
                                            readonly type: "string";
                                            readonly description: "The title of the product's selection, a subset of product's variation.";
                                        };
                                        readonly variationTitle: {
                                            readonly type: "string";
                                            readonly description: "The title of the main product variation.";
                                        };
                                    };
                                };
                            };
                            readonly options: {
                                readonly type: "array";
                                readonly description: "Option details of the product.";
                                readonly items: {
                                    readonly type: "object";
                                    readonly properties: {
                                        readonly id: {
                                            readonly type: "string";
                                            readonly description: "The ID of the product's option.";
                                        };
                                        readonly title: {
                                            readonly type: "string";
                                            readonly description: "The title of the product's option.";
                                        };
                                    };
                                };
                            };
                            readonly quantity: {
                                readonly type: "integer";
                                readonly description: "Quantity ordered.";
                            };
                            readonly price: {
                                readonly type: "string";
                                readonly description: "Unit price of the product.";
                            };
                            readonly total: {
                                readonly type: "string";
                                readonly description: "Total price of the order line item.";
                            };
                        };
                    };
                };
                readonly fulfillments: {
                    readonly type: "array";
                    readonly description: "Details of the order fulfillments. Direction of fulfillments is seller to buyer.";
                    readonly items: {
                        readonly title: "Shipping";
                        readonly type: "object";
                        readonly description: "Shipping model.";
                        readonly properties: {
                            readonly orderId: {
                                readonly type: "string";
                                readonly description: "The ID of the order.";
                            };
                            readonly status: {
                                readonly type: "string";
                                readonly enum: readonly ["shipped", "notShipped"];
                                readonly description: "Current status of the shipping.\n\n`shipped` `notShipped`";
                            };
                            readonly method: {
                                readonly type: "string";
                                readonly enum: readonly ["standard", "contracted"];
                                readonly description: "Method of the shipping.\n\n`standard` `contracted`";
                            };
                            readonly type: {
                                readonly type: "string";
                                readonly enum: readonly ["firstShipment", "secondShipment", "returnShipment"];
                                readonly description: "Type of the shipping. firstShipment and secondShipment are used for seller to buyer direction, returnShipment is used for buyer to seller direction.\n\n`firstShipment` `secondShipment` `returnShipment`";
                            };
                            readonly dateCreated: {
                                readonly type: "string";
                                readonly description: "For standard shipping, this is the date and time of the order closure. For contracted shipping, this is the date and time for the creation of the shipping code. yyyy-MM-ddTHH:mm:ssZ format is used (e.g., 2022-07-21T13:24:51+0300).";
                            };
                            readonly dateDispatched: {
                                readonly type: "string";
                                readonly description: "The date and time of the initial dispatch. It is provided by the shipping company and only present for contracted shipping. yyyy-MM-ddTHH:mm:ssZ format is used (e.g., 2022-07-21T13:24:51+0300).";
                            };
                            readonly company: {
                                readonly type: "string";
                                readonly enum: readonly ["yurtici", "mng", "ptt", "aras", "surat", "ups", "fedex", "dhl", "tnt", "pts", "aramex", "interGlobal", "other"];
                                readonly description: "Shipping company.\n\n`yurtici` `mng` `ptt` `aras` `surat` `ups` `fedex` `dhl` `tnt` `pts` `aramex` `interGlobal` `other`";
                            };
                            readonly code: {
                                readonly type: "string";
                                readonly description: "Generated shipping code. ";
                            };
                            readonly trackingNumber: {
                                readonly type: "string";
                                readonly description: "Tracking number of the shipping. For standard shipping, it is provided by the seller while closing the order. For contracted shipping, it is provided by the shipping company with the initial dispatch. ";
                            };
                            readonly trackingUrl: {
                                readonly type: "string";
                                readonly description: "Tracking URL of the shipping. It is provided by the shipping company and only present for contracted shipping.";
                            };
                            readonly size: {
                                readonly type: "string";
                                readonly description: "Size of the shipping load. It is provided by some of the shipping companies and only present for contracted shipping.";
                            };
                            readonly sizeUnit: {
                                readonly type: "string";
                                readonly description: "Size unit of the shipping load. It is provided by some of the shipping companies and only present for contracted shipping.\n\n`deci`";
                                readonly enum: readonly ["deci"];
                            };
                            readonly weight: {
                                readonly type: "string";
                                readonly description: "Weight of the shipping load. It is provided by some of the shipping companies and only present for contracted shipping.";
                            };
                            readonly weightUnit: {
                                readonly type: "string";
                                readonly description: "Weight unit of the shipping load. It is provided by some of the shipping companies and only present for contracted shipping.\n\n`gram` `kilogram`";
                                readonly enum: readonly ["gram", "kilogram"];
                            };
                            readonly cost: {
                                readonly type: "string";
                                readonly description: "Cost of the shipping. It is provided by the shipping company and only present for contracted shipping.";
                            };
                            readonly currency: {
                                readonly type: "string";
                                readonly enum: readonly ["TRY", "USD", "EUR"];
                                readonly description: "Currency of the shipping cost. It is provided by the shipping company and only present for contracted shipping.\n\n`TRY` `USD` `EUR`";
                            };
                        };
                    };
                };
                readonly returns: {
                    readonly type: "array";
                    readonly description: "Details of the order returns. Direction of returns is buyer to seller.";
                    readonly items: {
                        readonly title: "Shipping";
                        readonly type: "object";
                        readonly description: "Shipping model.";
                        readonly properties: {
                            readonly orderId: {
                                readonly type: "string";
                                readonly description: "The ID of the order.";
                            };
                            readonly status: {
                                readonly type: "string";
                                readonly enum: readonly ["shipped", "notShipped"];
                                readonly description: "Current status of the shipping.\n\n`shipped` `notShipped`";
                            };
                            readonly method: {
                                readonly type: "string";
                                readonly enum: readonly ["standard", "contracted"];
                                readonly description: "Method of the shipping.\n\n`standard` `contracted`";
                            };
                            readonly type: {
                                readonly type: "string";
                                readonly enum: readonly ["firstShipment", "secondShipment", "returnShipment"];
                                readonly description: "Type of the shipping. firstShipment and secondShipment are used for seller to buyer direction, returnShipment is used for buyer to seller direction.\n\n`firstShipment` `secondShipment` `returnShipment`";
                            };
                            readonly dateCreated: {
                                readonly type: "string";
                                readonly description: "For standard shipping, this is the date and time of the order closure. For contracted shipping, this is the date and time for the creation of the shipping code. yyyy-MM-ddTHH:mm:ssZ format is used (e.g., 2022-07-21T13:24:51+0300).";
                            };
                            readonly dateDispatched: {
                                readonly type: "string";
                                readonly description: "The date and time of the initial dispatch. It is provided by the shipping company and only present for contracted shipping. yyyy-MM-ddTHH:mm:ssZ format is used (e.g., 2022-07-21T13:24:51+0300).";
                            };
                            readonly company: {
                                readonly type: "string";
                                readonly enum: readonly ["yurtici", "mng", "ptt", "aras", "surat", "ups", "fedex", "dhl", "tnt", "pts", "aramex", "interGlobal", "other"];
                                readonly description: "Shipping company.\n\n`yurtici` `mng` `ptt` `aras` `surat` `ups` `fedex` `dhl` `tnt` `pts` `aramex` `interGlobal` `other`";
                            };
                            readonly code: {
                                readonly type: "string";
                                readonly description: "Generated shipping code. ";
                            };
                            readonly trackingNumber: {
                                readonly type: "string";
                                readonly description: "Tracking number of the shipping. For standard shipping, it is provided by the seller while closing the order. For contracted shipping, it is provided by the shipping company with the initial dispatch. ";
                            };
                            readonly trackingUrl: {
                                readonly type: "string";
                                readonly description: "Tracking URL of the shipping. It is provided by the shipping company and only present for contracted shipping.";
                            };
                            readonly size: {
                                readonly type: "string";
                                readonly description: "Size of the shipping load. It is provided by some of the shipping companies and only present for contracted shipping.";
                            };
                            readonly sizeUnit: {
                                readonly type: "string";
                                readonly description: "Size unit of the shipping load. It is provided by some of the shipping companies and only present for contracted shipping.\n\n`deci`";
                                readonly enum: readonly ["deci"];
                            };
                            readonly weight: {
                                readonly type: "string";
                                readonly description: "Weight of the shipping load. It is provided by some of the shipping companies and only present for contracted shipping.";
                            };
                            readonly weightUnit: {
                                readonly type: "string";
                                readonly description: "Weight unit of the shipping load. It is provided by some of the shipping companies and only present for contracted shipping.\n\n`gram` `kilogram`";
                                readonly enum: readonly ["gram", "kilogram"];
                            };
                            readonly cost: {
                                readonly type: "string";
                                readonly description: "Cost of the shipping. It is provided by the shipping company and only present for contracted shipping.";
                            };
                            readonly currency: {
                                readonly type: "string";
                                readonly enum: readonly ["TRY", "USD", "EUR"];
                                readonly description: "Currency of the shipping cost. It is provided by the shipping company and only present for contracted shipping.\n\n`TRY` `USD` `EUR`";
                            };
                        };
                    };
                };
                readonly refunds: {
                    readonly type: "array";
                    readonly description: "Details of the refunds issued.";
                    readonly items: {
                        readonly type: "object";
                        readonly properties: {
                            readonly id: {
                                readonly type: "string";
                                readonly description: "The ID of the refund.";
                            };
                            readonly type: {
                                readonly type: "string";
                                readonly enum: readonly ["full", "partial"];
                                readonly description: "The type of the refund.\n\n`full` `partial`";
                            };
                            readonly status: {
                                readonly type: "string";
                                readonly enum: readonly ["pending", "failed", "succeeded"];
                                readonly description: "Current status of the refund.\n\n`pending` `failed` `succeeded`";
                            };
                            readonly dateCreated: {
                                readonly type: "string";
                                readonly description: "The date and time for the creation of the refund request. yyyy-MM-ddTHH:mm:ssZ format is used (e.g., 2022-07-21T13:24:51+0300).";
                            };
                            readonly dateRefunded: {
                                readonly type: "string";
                                readonly description: "The date and time for the actual refund transaction submitted to the payment provider. yyyy-MM-ddTHH:mm:ssZ format is used (e.g., 2022-07-21T13:24:51+0300).";
                            };
                            readonly total: {
                                readonly type: "string";
                                readonly description: "Total amount of the refund.";
                            };
                        };
                    };
                };
            };
            readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
        };
    };
};
declare const PutProductsId: {
    readonly body: {
        readonly type: "object";
        readonly properties: {
            readonly title: {
                readonly type: "string";
                readonly description: "Title of the product.";
            };
            readonly description: {
                readonly type: "string";
                readonly description: "Detailed description of the product.";
            };
            readonly type: {
                readonly type: "string";
                readonly enum: readonly ["physical", "digital"];
                readonly description: "Type of the product.";
            };
            readonly media: {
                readonly type: "array";
                readonly description: "Details of product media files. There can be a maximum of 5 media files.";
                readonly items: {
                    readonly type: "object";
                    readonly properties: {
                        readonly type: {
                            readonly type: "string";
                            readonly enum: readonly ["image"];
                            readonly description: "Type of media file.";
                        };
                        readonly url: {
                            readonly type: "string";
                            readonly description: "he URL of media file. Formats supported: jpg, jpeg, png, bmp.";
                        };
                        readonly placement: {
                            readonly type: "integer";
                            readonly minimum: 1;
                            readonly maximum: 5;
                            readonly multipleOf: 1;
                            readonly description: "Ranking of the media file in product pages. Send \"1\" for the primary media file.";
                        };
                    };
                };
            };
            readonly priceData: {
                readonly type: "object";
                readonly description: "Details of the price information.";
                readonly properties: {
                    readonly price: {
                        readonly type: "string";
                        readonly description: "Unit price of the product.";
                    };
                    readonly discount: {
                        readonly type: "boolean";
                        readonly description: "Represents whether there is a product based discount.";
                    };
                    readonly discountedPrice: {
                        readonly type: "string";
                        readonly description: "Discounted price of the product.";
                    };
                    readonly shippingPrice: {
                        readonly type: "string";
                        readonly description: "Shipping price of the product.";
                    };
                };
            };
            readonly stockQuantity: {
                readonly type: "integer";
                readonly description: "Stock quantity of the product.";
            };
            readonly shippingPayer: {
                readonly type: "string";
                readonly enum: readonly ["sellerPays", "buyerPays"];
                readonly description: "Represents who pays for shipping during dispatch or delivery.";
            };
            readonly categories: {
                readonly type: "array";
                readonly description: "List of categories that product belongs to.";
                readonly items: {
                    readonly type: "object";
                    readonly properties: {
                        readonly categoryId: {
                            readonly type: "string";
                            readonly description: "The ID of category.";
                        };
                    };
                };
            };
            readonly variants: {
                readonly type: "array";
                readonly description: "List of variants of the product.";
                readonly items: {
                    readonly type: "object";
                    readonly properties: {
                        readonly selectionId: {
                            readonly type: "array";
                            readonly description: "The ID of selection.";
                            readonly items: {
                                readonly type: "string";
                            };
                        };
                        readonly stockQuantity: {
                            readonly type: "integer";
                            readonly description: "Stock quantity of the variant.";
                        };
                        readonly media: {
                            readonly type: "array";
                            readonly description: "Details of variant media files. Currently there can be a maximum of 1 media file.";
                            readonly items: {
                                readonly type: "object";
                                readonly properties: {
                                    readonly type: {
                                        readonly type: "string";
                                        readonly enum: readonly ["image"];
                                        readonly description: "Type of media file.";
                                    };
                                    readonly url: {
                                        readonly type: "string";
                                        readonly description: "The URL of media file. Formats supported: jpg, jpeg, png, bmp.";
                                    };
                                };
                            };
                        };
                        readonly priceData: {
                            readonly type: "object";
                            readonly description: "Details of the price information for the variant.";
                            readonly properties: {
                                readonly currency: {
                                    readonly type: "string";
                                    readonly description: "Currency of the variant.";
                                    readonly enum: readonly ["TRY", "USD", "EUR"];
                                };
                                readonly price: {
                                    readonly type: "string";
                                    readonly description: "Unit price of the variant.";
                                };
                            };
                        };
                        readonly primary: {
                            readonly type: "boolean";
                            readonly description: "Represents the primary variant. Only one variant can be primary.";
                        };
                    };
                };
            };
            readonly options: {
                readonly type: "array";
                readonly description: "List of options of the product. There can be a maximum of 3 options.";
                readonly items: {
                    readonly type: "object";
                    readonly properties: {
                        readonly optionId: {
                            readonly type: "string";
                            readonly description: "The ID of option.";
                        };
                        readonly optionTitle: {
                            readonly type: "string";
                            readonly description: "The title of option.";
                        };
                        readonly optionPrice: {
                            readonly type: "string";
                            readonly description: "The price of option.";
                        };
                    };
                };
            };
            readonly singleOption: {
                readonly type: "boolean";
                readonly description: "Represents whether a single option or multiple options can be selected during chekout.";
            };
            readonly customListing: {
                readonly type: "boolean";
                readonly description: "Represents whether the listing is a custom or standard one.";
            };
            readonly customNote: {
                readonly type: "string";
                readonly description: "Overrides the placeholder for note to seller field. Used for collecting a custom information from the buyer during checkout.";
            };
            readonly placementScore: {
                readonly type: "integer";
                readonly minimum: 1;
                readonly description: "Placement score of the product. Products with higher values are placed first in the store.";
            };
            readonly dispatchDuration: {
                readonly type: "integer";
                readonly minimum: 1;
                readonly maximum: 3;
                readonly multipleOf: 1;
                readonly description: "Dispatch duration in terms of days from seller to shipping company.";
            };
        };
        readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
    };
    readonly metadata: {
        readonly allOf: readonly [{
            readonly type: "object";
            readonly properties: {
                readonly id: {
                    readonly type: "string";
                    readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
                    readonly description: "Specify the product ID to retrieve the product.";
                };
            };
            readonly required: readonly ["id"];
        }];
    };
    readonly response: {
        readonly "200": {
            readonly title: "Product";
            readonly type: "object";
            readonly description: "Product model.";
            readonly properties: {
                readonly id: {
                    readonly type: "string";
                    readonly description: "The ID of the product.";
                };
                readonly title: {
                    readonly type: "string";
                    readonly description: "Title of the product.";
                };
                readonly description: {
                    readonly type: "string";
                    readonly description: "Detailed description of the product.";
                };
                readonly type: {
                    readonly type: "string";
                    readonly enum: readonly ["physical", "digital"];
                    readonly description: "Type of the product.\n\n`physical` `digital`";
                };
                readonly dateCreated: {
                    readonly type: "string";
                    readonly description: "The date and time of the initial product listing. yyyy-MM-ddTHH:mm:ssZ format is used (e.g., 2022-07-21T13:24:51+0300).";
                };
                readonly dateUpdated: {
                    readonly type: "string";
                    readonly description: "The date and time of the product update. yyyy-MM-ddTHH:mm:ssZ format is used (e.g., 2022-07-21T13:24:51+0300).";
                };
                readonly url: {
                    readonly type: "string";
                    readonly description: "The URL of the product. \n(e.g., https://www.shopier.com/696547)";
                };
                readonly media: {
                    readonly type: "array";
                    readonly description: "Details of product media files.";
                    readonly items: {
                        readonly type: "object";
                        readonly properties: {
                            readonly id: {
                                readonly type: "string";
                                readonly description: "The ID of media file.";
                            };
                            readonly type: {
                                readonly type: "string";
                                readonly enum: readonly ["image"];
                                readonly description: "Type of media file.\n\n`image`";
                            };
                            readonly url: {
                                readonly type: "string";
                                readonly description: "The URL of media file.\n(e.g., https://dmih5ui1qqea9.cloudfront.net/pictures_large/Camiseta6855_cobalt-blue-t-shirt.jpg)";
                            };
                            readonly placement: {
                                readonly type: "integer";
                                readonly description: "Ranking of the media file in product pages. Returns \"1\" for the primary media file.";
                                readonly minimum: 1;
                                readonly multipleOf: 1;
                                readonly maximum: 5;
                            };
                        };
                    };
                };
                readonly priceData: {
                    readonly type: "object";
                    readonly description: "Details of the price information.";
                    readonly properties: {
                        readonly currency: {
                            readonly type: "string";
                            readonly enum: readonly ["TRY", "USD", "EUR"];
                            readonly description: "Currency of the product.\n\n`TRY` `USD` `EUR`";
                        };
                        readonly price: {
                            readonly type: "string";
                            readonly description: "Unit price of the product.";
                        };
                        readonly discount: {
                            readonly type: "boolean";
                            readonly description: "Represents whether there is a product based discount.";
                        };
                        readonly discountedPrice: {
                            readonly type: "string";
                            readonly description: "Discounted price of the product.";
                        };
                        readonly shippingPrice: {
                            readonly type: "string";
                            readonly description: "Shipping price of the product.";
                        };
                    };
                };
                readonly stockStatus: {
                    readonly type: "string";
                    readonly enum: readonly ["inStock", "outOfStock"];
                    readonly description: "Current stock status of the product.\n\n`inStock` `outOfStock`";
                };
                readonly stockQuantity: {
                    readonly type: "integer";
                    readonly description: "Current stock quantity of the product.";
                };
                readonly shippingPayer: {
                    readonly type: "string";
                    readonly enum: readonly ["sellerPays", "buyerPays"];
                    readonly description: "Represents who pays for shipping during dispatch or delivery.\n\n`sellerPays` `buyerPays`";
                };
                readonly categories: {
                    readonly type: "array";
                    readonly description: "List of categories that product belongs to.";
                    readonly items: {
                        readonly type: "object";
                        readonly properties: {
                            readonly id: {
                                readonly type: "string";
                                readonly description: "The ID of category.";
                            };
                            readonly title: {
                                readonly type: "string";
                                readonly description: "The title of category.";
                            };
                        };
                    };
                };
                readonly variants: {
                    readonly type: "array";
                    readonly description: "List of variants of the product.";
                    readonly items: {
                        readonly type: "object";
                        readonly properties: {
                            readonly variationId: {
                                readonly type: "array";
                                readonly description: "The ID of variation.";
                                readonly items: {
                                    readonly type: "string";
                                };
                            };
                            readonly variationTitle: {
                                readonly type: "array";
                                readonly description: "The title of variation.";
                                readonly items: {
                                    readonly type: "string";
                                };
                            };
                            readonly selectionId: {
                                readonly type: "array";
                                readonly description: "The ID of selection.";
                                readonly items: {
                                    readonly type: "string";
                                };
                            };
                            readonly selectionTitle: {
                                readonly type: "array";
                                readonly description: "The title of selection.";
                                readonly items: {
                                    readonly type: "string";
                                };
                            };
                            readonly stockStatus: {
                                readonly type: "string";
                                readonly enum: readonly ["inStock", "outOfStock"];
                                readonly description: "Current stock status of the variant.\n\n`inStock` `outOfStock`";
                            };
                            readonly stockQuantity: {
                                readonly type: "integer";
                                readonly description: "Current stock quantity of the variant.";
                            };
                            readonly media: {
                                readonly type: "array";
                                readonly description: "Details of variant media files. Currently variant has a maximum of one media file.";
                                readonly items: {
                                    readonly type: "object";
                                    readonly properties: {
                                        readonly id: {
                                            readonly type: "string";
                                            readonly description: "The ID of media file.";
                                        };
                                        readonly type: {
                                            readonly type: "string";
                                            readonly enum: readonly ["image"];
                                            readonly description: "Type of media file.\n\n`image`";
                                        };
                                        readonly url: {
                                            readonly type: "string";
                                            readonly description: "The URL of media file.\n(e.g., https://dmih5ui1qqea9.cloudfront.net/pictures_large/Camiseta6855_cobalt-blue-t-shirt.jpg)";
                                        };
                                    };
                                };
                            };
                            readonly priceData: {
                                readonly type: "object";
                                readonly description: "Details of the price information for the variant.";
                                readonly properties: {
                                    readonly currency: {
                                        readonly type: "string";
                                        readonly enum: readonly ["TRY", "USD", "EUR"];
                                        readonly description: "Currency of the variant.\n\n`TRY` `USD` `EUR`";
                                    };
                                    readonly price: {
                                        readonly type: "string";
                                        readonly description: "Unit price of the variant.";
                                    };
                                };
                            };
                            readonly primary: {
                                readonly type: "boolean";
                                readonly description: "Represents the primary variant. Only one variant can be primary.";
                            };
                        };
                    };
                };
                readonly options: {
                    readonly type: "array";
                    readonly description: "List of options of the product.";
                    readonly items: {
                        readonly type: "object";
                        readonly properties: {
                            readonly id: {
                                readonly type: "string";
                                readonly description: "The ID of option.";
                            };
                            readonly title: {
                                readonly type: "string";
                                readonly description: "The title of option.";
                            };
                            readonly price: {
                                readonly type: "string";
                                readonly description: "The price of option.";
                            };
                        };
                    };
                };
                readonly singleOption: {
                    readonly type: "boolean";
                    readonly description: "Represents whether a single option or multiple options can be selected during chekout.";
                };
                readonly customListing: {
                    readonly type: "boolean";
                    readonly description: "Represents whether the listing is a custom or standard one.";
                };
                readonly customNote: {
                    readonly type: "string";
                    readonly description: "Overrides the placeholder for note to seller field. Used for collecting a custom information from the buyer during checkout.";
                };
                readonly placementScore: {
                    readonly type: "integer";
                    readonly minimum: 1;
                    readonly multipleOf: 1;
                    readonly description: "Placement score of the product. Products with higher values are placed first in the store.";
                };
                readonly dispatchDuration: {
                    readonly type: "integer";
                    readonly minimum: 1;
                    readonly maximum: 3;
                    readonly multipleOf: 1;
                    readonly description: "Dispatch duration in terms of days from seller to shipping company.";
                };
            };
            readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
        };
    };
};
declare const PutSelectionsId: {
    readonly body: {
        readonly type: "object";
        readonly properties: {
            readonly title: {
                readonly type: "string";
                readonly description: "The title of the product selection, a subset of product variation.";
            };
        };
        readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
    };
    readonly metadata: {
        readonly allOf: readonly [{
            readonly type: "object";
            readonly properties: {
                readonly id: {
                    readonly type: "string";
                    readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
                    readonly description: "Specify the selection ID to retrieve the selection.";
                };
            };
            readonly required: readonly ["id"];
        }];
    };
    readonly response: {
        readonly "200": {
            readonly title: "Selection";
            readonly type: "object";
            readonly description: "Selection model.";
            readonly properties: {
                readonly id: {
                    readonly type: "string";
                    readonly description: "The ID of the product selection, a subset of product variation.";
                };
                readonly title: {
                    readonly type: "string";
                    readonly description: "The title of the product selection, a subset of product variation.";
                };
                readonly variationId: {
                    readonly type: "string";
                    readonly description: "The ID of the related product variation.";
                };
            };
            readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
        };
    };
};
declare const PutShopSettings: {
    readonly body: {
        readonly type: "object";
        readonly properties: {
            readonly title: {
                readonly type: "string";
                readonly description: "Title of the shop. This the brief heading located at the shop's main page.";
            };
            readonly slogan: {
                readonly type: "string";
                readonly description: "Slogan or catchword located at the shop's main page.";
            };
            readonly announcement: {
                readonly type: "string";
                readonly description: "Announcement to buyers located at the shop's main page.";
            };
            readonly confirmation: {
                readonly type: "string";
                readonly description: "Order confirmation text. Is shown to buyers when an order is created after a successful payment.";
            };
            readonly email: {
                readonly type: "string";
                readonly description: "Email address located at the shop's main page. This can be different than the seller account's email.";
            };
            readonly phone: {
                readonly type: "string";
                readonly description: "Phone number located at the shop's main page. This can be different than the seller account's phone number.";
            };
            readonly access: {
                readonly type: "boolean";
                readonly description: "Represents whether the shop URL is publicly accessible.";
            };
            readonly cart: {
                readonly type: "boolean";
                readonly description: "Represents whether the shopping cart is used during checkouts. If the cart value is FALSE multiple products can not be purchased at the shop, only a single product can be purchased for each order.";
            };
            readonly mobileView: {
                readonly type: "string";
                readonly description: "Shop's appearance for mobile devices. Products can be placed either on a single column or on double columns.";
            };
            readonly filter: {
                readonly type: "boolean";
                readonly description: "Represents whether the product filter options are present or not.";
            };
            readonly stockOutProducts: {
                readonly type: "boolean";
                readonly description: "Represents whether the out of stock products are shown to buyers.";
            };
            readonly language: {
                readonly type: "string";
                readonly description: "Language selection of the shop.";
            };
            readonly vacation: {
                readonly type: "boolean";
                readonly description: "Represents whether the seller accepts orders. TRUE if the shop is closed for orders, FALSE if the shop is open for orders.";
            };
        };
        readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
    };
    readonly response: {
        readonly "200": {
            readonly title: "ShopSetting";
            readonly type: "object";
            readonly description: "Shop setting model.";
            readonly properties: {
                readonly name: {
                    readonly type: "string";
                    readonly description: "Name of the shop. This is the unique variable that appears at the end of the URL of the shop.";
                };
                readonly url: {
                    readonly type: "string";
                    readonly description: "URL of the shop.\n(e.g., https://www.shopier.com/tshirtshop)";
                };
                readonly title: {
                    readonly type: "string";
                    readonly description: "Title of the shop. This the brief heading located at the shop's main page.";
                };
                readonly slogan: {
                    readonly type: "string";
                    readonly description: "Slogan or catchword located at the shop's main page.";
                };
                readonly announcement: {
                    readonly type: "string";
                    readonly description: "Announcement to buyers located at the shop's main page.";
                };
                readonly confirmation: {
                    readonly type: "string";
                    readonly description: "Order confirmation text. Is shown to buyers when an order is created after a successful payment.";
                };
                readonly email: {
                    readonly type: "string";
                    readonly description: "Email address located at the shop's main page. This can be different than the shop owner's email.";
                };
                readonly phone: {
                    readonly type: "string";
                    readonly description: "Phone number located at the shop's main page. This can be different than the shop owner's phone number.";
                };
                readonly access: {
                    readonly type: "boolean";
                    readonly description: "Represents whether the shop URL is publicly accessible.";
                };
                readonly cart: {
                    readonly type: "boolean";
                    readonly description: "Represents whether the shopping cart is used during checkouts. If the cart value is FALSE multiple products can not be purchased at the shop, only a single product can be purchased for each order.";
                };
                readonly mobileView: {
                    readonly type: "string";
                    readonly enum: readonly ["singleColumn", "doubleColumn"];
                    readonly description: "Shop's appearance for mobile devices. Products can be placed either on a single column or on double columns.\n\n`singleColumn` `doubleColumn`";
                };
                readonly filter: {
                    readonly type: "boolean";
                    readonly description: "Represents whether the product filter options are present or not.";
                };
                readonly outOfStock: {
                    readonly type: "boolean";
                    readonly description: "Represents whether the out of stock products are shown to buyers.";
                };
                readonly language: {
                    readonly type: "string";
                    readonly enum: readonly ["TR", "EN"];
                    readonly description: "Language selection of the shop. \n\n`TR` `EN`";
                };
                readonly vacation: {
                    readonly type: "boolean";
                    readonly description: "Represents whether the seller accepts orders. Returns TRUE if the shop is closed for orders, returns FALSE if the shop is open for orders.";
                };
            };
            readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
        };
    };
};
declare const PutVariationsId: {
    readonly body: {
        readonly type: "object";
        readonly properties: {
            readonly title: {
                readonly type: "string";
                readonly description: "The title of the product variation.";
            };
        };
        readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
    };
    readonly metadata: {
        readonly allOf: readonly [{
            readonly type: "object";
            readonly properties: {
                readonly id: {
                    readonly type: "string";
                    readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
                    readonly description: "Specify the variation ID to retrieve the variation.";
                };
            };
            readonly required: readonly ["id"];
        }];
    };
    readonly response: {
        readonly "200": {
            readonly title: "Variation";
            readonly type: "object";
            readonly description: "Variation model.";
            readonly properties: {
                readonly id: {
                    readonly type: "string";
                    readonly description: "The ID of the product variation.";
                };
                readonly title: {
                    readonly type: "string";
                    readonly description: "The title of the product variation.";
                };
                readonly placement: {
                    readonly type: "integer";
                    readonly minimum: 1;
                    readonly maximum: 2;
                    readonly multipleOf: 1;
                    readonly description: "Ranking of the product variation in the shop. Returns \"1\" for the first variation, returns \"2\" for the second variation.";
                };
            };
            readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
        };
    };
};
export { DeleteCategoriesId, DeleteDiscountsAutomaticId, DeleteDiscountsCodesId, DeleteProductsId, DeleteSelectionsId, DeleteShippingsCode, DeleteVariationsId, DeleteWebhooksId, GetBalance, GetBalanceTransactions, GetBalanceTransactionsOrderId, GetCategories, GetCategoriesId, GetDiscountsAutomatic, GetDiscountsAutomaticId, GetDiscountsCodes, GetDiscountsCodesId, GetOrders, GetOrdersId, GetOrdersTransactionsOrderId, GetPayouts, GetPayoutsId, GetPayoutsTransactionsId, GetProducts, GetProductsId, GetRefunds, GetRefundsId, GetSelections, GetSelectionsId, GetShippings, GetShippingsCode, GetShopOwner, GetShopSettings, GetVariations, GetVariationsId, GetWebhooks, PostCategories, PostDiscountsAutomatic, PostDiscountsCodes, PostProducts, PostRefunds, PostSelections, PostShippings, PostVariations, PostWebhooks, PutCategoriesId, PutDiscountsAutomaticId, PutDiscountsCodesId, PutOrdersId, PutProductsId, PutSelectionsId, PutShopSettings, PutVariationsId };

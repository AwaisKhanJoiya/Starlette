// Tranzila Payment Gateway Configuration
const takbullConfig = {
  // Terminal credentials (set these in .env file)
  takbullApiKey: process.env.TAKBULL_API_KEY || "",
  takbullApiSecret: process.env.TAKBULL_API_SECRET || "",

  // API URLs
  baseUrl: "https://api.takbull.co.il/api/ExtranalAPI",

  // Currency
  currency: "ILS",

  // Transaction modes
  dealTypes: {
    REGULAR: 1,
    PAYMENTS: 2, // (need to sent maxpayments)
    RECURRING: 4, // Subscriptions
  },

  // Response codes
  responseCodes: {
    SUCCESS: "000",
    GENERAL_ERROR: "001",
    CARD_DECLINED: "002",
    INVALID_CARD: "003",
    EXPIRED_CARD: "004",
    INSUFFICIENT_FUNDS: "005",
  },

  // Recurring payment settings
  recurring: {
    interval: {
      DAILY: 1,
      WEEKLY: 2,
      MONTHLY: 3,
      ANNUAL: 4,
      EACH_MONTH: 5,
    },
  },
};

export default takbullConfig;

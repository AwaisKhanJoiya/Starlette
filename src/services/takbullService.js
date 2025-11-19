import axios from "axios";
import takbullConfig from "@/lib/takbull";

class TakbullService {
  constructor() {
    this.config = takbullConfig;
  }

  /**
   * Build common parameters for Tranzila requests
   */
  buildBaseParams() {
    return {
      apiKey: this.config.takbullApiKey,
      apiSecret: this.config.takbullApiSecret,
      currency: this.config.currency,
    };
  }

  /**
   * Make API request to Tranzila
   */
  async makeRequest(path, body) {
    try {
      const response = await axios.post(this.config.baseUrl + path, body, {
        headers: {
          "Content-Type": "application/json",
          API_Secret: this.config.takbullApiSecret,
          API_Key: this.config.takbullApiKey,
        },
      });

      // Tranzila returns URL-encoded response

      return response.data;
    } catch (error) {
      console.error(
        "Takbull API error:",
        error.response?.data || error.message || error
      );
      throw new Error("Payment gateway communication error");
    }
  }

  /**
   * Process one-time payment for class packs
   */
  async processOneTimePayment(paymentData) {
    const { amount, order_reference } = paymentData;

    const body = {
      order_reference: order_reference,
      OrderTotalSum: 1,
      DealType: this.config.dealTypes.REGULAR,
      RedirectAddress: `${process.env.FRONTEND_URL}/success`,
      CancelReturnAddress: `${process.env.FRONTEND_URL}/pricing`,
      Language: "en",
    };

    const result = await this.makeRequest(
      "/GetTakbullPaymentPageRedirectUrl",
      body
    );

    return result;
  }

  /**
   * Setup recurring payment for subscriptions
   */
  async setupRecurringPayment(paymentData) {
    const { amount, order_reference } = paymentData;

    const frequencyType = this.config.recurring.interval.MONTHLY;

    const body = {
      order_reference: order_reference,
      OrderTotalSum: amount.toFixed(2),
      InitialAmount: amount.toFixed(2),
      DealType: this.config.dealTypes.RECURRING,
      RedirectAddress: "http://localhost:3000/success",
      CancelReturnAddress: "http://localhost:3000/cancel",
      RecuringInterval: frequencyType,
      Language: "en",
    };

    const result = await this.makeRequest(
      "/GetTakbullPaymentPageRedirectUrl",
      body
    );

    return result;
  }
}

const takbullService = new TakbullService();
export default takbullService;

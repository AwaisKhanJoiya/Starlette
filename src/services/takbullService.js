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
    const { amount } = paymentData;

    const params = {
      ...this.buildBaseParams(),
      tranmode: this.config.tranModes.VERIFY_AND_CHARGE,
      sum: amount.toFixed(2),
      ccno: cardNumber.replace(/\s/g, ""),
      mycvv: cvv,
      expmonth: expiryMonth.padStart(2, "0"),
      expyear: expiryYear,
      myid: cardHolderId,
      contact: cardHolderName,
      email: email,
      remarks: description || "Class Pack Purchase",
      fprefnum: invoiceNumber || "",
    };

    const result = await this.makeRequest(params);

    return {
      success: result.Response === this.config.responseCodes.SUCCESS,
      transactionId: result.index || "",
      confirmationCode: result.ConfirmationCode || "",
      responseCode: result.Response || "",
      responseMessage: getTranzilaResponseMessage(result.Response),
      rawResponse: result,
    };
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

  /**
   * Cancel recurring subscription
   */
  // async cancelRecurringPayment(subscriptionToken) {
  //   const params = {
  //     ...this.buildBaseParams(),
  //     tranmode: this.config.tranModes.CANCEL_RECURRING,
  //     TranzilaToken: subscriptionToken,
  //   };

  //   const result = await this.makeRequest(params);

  //   return {
  //     success: result.Response === this.config.responseCodes.SUCCESS,
  //     responseCode: result.Response || "",
  //     responseMessage: getTranzilaResponseMessage(result.Response),
  //     rawResponse: result,
  //   };
  // }

  /**
   * Query transaction status
   */
  // async queryTransaction(transactionId) {
  //   const params = {
  //     ...this.buildBaseParams(),
  //     tranmode: this.config.tranModes.QUERY,
  //     index: transactionId,
  //   };

  //   const result = await this.makeRequest(params);

  //   return {
  //     success: result.Response === this.config.responseCodes.SUCCESS,
  //     transaction: result,
  //     responseMessage: getTranzilaResponseMessage(result.Response),
  //   };
  // }

  /**
   * Process refund
   */
  // async processRefund(transactionId, amount) {
  //   const params = {
  //     ...this.buildBaseParams(),
  //     tranmode: this.config.tranModes.CREDIT_REFUND,
  //     index: transactionId,
  //     sum: amount.toFixed(2),
  //   };

  //   const result = await this.makeRequest(params);

  //   return {
  //     success: result.Response === this.config.responseCodes.SUCCESS,
  //     refundTransactionId: result.index || "",
  //     confirmationCode: result.ConfirmationCode || "",
  //     responseCode: result.Response || "",
  //     responseMessage: getTranzilaResponseMessage(result.Response),
  //     rawResponse: result,
  //   };
  // }
}

const takbullService = new TakbullService();
export default takbullService;

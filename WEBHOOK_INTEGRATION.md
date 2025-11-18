# Takbull Webhook Integration

## Overview

The webhook endpoint processes payment notifications from Takbull and automatically updates payment and subscription status in the database.

**Endpoint:** `POST /api/webhook`

---

## Webhook Data Structure

Takbull sends the following data structure:

```javascript
{
  Id: 1580619,                    // Takbull internal payment ID
  uniqId: 'ca16c2d8-...',         // Unique identifier
  OrderNumber: 41,                 // Order number
  order_reference: '691cbd85...', // Your order reference
  DealType: 4,                     // Deal type (1=one-time, 4=subscription)
  CustomerFullName: 'John Doe',   // Customer name
  CustomerEmail: null,             // Customer email
  CustomerPhone: null,             // Customer phone
  OrderStatus: 0,                  // Order status (0=success)
  StatusCode: 0,                   // Payment status (0=success)
  IsSubscriptionPayment: false,    // Boolean for subscription
  TransactionId: 876492,           // Transaction ID
  CustomerIdentity: '890108566',  // Customer ID number
  Token: 'Z1IvL0E3...',           // Token for recurring payments
  Cardtype: 'CAL',                 // Card type
  Last4Digs: '5614',              // Last 4 digits of card
  OrderTotalSum: 500,              // Payment amount

  // Subscription specific fields
  InitialRecuringPaymentStatusCode: 0,
  InitialRecuringPaymentDescription: null,
  SubscriptionStatusCode: 0,
  SubscriptionStatusDescription: null,
}
```

---

## Status Codes

### Payment Status Codes

- **0** = Success / Approved
- **Other values** = Failed

### Subscription Status Codes

- **0** = Active
- **1** = Cancelled
- **Other values** = Various states

---

## Webhook Processing Flow

### 1. One-Time Payment (Class Pack)

```
Webhook Received
    ↓
Parse webhook data
    ↓
Find payment by takbullUniqueId or metadata
    ↓
Update payment status (completed/failed)
    ↓
Store webhook data in payment record
    ↓
If failed: Mark associated class pack as expired
    ↓
Return 200 OK
```

**What Gets Updated:**

- ✅ Payment status
- ✅ Payment metadata (card info, customer info)
- ✅ Takbull response data
- ✅ Class pack status (if payment failed)

### 2. Subscription Payment (Recurring)

```
Webhook Received
    ↓
Parse webhook data
    ↓
Find payment by takbullUniqueId or metadata
    ↓
Update payment status (completed/failed)
    ↓
Find associated subscription
    ↓
If successful:
  - Activate subscription
  - Set billing dates
  - Update subscription token
    ↓
If failed:
  - Cancel subscription (if initial payment)
    ↓
Return 200 OK
```

**What Gets Updated:**

- ✅ Payment status
- ✅ Payment metadata
- ✅ Subscription status (pending → active)
- ✅ Subscription token
- ✅ Start date and next billing date
- ✅ Minimum commitment end date

---

## Database Updates

### Payment Updates

```javascript
{
  status: "completed" | "failed",
  takbullUniqueId: "ca16c2d8-...",
  metadata: {
    takbullId: 1580619,
    takbullTransactionId: 876492,
    orderNumber: 41,
    cardType: "CAL",
    last4Digits: "5614",
    customerName: "John Doe",
    customerIdentity: "890108566"
  },
  takbullResponse: {
    webhook: { /* full webhook data */ },
    webhookReceivedAt: "2025-11-18T..."
  }
}
```

### Subscription Updates (on successful payment)

```javascript
{
  status: "active",                           // Changed from "pending"
  takbullSubscriptionId: "Z1IvL0E3...",     // Payment token
  startDate: "2025-11-18T...",
  nextBillingDate: "2025-12-18T...",         // 1 month from start
  minimumCommitmentEndDate: "2026-02-18T..." // 3 months from start
}
```

---

## Configuration

### Webhook URL Setup

Register your webhook URL with Takbull:

```
https://yourdomain.com/api/webhook
```

### Security Considerations

1. **Always return 200 OK** - Even on errors, to prevent webhook retries
2. **Log all webhooks** - For debugging and audit trail
3. **Validate data** - Check for required fields
4. **Idempotent processing** - Handle duplicate webhooks gracefully

---

## Testing

### Test Webhook Locally

```bash
# Using curl
curl -X POST http://localhost:3000/api/webhook \
  -H "Content-Type: application/json" \
  -d '{
    "Id": 1580619,
    "uniqId": "test-unique-id",
    "OrderNumber": 1,
    "StatusCode": 0,
    "IsSubscriptionPayment": false,
    "TransactionId": 876492,
    "OrderTotalSum": 500
  }'
```

### Test One-Time Payment Success

```javascript
{
  "Id": 1580619,
  "uniqId": "test-classpack-success",
  "OrderNumber": 1,
  "StatusCode": 0,              // Success
  "OrderStatus": 0,
  "IsSubscriptionPayment": false,
  "TransactionId": 876492,
  "CustomerFullName": "Test User",
  "CustomerIdentity": "123456789",
  "Cardtype": "CAL",
  "Last4Digs": "1234",
  "OrderTotalSum": 450
}
```

### Test Subscription Success

```javascript
{
  "Id": 1580620,
  "uniqId": "test-subscription-success",
  "OrderNumber": 2,
  "StatusCode": 0,              // Success
  "OrderStatus": 0,
  "IsSubscriptionPayment": true,
  "TransactionId": 876493,
  "Token": "subscription-token-here",
  "InitialRecuringPaymentStatusCode": 0,
  "SubscriptionStatusCode": 0,
  "CustomerFullName": "Test User",
  "OrderTotalSum": 500
}
```

### Test Payment Failure

```javascript
{
  "Id": 1580621,
  "uniqId": "test-payment-failed",
  "OrderNumber": 3,
  "StatusCode": 2,              // Failed
  "OrderStatus": 2,
  "IsSubscriptionPayment": false,
  "TransactionId": 876494,
  "OrderTotalSum": 450
}
```

---

## Webhook Logs

All webhooks are logged with the following information:

```javascript
console.log("TAKBULL WEBHOOK RECEIVED:", {
  id: webhookData.Id,
  transactionId: webhookData.TransactionId,
  orderReference: webhookData.order_reference,
  status: webhookData.StatusCode,
  isSubscription: webhookData.IsSubscriptionPayment,
  amount: webhookData.OrderTotalSum,
});
```

---

## Error Handling

### Missing Payment Record

If payment is not found in the database:

```javascript
console.warn("Payment not found for webhook:", webhookData.TransactionId);
// Webhook returns 200 OK (no retry)
```

### Processing Errors

If an error occurs during processing:

```javascript
console.error("Webhook processing error:", error);
// Webhook returns 200 OK (no retry)
```

**Why return 200 on errors?**

- Prevents Takbull from retrying indefinitely
- Errors are logged for manual investigation
- Database errors shouldn't trigger payment retries

---

## Monitoring

### What to Monitor

1. **Webhook Reception Rate** - Track incoming webhooks
2. **Processing Success Rate** - Track successful updates
3. **Unmatched Payments** - Webhooks with no matching payment
4. **Failed Payments** - Track payment failures
5. **Subscription Activations** - Track successful subscriptions

### Log Analysis

```bash
# Search for webhook logs
grep "TAKBULL WEBHOOK RECEIVED" logs/app.log

# Find unmatched payments
grep "Payment not found" logs/app.log

# Find processing errors
grep "Webhook processing error" logs/app.log
```

---

## Troubleshooting

### Webhook Not Updating Payment

**Possible causes:**

1. Payment not found in database
2. `takbullUniqueId` mismatch
3. Database connection issue

**Solution:**

- Check webhook logs
- Verify payment exists with matching ID
- Check database connection

### Subscription Not Activating

**Possible causes:**

1. Payment status not "completed"
2. Subscription not linked to payment
3. `IsSubscriptionPayment` is false

**Solution:**

- Verify webhook `StatusCode` is 0
- Check `payment.subscriptionId` is set
- Ensure `IsSubscriptionPayment` is true

### Duplicate Webhook Processing

**Handled automatically:**

- Webhook updates are idempotent
- Multiple webhooks with same data won't cause issues
- Payment status updates are safe to repeat

---

## Webhook Response

### Success Response

```javascript
{
  "message": "Webhook processed successfully",
  "status": "completed" | "failed"
}
```

**HTTP Status:** 200 OK

### Error Response (Internal)

```javascript
{
  "message": "Webhook received but processing failed"
}
```

**HTTP Status:** 200 OK (to prevent retries)

---

## Integration Checklist

- [x] Webhook endpoint created at `/api/webhook`
- [x] Payment status updates implemented
- [x] Subscription status updates implemented
- [x] Error handling in place
- [x] Logging configured
- [ ] Webhook URL registered with Takbull
- [ ] Test webhooks sent and verified
- [ ] Production webhooks monitored

---

## Next Steps

1. **Register webhook URL** with Takbull
2. **Test with sandbox** - Send test webhooks
3. **Monitor logs** - Verify processing
4. **Test real payment** - Complete end-to-end test
5. **Set up alerts** - Monitor for errors

---

## Support

For webhook-related issues:

- Check logs: `console.log` statements
- Verify payment exists in database
- Ensure Takbull webhook is configured
- Contact Takbull support for webhook issues

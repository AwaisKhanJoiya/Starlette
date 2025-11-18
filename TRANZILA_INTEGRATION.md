# Tranzila Payment Integration

This document explains how to integrate and use the Tranzila payment gateway for class pack purchases and subscription management.

## Setup

### 1. Environment Variables

Add the following variables to your `.env.local` file:

```bash
TRANZILA_TERMINAL_NAME=your_terminal_name
TRANZILA_API_PASSWORD=your_api_password
TRANZILA_SANDBOX_MODE=true  # Set to false in production
```

### 2. Get Tranzila Credentials

1. Contact Tranzila to create a merchant account
2. They will provide:
   - Terminal Name (supplier name)
   - API Password (TranzilaPW)
   - Sandbox credentials for testing
3. Update your `.env.local` with these credentials

### 3. Test Card Numbers (Sandbox Mode)

Tranzila provides test card numbers for sandbox testing. Contact them for:

- Test credit card numbers
- Test CVV codes
- Test ID numbers

## API Endpoints

### Class Pack Purchase

**Endpoint:** `POST /api/payments/classpack`

**Request Body:**

```json
{
  "packName": "10 Classes Pack",
  "packType": "10_classes",
  "totalClasses": 10,
  "amount": 500,
  "validityMonths": 3,
  "cardNumber": "1234567890123456",
  "cvv": "123",
  "expiryMonth": "12",
  "expiryYear": "25",
  "cardHolderName": "John Doe",
  "cardHolderId": "123456789"
}
```

**Response (Success):**

```json
{
  "success": true,
  "message": "Class pack purchased successfully",
  "classPack": {
    "id": "...",
    "packName": "10 Classes Pack",
    "totalClasses": 10,
    "remainingClasses": 10,
    "validUntil": "2025-02-09T..."
  },
  "payment": {
    "transactionId": "...",
    "confirmationCode": "...",
    "amount": 500
  }
}
```

### Create Subscription

**Endpoint:** `POST /api/payments/subscription`

**Request Body:**

```json
{
  "planName": "Premium Monthly",
  "amount": 300,
  "classesPerWeek": 2,
  "classesPerMonth": 8,
  "cardNumber": "1234567890123456",
  "cvv": "123",
  "expiryMonth": "12",
  "expiryYear": "25",
  "cardHolderName": "John Doe",
  "cardHolderId": "123456789"
}
```

**Response (Success):**

```json
{
  "success": true,
  "message": "Subscription created successfully",
  "subscription": {
    "id": "...",
    "planName": "Premium Monthly",
    "classesPerWeek": 2,
    "classesPerMonth": 8,
    "amount": 300,
    "startDate": "2024-11-09T...",
    "nextBillingDate": "2024-12-09T...",
    "minimumCommitmentEndDate": "2025-02-09T..."
  },
  "payment": {
    "transactionId": "...",
    "confirmationCode": "...",
    "amount": 300
  }
}
```

### Cancel Subscription

**Endpoint:** `POST /api/payments/subscription/cancel`

**Request Body:**

```json
{
  "subscriptionId": "subscription_id_here",
  "reason": "User requested cancellation"
}
```

**Response (Success):**

```json
{
  "success": true,
  "message": "Subscription will be cancelled after 1-month notice period",
  "subscription": {
    "id": "...",
    "status": "cancelled",
    "cancelledAt": "2024-11-09T...",
    "endDate": "2024-12-09T..."
  }
}
```

### Get User Subscriptions

**Endpoint:** `GET /api/user/subscriptions`

**Response:**

```json
{
  "subscriptions": [...],
  "activeSubscription": {...}
}
```

### Get User Class Packs

**Endpoint:** `GET /api/user/classpacks`

**Query Parameters:**

- `status` (optional): Filter by status (active, expired, depleted)

**Response:**

```json
{
  "classPacks": [...],
  "activeClassPack": {...},
  "totalPacks": 5
}
```

## Usage Examples

### Frontend - Purchase Class Pack

```javascript
import { useState } from "react";
import PaymentForm from "@/components/PaymentForm";

function PurchaseClassPack() {
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handlePayment = async (paymentData) => {
    try {
      const response = await fetch("/api/payments/classpack", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${yourAuthToken}`,
        },
        body: JSON.stringify({
          packName: "10 Classes Pack",
          packType: "10_classes",
          totalClasses: 10,
          amount: 500,
          validityMonths: 3,
          ...paymentData,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setSuccess(true);
        // Redirect to success page or show confirmation
      } else {
        setError(data.message);
      }
    } catch (error) {
      setError("Payment processing failed");
    }
  };

  return (
    <PaymentForm
      onSubmit={handlePayment}
      type="classpack"
      amount={500}
      description="10 Classes Pack - Valid for 3 months"
      buttonText="Purchase Class Pack"
    />
  );
}
```

### Frontend - Subscribe

```javascript
import PaymentForm from "@/components/PaymentForm";

function Subscribe() {
  const handleSubscription = async (paymentData) => {
    const response = await fetch("/api/payments/subscription", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${yourAuthToken}`,
      },
      body: JSON.stringify({
        planName: "Premium Monthly",
        amount: 300,
        classesPerWeek: 2,
        classesPerMonth: 8,
        ...paymentData,
      }),
    });

    const data = await response.json();

    if (data.success) {
      // Handle success
    }
  };

  return (
    <PaymentForm
      onSubmit={handleSubscription}
      type="subscription"
      amount={300}
      description="Premium Monthly - 8 classes per month"
      buttonText="Subscribe Now"
    />
  );
}
```

## Business Rules

### Class Packs

- No extensions granted (except in exceptional cases)
- Expiration date specified at time of purchase
- Can have multiple active packs

### Subscriptions

- Minimum commitment: 3 months
- Cancellation notice: 1 month
- Only one active subscription allowed per user
- Recurring billing handled automatically by Tranzila

### Cancellations

- Class bookings: 24 hours before class (12 hours for members)
- After cancellation window: Credit automatically deducted

## Security Notes

1. **Never store full card details** - Only store Tranzila transaction IDs and tokens
2. **Use HTTPS** - All payment requests must be over HTTPS
3. **Validate input** - Always validate card data before sending to Tranzila
4. **PCI Compliance** - Consider using Tranzila's hosted payment page for better compliance
5. **Test thoroughly** - Use sandbox mode extensively before going live

## Troubleshooting

### Common Error Codes

- `000`: Success
- `001`: General error
- `002`: Card declined
- `003`: Invalid card number
- `004`: Card expired
- `005`: Insufficient funds
- `006`: CVV error

### Testing

1. Ensure `TRANZILA_SANDBOX_MODE=true` in development
2. Use Tranzila's test card numbers
3. Test both successful and failed transactions
4. Verify webhook handling (if implemented)

## Support

For Tranzila-specific issues:

- Contact: Tranzila support
- Documentation: Request from Tranzila
- Technical support: Available through your merchant account

For implementation questions:

- Check this documentation
- Review the code in `/src/services/tranzilaService.js`
- Examine API routes in `/src/app/api/payments/`

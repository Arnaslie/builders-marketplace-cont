// Checkout placeholder.
//
// The original demo wired cart checkout to PayPal (components/paypal-checkout.tsx and the API's
// checkout routes). That integration is being replaced with Stripe, so the live checkout is
// stubbed out here: the cart still prices itself and shows totals, but no payment is collected.
// Keep this component until the Stripe integration lands.
export function CheckoutStub() {
  return (
    <div id="checkout">
      <div className="checkout-coming-soon">
        <p className="lede">
          <b>Checkout is coming soon.</b>
        </p>
        <p>
          We're replacing the demo payment flow with a Stripe integration. You can still build and
          price a cart below; paying for it isn't available just yet.
        </p>
        <p className="muted">
          Nothing is charged in the meantime. This notice replaces the old PayPal checkout.
        </p>
      </div>
    </div>
  );
}
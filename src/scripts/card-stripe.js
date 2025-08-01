import { loadStripe } from "@stripe/stripe-js";
import { environment } from "../environments/environment";

(async () => {
  const stripe = await loadStripe(environment.pkStripe);
  const appearance = {
  theme: 'stripe',

  variables: {
    colorPrimary: '#0570de',
    colorBackground: '#ffffff',
    colorText: '#30313d',
    colorDanger: '#df1b41',
    fontFamily: 'Ideal Sans, system-ui, sans-serif',
    spacingUnit: '2px',
    borderRadius: '4px',
    // See all possible variables below
  }
};
  const elements = stripe.elements();

  const cardNumber = elements.create('cardNumber');
  cardNumber.mount('#card-number');

  const cardExpiry = elements.create('cardExpiry');
  cardExpiry.mount('#card-expiry');

  const cardCvc = elements.create('cardCvc');
  cardCvc.mount('#card-cvc');

  const form = document.getElementById('payment-form');
  const messageEl = document.getElementById('message');

  if (!form) return; // Evita el error de null

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const { paymentMethod, error } = await stripe.createPaymentMethod({ type: 'card', card: cardNumber });

    if (error) {
      messageEl.textContent = error.message;
      messageEl.className = "text-red-600 text-center text-sm";
      return;
    }

    const res = await fetch('http://localhost:8000/create-payment-method', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ paymentMethodId: paymentMethod.id })
    });
    const data = await res.json();

    if (data.error) {
      messageEl.textContent = data.error;
      messageEl.className = "text-red-600 text-center text-sm";
    } else {
      messageEl.textContent = data.message;
      messageEl.className = "text-green-600 text-center text-sm";
    }
  });
})();

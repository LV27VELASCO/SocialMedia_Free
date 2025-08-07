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

    // Show loading state
    const button = document.querySelector('button[type="submit"]');
    const originalText = button.innerHTML;
    button.innerHTML = '<span class="flex items-center justify-center space-x-2"><span class="animate-spin">⏳</span><span>Validando tarjeta...</span></span>';
    button.disabled = true;

    const { paymentMethod, error } = await stripe.createPaymentMethod({ type: 'card', card: cardNumber });

    if (error) {
      messageEl.textContent = error.message;
      messageEl.className = "text-red-300 text-center text-sm bg-red-500/20 p-4 rounded-xl border border-red-400/30";
      button.innerHTML = originalText;
      button.disabled = false;
      return;
    }

    const dataRegister = JSON.parse(localStorage.getItem('Register'));

    const res = await fetch('http://127.0.0.1:8000/validate-pay-method', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        paymentMethodId: paymentMethod.id,
        name:dataRegister.nombre,
        email:dataRegister.email,
        socialMedia:dataRegister.redSocial,
        url:dataRegister.url,
        accion:dataRegister.accion
      })
    });
    const data = await res.json();

    if (data.error) {
      messageEl.textContent = data.error;
      messageEl.className = "text-red-300 text-center text-sm bg-red-500/20 p-4 rounded-xl border border-red-400/30";
      button.innerHTML = originalText;
      button.disabled = false;
    } else {
      // Simulate form processing
    setTimeout(() => {
      window.location.href = "confirmation-success";

      // Reset button
      button.innerHTML = originalText;
      button.disabled = false;
      }, 2000);
      messageEl.textContent = data.message;
      messageEl.className = "text-green-600 text-center text-sm";
      button.innerHTML = originalText;
      button.disabled = false;
    }
  });
})();

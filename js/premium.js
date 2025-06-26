document.addEventListener('DOMContentLoaded', () => {
    // Botón de volver
    document.getElementById('backBtn').addEventListener('click', () => {
        window.location.href = 'main.html';
    });

    // Botones de suscripción
    document.getElementById('monthlyBtn').addEventListener('click', () => {
        startSubscription('monthly');
    });

    document.getElementById('annualBtn').addEventListener('click', () => {
        startSubscription('annual');
    });
});

async function startSubscription(planType) {
    const createCheckoutSession = firebase.functions().httpsCallable('createCheckoutSession');
    const statusElement = document.getElementById('paymentStatus');
    
    try {
        statusElement.innerHTML = `<p class="loading" data-i18n="creatingSession">Creando sesión de pago...</p>`;
        applyTranslations();
        
        const result = await createCheckoutSession({ planType });
        
        // Redirigir a Stripe Checkout
        const stripe = Stripe(functions.config().stripe.public_key);
        const { error } = await stripe.redirectToCheckout({
            sessionId: result.data.sessionId
        });
        
        if (error) {
            throw error;
        }
    } catch (error) {
        console.error('Error en el proceso de pago:', error);
        statusElement.innerHTML = `
            <div class="error-message">
                <p data-i18n="paymentError">Error en el proceso de pago</p>
                <p>${error.message}</p>
            </div>
        `;
        applyTranslations();
    }
}
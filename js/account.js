document.addEventListener('DOMContentLoaded', async () => {
    // Botón de volver
    document.getElementById('backBtn').addEventListener('click', () => {
        window.location.href = 'main.html';
    });

    // Cargar información de cuenta
    await loadAccountInfo();
    
    // Botón para gestionar suscripción
    document.getElementById('manageSubscriptionBtn')?.addEventListener('click', async () => {
        const createPortalSession = firebase.functions().httpsCallable('createCustomerPortalSession');
        
        try {
            const result = await createPortalSession();
            window.location.href = result.data.url;
        } catch (error) {
            console.error('Error abriendo portal de gestión:', error);
            alert(translations[currentLanguage].portalError);
        }
    });
});

async function loadAccountInfo() {
    const user = firebase.auth().currentUser;
    if (!user) return;
    
    const statusElement = document.getElementById('subscriptionStatus');
    
    try {
        const userDoc = await firebase.firestore().collection('users').doc(user.uid).get();
        const userData = userDoc.data();
        
        if (userData.isPremium) {
            statusElement.innerHTML = `
                <div class="premium-status">
                    <div class="badge premium" data-i18n="premiumActive">PREMIUM ACTIVO</div>
                    <p data-i18n="premiumSince">Suscripto desde: ${userData.premiumSince?.toDate().toLocaleDateString() || translations[currentLanguage].unknownDate}</p>
                    ${userData.nextPayment ? `<p data-i18n="nextPayment">Próximo pago: ${userData.nextPayment.toDate().toLocaleDateString()}</p>` : ''}
                </div>
            `;
            document.getElementById('subscriptionActions').style.display = 'block';
        } else {
            statusElement.innerHTML = `
                <div class="free-status">
                    <div class="badge free" data-i18n="freeAccount">CUENTA GRATUITA</div>
                    <p data-i18n="upgradePrompt">Actualiza a Premium para desbloquear todas las funciones</p>
                    <a href="premium.html" class="btn" data-i18n="upgradeNow">Actualizar Ahora</a>
                </div>
            `;
        }
        
        // Cargar estadísticas de uso
        loadUsageStats(user.uid);
        applyTranslations();
    } catch (error) {
        console.error('Error cargando información de cuenta:', error);
        statusElement.innerHTML = `<p class="error" data-i18n="accountError">Error cargando información de cuenta</p>`;
        applyTranslations();
    }
}

async function loadUsageStats(userId) {
    // Implementar lógica para cargar estadísticas de uso
    // ...
}

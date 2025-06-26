document.addEventListener('DOMContentLoaded', async () => {
    // Verificar si es administrador
    if (!await isAdminUser()) {
        window.location.href = 'main.html';
        return;
    }

    // Cargar configuración actual
    await loadConfigSettings();
    
    // Configurar listeners
    document.getElementById('globalPremiumToggle').addEventListener('change', toggleGlobalPremium);
    document.getElementById('launchPromoToggle').addEventListener('change', toggleLaunchPromo);
    
    // Cargar estadísticas
    loadRealTimeStats();
});

async function isAdminUser() {
    const user = firebase.auth().currentUser;
    if (!user) return false;
    
    try {
        const userDoc = await firebase.firestore().collection('users').doc(user.uid).get();
        return userDoc.exists && userDoc.data().isAdmin;
    } catch (error) {
        console.error("Error verificando admin:", error);
        return false;
    }
}

async function loadConfigSettings() {
    const configRef = firebase.firestore().collection('config').doc('globalSettings');
    const doc = await configRef.get();
    
    if (doc.exists) {
        const data = doc.data();
        document.getElementById('globalPremiumToggle').checked = data.globalPremium || false;
        document.getElementById('launchPromoToggle').checked = data.launchPromo || false;
        updateStatusIndicators();
    }
}

function updateStatusIndicators() {
    const premiumActive = document.getElementById('globalPremiumToggle').checked;
    const promoActive = document.getElementById('launchPromoToggle').checked;
    
    document.getElementById('premiumStatus').textContent = 
        premiumActive ? translations[currentLanguage].active : translations[currentLanguage].inactive;
    
    document.getElementById('promoStatus').textContent = 
        promoActive ? translations[currentLanguage].active : translations[currentLanguage].inactive;
}

async function toggleGlobalPremium() {
    const active = document.getElementById('globalPremiumToggle').checked;
    const configRef = firebase.firestore().collection('config').doc('globalSettings');
    
    try {
        await configRef.set({ globalPremium: active }, { merge: true });
        updateStatusIndicators();
    } catch (error) {
        console.error("Error actualizando premium global:", error);
    }
}

async function toggleLaunchPromo() {
    const active = document.getElementById('launchPromoToggle').checked;
    const configRef = firebase.firestore().collection('config').doc('globalSettings');
    
    try {
        await configRef.set({ launchPromo: active }, { merge: true });
        updateStatusIndicators();
    } catch (error) {
        console.error("Error actualizando promoción:", error);
    }
}

function loadRealTimeStats() {
    // Usuarios activos
    firebase.firestore().collection('sessions')
        .where('active', '==', true)
        .onSnapshot(snapshot => {
            document.getElementById('activeUsersCount').textContent = snapshot.size;
        });
    
    // Usuarios premium
    firebase.firestore().collection('users')
        .where('isPremium', '==', true)
        .onSnapshot(snapshot => {
            document.getElementById('premiumUsersCount').textContent = snapshot.size;
        });
    
    // Ubicaciones (ejemplo simplificado)
    firebase.firestore().collection('sessions')
        .where('active', '==', true)
        .onSnapshot(snapshot => {
            const locations = {};
            const list = document.getElementById('locationsList');
            list.innerHTML = '';
            
            snapshot.forEach(doc => {
                const location = doc.data().location || 'Desconocido';
                locations[location] = (locations[location] || 0) + 1;
            });
            
            for (const [location, count] of Object.entries(locations)) {
                const li = document.createElement('li');
                li.textContent = `${location}: ${count} usuarios`;
                list.appendChild(li);
            }
        });
}
document.addEventListener('DOMContentLoaded', () => {
    // Cargar opciones de redes sociales
    loadSocialNetworks();
    
    // Cargar tipos de copy
    loadCopyTypes();
    
    // Cargar efectos
    loadEffects();
    
    // Manejar cambio de modo
    document.getElementById('generationMode').addEventListener('change', handleModeChange);
    
    // Manejar envío del formulario
    document.getElementById('contentForm').addEventListener('submit', handleFormSubmit);
});

function loadSocialNetworks() {
    const networks = [
        { id: 'facebook', name: 'Facebook' },
        { id: 'instagram', name: 'Instagram' },
        { id: 'linkedin', name: 'LinkedIn' },
        { id: 'twitter', name: 'X (Twitter)' },
        { id: 'tiktok', name: 'TikTok' },
        { id: 'youtube', name: 'YouTube' },
        { id: 'whatsapp', name: 'WhatsApp' },
        { id: 'telegram', name: 'Telegram' },
        { id: 'reddit', name: 'Reddit' }
    ];
    
    const container = document.getElementById('networksContainer');
    networks.forEach(network => {
        const div = document.createElement('div');
        div.className = 'checkbox-item';
        
        const input = document.createElement('input');
        input.type = 'checkbox';
        input.id = `network-${network.id}`;
        input.name = 'networks';
        input.value = network.id;
        
        const label = document.createElement('label');
        label.htmlFor = `network-${network.id}`;
        label.textContent = network.name;
        
        div.appendChild(input);
        div.appendChild(label);
        container.appendChild(div);
    });
}

function handleFormSubmit(e) {
    e.preventDefault();
    
    // Mostrar barra de progreso
    showProgressBar();
    
    // Obtener datos del formulario
    const formData = {
        keyword: document.getElementById('keyword').value,
        mode: document.getElementById('generationMode').value,
        networks: getSelectedNetworks(),
        copyType: document.getElementById('copyType').value,
        desiredEffect: document.getElementById('desiredEffect').value,
        language: currentLanguage
    };
    
    // Llamar a la función de generación
    generateContent(formData);
}

function showProgressBar() {
    const btn = document.getElementById('generateBtn');
    btn.disabled = true;
    btn.innerHTML = `
        <div class="progress-container">
            <div class="progress-bar"></div>
            <div class="progress-text" data-i18n="generating">Generando ideas...</div>
        </div>
    `;
    
    // Mostrar frases motivacionales
    showMotivationalPhrases();
}

// Función para generar contenido (se conecta con Firebase Functions)
async function generateContent(data) {
    const generateContent = firebase.functions().httpsCallable('generateContent');
    
    try {
        const result = await generateContent(data);
        // Guardar en historial
        saveToHistory(result.data);
        // Redirigir a resultados
        window.location.href = `results.html?generationId=${result.data.id}`;
    } catch (error) {
        console.error("Error al generar contenido:", error);
        alert(translations[currentLanguage].generationError || "Error al generar contenido");
    }
}
document.addEventListener('DOMContentLoaded', async () => {
    // Obtener parámetros de la URL
    const urlParams = new URLSearchParams(window.location.search);
    const generationId = urlParams.get('generationId');
    
    if (!generationId) {
        showError("No se encontró ID de generación");
        return;
    }

    // Botón de volver
    document.getElementById('backBtn').addEventListener('click', () => {
        window.location.href = 'main.html';
    });

    // Cargar resultados
    await loadGenerationResults(generationId);
});

async function loadGenerationResults(generationId) {
    try {
        const generationRef = firebase.firestore().collection('generations').doc(generationId);
        const doc = await generationRef.get();
        
        if (!doc.exists) {
            showError("Generación no encontrada");
            return;
        }

        const data = doc.data();
        renderResults(data);
    } catch (error) {
        console.error("Error cargando resultados:", error);
        showError("Error al cargar los resultados");
    }
}

function renderResults(generationData) {
    // Mostrar metadatos
    document.getElementById('resultKeyword').textContent = generationData.parameters.keyword;
    document.getElementById('resultNetworks').textContent = generationData.parameters.networks.join(', ');
    
    // Mostrar ideas
    const container = document.getElementById('resultsContainer');
    const isPremium = checkPremiumStatus(); // Verificar si es usuario premium
    
    generationData.content.ideas.forEach((idea, index) => {
        const ideaCard = document.createElement('div');
        ideaCard.className = 'idea-card';
        ideaCard.innerHTML = `
            <div class="idea-header">
                <h3>${idea.network}</h3>
                <div class="idea-actions">
                    <button class="copy-btn" data-i18n="copy" data-index="${index}"></button>
                    <button class="share-btn" data-i18n="share" data-index="${index}"></button>
                </div>
            </div>
            <div class="idea-content">
                <p class="hook"><strong data-i18n="hookLabel">Gancho:</strong> ${idea.hook}</p>
                <p class="post">${idea.post}</p>
                <div class="visual-box ${isPremium ? '' : 'premium-locked'}">
                    <p class="visual-desc"><strong data-i18n="visualLabel">Visual:</strong> ${idea.visual}</p>
                    ${!isPremium ? `
                        <div class="premium-overlay">
                            <p data-i18n="premiumVisual">Desbloquea con Premium</p>
                        </div>
                    ` : ''}
                </div>
                <p class="hashtags"><strong data-i18n="hashtagsLabel">Hashtags:</strong> ${idea.hashtags}</p>
            </div>
        `;
        container.appendChild(ideaCard);
    });
    
    // Mostrar frase final
    if (generationData.content.finalPhrase) {
        document.getElementById('finalPhrase').textContent = generationData.content.finalPhrase;
    }
    
    // Agregar event listeners para copiar/compartir
    document.querySelectorAll('.copy-btn').forEach(btn => {
        btn.addEventListener('click', () => copyIdeaContent(btn.dataset.index));
    });
    
    document.querySelectorAll('.share-btn').forEach(btn => {
        btn.addEventListener('click', () => shareIdeaContent(btn.dataset.index));
    });
    
    // Aplicar traducciones
    applyTranslations();
}

function checkPremiumStatus() {
    // Lógica para verificar si el usuario es premium
    return false; // Implementar según Firestore
}
const { onCall } = require("firebase-functions/v2/https");
const admin = require("firebase-admin");
const axios = require("axios");

if (!admin.apps.length) admin.initializeApp();

// ========== FUNCIÓN PRINCIPAL ==========
exports.generateIdeas = onCall({ region: "us-central1" }, async (data, context) => {
  const { keyword, copytype, language, networks, mode, formatoSalida, nIdeas } = data;

  if (!context.auth) {
    throw new Error("El usuario debe estar autenticado.");
  }
  if (!keyword || !copytype || !language || !networks || !mode) {
    throw new Error("Faltan campos obligatorios.");
  }
  if (!Array.isArray(networks) || networks.length === 0) {
    throw new Error("Selecciona al menos una red social.");
  }

  const apiKey = process.env.DEEPSEEK_API_KEY || "AQUÍ_TU_API_KEY"; // O usa functions.config() si lo configuraste
  if (!apiKey) {
    console.error("❌ No se encontró la API Key de Deepseek");
    throw new Error("API Key no configurada.");
  }

  const prompt = construirPrompt(keyword, copytype, language, networks, mode, formatoSalida, nIdeas);

  try {
    const response = await axios.post("https://api.deepseek.com/chat/completions", {
      model: "deepseek-chat",
      messages: [{ role: "user", content: prompt }],
    }, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
    });

    return { ideas: response.data, prompt };
  } catch (error) {
    console.error("Error generando idea:", error);
    throw new Error("Ocurrió un error generando la idea.");
  }
});

// ========== FUNCIÓN ADMIN ==========
exports.setPremiumGlobalStatus = onCall({ region: "us-central1" }, async (data, context) => {
  if (!context.auth) {
    throw new Error("El usuario debe estar autenticado.");
  }

  const updateFields = {};

  if ("isPremiumGlobalActive" in data) {
    updateFields.isPremiumGlobalActive = !!data.isPremiumGlobalActive;
  }

  if ("premiumGlobalEndDate" in data) {
    updateFields.premiumGlobalEndDate = data.premiumGlobalEndDate || null;
  }

  if ("isLaunchPromoActive" in data) {
    updateFields.isLaunchPromoActive = !!data.isLaunchPromoActive;
  }

  if (Object.keys(updateFields).length === 0) {
    throw new Error("No se enviaron campos válidos para actualizar.");
  }

  try {
    await admin.firestore()
      .collection("appConfig")
      .doc("global")
      .set(updateFields, { merge: true });

    return { success: true };
  } catch (error) {
    console.error("❌ Error en setPremiumGlobalStatus:", error);
    throw new Error("No se pudo actualizar el estado premium global.");
  }
});

// ========== CONSTRUCTOR DE PROMPT ==========
function construirPrompt(keyword, copytype, language, networks, mode, formatoSalida, nIdeas) {
  const redes = Array.isArray(networks) ? networks.join(", ") : networks;
  const plural = Array.isArray(networks) && networks.length > 1;

  return `
Eres un experto en redacción creativa para redes sociales. Genera ideas de copy para ${redes} siguiendo estas reglas:

- Haz cada bloque de texto lo más informativo, educativo y persuasivo posible, usando el máximo de palabras recomendadas para el tipo de red social.
- Incluye emojis dentro de las frases, sobre todo en las más importantes, para dar emoción y dinamismo (emojis relevantes, no solo al inicio).
- No uses asteriscos ni markdown.
- Cada idea debe tener:
  Gancho Verbal Impactante:
  Texto del Post:
  Hashtags:
  CTA:
  Prompt Visual para IA:
- Agrega saltos de línea (ENTER) después de cada frase para que sea fácil de leer y copiar en redes sociales.
- En "Prompt Visual para IA:", da una descripción lo más explícita, detallada y visualmente inspiradora posible, especificando el tipo de formato (imagen, video, ilustración, etc.) adecuado para la red social.
- El tema central es: "${keyword}"
- El tipo de copy es: "${copytype}"
- Idioma: ${language}
- Genera exactamente ${plural ? "una idea para cada red social" : (nIdeas || 3) + " ideas diferentes"} para: ${redes}.
- No generes más ideas de las solicitadas.

Ejemplo de formato:

Gancho Verbal Impactante: ¿Sabías que el 94% de los reclutadores usan LinkedIn, pero también es una mina de oro para B2B? 🚀

Texto del Post: Aprende cómo posicionarte como experto y generar leads sin ser spam. ✨ Aquí te dejo los mejores consejos para destacar entre miles de perfiles.

Hashtags: #LinkedIn #B2B #Empleo #Reclutamiento

CTA: ¿Listo para transformar tu perfil? Comenta "QUIERO" y te envío la guía. 💡

Prompt Visual para IA: Imagen de una laptop con gráficas ascendentes y un perfil profesional resaltado.
`;
}

// ========== FUNCIÓN ADMIN: Panel Premium ==========
exports.setPremiumGlobalStatus = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError("unauthenticated", "El usuario debe estar autenticado.");
  }

  const updateFields = {};
  if ("isPremiumGlobalActive" in data) {
    updateFields.isPremiumGlobalActive = !!data.isPremiumGlobalActive;
  }
  if ("premiumGlobalEndDate" in data) {
    updateFields.premiumGlobalEndDate = data.premiumGlobalEndDate || null;
  }
  if ("isLaunchPromoActive" in data) {
    updateFields.isLaunchPromoActive = !!data.isLaunchPromoActive;
  }

  if (Object.keys(updateFields).length === 0) {
    throw new functions.https.HttpsError("invalid-argument", "No se enviaron campos válidos para actualizar.");
  }

  try {
    await admin.firestore().collection("appConfig").doc("global").set(updateFields, { merge: true });
    return { success: true };
  } catch (error) {
    console.error("❌ Error en setPremiumGlobalStatus:", error);
    throw new functions.https.HttpsError("internal", "No se pudo actualizar el estado premium global.");
  }
});

const functions = require("firebase-functions");
const admin = require("firebase-admin");
const axios = require("axios");

if (!admin.apps.length) admin.initializeApp();

// ====== Función para generar ideas (https.onCall) ======
exports.generateIdeas = functions.https.onCall(async (data, context) => {
  const { keyword, copytype, language, networks, mode, formatoSalida, nIdeas } = data;

  if (!context.auth) {
    throw new functions.https.HttpsError("unauthenticated", "El usuario debe estar autenticado.");
  }

  if (!keyword || !copytype || !language || !networks || !mode) {
    throw new functions.https.HttpsError("invalid-argument", "Faltan campos obligatorios.");
  }

  const apiKey = functions.config().deepseek.key;
  if (!apiKey) {
    console.error("❌ No se encontró la API Key de Deepseek en functions.config()");
    throw new functions.https.HttpsError("internal", "API Key no configurada.");
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

    const textoGenerado = response.data.choices?.[0]?.message?.content || "";
    console.log("IDEAS GENERADAS:", textoGenerado);

    return {
      text: textoGenerado
    };

  } catch (error) {
    console.error("❌ Error en generateIdeas:", error.response?.data || error.message);
    throw new functions.https.HttpsError("internal", "No se pudieron generar ideas.");
  }
});

// ====== Utilidad para construir el prompt ======
function construirPrompt(keyword, copytype, language, networks, mode, formatoSalida, nIdeas) {
  const redes = Array.isArray(networks) ? networks.join(", ") : networks;
  let mensaje = `Quiero que generes ideas de contenido para redes sociales en ${language}.
El tema es: "${keyword}".
El tipo de publicación es: "${copytype}".
`;

  if (mode === "multi" || mode === "multired") {
    mensaje += `Genera exactamente una idea para cada una de estas redes sociales: ${redes}.
No generes más ideas de las solicitadas.\n`;
  } else {
    mensaje += `Genera exactamente 3 ideas diferentes para esta red social: ${redes}.
No generes más ideas de las solicitadas.\n`;
  }

  if (formatoSalida) {
    mensaje += `\nUsa este formato de salida:\n${formatoSalida}`;
  } else {
    mensaje += `\nPresenta cada idea de forma clara y separada.`;
  }

  return mensaje;
}

// ====== Panel Admin Premium: setPremiumGlobalStatus usando onCall ======
exports.setPremiumGlobalStatus = functions.https.onCall(async (data, context) => {
  // Validar autenticación y admin
  if (!context.auth) {
    throw new functions.https.HttpsError("unauthenticated", "El usuario debe estar autenticado.");
  }

  // Puedes agregar validación de admin si quieres aquí

  // Permitir actualizar cualquier combinación de campos
  const updateFields = {};

  // Si el campo está presente (aunque sea false o null), lo tomamos
  if ("isPremiumGlobalActive" in data) {
    updateFields.isPremiumGlobalActive = !!data.isPremiumGlobalActive;
  }
  if ("premiumGlobalEndDate" in data) {
    // Si es string vacío o indefinido, lo ponemos null
    updateFields.premiumGlobalEndDate = data.premiumGlobalEndDate ? data.premiumGlobalEndDate : null;
  }
  if ("isLaunchPromoActive" in data) {
    updateFields.isLaunchPromoActive = !!data.isLaunchPromoActive;
  }

  // Si no hay ningún campo relevante, error
  if (Object.keys(updateFields).length === 0) {
    throw new functions.https.HttpsError("invalid-argument", "No se enviaron campos válidos para actualizar.");
  }

  try {
    // Guardar en appConfig/global
    await admin.firestore().collection('appConfig').doc('global').set(updateFields, { merge: true });

    return { success: true };
  } catch (error) {
    console.error("❌ Error en setPremiumGlobalStatus:", error);
    throw new functions.https.HttpsError("internal", "No se pudo actualizar el estado premium global.");
  }
});

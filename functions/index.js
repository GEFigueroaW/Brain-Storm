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

  // Puedes agregar más validaciones según tu lógica de admin aquí,
  // por ejemplo, leer Firestore y verificar que el rol sea "admin".
  // Si quieres validar, descomenta este bloque:
  /*
  try {
    const userRef = admin.firestore().collection("users").doc(context.auth.uid);
    const userSnap = await userRef.get();
    if (!userSnap.exists || userSnap.data().role !== "admin") {
      throw new functions.https.HttpsError("permission-denied", "No tienes permisos de admin.");
    }
  } catch (e) {
    throw new functions.https.HttpsError("permission-denied", "No tienes permisos de admin.");
  }
  */

  // Permitir actualizar cualquier combinación de campos
  const updateFields = {};
  if (typeof data.isPremiumGlobalActive !== "undefined") {
    updateFields.isPremiumGlobalActive = data.isPremiumGlobalActive;
  }
  if (typeof data.premiumGlobalEndDate !== "undefined") {
    updateFields.premiumGlobalEndDate = data.premiumGlobalEndDate || null;
  }
  if (typeof data.isLaunchPromoActive !== "undefined") {
    updateFields.isLaunchPromoActive = data.isLaunchPromoActive;
  }

  // Para evitar que no se mande nada
  if (Object.keys(updateFields).length === 0) {
    throw new functions.https.HttpsError("invalid-argument", "No se enviaron campos para actualizar.");
  }

  try {
    // Guardar configuración en Firestore (colección 'appConfig', documento 'global')
    await admin.firestore().collection('appConfig').doc('global').set(updateFields, { merge: true });

    return { success: true };
  } catch (error) {
    console.error("❌ Error en setPremiumGlobalStatus:", error);
    throw new functions.https.HttpsError("internal", "No se pudo actualizar el estado premium global.");
  }
});

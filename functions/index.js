const functions = require("firebase-functions");
const axios = require("axios");

// ✅ Función Cloud de primera generación
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

  // Construye el prompt correctamente, usando el formato delimitado que espera el frontend
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

    // Log para depuración (puedes quitarlo después)
    console.log("IDEAS GENERADAS:", textoGenerado);

    // Aquí NO proceses, simplemente retorna el string completo
    return {
      text: textoGenerado
    };

  } catch (error) {
    console.error("❌ Error en generateIdeas:", error.response?.data || error.message);
    throw new functions.https.HttpsError("internal", "No se pudieron generar ideas.");
  }
});

// NUEVO: Usa formatoSalida y nIdeas (opcional)
function construirPrompt(keyword, copytype, language, networks, mode, formatoSalida, nIdeas) {
  const redes = Array.isArray(networks) ? networks.join(", ") : networks;
  // Modo seguro: si frontend NO manda formatoSalida, pon uno básico (pero el frontend sí lo envía)
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

  // Agrega el formato delimitado (frontend lo envía en formatoSalida)
  if (formatoSalida) {
    mensaje += `\nUsa este formato de salida:\n${formatoSalida}`;
  } else {
    mensaje += `\nPresenta cada idea de forma clara y separada.`;
  }

  return mensaje;
}

// ======= AGREGADO PARA CORS EN setPremiumGlobalStatus =======
const cors = require("cors")({ origin: true });

exports.setPremiumGlobalStatus = functions.https.onRequest((req, res) => {
  cors(req, res, async () => {
    try {
      // Aquí va tu lógica original para actualizar el estado premium global
      // Por ejemplo, suponiendo que recibes { isPremiumGlobalActive, premiumGlobalEndDate, isLaunchPromoActive }
      // y lo guardas en Firestore:
      /*
      const admin = require('firebase-admin');
      if (!admin.apps.length) admin.initializeApp();
      const db = admin.firestore();

      const { isPremiumGlobalActive, premiumGlobalEndDate, isLaunchPromoActive } = req.body;
      await db.collection('config').doc('premiumGlobalStatus').set({
        isPremiumGlobalActive,
        premiumGlobalEndDate,
        isLaunchPromoActive
      }, { merge: true });
      */

      // Simulación de respuesta de éxito
      res.status(200).json({ success: true });
    } catch (error) {
      console.error("Error en setPremiumGlobalStatus:", error);
      res.status(500).json({ error: error.message });
    }
  });
});

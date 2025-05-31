const functions = require("firebase-functions");
const axios = require("axios");

// ✅ Función Cloud de primera generación
exports.generateIdeas = functions.https.onCall(async (data, context) => {
  const { keyword, copytype, language, networks, mode } = data;

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

  const prompt = construirPrompt(keyword, copytype, language, networks, mode);

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

    const ideas = textoGenerado
      .split(/\n+/)
      .filter(line => line.trim())
      .map((line, i) => ({ text: line.trim() }));

    return {
      success: true,
      ideas
    };

  } catch (error) {
    console.error("❌ Error en generateIdeas:", error.response?.data || error.message);
    throw new functions.https.HttpsError("internal", "No se pudieron generar ideas.");
  }
});

function construirPrompt(keyword, copytype, language, networks, mode) {
  const redes = Array.isArray(networks) ? networks.join(", ") : networks;
  let mensaje = `Quiero generar ideas de contenido para redes sociales en ${language}. `;

  if (mode === "multired") {
    mensaje += `Necesito una idea para cada una de estas redes: ${redes}. `;
  } else {
    mensaje += `Necesito tres ideas diferentes para una sola red social: ${redes}. `;
  }

  mensaje += `El tema es: "${keyword}". El tipo de publicación es: "${copytype}". Sé claro, breve y creativo.`;

  return mensaje;
}

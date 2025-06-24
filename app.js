// =================== CONFIGURACIÓN FIREBASE ===================
const firebaseConfig = {
  apiKey: "AIzaSyCScJA-UGs3WcBnfAm-6K94ybZ4bzBahz8",
  authDomain: "brain-storm-8f0d8.firebaseapp.com",
  databaseURL: "https://brain-storm-8f0d8-default-rtdb.firebaseio.com",
  projectId: "brain-storm-8f0d8",
  storageBucket: "brain-storm-8f0d8.appspot.com",
  messagingSenderId: "401208607043",
  appId: "1:401208607043:web:6f35fc81fdce7b3fbeaff6"
};

firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

// =================== VARIABLES GLOBALES ===================
let userData = null;
let appConfig = null;
let isPremium = false;
let language = 'es';

const networksFull = ["Facebook", "LinkedIn", "X / Twitter", "WhatsApp", "Telegram", "Reddit", "Instagram", "TikTok", "YouTube"];
const freeNetworks = ["Facebook"];
const copyOptions = {
  "De beneficio o solución": "Cómo el producto mejora la vida del cliente.",
  "De novedad o lanzamiento": "Anuncia algo nuevo para atraer atención inmediata.",
  "De interacción o pregunta": "Genera respuestas de la audiencia.",
  "De urgencia o escasez": "Crea urgencia de acción.",
  "Informativo o educativo": "Comparte conocimiento útil.",
  "Informal": "Tono casual y cercano.",
  "Llamada a la acción (CTA)": "Mueve a la acción inmediata.",
  "Narrativo o storytelling": "Cuenta historias emocionales.",
  "Posicionamiento o branding": "Refuerza imagen de marca.",
  "Testimonio o prueba social": "Muestra experiencias positivas.",
  "Técnico o profesional": "Contenido técnico especializado.",
  "Venta directa o persuasivo": "Persuade para cerrar ventas."
};

// =================== PANTALLA: index.html ===================
if (document.getElementById('login-btn')) {
  document.getElementById('language-selector').addEventListener('change', (e) => {
    language = e.target.value;
  });

  document.getElementById('login-btn').addEventListener('click', () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider);
  });

  auth.onAuthStateChanged(async (user) => {
    if (user) {
      const userDoc = await db.collection("users").doc(user.uid).get();
      if (!userDoc.exists) {
        await db.collection("users").doc(user.uid).set({
          email: user.email,
          name: user.displayName,
          isPremium: false,
          generationCredits: 0,
          languagePreference: language
        });
      }
      window.location.href = "config.html";
    }
  });
}

// =================== PANTALLA: config.html ===================
if (document.getElementById('generate-btn')) {
  auth.onAuthStateChanged(async (user) => {
    if (!user) {
      window.location.href = "index.html";
      return;
    }
    const uid = user.uid;
    const userDoc = await db.collection("users").doc(uid).get();
    userData = userDoc.data();

    const configDoc = await db.collection("appConfig").doc("global").get();
    appConfig = configDoc.exists ? configDoc.data() : {};

    isPremium = userData.isPremium || appConfig.isPremiumGlobalActive || appConfig.isLaunchPromoActive;

    document.getElementById("greeting").innerText = `¡Hola, ${userData.name}!`;
    document.getElementById("counter").innerText = !isPremium ? `Generaciones restantes esta semana: ${userData.generationCredits}/3` : "";

    const container = document.getElementById("networks-container");
    networksFull.forEach(net => {
      const btn = document.createElement("button");
      btn.className = "button is-light";
      btn.innerText = net;
      btn.dataset.value = net;

      if (!isPremium && !freeNetworks.includes(net)) {
        btn.disabled = true;
      } else {
        btn.addEventListener('click', () => btn.classList.toggle("is-info"));
      }

      container.appendChild(btn);
    });

    const copySel = document.getElementById("copytype");
    for (const [type, desc] of Object.entries(copyOptions)) {
      const opt = document.createElement("option");
      opt.value = type;
      opt.text = type;
      if (!isPremium && !["Informativo o educativo", "Informal", "Técnico o profesional"].includes(type)) {
        opt.disabled = true;
      }
      copySel.add(opt);
    }

    copySel.addEventListener("change", () => {
      document.getElementById("copy-description").innerText = copyOptions[copySel.value];
    });
    copySel.dispatchEvent(new Event('change'));
  });

  document.getElementById('generate-btn').addEventListener('click', async () => {
    const mode = document.querySelector("input[name='mode']:checked").value;
    const selectedNetworks = [...document.querySelectorAll("#networks-container .is-info")].map(btn => btn.dataset.value);
    const keyword = document.getElementById("keyword").value.trim();
    const copytype = document.getElementById("copytype").value;
    const copyDescription = copyOptions[copytype];

    if (!keyword || selectedNetworks.length === 0) {
      alert("Completa todos los campos.");
      return;
    }

    document.getElementById('generate-btn').classList.add("is-loading");

    try {
      const user = firebase.auth().currentUser;
      const idToken = await user.getIdToken();

      const response = await fetch("https://us-central1-brain-storm-8f0d8.cloudfunctions.net/generateIdeas", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${idToken}`
        },
        body: JSON.stringify({
          keyword, copytype, copyDescription, language, networks: selectedNetworks, mode
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Error interno en el servidor");
      }

      const data = await response.json();
      sessionStorage.setItem("results", data.result);
      sessionStorage.setItem("isPremium", isPremium);
      window.location.href = "results.html";

    } catch (e) {
      alert("Error: " + e.message);
    }

    document.getElementById('generate-btn').classList.remove("is-loading");
  });
}

// =================== PANTALLA: results.html ===================
if (document.getElementById('results-container')) {
  const resultText = sessionStorage.getItem("results");
  const premium = sessionStorage.getItem("isPremium") === "true";

  if (!resultText) {
    window.location.href = "config.html";
  } else {
    const container = document.getElementById("results-container");
    resultText.split("---IDEA_").forEach(block => {
      if (!block.includes("---FIN_IDEA")) return;
      const card = document.createElement("div");
      card.className = "idea-card animate__animated animate__fadeInUp";
      if (!premium) card.classList.add("blurred");
      card.innerText = block;
      container.appendChild(card);
    });
  }

  document.getElementById("new-gen-btn").addEventListener("click", () => {
    window.location.href = "config.html";
  });
}

// =================== PANTALLA: admin.html ===================
if (document.getElementById('save-admin-btn')) {
  auth.onAuthStateChanged(async (user) => {
    if (!user) {
      window.location.href = "index.html";
      return;
    }
    const email = user.email;
    const adminDoc = await db.collection("admins").doc(email).get();
    if (!adminDoc.exists) {
      alert("Acceso denegado");
      window.location.href = "index.html";
    }

    const configDoc = await db.collection("appConfig").doc("global").get();
    const config = configDoc.exists ? configDoc.data() : {};
    document.getElementById("premium-global").checked = config.isPremiumGlobalActive || false;
    document.getElementById("launch-promo").checked = config.isLaunchPromoActive || false;
    if (config.premiumGlobalEndDate) {
      const date = new Date(config.premiumGlobalEndDate._seconds * 1000);
      document.getElementById("premium-end-date").value = date.toISOString().split('T')[0];
    }
  });

  document.getElementById("save-admin-btn").addEventListener("click", async () => {
    const user = firebase.auth().currentUser;
    const idToken = await user.getIdToken();

    try {
      const response = await fetch("https://us-central1-brain-storm-8f0d8.cloudfunctions.net/setPremiumGlobalStatus", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${idToken}`
        },
        body: JSON.stringify({
          isPremiumGlobalActive: document.getElementById("premium-global").checked,
          isLaunchPromoActive: document.getElementById("launch-promo").checked,
          premiumGlobalEndDate: document.getElementById("premium-end-date").value || null
        })
      });

      if (!response.ok) throw new Error("Error al actualizar la configuración");
      alert("Configuración actualizada");
    } catch (e) {
      alert("Error: " + e.message);
    }
  });
}

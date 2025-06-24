// Firebase Config (tu configuración real de proyecto)
const firebaseConfig = {
  apiKey: "AIzaSyCScJA-UGs3WcBnfAm-6K94ybZ4bzBahz8",
  authDomain: "brain-storm-8f0d8.firebaseapp.com",
  projectId: "brain-storm-8f0d8",
  storageBucket: "brain-storm-8f0d8.appspot.com",
  messagingSenderId: "401208607043",
  appId: "1:401208607043:web:6f35fc81fdce7b3fbeaff6"
};

// Inicializa Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();

// Control de sesión en todas las páginas
document.addEventListener("DOMContentLoaded", () => {
  const path = window.location.pathname;

  auth.onAuthStateChanged(user => {
    if (path.includes("index.html") || path === "/") {
      if (user) {
        document.getElementById("loginGoogleBtn").classList.add("hidden");
        document.getElementById("logoutBtn").classList.remove("hidden");
      } else {
        document.getElementById("loginGoogleBtn").classList.remove("hidden");
        document.getElementById("logoutBtn").classList.add("hidden");
      }
    } else {
      if (!user) {
        window.location.href = "index.html";
      }
    }
  });

  // Eventos de login
  const loginBtn = document.getElementById("loginGoogleBtn");
  if (loginBtn) {
    loginBtn.addEventListener("click", () => {
      const provider = new firebase.auth.GoogleAuthProvider();
      auth.signInWithPopup(provider).then(() => {
        window.location.href = "config.html";
      }).catch(err => alert(err.message));
    });
  }

  // Logout
  const logoutBtn = document.getElementById("logoutBtn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      auth.signOut();
    });
  }
});

// Lógica generación IA en config.html
document.addEventListener("DOMContentLoaded", () => {
  const generateButton = document.getElementById("generateBtn");
  if (!generateButton) return;

  generateButton.addEventListener("click", async () => {
    const keyword = document.getElementById("keyword").value.trim();
    const mode = document.querySelector('input[name="mode"]:checked')?.value;
    const selectedNetworks = Array.from(document.querySelectorAll('input[name="network"]:checked')).map(el => el.value);
    const desiredEffect = document.getElementById("desiredEffect").value;
    const copyType = document.getElementById("copyType").value;

    if (!keyword || !desiredEffect || !copyType || selectedNetworks.length === 0 || !mode) {
      alert("Por favor completa todos los campos y selecciona al menos una red social.");
      return;
    }

    generateButton.disabled = true;
    generateButton.textContent = "Generando...";

    try {
      const response = await fetch("https://us-central1-brain-storm-8f0d8.cloudfunctions.net/api", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ keyword, desiredEffect, copyType, networks: selectedNetworks, mode })
      });

      if (!response.ok) throw new Error("Error en el servidor");

      const data = await response.json();
      localStorage.setItem("feedflowResults", JSON.stringify(data.ideas));
      window.location.href = "results.html";
    } catch (error) {
      console.error("Error al generar ideas:", error);
      alert("Ocurrió un error al generar las ideas.");
    }

    generateButton.disabled = false;
    generateButton.textContent = "Generar Ideas";
  });
});

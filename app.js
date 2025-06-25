// Firebase Configuración (usa la tuya real)
const firebaseConfig = {
  apiKey: "AIzaSyCScJA-UGs3WcBnfAm-6K94ybZ4bzBahz8",
  authDomain: "brain-storm-8f0d8.firebaseapp.com",
  projectId: "brain-storm-8f0d8"
};
firebase.initializeApp(firebaseConfig);

// LOGIN Google
if (document.getElementById("loginBtn")) {
  document.getElementById("loginBtn").addEventListener("click", () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    firebase.auth().signInWithPopup(provider)
      .then(() => {
        const lang = document.getElementById("language").value;
        sessionStorage.setItem("language", lang);
        window.location.href = "main.html";
      })
      .catch(error => {
        alert("Error al iniciar sesión: " + error.message);
      });
  });
}

// GENERACIÓN de ideas
if (document.getElementById("generateBtn")) {
  document.getElementById("generateBtn").addEventListener("click", async () => {
    const keyword = document.getElementById("keyword").value;
    const effect = document.getElementById("effect").value;
    const copyType = document.getElementById("copyType").value;
    const mode = document.getElementById("mode").value;
    const networks = Array.from(document.querySelectorAll('.network:checked')).map(cb => cb.value);

    if (!keyword || !effect || !copyType || networks.length === 0) {
      alert("Por favor completa todos los campos.");
      return;
    }

    sessionStorage.setItem("keyword", keyword);
    sessionStorage.setItem("effect", effect);
    sessionStorage.setItem("copyType", copyType);
    sessionStorage.setItem("mode", mode);
    sessionStorage.setItem("networks", JSON.stringify(networks));

    window.location.href = "results.html";
  });
}

// MOSTRAR RESULTADOS (ya en results.html)
if (document.getElementById("results")) {
  window.addEventListener("load", async () => {
    const keyword = sessionStorage.getItem("keyword");
    const effect = sessionStorage.getItem("effect");
    const copyType = sessionStorage.getItem("copyType");
    const mode = sessionStorage.getItem("mode");
    const networks = JSON.parse(sessionStorage.getItem("networks"));

    document.getElementById("results").innerHTML = "Generando ideas IA...";

    try {
      const response = await fetch("https://us-central1-brain-storm-8f0d8.cloudfunctions.net/api/generateIdeas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ keyword, desiredEffect: effect, copyType, networks, mode })
      });

      if (!response.ok) throw new Error("Error al generar ideas");
      const data = await response.json();

      let html = "";
      data.ideas.forEach(item => {
        html += `<h3>${item.network}</h3><pre>${item.result}</pre><hr>`;
      });

      document.getElementById("results").innerHTML = html;

    } catch (err) {
      document.getElementById("results").innerHTML = "Error: " + err.message;
    }
  });
}

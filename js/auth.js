// Configura Firebase
const firebaseConfig = {
  apiKey: "AIzaSyCScJA-UGs3WcBnfAm-6K94ybZ4bzBahz8",
  authDomain: "brain-storm-8f0d8.firebaseapp.com",
  databaseURL: "https://brain-storm-8f0d8-default-rtdb.firebaseio.com",
  projectId: "brain-storm-8f0d8",
  storageBucket: "brain-storm-8f0d8.appspot.com",
  messagingSenderId: "401208607043",
  appId: "1:401208607043:web:6f35fc81fdce7b3fbeaff6"
};

// Inicializar Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

// Login con Google
document.getElementById('googleLogin')?.addEventListener('click', () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider)
        .then(handleLoginSuccess)
        .catch(handleLoginError);
});

// Manejar login exitoso
function handleLoginSuccess(result) {
    const user = result.user;
    const username = user.displayName || user.email.split('@')[0];
    
    // Guardar en Firestore
    db.collection('users').doc(user.uid).set({
        name: username,
        email: user.email,
        lastLogin: firebase.firestore.FieldValue.serverTimestamp(),
        isPremium: false
    }, { merge: true });
    
    // Redirigir a main.html
    window.location.href = 'main.html';
}

// Cerrar sesión
document.getElementById('logoutBtn')?.addEventListener('click', () => {
    auth.signOut().then(() => {
        window.location.href = 'index.html';
    });
});

// Verificar estado de autenticación
auth.onAuthStateChanged(user => {
    if (user) {
        // Mostrar nombre de usuario
        const username = user.displayName || user.email.split('@')[0];
        document.getElementById('username').textContent = username;
        
        // Verificar si es admin
        checkAdminStatus(user.uid);
    } else if (!window.location.pathname.includes('index.html')) {
        window.location.href = 'index.html';
    }
});

// Verificar logout automático a medianoche
setInterval(() => {
    const now = new Date();
    if (now.getHours() === 0 && now.getMinutes() === 0) {
        auth.signOut();
    }
}, 60000);
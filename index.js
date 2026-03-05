// Función para mostrar el popup de contacto
function showContactInfo() {
    document.getElementById('contactPopup').style.display = 'block';
}

// Función para cerrar el popup de contacto
function closeContactPopup() {
    document.getElementById('contactPopup').style.display = 'none';
}

// Función para mostrar el popup de login
function showLoginPopup() {
    document.getElementById('loginPopup').style.display = 'block';
}

// Función para cerrar el popup de login
function closeLoginPopup() {
    document.getElementById('loginPopup').style.display = 'none';
    // Limpiar los campos
    document.getElementById('username').value = '';
    document.getElementById('password').value = '';
}

// Función para verificar el login
function checkLogin() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    
    // Credenciales correctas
    if (username === 'user1' && password === '1234') {
        
        window.location.href = 'curriculum.html';
    } else {
        // Mostrar mensaje de error
        const errorDiv = document.createElement('p');
        errorDiv.className = 'error-message';
        errorDiv.textContent = 'Usuario o contraseña incorrectos. Por favor, intenta de nuevo.';
        
        // Remover mensajes de error anteriores
        const oldError = document.querySelector('.error-message');
        if (oldError) {
            oldError.remove();
        }
        
        // Agregar nuevo mensaje de error
        document.querySelector('.login-form').appendChild(errorDiv);
    }
}

// Cerrar popups haciendo clic fuera del contenido
window.onclick = function(event) {
    const contactPopup = document.getElementById('contactPopup');
    const loginPopup = document.getElementById('loginPopup');
    
    if (event.target === contactPopup) {
        closeContactPopup();
    }
    if (event.target === loginPopup) {
        closeLoginPopup();
    }
}

// Cerrar popups con tecla ESC
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        closeContactPopup();
        closeLoginPopup();
    }
});
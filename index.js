// DECLARE the validCredentials variable at the VERY TOP
let validCredentials = { username: '', password: '' };

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

async function loadCredentials() {
    try {
        const response = await fetch('login_db.txt');
        const text = await response.text();
        
        // Parse username and password from the text file
        const usernameMatch = text.match(/Username:\s*(\S+)/i);
        const passwordMatch = text.match(/Password:\s*(\S+)/i);
        
        if (usernameMatch && passwordMatch) {
            validCredentials.username = usernameMatch[1];
            validCredentials.password = passwordMatch[1];
            console.log('Credentials loaded successfully', validCredentials);
            return true;
        } else {
            console.error('Invalid credentials format in file');
            return false;
        }
    } catch (error) {
        console.error('Error loading credentials:', error);
        return false;
    }
}

// Función para verificar el login - MAKE IT ASYNC
async function checkLogin() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    
    // If credentials aren't loaded yet, wait for them
    if (!validCredentials.username) {
        console.log('Loading credentials...');
        await loadCredentials();  // IMPORTANT: use AWAIT here
    }
    
    // Double-check if credentials loaded successfully
    if (!validCredentials.username) {
        const errorDiv = document.createElement('p');
        errorDiv.className = 'error-message';
        errorDiv.textContent = 'Error loading credentials. Please refresh the page.';
        
        const oldError = document.querySelector('.error-message');
        if (oldError) oldError.remove();
        
        document.querySelector('.login-form').appendChild(errorDiv);
        return;
    }
    
    // Now check the credentials
    if (username === validCredentials.username && password === validCredentials.password) {
        window.location.href = 'curriculum.html';
    } else {
        // Show error message
        const errorDiv = document.createElement('p');
        errorDiv.className = 'error-message';
        errorDiv.textContent = 'Usuario o contraseña incorrectos. Por favor, intenta de nuevo.';
        
        // Remove old error messages
        const oldError = document.querySelector('.error-message');
        if (oldError) oldError.remove();
        
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

window.addEventListener('DOMContentLoaded', () => {
    loadCredentials();
});
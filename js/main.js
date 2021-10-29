new WOW().init();

const buttonAuth = document.querySelector('.button-auth');
const modalAuth = document.querySelector('.modal-auth');
const loginForm = document.querySelector('#login-form');
const loginInput = document.querySelector('#input-login');
const buttonLogout = document.querySelector('#button-logout');
const userNameEl = document.querySelector('#userName');
const inputPassword = document.querySelector('#input-password');
const authMsg = document.querySelector('#auth-msg');



let login = localStorage.getItem('gloDelivery');

function toggleModalAuth() {
    modalAuth.classList.toggle("is-open");
    loginInput.classList.remove('invalid-input');
    inputPassword.classList.remove('invalid-input');
    authMsg.textContent = '';
    if (modalAuth.classList.contains("is-open")) {
        disabledScroll();
    }
    else {
        enabledScroll();
    }
}


function autorized() {
    function logOut() {
        login=null;
        localStorage.removeItem('gloDelivery');
        userNameEl.textContent = '';
        buttonLogout.removeEventListener('click', logOut);
        checkAuth();
    }
    console.log('авторизован');
    buttonAuth.style.display = "none";
    buttonLogout.style.display = "flex";
    userNameEl.textContent = "Добро пожаловать, " + login;
    buttonLogout.addEventListener('click', logOut);


}

function notAutorized() {
    buttonAuth.style.display = "flex";
    buttonLogout.style.display = "none";
    console.log('Не авторизован');
    function logIn(event) {
        event.preventDefault();
        login = loginInput.value;
        password = inputPassword.value;
        loginInput.classList.remove('invalid-input');
        inputPassword.classList.remove('invalid-input');

        if(login && password) {
            localStorage.setItem('gloDelivery', login);
            
            toggleModalAuth();
            buttonAuth.removeEventListener('click', toggleModalAuth);
            loginForm.removeEventListener('submit', logIn);
            loginForm.reset();
            checkAuth();
        }
        else {
            authMsg.textContent = 'Поля должны быть заполнены';
            if(!login) loginInput.classList.add('invalid-input');
            if(!password) inputPassword.classList.add('invalid-input');
        }
    }

    buttonAuth.addEventListener('click', toggleModalAuth);
    loginForm.addEventListener('submit', logIn);
    modalAuth.addEventListener('click', function(event) {
        if (event.target.classList.contains('is-open')) {
            toggleModalAuth();
        }
    });
}

function checkAuth() {
    if(login) {
        autorized();
    }
    else {
        notAutorized();
    }
}

checkAuth();
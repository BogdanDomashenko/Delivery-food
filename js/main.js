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

        if(login && password) {
            localStorage.setItem('gloDelivery', login);

            toggleModalAuth();
            buttonAuth.removeEventListener('click', toggleModalAuth);
            loginForm.removeEventListener('submit', logIn);
            loginForm.reset();
            checkAuth();
        }
        else {
            loginInput.classList.add('invalid-input');
            inputPassword.classList.add('invalid-input');
            authMsg.textContent = 'Поля должны быть заполнены';
        }
    }

    buttonAuth.addEventListener('click', toggleModalAuth);
    loginForm.addEventListener('submit', logIn);
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
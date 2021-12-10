'use strict';

new WOW().init();

const buttonAuth = document.querySelector('.button-auth');
const modalAuth = document.querySelector('.modal-auth');
const loginForm = document.querySelector('#login-form');
const loginInput = document.querySelector('#input-login');
const buttonLogout = document.querySelector('#button-logout');
const userNameEl = document.querySelector('#userName');
const inputPassword = document.querySelector('#input-password');
const authMsg = document.querySelector('#auth-msg');
const cardsRestaraurants = document.querySelector('.cards-restaurants');
const containerPromo = document.querySelector('.container-promo');
const restaurants = document.querySelector('.restaurants');
const menu = document.querySelector('.menu');
const logo = document.querySelector('.logoHref');
const cardsMenu = document.querySelector('.cards-menu');
const inputSearch = document.querySelector('.input-search');
const pageName = document.querySelector('.page-name');
const cartModalBody = document.querySelector('.modal-cart .modal-body');
const cartTotalPrice = document.querySelector('.modal-pricetag');
const buttonClearCart = document.querySelector('#button-clear-cart');

let cart = [];

let login = localStorage.getItem('gloDelivery');

const getData = async function(url) {
    const response = await fetch(url);

    if (!response.ok) {
        throw new Error(`Fetch address error ${url}, 
        satus error ${response.status}`);
    }
    return await response.json();
};


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
    cartButton.classList.remove('hidden');
    buttonAuth.style.display = "none";
    buttonLogout.style.display = "flex";
    userNameEl.textContent = "Добро пожаловать, " + login;
    buttonLogout.addEventListener('click', logOut);
}

function notAutorized() {
    buttonAuth.style.display = "flex";
    buttonLogout.style.display = "none";
    cartButton.classList.add('hidden');
    console.log('Не авторизован');
    function logIn(event) {
        event.preventDefault();
        login = loginInput.value;
        let password = inputPassword.value;
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

function createCardReustarants(restaurant) {
    const { 
        image, kitchen, 
        name, price, stars, 
        products, time_of_delivery: timeOfDelivery} = restaurant 

    const card = `
        <a class="card card-restaurant wow animate__animated animate__fadeInUp" data-wow-delay="0" data-name="${name}" data-stars="${stars}" data-price="${price}" data-products="${products}">
            <img src="${image}" alt="image" class="card-image">
            <div class="card-text">
                <div class="card-heading">
                    <h3 class="card-title">
                        ${name}
                    </h3>
                    <span class="card-tag tag">
                    ${timeOfDelivery}
                    </span>
                </div>
                <div class="card-info">
                    <div class="rating">
                        <img src="img/star.svg" alt="star" class="rating-star">
                        ${stars}
                    </div>
                    <div class="price">
                        От ${price} ₽
                    </div>
                    <div class="category">
                        ${kitchen}
                    </div>
                </div>
            </div>
    </a>
    `
    cardsRestaraurants.insertAdjacentHTML('beforeend', card);
}

function createReustarantInfo({ stars, name, price }) {
    if(document.querySelector('.menu-heading')) document.querySelector('.menu-heading').remove();

    const restaurantInfo = document.createElement('div');

    restaurantInfo.className = 'menu-heading';

    restaurantInfo.insertAdjacentHTML('beforeend', `
            <h2 class="section-title">
            ${name}
        </h2>
        <div class="card-info">
            <div class="rating">
                <img src="img/star.svg" alt="star" class="rating-star">
                ${stars}
            </div>
            <div class="price">
                От ${price} ₽
            </div>
            <div class="category">
                Пицца
            </div>
        </div>
    `);
    menu.insertAdjacentElement('afterbegin', restaurantInfo);
}

function removeReustarantInfo() {
    document.querySelector('.menu-heading').textContent = '';
}

function createCardGood({ description, image, name, price, id }) {
    const card = document.createElement('div');
    card.className = 'card wow animate__animated animate__fadeInUp';
    card.setAttribute('data-wow-delay', 0);
    card.id = id;
    card.insertAdjacentHTML('beforeend', `
            <img src="${image}" alt="image" class="card-image">
            <div class="card-text">
                <div class="card-heading">
                    <h3 class="card-title card-title-reg">
                        ${name}
                    </h3>
                </div>
                <div class="card-info">
                    <div class="ingredietns">
                        ${description}
                    </div>
                </div>
                <div class="card-buttons">
                    <button class="button button-primary button-add-cart">
                        <span class="button-card-text">В корзину</span>
                        <img src="img/cart2.svg" alt="shopping-cart" class="card-button-image">
                    </button>
                    <strong class="card-price-bold card-price">${price} ₽</strong>
                </div>
            </div>
    `);
    cardsMenu.insertAdjacentElement('beforeend', card);
}

function openGoods(event) {
    if(login){
        const target = event.target;
    
        const restourant = target.closest('.card-restaurant');
    
        cardsMenu.textContent = '';
        
        if (restourant) {
            userNameEl.classList.add('hidden');
            pageName.classList.add('hidden');
            containerPromo.classList.add('hidden');
            restaurants.classList.add('hidden');
            menu.classList.remove('hidden');

            createReustarantInfo(restourant.dataset);

            getData(`./db/${restourant.dataset.products}`).then(function(data) {
                data.forEach(createCardGood);
            })
        }
    }
    else {
        toggleModalAuth();
    }
}

function closeGoods() {
    removeReustarantInfo();
    inputSearch.value = '';
    containerPromo.classList.remove('hidden');
    restaurants.classList.remove('hidden');
    menu.classList.add('hidden');
    userNameEl.classList.remove('hidden');
    pageName.classList.add('hidden');
}

function addToCart(event) {
    const target = event.target;

    const buttonAddToCart = target.closest('.button-add-cart');
    if(buttonAddToCart) {
        const card = target.closest('.card');
        const title = card.querySelector('.card-title-reg').textContent;
        const coast = parseFloat(card.querySelector('.card-price').textContent);
        const id = card.id;

        const food = cart.find(function(item) {
            return item.id == id;
        });

        if(food) {
            food.count += 1;
        }
        else {
            cart.push({
                id, title, coast,
                count: 1
            })
        }

        localStorage.setItem('cart', JSON.stringify(cart));
    }
}

function renderCart() {
    cartModalBody.textContent='';
    cart.forEach((function ({id, title, coast, count}) {
        const itemCart = `
            <div class="food-row">
                <span class="food-name">${title}</span>
                <strong class="food-price">${coast} ₽</strong>
                <div class="food-counter">
                    <button class="counter-button counter-minus" data-id=${id}>-</button>
                    <span class="counter">${count}</span>
                    <button class="counter-button counter-plus" data-id=${id}>+</button>
                </div>
            </div>
        `;
        cartModalBody.insertAdjacentHTML('beforeend', itemCart);
    }))

    const totalPrice = cart.reduce(function (result, item) { 
        return result += (item.coast * item.count);
    }, 0);

    cartTotalPrice.textContent = totalPrice + ' ₽';
}

function changeCount(event) {
    const target = event.target;

    if(target.classList.contains('counter-button')) {
        const food = cart.find(item => item.id == target.dataset.id);
        if(target.classList.contains('counter-plus'))  food.count++;
        else if(target.classList.contains('counter-minus')) {
            food.count--;
            if (food.count === 0) {
                cart.splice(cart.indexOf(food), 1);
            }
        }
        localStorage.setItem('cart', JSON.stringify(cart));
        renderCart();
    }
}

function init() {
    const localStorageCart = JSON.parse(localStorage.getItem('cart'));

    if(localStorageCart) {
        console.log(localStorageCart)
        cart = localStorageCart;
    }

    getData('./db/partners.json').then(function(data) {
        data.forEach(createCardReustarants)
    });
    
    cardsRestaraurants.addEventListener('click', openGoods);
    logo.addEventListener('click', function() {
        closeGoods();
    })

    cartModalBody.addEventListener('click', changeCount);
    buttonClearCart.addEventListener('click', function () {
        cart.length = 0;
        renderCart();
    })
    
    checkAuth();
    
    inputSearch.addEventListener('keypress', function(event) {
        if(event.charCode === 13) {
            pageName.textContent = '';
            const value = event.target.value.trim();
            
            if(!value) {
                event.target.classList.add('invalid-input');
                setTimeout(function() {
                    event.target.classList.remove('invalid-input');
                },2000)
                event.target.value = '';
                return;
            }

            event.target.classList.remove('invalid-input');

            getData('/db/partners.json').then(function(data) {
                return data.map(function(partner) {
                    return partner.products;
                });
            })
            .then(function(linkProducts) {
                linkProducts.forEach(function(link) {
                    cardsMenu.textContent = '';

                    getData(`./db/${link}`).then(function(data) {
                        const resultSearch = data.filter(item => {
                            const name = item.name.toLowerCase();
                            return name.includes(value.toLowerCase());
                        });

                        containerPromo.classList.add('hidden');
                        restaurants.classList.add('hidden');
                        menu.classList.remove('hidden');
                        userNameEl.classList.add('hidden');

                        if(resultSearch.length == 0) {
                            if(pageName.textContent) return;
                            pageName.textContent  = 'Ничего не найдено';
                        }
                        else {
                            pageName.textContent = 'Результат поиска';
                            resultSearch.forEach(createCardGood);
                        }
                        pageName.classList.remove('hidden');
                    })
                })
            })
        }
    });

    cardsMenu.addEventListener('click', addToCart);

}

init();
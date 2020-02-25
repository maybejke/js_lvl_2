const API = 'https://raw.githubusercontent.com/GeekBrainsTutorial/online-store-api/master/responses';

/**
* базовые классы
**/
class List {
	constructor(url, container, list = listContext) {
		this.container = container;  // // крепим к контейнеру (.product)
		this.list = list; // словарь для классов
		this.url = url; // catalogData.json
		this.goods = []; // список продуктов
		this.allProducts = []; // список продуктов для обработки
		this.filtered = []; // отфильтрованные товары
		this._init();
	}

	// метод получения данных с сервера
	getJson(url) {
		// забираем данные из файла гитхаба
		return fetch(url ? url: `${API + this.url}`)
		// забираем результат, парсинг json
		.then(result => result.json())
		// отлавливаем ошибки
		.catch(error => {
			console.log(error);
		})
	}

	/**
	* метод для обработки данных 
	* @params data
	*/
	handelData(data){
		this.goods = [...data];
		this.render();
	}

	/**
	* метод посчета стоимости товаров
	* @returns number
	**/
	calcTotal(){
		// в продуктах, accum - общая сумма, item.price - цена одного продукта, ", 0" - стратовая.
		return this.allProducts.reduce((accum, item) => accum += item.price, 0)
	}
	// генерируем шаблон
	render() {
		const block = document.querySelector(this.container);
		// из списка продуктов goods выбираем по строчно продукты
		for (let product of this.goods) {
			// создаем экземляр класса с каждым продуктом
			const productObj = new this.list[this.constructor.name](product);
			// заполняем список всех продкутов для дальнейшего исп
			this.allProducts.push(productObj);
			// заполняем html страницу с помощью метода экземпляра класса
			block.insertAdjacentHTML('beforeend', productObj.render());
		}
	}
	/**
	* метод поиска товаров
	* @params value - запрос поиска
	**/
	filter(value){
		const regexp = new new RegExp(value, 'i');
		this.filtered = this.allProducts.filter(product => regexp.test(product.product_name));
		this.allProducts.forEach(el => {
			const block = document.querySelector(`.product-item[data-id="${el.id_product}"]`);
			if (!this.filtered.includes(el)){
				block.classList.add('invisible');
			} else {
				block.classList.remove('invisible');
			}
		})
	}

	_init() {
		return false
	}

}
	
class Item {
	constructor (el, img='https://placehold.it/200x150') {
		this.product_name = el.product_name;
	    this.price = el.price;
	    this.id_product = el.id_product;
	    this.img = img;
	}

	render() {
		return `<div class="product-item" data-id="${this.id_product}">
                <img src="${this.img}" alt="img">
                <div class="desc">
                    <h3>${this.product_name}</h3>
                    <p>${this.price} RUB</p>
                    <button class="buy-btn"
                    data-id="${this.id_product}"
                    data-name="${this.product_name}"
                    data-price="${this.price}">Купить</button>
                </div>
            </div>`	
	} 
}

class ProductList extends List {
	constructor(cart, container = '.products', url = "/catalogData.json"){
		super(url, container);
		this.cart = cart;
		this.getJson()
			.then(data => this.handelData(data));
	}

	_init(){
		document.querySelector(this.container).addEventListener('click', event => {
			if (event.target.classList.contains('buy-btn')){
				this.cart.addProduct(event.target);
		    }
	    });
	    document.querySelector('.search-form').addEventListener('submit', event => {
	    	event.preventDefault();
	    	this.filter(document.querySelector('.search-form').value)
	    })
	}
}


class ProductItem extends Item{}

class Cart extends List {
	constructor(container='.cart-block', url = '/getBasket.json') {
		super(url, container);
		this.getJson()
		.then(data => {
			this.handelData(data.contents);
		});
	}

	/**
	* adding goods to a card
	**/
	addProduct(element){
		this.getJson(`${API}/addToBasket.json`)
		.then(data => {
			if(data.result === 1){
				let productId = +element.dataset['id'];
				let find = this.allProducts.find(product => product.id_product === productId);
				if(find){
					find.quantity++;
					this._updateCart(find);
				} else {
					let product = {
						id_product: productId,
						price: +element.dataset['price'],
						product_name: +element.dataset['name'],
						quantity: 1
					};
					this.goods = [product];
					this.render();
				}
			} else {
				alert('Error');
			}
		})
	}
	/**
	* removing goods from a card
	**/

	removeProduct(element){
		this.getJson(`${API}/deleteFromBasket.json`)
		.then(data => {
			if(data.result === 1) {
				let productId = +element.dataset['id'];
				let find = this.allProducts.find(product => product.id_product === productId);
				if(find.quantity > 1) {
					find.quantity--;
					this._updateCart(find);
				} else {
					this.allProducts.splice(this.allProducts.indexOf(find, 1));
					document.querySelector(`card-item[data-id="${productId}"]`).remove();
				}
			} else {
				alert('Error');
			}
		})
	}

	_updateCart(product){
		let block = document.querySelector(`.cart-item[data-id="${product.id_product}"]`);
		block.querySelector('.product-quantity').textContent = `Quantity: ${product.quantity}`;
		block.querySelector('.product-price').textContent = `${product.quantity*product.price} RUB`;
	}
	_init() {
	    document.querySelector('.btn-cart').addEventListener('click', () => {
	      document.querySelector(this.container).classList.toggle('invisible');
	    });
		document.querySelector(this.container).addEventListener('click', event => {
			if(event.target.classList.contains('del-btn')) {
				this.removeProduct(event.target);
			}
		})
	}
}

class CartItem extends Item {
	constructor(el, img = 'https://placehold.it/50x100') {
		super(el, img);
		this.quantity = el.quantity;
	}
	render() {
		return `<div class="cart-item" data-id="${this.id_product}">
            <div class="product-bio">
            <img src="${this.img}" alt="Some image">
            <div class="product-desc">
            <p class="product-title">${this.product_name}</p>
            <p class="product-quantity">Количество: ${this.quantity}</p>
        <p class="product-single-price">${this.price} за ед.</p>
        </div>
        </div>
        <div class="right-block">
            <p class="product-price">${this.quantity * this.price} ₽</p>
            <button class="del-btn" data-id="${this.id_product}">&times;</button>
        </div>`
	}
}


const listContext = {
	ProductList: ProductItem,
	Cart: CartItem
};

let cart = new Cart();
let products = new ProductList(cart);
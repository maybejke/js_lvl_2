const API = 'https://raw.githubusercontent.com/GeekBrainsTutorial/online-store-api/master/responses';


class ProductItem {
	constructor (product, img='https://placehold.it/200x150') {
		this.title = product.product_name;
		this.price = product.price;
		this.id = product.id_product;
		this.img = img;
	}

	render() {
		return `<div class="product-item" data-id="${this.id}">
					<img src="${this.img}" alt="img">
					<div class='desc'>
						<h3> ${this.title}</h3>
						<p ${this.price}</p>
						<button class="buy-btn"
						data-id="${this.id}"
						data-name="${this.name}"
						data-price="${this.price}"
						data-img="${this.img}"
						> Buy </button>
					</div>
				</div>`	
	} 
}

class ProductList {
	constructor(container = '.products') {
		// крепим к контейнеру
		this.container = container;
		// список товаров
		this.goods = [];
		// для работы со всеми продуктами
		this.allProducts = [];
		// забираем данные с сервера
		this._getProducts()
			// разбираем еще раз полученные данные
			.then(data => {
				this.goods = [...data];
				// отрисовываем продукты
				this.render();
			});
	}

	// метод забора данных из базы
	_getProducts() {
		// забираем данные из файла гитхаба
		return fetch(`${API}/catalogData.json`)
		// забираем результат, парсинг json
		.then(result => result.json())
		// отлавливаем ошибки
		.catch(error => {
			console.log('error', error);
		});
	}

	// генерируем шаблон
	render() {
		const block = document.querySelector(this.container);
		// из списка продуктов goods выбираем по строчно продукты
		for (let product of this.goods) {
			// создаем экземляр класса с каждым продуктом
			const productObject = new ProductItem(product);
			// заполняем список всех продкутов для дальнейшего исп
			this.allProducts.push(productObject);
			// заполняем html страницу с помощью метода экземпляра класса
			block.insertAdjacentHTML('beforeend', productObject.render());
		}
	}

	calcTotal() {
		// в продуктах, accum - общая сумма, item.price - цена одного продукта, ", 0" - стратовая.
		return this.allProducts.reduce((accum, item) => accum += item.price, 0)
	}
}

// class Catalog extends ProductList {
// 	constructor (cart, url = '/catalogData.json', container='.products') {
// 		super (url, container)
// 		this.cart = cart;
// 	}

// 	_addListeners () {
// 		document.querySelector('.products').addEventListener('click', (evt) => {
// 			if (evt.target.classList.contains('buy-btn')) {
// 				this.cart.addProduct(evt.target);
// 			}
// 		})
// 	}
// 	_init() {
// 		this._getProducts().then(data => {
// 				this.goods = [...data];
// 				// отрисовываем продукты
// 				this.render();
// 				.finally (() => {this.addListeners ()})
// 			});
// 	}
// }

// class BasketItem extends ProductItem {}

new ProductList();
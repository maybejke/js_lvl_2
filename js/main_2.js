class ProductItem {
	constructor (product, img='https://placehold.it/200x150') {
		this.title = product.title;
		this.price = product.price;
		this.id = product.id;
		this.img = img;
	}

	render() {
		return `<div class="product-item" data-id="${this.id}">
					<img src="${this.img}" alt="img">
					<div class='desc'>
						<h3> ${this.title}</h3>
						<p ${this.price}</p>
						<button class="buy-btn"> Buy </button>
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
		this._fetchProducts();
		// отрисовываем продукты
		this.render();
		console.log(this.goods);
    	console.log(this.allProducts);
    	console.log(this.sum());

	}

	// метод забора данных из базы
	_fetchProducts() {
		this.goods = [
			{id: 1, title: 'MacBook Air', price: 1000},
			{id: 2, title: 'MacBook Pro 13', price: 1200},
			{id: 3, title: 'MacBook Pro 15', price: 1300},
			{id: 4, title: 'MacBook Air 2018', price: 700},
			{id: 5, title: 'MacBook Pro 16', price: 1500},
		];
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

	sum() {
		let totalPrice = 0;
		for (let product of this.allProducts) {
			totalPrice += product.price; 
		}
		return totalPrice;
	}
}

new ProductList();
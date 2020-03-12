const API = 'https://raw.githubusercontent.com/GeekBrainsTutorial/online-store-api/master/responses';

const app = new Vue({
	el: '#app',
	data: {
		catalogUrl: '/catalogData.json',
        cartUrl: '/getBasket.json',
		userSearch: '',
        showCart: false,
        products: [],
        cartItems: [],
        filtered: [],
        imgCart: 'https://placehold.it/50x100',
        imgCatalog: 'https://placehold.it/200x150',
	},
	methods: {
		getJson(url){
			return fetch(url)
			.then(result => result.json())
			.catch(error => {
				console.log(error);
			})
		},
		// метод добавления товара в корзину
		addProduct(product){
            this.getJson(`${API}/addToBasket.json`)
            .then(data => {
                if(data.result === 1){
                    let find = this.cartItems.find(el => el.id_product === product.id_product);
                    if(find){
                        find.quantity++;
                    } else {
                        let prod = Object.assign({quantity: 1}, product);
                        this.cartItems.push(prod)
                    }
                } else {
                    alert('Error');
                }
            })
        },
        // метод удаления товара
        remove(item) {
            this.getJson(`${API}/deleteFromBasket.json`)
            .then(data => {
                if(data.result === 1) {
                    if(item.quantity>1){
                        item.quantity--;
                    } else {
                        this.cartItems.splice(this.cartItems.indexOf(item), 1)
                    }
                }
            })
        },
        // фильтрация используя регулярные выражения
        filter(){
            let regexp = new RegExp(this.userSearch, 'i');
            this.filtered = this.products.filter(el => regexp.test(el.product_name));
        }
	},
	mounted(){
		this.getJson(`${API + this.cartUrl}`)
            .then(data => {
                for(let el of data.contents){
                    this.cartItems.push(el);
                }
            });
        this.getJson(`${API + this.catalogUrl}`)
           .then(data => {
               for(let el of data){
                   this.products.push(el);
                   this.filtered.push(el);
               }
           });
        this.getJson(`getProducts.json`)
            .then(data => {
                for(let el of data){
                    this.products.push(el);
                    this.filtered.push(el);
                }
            })
	}
})
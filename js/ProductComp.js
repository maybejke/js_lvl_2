
Vue.component('products', {
    data(){
        return { 
            catalogUrl: '/catalogData.json',
            products: [],
            filtered: [],
            imgCatalog: 'https://placehold.it/200x150',
        }
    },
    methods: {
         filter(){
            let regexp = new RegExp(this.userSearch, 'i');
            this.filtered = this.products.filter(el => regexp.test(el.product_name));
        }
    },
    mounted(){
        this.$parent.getJson(`${API + this.catalogUrl}`)
        .then(data => {
            for(let el of data){
                this.product.push(el);
                this.filtered.push(el);
            }
        })
    },
    template:
        `<div class="products">
            <product v-for="item of products"
                :key="item.id_product"
                :img="img"
                :product="item"></product>
        </div>`
})

Vue.component('product', {
    props: ['product', 'img'],
    data() {
        return {
            cartAPI: this.$root.refs.cart,
        };
    },

    template:
        `<div class="product-item">
                <img :src="img" alt="Some img">
                <div class="desc">
                    <h3>{{product.product_name}}</h3>
                    <p>{{product.price}}₽</p>
                    <button class="buy-btn" @click="cartAPI.addProduct(product)">Купить</button>
                </div>
            </div>
        `
})


// Vue.component('products', {
//     props: ['products', 'img'],
//     template: `
//         <div class="products">
//             <product v-for="item of products"
//                 :key="item.id_product"
//                 :img="img"
//                 :product="item"></product>
//         </div>
//     `
// });
// Vue.component('product', {
//     props: ['product', 'img'],
//     template: `
//     <div class="product-item">
//                 <img :src="img" alt="Some img">
//                 <div class="desc">
//                     <h3>{{product.product_name}}</h3>
//                     <p>{{product.price}}₽</p>
//                     <button class="buy-btn" @click="$parent.$emit('add-product', product)">Купить</button>
//                 </div>
//             </div>
//     `
// });


var eventBus = new Vue()

Vue.component('product', {
    props: {
        premium: {
            type: Boolean,
            required: true
        }
    },
    template: `
    <div class="product">
            <div class="product-image">
                <img v-bind:src="image">
            </div>
            <div class="product-info">
                <h1>{{title}}</h1>
                <h2>{{frase}}</h2>

                <p v-if="estoque > 15">Em estoque</p>
                <p v-else-if="estoque <= 15 && estoque > 0"> Estoque quase acabando</p>
                <p v-else>Sem estoque</p>
                <p>Correio: {{correio}} <p/>

                <ul>
                    <li v-for="detail in details">{{detail}}</li>
                </ul>
                <p>OPCOES:</p>
                <div v-for="(variante, index) in variantes" :key="variante.varianteId" class="color-box"
                    :style="{ backgroundColor: variante.cor}" @mouseover="trocaDeTenis(index)">
                </div>

                <button v-on:click="addAoCarrinho" 
                :disabled="!estoque" 
                :class="{ disabledButton: !estoque }">
                Adicionar ao carrinho
                </button>
            </div>
            <product-tabs :reviews="reviews"></product-tabs>
            
        </div>
        `,
    data() {
        return {
            produto: 'Tenis',
            marca: 'ESTUDOS DE VUE:',
            frase: 'Feito de tecido com sola de borracha',
            varianteSelecionada: 0,
            details: ['80% tecido', '20%borracha', 'esportivo'],
            variantes: [
                {
                    varianteId: 11111111,
                    varianteCor: "azul e amarelo",
                    cor: "blue",
                    varianteImage: "tenis_azul.jpg",
                    varianteQuantidade: 20
                },
                {
                    varianteId: 22222222,
                    varianteCor: "preto e vermelho",
                    cor: "black",
                    varianteImage: "tenis_preto.jpg",
                    varianteQuantidade: 5
                }
            ],
            reviews: []
        }
    },
    methods: {
        addAoCarrinho: function () {
            this.$emit('add-to-cart', this.variantes[this.varianteSelecionada].varianteId)
        },
        trocaDeTenis: function (index) {
            this.varianteSelecionada = index
            console.log(index)
        },
    },
    computed: {
        title() {
            return this.marca + ' ' + this.produto;
        },
        image() {
            return this.variantes[this.varianteSelecionada].varianteImage
        },
        estoque() {
            return this.variantes[this.varianteSelecionada].varianteQuantidade
        },
        correio() {
            if (this.premium) {
                return 'Free'
            }
            else {
                return 2.99
            }
        }
    },
    mounted() {
        eventBus.$on('review-submitted', productReview => {
            this.reviews.push(productReview)
        })
    }
})
Vue.component('product-review', {
    template: `
    <form class="review-form" @submit.prevent="onSubmit">

    <p v-if="errors.length">
        <b>Por favor, corrija o(s) seguinte(s) erro(s):</b>
        <ul>
            <li v-for="error in errors">{{ error }}</li>
        </ul>
    </p>
      <p>
        <label for="name">Nome:</label>
        <input id="name" v-model="name" placeholder="name">
      </p>
      
      <p>
        <label for="review">Review:</label>      
        <textarea id="review" v-model="review" ></textarea>
      </p>
      
      <p>
        <label for="rating">Nota:</label>
        <select id="rating" v-model.number="rating">
          <option>5</option>
          <option>4</option>
          <option>3</option>
          <option>2</option>
          <option>1</option>
        </select>
      </p>
          
      <p>
        <input type="submit" value="Submit">  
      </p>    
    
    </form>
    `,
    data() {
        return {
            name: null,
            review: null,
            rating: null,
            errors: []
        }
    },
    methods: {
        onSubmit() {
            if (this.name && this.review && this.rating) {
                let productReview = {
                    name: this.name,
                    review: this.review,
                    rating: this.rating
                }
                eventBus.$emit('review-submitted', productReview)
                this.name = null
                this.review = null
                this.rating = null
            }
            else {
                if (!this.name) this.errors.push("Precisa de nome.")
                if (!this.review) this.errors.push("Precisa de review.")
                if (!this.rating) this.errors.push("Precisa de nota.")
            }
        }
    }
})

Vue.component('product-tabs', {
    props: {
        reviews: {
            type: Array,
            required: true
        }
    },
    template: `
      <div>    
          <span class="tab" 
          :class="{ activeTab: selectedTab === tab }"
            v-for="(tab, index) in tabs" 
            @click="selectedTab = tab">
          {{ tab }}</span>

          <div v-show="selectedTab==='Reviews'">
                <p v-if="!reviews.length">Ainda nao tem reviews.</p>
                <ul>
                    <li v-for="review in reviews">
                        <p>Nome: {{ review.name }}</p>
                        <p>Nota: {{ review.rating }}</p>
                        <p>Review: {{ review.review }}</p>
                    </li>
                </ul>
            </div>
            <product-review v-show="selectedTab==='Fazer uma review'"></product-review>
      </div>
    `,
    data() {
        return {
            tabs: ['Reviews', 'Fazer uma review'],
            selectedTab: 'Reviews'
        }
    }
})
var app = new Vue({
    el: '#app',
    data: {
        premium: true,
        carrinho: []
    },
    methods: {
        updateCart(id) {
            this.carrinho.push(id)
        }
    }
})

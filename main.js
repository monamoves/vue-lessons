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
        <img :src="image" />
      </div>

      <div class="product-info">
        <h1>{{ brand}} {{ product }}</h1>
        <p v-if="inventory > 10">In Stock</p>
        <p v-else-if="inventory <= 10 && inventory > 0">Almost sold out!</p>
        <p v-else class="outOfStock">Out of stock</p>
        <p>{{ sale }}</p>
        <p>Shipping: {{ shipping }}</p>

        <ul>
          <li v-for="detail in details">{{ detail }}</li>
        </ul>

        <div class="color-box" 
          v-for="(variant, index) in variants" 
          :key="variant.variantId"
          :style="{ backgroundColor: variant.variantColor }"
          @mouseover="updateProduct(index)">
        </div>

        <ul>
          <li v-for="size in sizes">{{ size }}</li>
        </ul>

        <button v-on:click="addToCart">Add to Cart</button>


        <p><a :href="link">Better products can be found here</a></p>
      </div>

  </div>
  `,
  data() {
    return {
      product: "T-shirts",
      brand: "PS/IS 78Q",
      selectedVariant: 0,
      image:
      "https://www.vuemastery.com/images/challenges/vmSocks-green-onWhite.jpg",
      link: "http://www.monamoves.com",
      inventory: 0,
      details: ["100% cotton", "adult and child sizes available"],
      sizes: ["small", "medium", "large", "x-large"],
      variants: [
        {
          variantId: 1001,
          variantColor: 'grey',
          variantImage: 'https://www.vuemastery.com/images/challenges/vmSocks-green-onWhite.jpg',
          variantQuantity: 10
        },
        {
          variantId: 1002,
          variantColor: 'red',
          variantImage: 'https://www.vuemastery.com/images/challenges/vmSocks-blue-onWhite.jpg',
          variantQuantity: 4
        }
      ],
      onSale: true
    }
  },
    methods: {
      addToCart: function() {
        this.$emit('add-to-cart',
          this.variants[this.selectedVariant].variantId)
      },
      updateProduct: function (index) {
        this.selectedVariant = index
      }
    },
    computed: {
      image() {
        return this.variants[this.selectedVariant].variantImage
      },
      inStock() {
        return this.variants[this.selectedVariant].variantQuantity
      },
      sale() {
        if (this.onSale) {
          return this.brand + " " + this.product + ' ' + ' are on sale now!'
        }
        return this.brand + " " + this.product + ' ' + 'is not on sale.'
      },
      shipping() {
        if (this.premium) {
          return "Free";
        }
        return 2.99;
      }
    }
})

var app = new Vue({
  el: "#app",
  data: {
    premium: false,
    cart: []
  },
  methods: {
    updateCart(id) {
      this.cart.push(id)
    }
  }
});



//how can the inventory property connect to the souc=rce of t-shirts?
// need an image of t-shirt
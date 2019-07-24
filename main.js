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
        <p v-if="variants.variantQuantity > 10">In Stock</p>
        <p v-else-if="variants.variantQuantity <= 10 && variants.variantQuantity > 0">Almost sold out!</p>
        <p v-else class="outOfStock">Out of stock</p>
        <p>{{ sale }}</p>
        <p>Shipping: {{ shipping }}</p>

        <ul>
          <li v-for="detail in details">{{ detail }}</li>
        </ul>

        <div class="color-box" 
          v-for="(variant, index) in variants" 
          :key="variants.variantId"
          :style="{ backgroundColor: variant.variantColor }"
          @mouseover="updateProduct(index)">
        </div>

        <ul>
          <li v-for="size in sizes">{{ size }}</li>
        </ul>

        <button v-on:click="addToCart">Add to Cart</button>

        <button @click="removeFromCart">Remove Item</button>

        <customer-info @info-submitted="addCustomer"


        <p><a :href="link">Better products can be found here</a></p>
      </div>

  </div>
  `,
  data() {
    return {
      product: "T-shirts",
      brand: "PS/IS 78Q",
      selectedVariant: 0,
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
      onSale: true,
      customers: []
    };
  },
    methods: {
      addToCart: function() {
        this.$emit('add-to-cart',
          this.variants[this.selectedVariant].variantId)
      },
      updateProduct: function(index) {
        this.selectedVariant = index
      },
      removeFromCart: function() {
        this.$emit('remove-from-cart', this.variants[this.selectedVariant].variantId)
      }
      addCustomer(customerInfo) {
        this.customers.push(customerInfo);
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
});

Vue.component("customer-info", {
  template:
  `<form class="customer-form" @submit.prevent="onSubmit">
  <p class="error" v-if-:errors.length">
  <b>Please correct the following error(s):</b>
  <ul>
  <li v-for-"error in errors">{{ error }}</li>
  </ul>
  </p>

  <p>
  <label for="name">Name:</label>
  <input id="name" v-model="name">
  </p>

  <p>
  <label for="class"Class Number:</label>
  <input id="class" v-model="class"></input>
  </p>

  <p>
  <label for="teacher">Teacher: </label>
  <input id="teacher" v=model="teacher">
  </p>

  <p>
  <input type="submit" value="Submit">
  </p>

  </form>
  `,
  data() {
    return {
      name: null,
      class: null,
      teacher: null,
      errors: []
    };
  },
  methods: {
    onSubmit() {
      this.errors = [];
      if (this.name && this.class && this.teacher) {
        let customerInfo = {
          name: this.name,
          class: this.class,
          teacher: this.teacher
        };
        this.$emit("info-submitted", customerInfo);
        this.name = null;
        this.class = null;
        this.teacher = null;
      } else {
        if (!this.name) this.errors.push("Name required");
        if (!this.class) this.errors.push("Class required");
        if (!this.teacher) this.errors.push("Teacher's name required");

      }
    }
  }
});

var app = new Vue({
  el: "#app",
  data: {
    premium: false,
    cart: []
  },
  methods: {
    updateCart(id) {
      this.cart.push(id)
    },
    removeItem(id) {
      for(var i = this.cart.length - 1; i >= 0; i--) {
        if (this.cart[i] === id) {
          this.cart.splice(i, 1);
        }
      }
    }  
  }
});



//how can the inventory property connect to the souc=rce of t-shirts?
// need an image of t-shirt
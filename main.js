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

        <div>
          <button v-on:click="addToCart">Add to Cart</button>

          <button @click="removeFromCart">Remove Item</button>
        </div>

        <div class="customer">
          <customer-tabs :customers="customers"></customer-tabs>
        </div>

        <div>
        <cart :cart="cart"></cart>
        </div>

        <p><a :href="link">Return to PS/IS 78Q PTA</a></p>
    </div>

  </div>
  `,
  data() {
    return {
      product: "T-shirts",
      brand: "PS/IS 78Q",
      selectedVariant: 0,
      link: "http://www.psis78pta.org",
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
    }
  },
    methods: {
      addToCart() {
        this.$emit('add-to-cart',
          this.variants[this.selectedVariant].variantId)
      },
      updateProduct(index) {
        this.selectedVariant = index
      },
      removeFromCart() {
        this.$emit('remove-from-cart', this.variants[this.selectedVariant].variantId);
      },
      showCart() {
        this.cart = index
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
          return this.brand + " " + this.product + ' ' + ' are on sale now!';
        }
        return this.brand + " " + this.product + ' ' + 'is not on sale.';
      },
      shipping() {
        if (this.premium) {
          return "Free";
        }
        return 2.99;
      }
    },
    mounted() {
      eventBus.$on('info-submitted', customerInfo => {
        this.customers.push(customerInfo)
      })
    }
})

Vue.component('customer-info', {
  template:
  `<form class="customer-form" @submit.prevent="onSubmit">
  <p class="error" v-if="errors.length">
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
  <label for="classroom">Class Number:</label>
  <input id="classroom" v-model="classroom"></input>
  </p>

  <p>
  <label for="teacher">Teacher: </label>
  <input id="teacher" v-model="teacher">
  </p>

  <p>
  <input type="submit" value="Submit">
  </p>

  </form>
  `,
  data() {
    return {
      name: null,
      classroom: null,
      teacher: null,
      errors: []
    }
  },
  methods: {
    onSubmit() {
      this.errors = []
      if (this.name && this.classroom && this.teacher) {
        let customerInfo = {
          name: this.name,
          classroom: this.classroom,
          teacher: this.teacher
        }
        eventBus.$emit("info-submitted", customerInfo)
        this.name = null
        this.classroom = null
        this.teacher = null
      } else {
        if (!this.name) this.errors.push("Name required.")
        if (!this.classroom) this.errors.push("Class required.")
        if (!this.teacher) this.errors.push("Teacher's name required.")

      }
    }
  }
})

Vue.component('customer-tabs', {
  props: {
    customers: {
      type: Array,
      required: false
    }
  },
  template: `
  <div>
    <div>
    <span class="tab"
          :class="{ activeTab: selectedTab === tab }"
          v-for="(tab, index) in tabs" 
          :key="index"
          @click="selectedTab = tab">
          {{ tab }}</span>
    </div>

    <div v-show="selectedTab === 'Entered Info'">
        <p v-if="!customers.length">You have not entered your customer info.</p>
        <ul v-else>
        <li v-for="(customer, index) in customers" :key="index">
        <p>Customer Name: {{ customer.name }}</p>
        <p>Classroom Number: {{ customer.classroom }}</p>
        <p>Teacher Name: {{ customer.teacher }}</p>
        </li>
        </ul>
    </div>

        <customer-info v-show="selectedTab === 'Customer Form'"></customer-info>

        <cart v-show="selectedTab === 'View Cart'"></cart>


  </div>

  `,
  data() {
    return {
      tabs: ['Entered Info', 'Customer Form'],
      selectedTab: 'Entered Info'
    }
  },
})

Vue.component('cart', {
  props: {
    cart: {
      type: Array,
      required: false
    }
  },
  template: `
    <div class="cart">
      <span class="view-cart" 
      v-for="(cart, index) in cart" 
      :key="index" 
      @click="showCart">{{ cart }} View Cart</span>

      <div>
        <cart :cart="cart"></cart>
        </div>

    </div>
  `,
  methods: {
    onClick() {
      this.cart = []
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
      this.cart.push(id);
    },
    removeItem(id) {
      for(var i = this.cart.length - 1; i >= 0; i--) {
        if (this.cart[i] === id) {
          this.cart.splice(i, 1);
        }
      }
    }  
  }
})



//how can the inventory property connect to the souc=rce of t-shirts?
// need an image of t-shirt
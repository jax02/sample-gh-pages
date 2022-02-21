//import { createApp } from "https://cdnjs.cloudflare.com/ajax/libs/vue/3.2.26/vue.esm-browser.min.js";
//1.html v-form先暫時註解
//2.取得資料 "客戶購物-產品"
//3.資料呈現在畫面上(產品列表)
//4.按鈕功能(元件建立、建立modal實體、掛載至html)
//5.購物車列表
//6.loading功能



const apiUrl = 'https://vue3-course-api.hexschool.io/v2';
const apiPath = 'kai';



//驗證套件提供的函式(定義規則用)
//部分載入
// VeeValidate.defineRule('email', VeeValidateRules['email']);
// VeeValidate.defineRule('required', VeeValidateRules['required']);

//全部載入
Object.keys(VeeValidateRules).forEach(rule => {
    if (rule !== 'default') {
        VeeValidate.defineRule(rule, VeeValidateRules[rule]);
    }
});

//引入中文版驗證資訊
VeeValidateI18n.loadLocaleFromURL("./zh_TW.json");

// 套用、修改驗證資訊
VeeValidate.configure({
    generateMessage: VeeValidateI18n.localize("zh_TW"),
    validateOnInput: true, // 調整為輸入字元立即進行驗證
});



const app = Vue.createApp({
    data() {
        return {
            cartData: {},
            products: [],
            productId: '',
            isLoadingItem: '',
            user: {
                name: "",
                email: "",
                tel: "",
                address: "",
            },
            message: '',
        }
    },
    //用區域元件方式註冊驗證元件
    // components: {
    //     //自訂名稱:前方解構的
    //     Vform: Form,
    //     Vfield: Field,
    //     ErrorMessage: ErrorMessage,
    // },
    methods: {
        getProducts() {
            axios.get(`${apiUrl}/api/${apiPath}/products/all`)
                .then(res => {
                    this.products = res.data.products;
                })
                .catch(err => {
                    console.log(err);
                });
        },
        openProductModal(id) {
            //元件要加上ref才能用此方式呼叫
            this.productId = id;
            this.$refs.productModal.openModal();
        },
        getCart() {
            axios.get(`${apiUrl}/api/${apiPath}/cart`)
                .then(res => {
                    this.cartData = res.data.data;
                })
                .catch(err => {
                    console.log(err);
                });
        },
        addToCart(id, qty = 1) {
            const data =
            {
                "product_id": id,
                qty
            };
            this.isLoadingItem = id;
            axios.post(`${apiUrl}/api/${apiPath}/cart`, { data })
                .then(res => {
                    this.getCart();
                    this.isLoadingItem = '';
                    this.$refs.productModal.closeModal();
                })
                .catch(err => {
                    console.log(err);
                });
        },
        removeCartItem(id) {
            this.isLoadingItem = id;
            axios.delete(`${apiUrl}/api/${apiPath}/cart/${id}`)
                .then(res => {
                    this.getCart();
                    this.isLoadingItem = '';
                })
                .catch(err => {
                    console.log(err);
                });
        },
        removeCarts() {
            axios.delete(`${apiUrl}/api/${apiPath}/carts`)
                .then(res => {
                    this.getCart();
                })
                .catch(err => {
                    console.log(err);
                });
        },
        updateCartItem(item) {
            const data =
            {
                "product_id": item.id,
                "qty": item.qty,
            };
            this.isLoadingItem = item.id;
            axios.put(`${apiUrl}/api/${apiPath}/cart/${item.id}`, { data })
                .then(res => {
                    this.getCart();
                    this.isLoadingItem = '';
                })
                .catch(err => {
                    console.log(err);
                });
        },
        //手機號碼規則
        isPhone(value) {
            const phoneNumber = /^(09)[0-9]{8}$/
            return phoneNumber.test(value) ? true : '需要正確的電話號碼'
        },
        // 送出表單
        onSubmit() {
            const data = {
                user: this.user,
                message: this.meaasge
            };
            axios.post(`${apiUrl}/api/${apiPath}/order`, { data })
                .then(res => {
                    //重設表單
                    console.log(res);
                    this.$refs.form.resetForm();
                })
                .catch(err => {
                    console.log(err);
                });
        },
    },
    mounted() {
        this.getProducts();
        this.getCart();
    }
});
//註冊元件(全域方式)
app.component('VForm', VeeValidate.Form);
app.component('VField', VeeValidate.Field);
app.component('ErrorMessage', VeeValidate.ErrorMessage);
//$refs方式(ref=modal)
app.component('product-modal', {
    //props:外傳內
    props: ['id'],
    template: '#userProductModal',
    data() {
        return {
            modal: {},
            product: {},
            qty: 1,
        }
    },
    //產品id更動的監控
    watch: {
        id() {
            this.getproduct();
        }
    },
    methods: {
        openModal() {
            this.modal.show();
        },
        closeModal() {
            this.modal.hide();
        },
        getproduct() {
            axios.get(`${apiUrl}/api/${apiPath}/product/${this.id}`)
                .then(res => {
                    console.log(res.data);
                    this.product = res.data.product;
                })
                .catch(err => {
                    console.log(err);
                });
        },
        addToCart() {
            this.$emit('add-cart', this.product.id, this.qty);
            this.qty = 1;
        },
    },
    mounted() {
        this.modal = new bootstrap.Modal(this.$refs.modal);
    }
});


app.mount("#app");
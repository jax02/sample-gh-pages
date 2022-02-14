import { createApp } from 'https://cdnjs.cloudflare.com/ajax/libs/vue/3.2.26/vue.esm-browser.min.js';

// const api = "https://vue3-course-api.hexschool.io/v2/admin/signin";
// const apiPath = "kai";
const url = 'https://vue3-course-api.hexschool.io/v2';

createApp({
    data() {
        return {
            //表單input位置記得v-model資料才回傳入
            user: {
                username: '',
                password: '',
            },
        }
    },
    methods: {
        login() {
            const api = 'https://vue3-course-api.hexschool.io/v2/admin/signin';
            axios.post(api, this.user).then((response) => {
                const { token, expired } = response.data;
                // 寫入 cookie token
                // expires 設置有效時間
                document.cookie = `hexToken=${token};expires=${new Date(expired)}; path=/`;
                // window.location = 'products.html';
                window.location = "product_week4.html"
            }).catch((error) => {
                alert(error.data.message);
            });
        },
    },
}).mount('#app');
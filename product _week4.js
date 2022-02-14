import { createApp } from "https://cdnjs.cloudflare.com/ajax/libs/vue/3.2.26/vue.esm-browser.min.js";
import pagination from "./pagination.js";
const url = 'https://vue3-course-api.hexschool.io/v2';
const apiUrl = 'https://vue3-course-api.hexschool.io/v2';
const apiPath = 'kai';
//admin身份驗證
//驗證成功撈資料顯示

//下方建構modal時用的
let productModal = null;
let delProductModal = null;


createApp({
    components: {
        pagination
    },
    data() {
        return {
            apiUrl: 'https://vue3-course-api.hexschool.io/v2',
            apiPath: 'kai',
            products: [],
            isNew: false,//用來區分新增(true)、編輯(false)Model
            num: '',
            tempProducts: {
                imagesUrl: [],
            },
            pagination: {},
        }
    },
    methods: {
        checkAdmin() {
            const url = `${this.apiUrl}/api/user/check`;
            axios.post(url).then(res => {
                //驗證成功表示有管理員身份，就能讀取後台產品資料
                this.getData();
            })
                .catch(err => {
                    alert(err.message);
                    //驗證失敗返回首頁
                    window.location = 'index.html';
                });

        },
        //若參數只帶page若沒給值會是undefined因此 =1 會讓其預設第一頁開始
        getData(page = 1) {
            const url = `${this.apiUrl}/api/${this.apiPath}/admin/products/?page=${page}`;
            axios.get(url).then(res => {
                //取得產品資料
                this.products = res.data.products;
                this.num = Object.keys(this.products).length;
                //沒有"/all"結尾的api才有分頁資訊
                this.pagination = res.data.pagination;
                //參數預設值 "?page=${函式帶的參數}"

            })
                .catch(err => {
                    alert(err.data.message);
                });
        },
        openProduct(item) {
            this.tempProducts = item;
        },
        //須先判斷新增、修改、刪除狀態
        openModal(status, item) {
            if (status == 'new') {
                this.tempProducts = {
                    imagesUrl: []
                };
                productModal.show()
                this.isNew = true;//修改狀態，表示為新增
            }
            else if (status == 'edit') {
                //用此方式複製才不會同步影響
                this.tempProducts = { ...item };
                productModal.show();
                this.isNew = false;
            } else if (status == 'del') {
                this.tempProducts = { ...item };
                delProductModal.show();
            }

        },
        delProduct() {
            let url = `${this.apiUrl}/api/${this.apiPath}/admin/product/${this.tempProducts.id}`;
            axios.delete(url)
                .then(res => {
                    console.log(res);
                    delProductModal.hide();
                    this.getData();
                })
                .catch(err => {
                    console.log(err);
                })
        },
    },
    mounted() {
        const token = document.cookie.replace(/(?:(?:^|.*;\s*)hexToken\s*\=\s*([^;]*).*$)|^.*$/, "$1");
        //axios自動帶入驗證欄位
        axios.defaults.headers.common['Authorization'] = token;
        this.checkAdmin();
        // 使用 new 建立 bootstrap Modal，拿到實體 DOM 並賦予到變數上(方便後續的show、hide操作)
        // 新增 和 編輯共用 productModal
        // 賦予方法為bs5官網寫法(可帶2個參數：DOM元素、額外設定)
        productModal = new bootstrap.Modal(document.getElementById('productModal'), {
            keyboard: false
        });
        // 刪除使用 delProductModal
        delProductModal = new bootstrap.Modal(document.getElementById('delProductModal'), {
            keyboard: false
        });
    }
})
    .component('productModal', {
        props: ['tempProducts'],
        template: '#templateForProductModal',
        methods: {
            updateProduct() {
                let url = `${apiUrl}/api/${apiPath}/admin/product`;
                let method = 'post';
                if (this.isNew) {
                    url = `${apiUrl}/api/${apiPath}/admin/product/${this.tempProducts.id}`;
                    method = 'put';
                }
                //注意後端給的api post格式
                axios[method](url, { data: this.tempProducts })
                    .then(res => {
                        this.$emit('get-product');
                        productModal.hide();

                    })
                    .catch(err => {
                        console.log(err);
                    });
            },
        }
    })
    .component('deleteModal', {
        props: ['tempProducts'],
        template: '#templateForDelete',
        methods: {
            delProduct() {
                let url = `${apiUrl}/api/${apiPath}/admin/product/${this.tempProducts.id}`;
                axios.delete(url)
                    .then(res => {
                        delProductModal.hide();
                        this.$emit('get-product');
                    })
                    .catch(err => {
                        console.log(err);
                    })
            },
        }
    })
    .mount("#app");
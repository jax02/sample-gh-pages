export default {
    //內層pages、外層paginstion
    props: ['pages'],
    template: `<nav aria-label="Page navigation example">
  <ul class="pagination">
    <li class="page-item" :class="{disabled: !pages.has_pre}">
      <a class="page-link" href="#" 
      @click="$emit('get-product',pages.current_page-1)"
      aria-label="Previous">
        <span aria-hidden="true">&laquo;</span>
      </a>
    </li>
    <li class="page-item" 
    :class="{active:page==pages.current_page}"
    v-for="page in pages.total_pages" :key="page+'page'">
    <a class="page-link" href="#"
    @click="$emit('get-product',page)">{{page}}</a></li>
    <li class="page-item" :class="{disabled: !pages.has_next}">
      <a class="page-link" href="#" 
      @click="$emit('get-product',pages.current_page+1)"
      aria-label="Next">
        <span aria-hidden="true">&raquo;</span>
      </a>
    </li>
  </ul>
</nav> `
}



// vue控制class 方法    :class="{狀態:判斷式} 範例:6、12、14
// bs5 一定要記熟
// 排版/工具/通用類別(要能不用看能key出來)


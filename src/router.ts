import './style.css'
import { createRouter, createWebHashHistory } from 'vue-router'
import Home from './Home.vue'
import ImgToPDF from './projects/img-to-pdf/ImgToPDF.vue'

const routes = [
  { path: '/', component: Home },
  { path: '/projects/img-to-pdf', component: ImgToPDF }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
})

export default router
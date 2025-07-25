import './style.css'
import { createRouter, createWebHistory } from 'vue-router'
import Home from './Home.vue'
import ImgToPDF from './projects/img-to-pdf/ImgToPDF.vue'

const routes = [
  { path: '/', component: Home },
  { path: '/projects/img-to-pdf', component: ImgToPDF }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
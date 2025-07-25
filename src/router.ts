import './style.css'
import { createRouter, createWebHashHistory } from 'vue-router'
import Home from './Home.vue'
import ImgToPDF from './projects/img-to-pdf/ImgToPDF.vue'

const routes = [
  { path: '/', component: Home, meta: { title: 'Martipops Projects' } },
  { path: '/projects/img-to-pdf', component: ImgToPDF, meta: { title: 'Images to PDF' } }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
})

export default router
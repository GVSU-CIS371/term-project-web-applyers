import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'  // Changed from Home.vue
import CollegeView from '../views/CollegeView.vue'  // Changed from Colleges.vue
import CollegeDetail from '../views/CollegeDetail.vue'
import AddReview from '../views/AddReview.vue'
import LoginView from '../views/LoginView.vue'
import SignupView from '../views/SignupView.vue';
import UserReviews from '../views/UserReviews.vue';

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView  // Matches HomeView.vue
  },
  {
    path: '/Colleges',
    name: 'Colleges',
    component: CollegeView  // Matches CollegeView.vue
  },
  {
    path: '/Login',
    name: 'Logins',
    component: LoginView  // Matches CollegeView.vue
  },
  {
    path: '/college/:collegeId',
    name: 'CollegeDetail',
    component: CollegeDetail,
    props: true
  },
  {
    path: '/add-review/:collegeId',
    name: 'AddReview',
    component: AddReview,
    props: true,
    meta: { requiresAuth: true }
  },
  {
    path: '/my-reviews',
    name: 'UserReviews',
    component: UserReviews
  },
  { 
    path: '/signup', name: 'Signup', component: SignupView 
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

export default router
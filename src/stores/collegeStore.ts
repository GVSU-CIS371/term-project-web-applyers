import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import {
  collection,
  getDocs,
  addDoc,
} from 'firebase/firestore'
import { db } from '../firebase'

interface Review {
  collegeName: string
  rating: number
  comment: string
  userName: string
}

interface College {
  name: string
  averageRating?: number
  reviewCount?: number
  imageUrl?: string
}

export const useCollegeStore = defineStore('College', () => {
  const reviews = ref<Review[]>([])
  const colleges = ref<College[]>([])
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  const fetchReviews = async () => {
    try {
      isLoading.value = true
      const snapshot = await getDocs(collection(db, 'Ratings'))
      reviews.value = snapshot.docs.map(doc => doc.data() as Review)
    } catch (err) {
      error.value = 'Failed to fetch reviews'
      console.error(err)
    } finally {
      isLoading.value = false
    }
  }

  const computeColleges = () => {
    const grouped: { [name: string]: Review[] } = {}
    for (const review of reviews.value) {
      if (!grouped[review.collegeName]) grouped[review.collegeName] = []
      grouped[review.collegeName].push(review)
    }

    colleges.value = Object.entries(grouped).map(([name, revs]) => {
      const totalRating = revs.reduce((sum, r) => sum + r.rating, 0)
      return {
        name,
        averageRating: parseFloat((totalRating / revs.length).toFixed(1)),
        reviewCount: revs.length
      }
    })
  }

  const getCollegeByName = (name: string) =>
    computed(() => colleges.value.find(college => college.name === name))

  const getReviewsForCollege = (name: string) =>
    computed(() => reviews.value.filter(r => r.collegeName === name))

  const addReview = async (review: Review) => {
    try {
      await addDoc(collection(db, 'Ratings'), review)
      reviews.value.push(review)
      computeColleges()
    } catch (err) {
      error.value = 'Failed to add review'
      console.error(err)
    }
  }

  return {
    reviews,
    colleges,
    isLoading,
    error,
    fetchReviews,
    computeColleges,
    getCollegeByName,
    getReviewsForCollege,
    addReview
  }
})

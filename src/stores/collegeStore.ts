import { defineStore } from 'pinia'
import { ref } from 'vue'
import {
  collection,
  getDocs,
  doc,
  getDoc,
  addDoc,
  updateDoc,
  query,
  where
} from 'firebase/firestore'
import db from '../firebase'

interface College {
  id: string;
  name: string;
  averageRating?: number;
  reviewCount?: number;
}

interface Review {
  rating: number;
  comment: string;
  userName: string;
}

export const useCollegeStore = defineStore('college', () => {
  // State
  const colleges = ref<College[]>([])
  const currentCollege = ref<College | null>(null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  // Actions
  const fetchColleges = async () => {
    try {
      isLoading.value = true;
      console.log("[fetchColleges] Fetching colleges...");
  
      const querySnapshot = await getDocs(collection(db, "colleges"));
      colleges.value = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as College[];
  
      console.log("[fetchColleges] Colleges loaded:", colleges.value);
    } catch (err) {
      error.value = "Failed to fetch colleges";
      console.error("[fetchColleges] Error:", err);
    } finally {
      isLoading.value = false;
    }
  };

  const fetchCollegeById = async (id: string) => {
    try {
      isLoading.value = true
      const docRef = doc(db, 'colleges', id)
      const docSnap = await getDoc(docRef)

      if (docSnap.exists()) {
        currentCollege.value = {
          id: docSnap.id,
          ...docSnap.data()
        } as College
        console.log("[fetchCollegeById] College loaded:", currentCollege.value)
      } else {
        console.warn(`[fetchCollegeById] College with ID ${id} not found`)
      }
    } catch (err) {
      error.value = 'Failed to fetch college details'
      console.error("[fetchCollegeById] Error:", err)
    } finally {
      isLoading.value = false
    }
  }

  const searchColleges = async (searchTerm: string) => {
    try {
      isLoading.value = true
      console.log(`[searchColleges] Searching for: ${searchTerm}`)

      const q = query(
        collection(db, 'colleges'),
        where('name', '>=', searchTerm),
        where('name', '<=', searchTerm + '\uf8ff')
      )
      const querySnapshot = await getDocs(q)
      colleges.value = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as College[]

      console.log("[searchColleges] Results:", colleges.value)
    } catch (err) {
      error.value = 'Search failed'
      console.error("[searchColleges] Error:", err)
    } finally {
      isLoading.value = false
    }
  }

  const addReviewToCollege = async (collegeId: string, reviewData: Review) => {
    try {
      console.log("[addReviewToCollege] Adding review:", reviewData)
      await addDoc(collection(db, 'colleges', collegeId, 'reviews'), reviewData)
      await updateCollegeStats(collegeId)
    } catch (err) {
      error.value = 'Failed to add review'
      console.error("[addReviewToCollege] Error:", err)
    }
  }

  const updateCollegeStats = async (collegeId: string) => {
    try {
      const reviewsRef = collection(db, 'colleges', collegeId, 'reviews')
      const reviewsSnap = await getDocs(reviewsRef)
      const reviews = reviewsSnap.docs.map(doc => doc.data() as Review)

      const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0)
      const averageRating = reviews.length ? totalRating / reviews.length : 0

      await updateDoc(doc(db, 'colleges', collegeId), {
        reviewCount: reviews.length,
        averageRating: parseFloat(averageRating.toFixed(1))
      })

      console.log("[updateCollegeStats] Stats updated for:", collegeId)
    } catch (err) {
      console.error("[updateCollegeStats] Error:", err)
    }
  }

  return {
    colleges,
    currentCollege,
    isLoading,
    error,
    fetchColleges,
    fetchCollegeById,
    searchColleges,
    addReviewToCollege
  }
})

<template>
    <v-card>
      <v-card-title>Add Your Review</v-card-title>
      
      <v-card-text>
        <v-form ref="form" @submit.prevent="submitReview">
          <v-row>
            <v-col cols="12">
              <v-rating
                v-model="review.rating"
                color="amber"
                size="36"
                half-increments
                hover
                required
              ></v-rating>
            </v-col>
  
            <v-col cols="12">
              <v-text-field
                v-model="review.course"
                label="Course/Degree"
                required
              ></v-text-field>
            </v-col>
  
            <v-col cols="12">
              <v-textarea
                v-model="review.comment"
                label="Your Review"
                required
                rows="4"
              ></v-textarea>
            </v-col>
  
            <v-col cols="12">
              <v-checkbox
                v-model="review.anonymous"
                label="Post anonymously"
              ></v-checkbox>
            </v-col>
          </v-row>
        </v-form>
      </v-card-text>
  
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn text @click="$emit('cancel')">Cancel</v-btn>
        <v-btn color="primary" @click="submitReview">Submit</v-btn>
      </v-card-actions>
    </v-card>
  </template>
  
  <script>
  import { db, auth } from '../firebase'
  import { collection, addDoc, doc, updateDoc } from 'firebase/firestore'
  
  export default {
    name: 'AddReview',
    props: {
      collegeId: {
        type: String,
        required: true
      }
    },
    data() {
      return {
        review: {
          rating: 0,
          course: '',
          comment: '',
          anonymous: false,
          date: new Date(),
          userId: auth.currentUser?.uid,
          userName: auth.currentUser?.displayName || 'Anonymous'
        }
      }
    },
    methods: {
      async submitReview() {
        try {
          // Add review to reviews collection
          const reviewRef = await addDoc(collection(db, 'reviews'), {
            ...this.review,
            collegeId: this.collegeId
          })
  
          // Update college's review count and average rating
          await this.updateCollegeStats()
  
          this.$emit('review-added')
        } catch (error) {
          console.error('Error adding review:', error)
        }
      },
      async updateCollegeStats() {
        const collegeRef = doc(db, 'colleges', this.collegeId)
        const reviewsQuery = query(
          collection(db, 'reviews'),
          where('collegeId', '==', this.collegeId)
        )
        
        const querySnapshot = await getDocs(reviewsQuery)
        const reviews = querySnapshot.docs.map(doc => doc.data())
        
        const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0)
        const averageRating = totalRating / reviews.length
        
        await updateDoc(collegeRef, {
          reviewCount: reviews.length,
          averageRating: parseFloat(averageRating.toFixed(1))
        })
      }
    }
  }
  </script>
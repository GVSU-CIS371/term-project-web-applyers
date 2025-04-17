<template>
  <v-card>
    <v-card-title>Add Your Review</v-card-title>

    <v-card-text>
      <v-form ref="form" @submit.prevent="submitReview">
        <v-row>
          <!-- Subject Dropdown -->
          <v-col cols="12">
            <v-select
              v-model="review.subject"
              :items="subjects"
              item-text="name"
              item-value="name"
              label="Select a Subject"
              required
            ></v-select>
          </v-col>

          <!-- Rating Input -->
          <v-col cols="12">
            <v-rating
              v-model="review.rating"
              color="amber"
              size="36"
              hover
              :max="10"
              required
            ></v-rating>
          </v-col>

          <!-- Text Review -->
          <v-col cols="12">
            <v-textarea
              v-model="review.comment"
              label="Your Review"
              required
              rows="4"
            ></v-textarea>
          </v-col>

          <!-- Anonymous Checkbox -->
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
import { db, auth } from '../firebase';
import {
  collection,
  addDoc,
  doc,
  getDocs,
  updateDoc
} from 'firebase/firestore';

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
      subjects: [], // List of subjects offered by the college
      review: {
        subject: '', // Selected subject
        rating: 0,
        comment: '',
        anonymous: false,
        date: new Date(),
        userId: auth.currentUser?.uid,
        userName: auth.currentUser?.displayName || 'Anonymous'
      }
    };
  },
  async created() {
    await this.fetchSubjects();
  },
  methods: {
    async fetchSubjects() {
      try {
        const subjectsRef = collection(db, `colleges/${this.collegeId}/subjects`);
        const querySnapshot = await getDocs(subjectsRef);
        this.subjects = querySnapshot.docs.map(doc => ({
          name: doc.data().name // Only include the name for display
        }));
      } catch (error) {
        console.error('Error fetching subjects:', error);
      }
    },
    async submitReview() {
      if (!this.review.subject) {
        alert('Please select a subject.');
        return;
      }

      if (this.review.rating === 0) {
        alert('Please provide a rating.');
        return;
      }

      try {
        // Add review to the reviews subcollection under the specific college
        const reviewRef = await addDoc(
          collection(db, `colleges/${this.collegeId}/reviews`),
          {
            ...this.review
          }
        );

        console.log('Review added with ID:', reviewRef.id);

        // Update college's review count and average rating
        await this.updateCollegeStats();

        this.$emit('review-added');
      } catch (error) {
        console.error('Error adding review:', error);
      }
    },
    async updateCollegeStats() {
      const reviewsRef = collection(db, `colleges/${this.collegeId}/reviews`);
      const querySnapshot = await getDocs(reviewsRef);

      const reviews = querySnapshot.docs.map(doc => doc.data());
      const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
      const averageRating = totalRating / reviews.length;

      const collegeRef = doc(db, 'colleges', this.collegeId);
      await updateDoc(collegeRef, {
        reviewCount: reviews.length,
        averageRating: parseFloat(averageRating.toFixed(1))
      });

      console.log('College stats updated:', {
        reviewCount: reviews.length,
        averageRating: parseFloat(averageRating.toFixed(1))
      });
    }
  }
};
</script>
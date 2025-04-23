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
              label="Select a Subject (Optional)"
            ></v-select>
          </v-col>

          <!-- Rating Input (Radial Selector) -->
          <v-col cols="12">
            <v-radio-group
              v-model="review.rating"
              row
              label="Rating (1-10)"
              required
            >
              <v-radio
                v-for="n in 10"
                :key="n"
                :label="n"
                :value="n"
                :color="review.rating === n ? 'primary' : 'grey'"
              ></v-radio>
            </v-radio-group>
            <p v-if="review.rating" class="text-caption text-muted">
              You selected a rating of {{ review.rating }}.
            </p>
            <p v-else class="text-caption text-muted">
              Please select a rating.
            </p>
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
            <p v-if="review.anonymous" class="text-caption text-muted">
              Your review will be posted anonymously.
            </p>
            <p v-else class="text-caption text-muted">
              Your name will be displayed with your review.
            </p>
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
  getDoc,
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
        subject: '', // Selected subject (optional)
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
        this.subjects = querySnapshot.docs.map(doc => doc.data().name); // Extract only the name
      } catch (error) {
        console.error('Error fetching subjects:', error);
      }
  },
  async fetchUserName(userId) {
    try {
      const userDoc = await getDoc(doc(db, 'users', userId)); // Assuming user data is stored in a 'users' collection
      if (userDoc.exists()) {
        return userDoc.data().name || 'No Name Provided'; // Return the name or a fallback
      } else {
        console.error('User document does not exist.');
        return 'No Name Provided';
      }
    } catch (error) {
      console.error('Error fetching user name:', error);
      return 'No Name Provided';
    }
},
async submitReview() {
  console.log('Current User:', auth.currentUser); // Log the current user object

  if (this.review.rating === 0) {
    alert('Please provide a rating.');
    return;
  }

  try {
    let userName = 'Anonymous';

    if (!this.review.anonymous) {
      // Fetch the user's name from Firestore
      userName = await this.fetchUserName(auth.currentUser?.uid);
    }

    console.log('Resolved userName:', userName); // Log the resolved userName

    // Add review to the reviews subcollection under the specific college
    const reviewRef = await addDoc(
      collection(db, `colleges/${this.collegeId}/reviews`),
      {
        ...this.review,
        userName // Include the correct userName
      }
    );

    console.log('Review added with ID:', reviewRef.id);

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
<template>
  <v-container v-if="college">
    <v-row>
      <v-col cols="12">
        <v-btn text @click="$router.go(-1)">
          <v-icon left>mdi-arrow-left</v-icon>
          Back to Colleges
        </v-btn>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12" md="4">
        <v-img
          :src="college.image || 'https://via.placeholder.com/400x300?text=College'"
          height="300"
          contain
        ></v-img>
      </v-col>

      <v-col cols="12" md="8">
        <h1 class="display-1">{{ college.name }}</h1>
        <h2 class="subtitle-1">{{ college.location }}</h2>

        <div class="my-4">
          <rating-display :rating="college.averageRating || 0" size="36" />
          <span class="ml-2">({{ reviews.length }} reviews)</span>
        </div>

        <v-chip-group>
          <v-chip v-for="subject in subjects" :key="subject.name" color="primary" small>
            {{ subject.name }} ({{ subject.rating }}/10)
          </v-chip>
        </v-chip-group>

        <p class="mt-4">{{ college.description }}</p>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12">
        <v-divider class="my-4"></v-divider>
        <h2 class="headline">Reviews</h2>

        <v-btn
          v-if="user"
          color="primary"
          class="mb-4"
          @click="showAddReview = true"
        >
          Add Review
        </v-btn>

        <v-alert v-else type="info" class="mb-4">
          Please <router-link to="/login">login</router-link> to add a review.
        </v-alert>

        <review-card
          v-for="review in reviews"
          :key="review.id"
          :review="review"
          class="mb-4"
        />
      </v-col>
    </v-row>

    <v-dialog v-model="showAddReview" max-width="600">
      <add-review
        :college-id="collegeId"
        @review-added="handleReviewAdded"
        @cancel="showAddReview = false"
      />
    </v-dialog>
  </v-container>
</template>

<script>
import { db } from '../firebase';
import { doc, getDoc, collection, getDocs } from 'firebase/firestore';
import { auth } from '../firebase';
import RatingDisplay from '../components/RatingDisplay.vue';
import ReviewCard from '../components/ReviewCard.vue';
import AddReview from './AddReview.vue';

export default {
  name: 'CollegeDetail',
  components: {
    RatingDisplay,
    ReviewCard,
    AddReview
  },
  props: {
    collegeId: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      college: null,
      reviews: [],
      subjects: [],
      showAddReview: false,
      user: null
    };
  },
  async created() {
    await this.fetchCollege();
    await this.fetchReviews();
    await this.fetchSubjects();

    // Use onAuthStateChanged to reliably track user state
    auth.onAuthStateChanged(user => {
      this.user = user;
    });
  },
  methods: {
    async fetchCollege() {
      const docRef = doc(db, 'colleges', this.collegeId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        this.college = {
          id: docSnap.id,
          ...docSnap.data()
        };
      } else {
        this.$router.push('/colleges');
      }
    },
    async fetchReviews() {
      const reviewsRef = collection(db, `colleges/${this.collegeId}/reviews`);
      const querySnapshot = await getDocs(reviewsRef);
      this.reviews = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    },
    async fetchSubjects() {
      const subjectsRef = collection(db, `colleges/${this.collegeId}/subjects`);
      const querySnapshot = await getDocs(subjectsRef);
      this.subjects = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    },
    handleReviewAdded() {
      this.showAddReview = false;
      this.fetchReviews(); // Refresh reviews list
    }
  }
};
</script>
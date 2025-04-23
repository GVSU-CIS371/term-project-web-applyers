<template>
    <v-container>
      <h1 class="text-center">My Reviews</h1>
  
      <v-alert v-if="reviews.length === 0" type="info">
        You haven't posted any reviews yet.
      </v-alert>
  
      <v-row v-else>
        <v-col cols="12" sm="6" md="4" v-for="review in reviews" :key="review.id">
          <v-card>
            <v-card-title>
              {{ review.subject || 'No Subject' }}
            </v-card-title>
            <v-card-subtitle>
              Rating: {{ review.rating }}
            </v-card-subtitle>
            <v-card-text>
              {{ review.comment }}
            </v-card-text>
            <v-card-subtitle>
              <strong>College:</strong> {{ review.collegeName || 'Unknown College' }}
            </v-card-subtitle>
            <v-card-actions>
              <v-chip color="primary" text-color="white">
                {{ review.anonymous ? 'Anonymous' : review.userName }}
              </v-chip>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </template>

<script>
import { db, auth } from '../firebase';
import { collectionGroup, query, where, getDocs, doc, getDoc } from 'firebase/firestore';

export default {
  name: 'UserReviews',
  data() {
    return {
      reviews: [] 
    };
  },
  async created() {
    await this.fetchUserReviews();
  },
  methods: {
    async fetchUserReviews() {
      try {
        const userId = auth.currentUser?.uid;
        if (!userId) {
          console.error('No user is currently signed in.');
          return;
        }

        const reviewsRef = collectionGroup(db, 'reviews');
        const reviewsQuery = query(reviewsRef, where('userId', '==', userId));
        const querySnapshot = await getDocs(reviewsQuery);

        // Fetch the college name for each review
        const reviewsWithCollege = await Promise.all(
          querySnapshot.docs.map(async (reviewDoc) => {
            const reviewData = reviewDoc.data();

            const parentPath = reviewDoc.ref.path; 
            const collegeId = parentPath.split('/')[1]; 
            const collegeDoc = await getDoc(doc(db, 'colleges', collegeId));
            const collegeName = collegeDoc.exists() ? collegeDoc.data().name : 'Unknown College';

            return {
              id: reviewDoc.id,
              ...reviewData,
              collegeName 
            };
          })
        );

        this.reviews = reviewsWithCollege;

        console.log('Fetched reviews:', this.reviews); // Debug
      } catch (error) {
        console.error('Error fetching user reviews:', error);
      }
    }
  }
};
</script>
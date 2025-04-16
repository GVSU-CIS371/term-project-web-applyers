<template>
  <v-container>
    <v-row class="text-center">
      <v-col cols="12">
        <v-img class="my-3" contain height="200" />
      </v-col>

      <v-col class="mb-4">
        <h1 class="display-2 font-weight-bold mb-3">Welcome to Rate My College</h1>
        <p class="subheading font-weight-regular">
          Find honest reviews from students about colleges across the country
          <br />or share your own experience to help others.
        </p>
      </v-col>

      <v-col class="mb-5" cols="12">
        <v-btn color="primary" large to="/colleges">
          Browse Colleges
          <v-icon right>mdi-school</v-icon>
        </v-btn>
      </v-col>

      <!-- Display Reviews -->
      <v-col cols="12" class="mt-5">
        <h2 class="text-h4 mb-3">Latest Reviews</h2>
        <v-list>
          <v-list-item
            v-for="review in reviews"
            :key="review.id"
            class="mb-2"
            two-line
          >
            <v-list-item-content>
              <v-list-item-title class="font-weight-bold">
                {{ review.CollegeName }} - ⭐ {{ review.Rating }}/5
              </v-list-item-title>
              <v-list-item-subtitle>
                "{{ review.Comment }}" - {{ review.UserName }}
              </v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { collection, getDocs } from 'firebase/firestore'
import { db } from '../firebase'

const reviews = ref([])

const loadReviews = async () => {
  const snapshot = await getDocs(collection(db, 'ratings'))
  reviews.value = snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }))
}

onMounted(() => {
  loadReviews()
})
</script>

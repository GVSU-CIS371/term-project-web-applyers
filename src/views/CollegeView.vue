<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <h1 class="display-1 mb-4">Colleges</h1>
        
        <v-text-field
          v-model="search"
          append-icon="mdi-magnify"
          label="Search colleges"
          single-line
          hide-details
        ></v-text-field>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12" sm="6" md="4" v-for="college in filteredColleges" :key="college.id">
        <v-card @click="goToCollege(college.id)" hover>
          <v-img
            :src="college.image || 'https://via.placeholder.com/300x200?text=College'"
            height="150px"
          ></v-img>

          <v-card-title>{{ college.name }}</v-card-title>

          <v-card-subtitle>
            <rating-display :rating="college.averageRating || 0" />
            ({{ college.reviewCount || 0 }} reviews)
          </v-card-subtitle>

          <v-card-text>
            <div class="text--primary">
              {{ college.location }}
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <v-btn
      v-if="user"
      fab
      fixed
      bottom
      right
      color="primary"
      @click="$router.push('/add-college')"
    >
      <v-icon>mdi-plus</v-icon>
    </v-btn>
  </v-container>
</template>

<script>
import { db } from '../firebase'
import { collection, getDocs } from 'firebase/firestore'
import RatingDisplay from '../components/RatingDisplay.vue'

export default {
  name: 'Colleges',
  components: {
    RatingDisplay
  },
  data() {
    return {
      colleges: [],
      search: '',
      user: null
    }
  },
  computed: {
    filteredColleges() {
      return this.colleges.filter(college => 
        college.name.toLowerCase().includes(this.search.toLowerCase()) ||
        college.location.toLowerCase().includes(this.search.toLowerCase())
      )
    }
  },
  async created() {
    await this.fetchColleges()
    this.user = auth.currentUser
  },
  methods: {
    async fetchColleges() {
      const querySnapshot = await getDocs(collection(db, 'colleges'))
      this.colleges = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }))
    },
    goToCollege(id) {
      this.$router.push(`/college/${id}`)
    }
  }
}
</script>
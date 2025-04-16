<template>
    <v-card>
      <v-card-title>
        <rating-display :rating="review.rating" />
        <span class="ml-2">{{ review.course }}</span>
      </v-card-title>
  
      <v-card-subtitle>
        {{ review.anonymous ? 'Anonymous' : review.userName }} • 
        {{ formatDate(review.date) }}
      </v-card-subtitle>
  
      <v-card-text>
        {{ review.comment }}
      </v-card-text>
    </v-card>
  </template>
  
  <script>
  import RatingDisplay from './RatingDisplay.vue'
  
  export default {
    name: 'ReviewCard',
    components: {
      RatingDisplay
    },
    props: {
      review: {
        type: Object,
        required: true
      }
    },
    methods: {
      formatDate(date) {
        if (!date) return ''
        const d = date.toDate ? date.toDate() : new Date(date)
        return d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
      }
    }
  }
  </script>
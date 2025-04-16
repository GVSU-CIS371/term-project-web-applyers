<template>
    <v-rating
      :value="rating"
      color="amber"
      dense
      half-increments
      readonly
      :size="size"
      class="d-inline-block"
    ></v-rating>
  </template>
  
  <script>
  export default {
    name: 'RatingDisplay',
    props: {
      rating: {
        type: Number,
        required: true
      },
      size: {
        type: [Number, String],
        default: 24
      }
    }
  }
  </script>
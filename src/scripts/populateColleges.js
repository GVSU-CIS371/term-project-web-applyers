import { db } from '../firebase';
import { collection, addDoc } from 'firebase/firestore';

export const populateColleges = async () => {
  const colleges = [
    {
      name: 'Grand Valley State University',
      location: 'Allendale, Michigan',
      image: 'https://via.placeholder.com/300x200?text=Grand+Valley+State+University',
      description: 'A great university located in Michigan.',
      reviews: [
        { rating: 8, text: 'Beautiful campus and solid academics.' },
        { rating: 7, text: 'Affordable but large class sizes.' }
      ],
      subjects: [
        { name: 'Business', rating: 8, text: 'Very practical courses.' },
        { name: 'Nursing', rating: 9, text: 'Top program in the state.' }
      ]
    },
    {
      name: 'University of Michigan',
      location: 'Ann Arbor, Michigan',
      image: 'https://via.placeholder.com/300x200?text=University+of+Michigan',
      description: 'A top-ranked public university known for its research programs.',
      reviews: [
        { rating: 10, text: 'Incredible research opportunities.' },
        { rating: 9, text: 'Challenging but rewarding.' }
      ],
      subjects: [
        { name: 'Engineering', rating: 10, text: 'One of the best in the country.' },
        { name: 'Law', rating: 9, text: 'Very competitive program.' }
      ]
    },
    {
      name: 'Michigan State University',
      location: 'East Lansing, Michigan',
      image: 'https://via.placeholder.com/300x200?text=Michigan+State+University',
      description: 'A diverse university with a strong focus on athletics and academics.',
      reviews: [
        { rating: 7, text: 'Strong community feel.' },
        { rating: 8, text: 'Great sports culture and solid academics.' }
      ],
      subjects: [
        { name: 'Agriculture', rating: 8, text: 'Nationally recognized program.' },
        { name: 'Education', rating: 7, text: 'Helpful professors and lots of fieldwork.' }
      ]
    }
  ];

  try {
    for (const college of colleges) {
      // Add the college document
      const collegeRef = await addDoc(collection(db, 'colleges'), {
        name: college.name,
        location: college.location,
        image: college.image,
        description: college.description,
      });

      // Add reviews subcollection
      for (const review of college.reviews) {
        await addDoc(collection(collegeRef, 'reviews'), {
          rating: review.rating,
          text: review.text,
        });
      }

      // Add subjects subcollection
      for (const subject of college.subjects) {
        await addDoc(collection(collegeRef, 'subjects'), {
          name: subject.name,
          rating: subject.rating,
          text: subject.text,
        });
      }

      console.log(`College "${college.name}" added with ID: ${collegeRef.id}`);
    }

    console.log('All colleges successfully added!');
  } catch (error) {
    console.error('Error adding colleges:', error);
  }
};

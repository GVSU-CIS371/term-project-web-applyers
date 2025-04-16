import { db } from '../firebase';
import { collection, addDoc } from 'firebase/firestore';

export const populateColleges = async () => {
  const colleges = [
    {
      name: 'Grand Valley State University',
      location: 'Allendale, Michigan',
      image: 'https://via.placeholder.com/300x200?text=Grand+Valley+State+University',
      averageRating: 4.5,
      reviewCount: 10,
      tags: ['Public', 'Midwest', 'Affordable'],
      description: 'A great university located in Michigan.'
    },
    {
      name: 'University of Michigan',
      location: 'Ann Arbor, Michigan',
      image: 'https://via.placeholder.com/300x200?text=University+of+Michigan',
      averageRating: 4.8,
      reviewCount: 25,
      tags: ['Public', 'Top Ranked', 'Research'],
      description: 'A top-ranked public university known for its research programs.'
    },
    {
      name: 'Michigan State University',
      location: 'East Lansing, Michigan',
      image: 'https://via.placeholder.com/300x200?text=Michigan+State+University',
      averageRating: 4.3,
      reviewCount: 15,
      tags: ['Public', 'Big Ten', 'Diverse'],
      description: 'A diverse university with a strong focus on athletics and academics.'
    }
  ];

  try {
    for (const college of colleges) {
      const docRef = await addDoc(collection(db, 'colleges'), college);
      console.log('College added with ID:', docRef.id);
    }
    console.log('Colleges successfully added!');
  } catch (error) {
    console.error('Error adding colleges:', error);
  }
};
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from './firebase';

function CardViewer() {
  const { id } = useParams();
  const [cardData, setCardData] = useState(null);

  useEffect(() => {
    const fetchCard = async () => {
      try {
        const docRef = doc(db, 'cards', id); // ✅ correct collection
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setCardData(docSnap.data());
        } else {
          console.log('No such document!');
        }
      } catch (error) {
        console.error('Error fetching card:', error);
      }
    };

    fetchCard();
  }, [id]);

  if (!cardData) return <p>Loading card...</p>;

  return (
    <div style={{ padding: '2rem', textAlign: 'center' }}>
      <h1>{cardData.formData.businessName}</h1>
      <p>{cardData.formData.description}</p>
      <p>📧 {cardData.formData.email}</p>
      <p>📸 {cardData.formData.instagram}</p>
      <p>📘 {cardData.formData.facebook}</p>
      <p>🌐 {cardData.formData.website}</p>
    </div>
  );
}

export default CardViewer;

// src/BusinessCardForm.js

import React, { useState } from 'react';
import { db } from './firebase';
import { collection, addDoc, Timestamp, doc, updateDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import CardCustomizer from './CardCustomizer';

function BusinessCardForm() {
  const [formData, setFormData] = useState({
    fullName: '',
    businessName: '',
    description: '',
    email: '',
    instagram: '',
    facebook: '',
    website: '',
  });

  const [cardId, setCardId] = useState(null);
  const [status, setStatus] = useState(null);
  const [step, setStep] = useState(1);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('Saving...');

    try {
      const docRef = await addDoc(collection(db, 'businessCards'), {
        ...formData,
        createdAt: Timestamp.now(),
      });

      setCardId(docRef.id);
      setStatus('✅ Saved successfully!');
      setStep(2);
    } catch (error) {
      console.error('Error saving data:', error);
      setStatus('❌ Failed to save');
    }
  };

  const handleCustomizationSave = async (customSettings) => {
    if (!cardId) return;
    try {
      const cardRef = doc(db, 'businessCards', cardId);
      await updateDoc(cardRef, { customization: customSettings });
    } catch (error) {
      console.error('Failed to save customization:', error);
    }
  };

  const fields = [
    { key: 'fullName', label: 'Full Name' },
    { key: 'businessName', label: 'Business Name' },
    { key: 'description', label: 'Description' },
    { key: 'email', label: 'E-mail' },
    { key: 'instagram', label: 'Instagram' },
    { key: 'facebook', label: 'Facebook' },
    { key: 'website', label: 'Website' },
  ];

  const sanitizedLinks = {
    ...formData,
    email: formData.email ? (formData.email.includes('@') ? `mailto:${formData.email}` : '') : '',
    instagram: formData.instagram ? (formData.instagram.startsWith('http') ? formData.instagram : `https://instagram.com/${formData.instagram}`) : '',
    facebook: formData.facebook ? (formData.facebook.startsWith('http') ? formData.facebook : `https://facebook.com/${formData.facebook}`) : '',
    website: formData.website ? (formData.website.startsWith('http') ? formData.website : `https://${formData.website}`) : '',
  };

  return (
    <div style={{ maxWidth: 500, margin: '0 auto' }}>
      {step === 1 && (
        <form
          onSubmit={handleSubmit}
          style={{
            maxWidth: 500,
            margin: '2rem auto',
            padding: '1rem',
            border: '1px solid #ccc',
            borderRadius: '0.5rem',
            textAlign: 'center',
          }}
        >
          <h2>Create a Business Card</h2>

          {fields.map(({ key, label }) => (
            <div key={key} style={{ marginBottom: '1rem' }}>
              <label
                htmlFor={key}
                style={{
                  display: 'block',
                  fontWeight: 'bold',
                  marginBottom: '0.25rem',
                  textTransform: 'capitalize',
                }}
              >
                {label}
              </label>
              <input
                type="text"
                id={key}
                name={key}
                value={formData[key]}
                onChange={handleChange}
                required={['fullName', 'businessName', 'description'].includes(key)}
                style={{
                  width: '80%',
                  padding: '0.5rem',
                  margin: '0 auto',
                  display: 'block',
                }}
              />
            </div>
          ))}

          <button type="submit" style={{ padding: '0.5rem 1rem' }}>
            Save
          </button>

          {status && <p style={{ marginTop: '1rem' }}>{status}</p>}
        </form>
      )}

      {step === 2 && cardId && (
        <CardCustomizer
          formData={sanitizedLinks}
          onSaveCustomization={handleCustomizationSave}
          cardId={cardId}
        />
      )}
    </div>
  );
}

export default BusinessCardForm;

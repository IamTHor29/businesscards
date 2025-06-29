// CardCustomizer.js
import React, { useState, useRef } from 'react'; // Import React and hooks
import { useNavigate } from 'react-router-dom'; // Import navigation hook
import { db } from './firebase'; // Import Firestore database reference
import { collection, addDoc } from 'firebase/firestore'; // Firestore functions for saving data
import * as htmlToImage from 'html-to-image'; // Import for image export
import { QRCodeCanvas } from 'qrcode.react'; // Use correct named export from qrcode.react

function CardCustomizer({ formData }) {
  const navigate = useNavigate(); // Used to navigate after saving
  const cardRef = useRef(); // Ref to the card preview div for exporting as image

  const [orientation, setOrientation] = useState('horizontal');
  const [cardColor, setCardColor] = useState('#ffffff');
  const [borderColor, setBorderColor] = useState('#000000');
  const [borderStyle, setBorderStyle] = useState('solid');
  const [fontColor, setFontColor] = useState('#000000');
  const [fontSize, setFontSize] = useState('16');
  const [logo, setLogo] = useState(null);
  const [shadowColor, setShadowColor] = useState('rgba(0,0,0,0.3)');
  const [bgImage, setBgImage] = useState(null);
  const [bgImgRepeat, setBgImgRepeat] = useState('repeat');
  const [bgImgCover, setBgImgCover] = useState('cover');
  const [logoSize, setLogoSize] = useState('60');
  const [logoPosition, setLogoPosition] = useState('top');
  const [shareUrl, setShareUrl] = useState(null); // Store shareable URL

  // Handle logo upload and preview
  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) setLogo(URL.createObjectURL(file));
  };

  // Handle background image upload and preview
  const handleBackgroundimgChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setBgImage(reader.result);
      reader.readAsDataURL(file);
    }
  };

  // Prepare user-provided links safely
  const sanitizedLinks = {
    ...formData,
    email: formData.email?.includes('@') ? `mailto:${formData.email}` : '',
    instagram: formData.instagram?.startsWith('http') ? formData.instagram : `https://instagram.com/${formData.instagram}`,
    facebook: formData.facebook?.startsWith('http') ? formData.facebook : `https://facebook.com/${formData.facebook}`,
    website: formData.website?.startsWith('http') ? formData.website : `https://${formData.website}`,
  };

  // Styles for the preview card
  const cardStyle = {
    display: 'flex',
    flexDirection: orientation === 'horizontal' ? (logoPosition === 'left' ? 'row' : 'row-reverse') : 'column',
    alignItems: 'center',
    justifyContent: 'center',
    flexWrap: 'wrap',
    backgroundColor: cardColor,
    backgroundImage: `url(${bgImage})`,
    backgroundRepeat: bgImgRepeat,
    backgroundSize: bgImgCover,
    backgroundPosition: 'center',
    border: `3px ${borderStyle} ${borderColor}`,
    color: fontColor,
    fontSize: `${fontSize}px`,
    width: '100%',
    maxWidth: orientation === 'horizontal' ? '500px' : '300px',
    minHeight: orientation === 'horizontal' ? '200px' : '400px',
    borderRadius: '10px',
    boxShadow: borderStyle === 'shadow' ? `0 0 15px ${shadowColor}` : 'none',
    padding: '1rem',
    gap: '1rem',
    margin: '2rem auto',
  };

  // Save the customized card to Firestore
  const handleSave = async () => {
    const data = {
      formData,
      orientation,
      cardColor,
      borderColor,
      borderStyle,
      fontColor,
      fontSize,
      shadowColor,
      bgImage,
      bgImgRepeat,
      bgImgCover,
      logoPosition,
      logoSize,
      createdAt: new Date()
    };

    try {
      const docRef = await addDoc(collection(db, 'cards'), data); // Save to Firestore
      const cardUrl = `${window.location.origin}/card/${docRef.id}`;
      setShareUrl(cardUrl); // Store the share URL to show/share later
      navigate(`/card/${docRef.id}`); // Redirect to viewer
    } catch (error) {
      console.error("Error saving card:", error); // Log any error
    }
  };

  // Export the card as a PNG image
  const handleExportImage = () => {
    if (cardRef.current) {
      htmlToImage.toPng(cardRef.current)
        .then((dataUrl) => {
          const link = document.createElement('a');
          link.download = 'business-card.png';
          link.href = dataUrl;
          link.click();
        })
        .catch((err) => {
          console.error('Error exporting image', err); // Log export error
        });
    }
  };

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto' }}> {/* Container for customization UI */}
      <h2>🎨 Customize Your Card</h2>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', marginBottom: '2rem' }}>
  {/* Logo Upload */}
  <div>
    <label>Upload Logo</label><br />
    <input type="file" accept="image/*" onChange={handleLogoChange} />
  </div>

  {/* Logo Size */}
  <div>
    <label>Logo Size</label><br />
    <input type="range" min="60" max="350" value={logoSize} onChange={(e) => setLogoSize(Number(e.target.value))} />
  </div>

  {/* Orientation */}
  <div>
    <label>Orientation</label><br />
    <select value={orientation} onChange={(e) => setOrientation(e.target.value)}>
      <option value="horizontal">Horizontal</option>
      <option value="vertical">Vertical</option>
    </select>
  </div>

  {/* Background Image Upload */}
  <div>
    <label>Upload Background Image</label><br />
    <input type="file" accept="image/*" onChange={handleBackgroundimgChange} />
  </div>

  {/* Background Repeat */}
  <div>
    <label>Background Repeat</label><br />
    <select value={bgImgRepeat} onChange={(e) => setBgImgRepeat(e.target.value)}>
      <option value="repeat">Repeat</option>
      <option value="no-repeat">No-Repeat</option>
    </select>
  </div>

  {/* Background Size */}
  <div>
    <label>Background Size</label><br />
    <select value={bgImgCover} onChange={(e) => setBgImgCover(e.target.value)}>
      <option value="cover">Cover</option>
      <option value="contain">Contain</option>
    </select>
  </div>

  {/* Card Color */}
  <div>
    <label>Card Color</label><br />
    <input type="color" value={cardColor} onChange={(e) => setCardColor(e.target.value)} />
  </div>

  {/* Border Style */}
  <div>
    <label>Border Style</label><br />
    <select value={borderStyle} onChange={(e) => setBorderStyle(e.target.value)}>
      <option value="solid">Solid</option>
      <option value="dashed">Dashed</option>
      <option value="double">Double</option>
      <option value="dotted">Dotted</option>
      <option value="shadow">Shadow</option>
    </select>
  </div>

  {/* Border Color */}
  <div>
    <label>Border Color</label><br />
    <input type="color" value={borderColor} onChange={(e) => setBorderColor(e.target.value)} />
  </div>

  {/* Shadow Color */}
  <div>
    <label>Shadow Color</label><br />
    <input type="color" value={shadowColor} onChange={(e) => setShadowColor(e.target.value)} />
  </div>

  {/* Font Color */}
  <div>
    <label>Font Color</label><br />
    <input type="color" value={fontColor} onChange={(e) => setFontColor(e.target.value)} />
  </div>

  {/* Font Size */}
  <div>
    <label>Font Size</label><br />
    <input type="range" min="12" max="25" value={fontSize} onChange={(e) => setFontSize(e.target.value)} />
  </div>
</div>


      {/* Card preview section */}
      <div ref={cardRef} style={cardStyle}>
        {logo && <img src={logo} alt="Logo" style={{ height: `${logoSize}px`, objectFit: 'contain' }} />}
        <div>
          <h3>{formData.businessName}</h3>
          <p>{formData.description}</p>
          <small>
            {sanitizedLinks.email && <>✉️ <a href={sanitizedLinks.email}>{formData.email}</a><br /></>}
            {sanitizedLinks.instagram && <>📸 <a href={sanitizedLinks.instagram}>{formData.instagram}</a><br /></>}
            {sanitizedLinks.facebook && <>📘 <a href={sanitizedLinks.facebook}>{formData.facebook}</a><br /></>}
            {sanitizedLinks.website && <>🌐 <a href={sanitizedLinks.website}>{formData.website}</a></>}
          </small>
        </div>
      </div>

      {/* Action buttons */}
      <div style={{ textAlign: 'center', marginTop: '2rem' }}>
        <button onClick={handleExportImage}>📸 Export as Image</button>
      </div>

      {/* Shareable QR Code + Link */}
      {shareUrl && (
        <div style={{ textAlign: 'center', marginTop: '2rem' }}>
          <h3>🔗 Share Your Card</h3>
          <p><a href={shareUrl} target="_blank" rel="noopener noreferrer">{shareUrl}</a></p>
          <QRCodeCanvas value={shareUrl} size={180} />
        </div>
      )}
    </div>
  );
}

export default CardCustomizer; // Export component

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import BusinessCardForm from './BusinessCardForm';
import CardViewer from './CardViewer';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<BusinessCardForm />} />
          <Route path="/card/:id" element={<CardViewer />} />
      </Routes>
    </Router>
  );
}

export default App;

import React, { useState, useEffect } from 'react';
import PhotoList from './components/PhotoList';
import Header from './components/Header';
import Modal from './components/Modal';

function App() {
  const [searchResults, setSearchResults] = useState([]);
  const [savedQueries, setSavedQueries] = useState([]);
  const [selectedPhoto, setSelectedPhoto] = useState(null);

  // Function to fetch recent photos on initial load
  const fetchRecentPhotos = async () => {
    try {
      const response = await fetch(
        `https://www.flickr.com/services/rest/?method=flickr.photos.getRecent&api_key=f71bc47a2d84579fa7c7297181d97b86&safe_search=1&format=json&nojsoncallback=1`
      );

      if (response.ok) {
        const data = await response.json();
        setSearchResults(data.photos.photo);
      } else {
        console.error('Failed to fetch recent photos');
      }
    } catch (error) {
      console.error('Error fetching recent photos:', error);
    }
  }

  useEffect(() => {
    fetchRecentPhotos();
  }, []);

  return (
    <div className="App">
      <Header
        searchResults={searchResults}
        savedQueries={savedQueries}
        setSearchResults={setSearchResults}
        setSavedQueries={setSavedQueries}
      />
      <PhotoList
        searchResults={searchResults}
        setSelectedPhoto={setSelectedPhoto}
      />
      {selectedPhoto && (
        <Modal
          selectedPhoto={selectedPhoto}
          onClose={() => setSelectedPhoto(null)}
        />
      )}
    </div>
  );
}

export default App;
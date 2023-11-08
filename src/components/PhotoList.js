import React, { useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';

function PhotoList({ searchResults }) {
    const [selectedPhoto, setSelectedPhoto] = useState(null);

    const handleSelectPhoto = (photo) => {
        setSelectedPhoto(photo);
    };

    const closeModal = () => {
        setSelectedPhoto(null);
    };

    const renderPhotoList = () => {
        return searchResults.map((photo) => (
            <div key={photo.id} className="photo-item" onClick={() => handleSelectPhoto(photo)}>
                <img src={`https://farm${photo.farm}.staticflickr.com/${photo.server}/${photo.id}_${photo.secret}.jpg`} alt={photo.title} />
            </div>
        ));
    };

    return (
        <div className="PhotoList">
            <InfiniteScroll dataLength={searchResults.length} next={() => { }} hasMore={false}>
                <div className="photo-grid">
                    {renderPhotoList()}
                </div>
            </InfiniteScroll>
            {selectedPhoto && (
                <div className="modal">
                    <div className="modal-content">
                        <span className="close" onClick={closeModal}>&times;</span>
                        <img className="modal-image" src={`https://farm${selectedPhoto.farm}.staticflickr.com/${selectedPhoto.server}/${selectedPhoto.id}_${selectedPhoto.secret}.jpg`} alt={selectedPhoto.title} />
                        <p>{selectedPhoto.title}</p>
                    </div>
                </div>
            )}
        </div>
    );
}

export default PhotoList;
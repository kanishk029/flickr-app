import React from 'react';

function Modal({ selectedPhoto, onClose }) {
    if (!selectedPhoto) {
        return null;
    }

    return (
        <div className="modal">
            <div className="modal-content">
                <span className="close" onClick={onClose}>&times;</span>
                <img src={selectedPhoto.url} alt={selectedPhoto.title} />
                <p>{selectedPhoto.title}</p>
            </div>
        </div>
    );
}

export default Modal;
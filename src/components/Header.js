import React, { useState, useEffect } from 'react';

function Header({ searchResults, savedQueries, setSearchResults, setSavedQueries }) {
    const [searchQuery, setSearchQuery] = useState('');
    const [suggestedQueries, setSuggestedQueries] = useState([]);
    const [loadingSuggestions, setLoadingSuggestions] = useState(false);
    const [showDropdown, setShowDropdown] = useState(false); // State to control the dropdown visibility

    useEffect(() => {
        // Load saved queries from local storage on component mount
        const storedQueries = localStorage.getItem('savedQueries');
        if (storedQueries) {
            setSavedQueries(JSON.parse(storedQueries));
        }
    }, [setSavedQueries]);

    // Function to fetch search suggestions as the user types
    const fetchSearchSuggestions = async (query) => {
        setLoadingSuggestions(true);
        try {
            const response = await fetch(
                `https://www.flickr.com/services/rest/?method=flickr.photos.search&api_key=f71bc47a2d84579fa7c7297181d97b86&text=${query}&safe_search=1&format=json&nojsoncallback=1`
            );

            if (response.ok) {
                const data = await response.json();
                const suggestions = data.photos.photo.map((photo) => ({
                    title: photo.title,
                    url: `https://farm${photo.farm}.staticflickr.com/${photo.server}/${photo.id}_${photo.secret}.jpg`,
                }));
                setSuggestedQueries(suggestions);
            } else {
                console.error('Failed to fetch search suggestions');
            }
        } catch (error) {
            console.error('Error fetching search suggestions:', error);
        } finally {
            setLoadingSuggestions(false);
        }
    };

    // Function to handle search input change
    const handleSearchInputChange = (e) => {
        const query = e.target.value;
        setSearchQuery(query);

        // Fetch suggestions while the user is typing (optional debounce)
        fetchSearchSuggestions(query);
    };

    // Function to handle search and fetch search results
    const handleSearch = async () => {
        try {
            const response = await fetch(
                `https://www.flickr.com/services/rest/?method=flickr.photos.search&api_key=f71bc47a2d84579fa7c7297181d97b86&text=${searchQuery}&safe_search=1&format=json&nojsoncallback=1`
            );

            if (response.ok) {
                const data = await response.json();
                setSearchResults(data.photos.photo);

                // Update savedQueries state with the current search query
                // setSavedQueries([...savedQueries, searchQuery]);

                const updatedQueries = [searchQuery, ...savedQueries].slice(0, 3);
                setSavedQueries(updatedQueries);

                // Save the search query to local storage
                if (searchQuery) {
                    const storedQueries = localStorage.getItem('savedQueries');
                    const queries = storedQueries ? JSON.parse(storedQueries) : [];
                    queries.push(searchQuery);
                    localStorage.setItem('savedQueries', JSON.stringify(queries));
                }

                // Clear the search bar
                setSearchQuery('');
            } else {
                console.error('Failed to fetch search results');
            }
        } catch (error) {
            console.error('Error fetching search results:', error);
        }
    };

    // Function to handle selecting a suggested query
    const handleSuggestionSelection = (suggestion) => {
        setSearchQuery(suggestion.title);
        setLoadingSuggestions(false);
    };

    // Function to render saved queries as tags
    const renderSavedQueries = () => {
        return savedQueries.map((query, index) => (

            <span key={index} className="saved-query" onClick={() => handleSuggestionSelection(query)}>
                {query}
            </span>

        ));
    };

    // Function to render suggested queries as tags
    const renderSuggestedQueries = () => {
        return suggestedQueries.map((suggestion, index) => (
            <div
                key={index}
                className="suggested-query"
                onClick={() => handleSuggestionSelection(suggestion)}
            >
                <img src={suggestion.url} alt={suggestion.title} />
                <span>{suggestion.title}</span>
            </div>
        ));
    };

    // Function to toggle the dropdown visibility
    const toggleDropdown = () => {
        setShowDropdown(!showDropdown);
    };


    // const dropDown = () =>  {
    //   console.log("hello");
    //   return (
    //     <div className="dropdown-container">
    //       <div className="saved-queries">
    //         {renderSavedQueries()}
    //       </div>
    //     </div>
    //   );
    // };

    return (
        <div className="Header">
            <div className="search-bar">
                <input
                    type="text"
                    placeholder="Search photos..."
                    value={searchQuery}
                    onChange={handleSearchInputChange}
                    onClick={toggleDropdown} // Clicking the input toggles the dropdown
                />
                <button onClick={handleSearch}>
                    <span className="search-icon">
                        <i className="fas fa-search"></i>
                    </span>
                </button>
            </div>
            {showDropdown && (
                <div className="dropdown-container">
                    <div className="saved-queries">
                        {renderSavedQueries()}
                    </div>
                </div>
            )}
            {loadingSuggestions}
        </div>
    );
}

export default Header;
import React, { useState } from "react";
import axios from "axios";
import { LuSearch } from "react-icons/lu";
import Modal from "./Modal";

const Search = () => {
    const [query, setQuery] = useState("");
    const [results, setResults] = useState([]);
    const [selectedVideo, setSelectedVideo] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleSearch = async () => {
        if (!query) return;

        const apiKey = process.env.REACT_APP_YOUTUBE_API_KEY;
        const response = await axios.get("https://www.googleapis.com/youtube/v3/search", {
            params: {
                part: "snippet",
                q: query,
                type: "video",
                maxResults: 5,
                key: apiKey,
            },
        });

        setResults(response.data.items);
    };

    const handleInputChange = (e) => {
        setQuery(e.target.value);
    };

    const handleVideoSelect = (video) => {
        setSelectedVideo(video);
        setIsModalOpen(true);
    };

    const handleAddToPlaylist = (playlistId) => {
        const newTrack = {
            title: selectedVideo.snippet.title,
            videoID: selectedVideo.id.videoId,
            imageURL: selectedVideo.snippet.thumbnails.default.url,
            artist: selectedVideo.snippet.channelTitle,
        };
        // 플레이리스트에 추가하는 로직을 여기에 추가합니다.
    };

    return (
        <article className="search">
            <label htmlFor="searchInput">
                <LuSearch />
            </label>
            <input
                type="text"
                placeholder="Search"
                id="searchInput"
                value={query}
                onChange={handleInputChange}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            />
            <ul className="search-results">
                {results.map((result) => (
                    <li key={result.id.videoId} onClick={() => handleVideoSelect(result)}>
                        <img src={result.snippet.thumbnails.default.url} alt={result.snippet.title} />
                        <div>
                            <h3>{result.snippet.title}</h3>
                        </div>
                    </li>
                ))}
            </ul>
            {isModalOpen && (
                <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onAddToPlaylist={handleAddToPlaylist} />
            )}
        </article>
    );
};

export default Search;

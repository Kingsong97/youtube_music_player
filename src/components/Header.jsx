import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FcRating, FcPlus, FcApproval, FcEmptyTrash, FcEditImage } from "react-icons/fc";
import { IoMusicalNotes } from "react-icons/io5";

const Header = () => {
    const [showInput, setShowInput] = useState(false); // 입력 박스 표시 여부 상태
    const [newItem, setNewItem] = useState(''); // 새 항목의 제목 상태
    const [playlistCount, setPlaylistCount] = useState(0); // 플레이리스트 개수 상태
    const [editingPlaylist, setEditingPlaylist] = useState(null); // 현재 편집 중인 플레이리스트

    useEffect(() => {
        const count = localStorage.getItem('playlistCount') || 0; // 로컬 스토리지에서 플레이리스트 개수를 가져옴
        setPlaylistCount(Number(count)); // 상태 업데이트
    }, []);

    const handleAddClick = () => {
        setShowInput(true); // 입력 박스 표시
    };

    const handleInputChange = (e) => {
        setNewItem(e.target.value); // 입력 값 업데이트
    };

    const handleAddItem = () => {
        if (newItem.trim() !== '') { // 제목이 비어있지 않은 경우
            const newCount = playlistCount + 1; // 새로운 플레이리스트 번호
            const playlistKey = `playlist${newCount}`; // 플레이리스트 키 (예: playlist1, playlist2)
            const newPlaylist = {
                id: playlistKey,
                name: newItem,
                items: [] // 초기 항목 배열
            };

            localStorage.setItem(playlistKey, JSON.stringify(newPlaylist)); // 로컬 스토리지에 저장
            localStorage.setItem('playlistCount', newCount.toString()); // 플레이리스트 개수 저장
            setPlaylistCount(newCount); // 상태 업데이트
            setNewItem(''); // 입력 값 초기화
            setShowInput(false); // 입력 박스 숨기기
        }
    };

    const handleCancel = () => {
        setNewItem(''); // 입력 값 초기화
        setShowInput(false); // 입력 박스 숨기기
    };

    const handleRemoveItem = (playlistKey) => {
        localStorage.removeItem(playlistKey); // 로컬 스토리지에서 삭제
        const Newcount = playlistCount - 1; // 플레이리스트 개수 감소
        localStorage.setItem('playlistCount', Newcount.toString()); // 플레이리스트 개수 저장
        setPlaylistCount(Newcount); // 상태 업데이트
    };

    const handleEditClick = (playlistKey) => {
        const playlist = JSON.parse(localStorage.getItem(playlistKey));
        setEditingPlaylist({ key: playlistKey, name: playlist.name });
    };

    const handleEditChange = (e) => {
        setEditingPlaylist({ ...editingPlaylist, name: e.target.value });
    };

    const handleSaveEdit = () => {
        if (editingPlaylist.name.trim() !== '') {
            const updatedPlaylist = {
                ...JSON.parse(localStorage.getItem(editingPlaylist.key)),
                name: editingPlaylist.name
            };
            localStorage.setItem(editingPlaylist.key, JSON.stringify(updatedPlaylist)); // 업데이트된 이름 저장
            setEditingPlaylist(null); // 편집 모드 종료
        }
    };

    const handleCancelEdit = () => {
        setEditingPlaylist(null); // 편집 모드 종료
    };

    const playlistLinks = [];
    for (let i = 1; i <= playlistCount; i++) {
        const playlistKey = `playlist${i}`;
        const playlist = JSON.parse(localStorage.getItem(playlistKey));
        const isEditing = editingPlaylist && editingPlaylist.key === playlistKey;
        playlistLinks.push(
            <li key={i}>
                {isEditing ? (
                    <>
                        <input
                            type="text"
                            value={editingPlaylist.name}
                            onChange={handleEditChange}
                        />
                        <button onClick={handleSaveEdit}>Save</button>
                        <button onClick={handleCancelEdit}>Cancel</button>
                    </>
                ) : (
                    <>
                        <Link to={`/playlist/${playlistKey}`}><span className='icon2'><FcApproval /></span>{playlist.name}</Link>
                        <button onClick={() => handleEditClick(playlistKey)}><FcEditImage /></button>
                        <button onClick={() => handleRemoveItem(playlistKey)}><FcEmptyTrash /></button>
                    </>
                )}
            </li>
        );
    }

    return (
        <header id='header' role='banner'>
            <h1 className='logo'>
                <Link to='/'><IoMusicalNotes />나의 뮤직 차트</Link>
            </h1>
            <h2>chart</h2>
            <ul>
                <li><Link to='chart/melon'><span className='icon'></span>멜론 차트</Link></li>
                <li><Link to='chart/bugs'><span className='icon'></span>벅스 차트</Link></li>
                <li><Link to='chart/apple'><span className='icon'></span>애플 차트</Link></li>
                <li><Link to='chart/genie'><span className='icon'></span>지니 차트</Link></li>
                <li><Link to='chart/billboard'><span className='icon'></span>빌보드 차트</Link></li>
            </ul>
            <h2>playlist</h2>
            <ul>
                <li><Link to='/mymusic'><span className='icon2'><FcRating /></span>Mymusic</Link></li>
                {playlistLinks}
                <li>
                    {showInput ? (
                        <div>
                            <input
                                type='text'
                                value={newItem}
                                onChange={handleInputChange}
                            />
                            <button onClick={handleAddItem}>Add</button>
                            <button onClick={handleCancel}>Cancel</button>
                        </div>
                    ) : (
                        <Link to='#' onClick={handleAddClick}><span className='icon2'><FcPlus /></span>Create</Link>
                    )}
                </li>
            </ul>
        </header>
    );
}

export default Header;
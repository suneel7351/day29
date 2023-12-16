
import React, { useState, useRef, useEffect } from 'react';
import './App.css';
import { FaPlayCircle } from "react-icons/fa";
import { IoPauseCircle } from "react-icons/io5";
import { BiSolidSkipNextCircle } from "react-icons/bi"
import { BiSolidSkipPreviousCircle } from "react-icons/bi"
import { FaRepeat } from "react-icons/fa6";
import { FaShuffle } from "react-icons/fa6";
const App = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isSeeking, setIsSeeking] = useState(false);
  const [seekValue, setSeekValue] = useState(0);
  const audioRef = useRef(null);
  const [isShuffle, setIsShuffle] = useState(false);
  const [isRepeat, setIsRepeat] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const speedOptions = [1, 1.5, 2];
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);

  const handleSpeedChange = (e) => {
    const selectedSpeed = parseFloat(e.target.value);
    audioRef.current.playbackRate = selectedSpeed;
    setPlaybackSpeed(selectedSpeed);
  };



  const playNextTrack = () => {
    const newIndex = (currentTrackIndex + 1) % musicTracks.length;
    setCurrentTrackIndex(newIndex);
    setIsPlaying(true); 
  };

  const playPrevTrack = () => {
    const newIndex = (currentTrackIndex - 1 + musicTracks.length) % musicTracks.length;
    setCurrentTrackIndex(newIndex);
    setIsPlaying(true);
  };


  useEffect(() => {
    audioRef.current.loop = isRepeat;
  }, [isRepeat]);


let updateTime
let handleEnded
  useEffect(() => {
    const audio = audioRef.current;

    const playCurrentTrack = () => {
      audio.src = musicTracks[currentTrackIndex];
      audio.play();
      setIsPlaying(true);
    };

    playCurrentTrack();

     updateTime = () => {
      if (!isSeeking) {
        setCurrentTime(audio.currentTime);
      }
      setDuration(audio.duration);
    };

     handleEnded = () => {
      playNextTrack();
    };

    audio.addEventListener('timeupdate', updateTime);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', updateTime);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [currentTrackIndex, isSeeking]);


  useEffect(() => {
    return () => {
      const audio = audioRef.current;
      audio.removeEventListener('timeupdate', updateTime);
      audio.removeEventListener('ended', handleEnded);
    };
  }, []);






  const seekStartHandler = () => {
    setIsSeeking(true);
  };

  const seekEndHandler = () => {
    const seekTime = (seekValue / 100) * duration;
    if (isFinite(seekTime)) {
      audioRef.current.currentTime = seekTime;
      setCurrentTime(seekTime);
    }

    setIsSeeking(false);
  };


  const seekHandler = (e) => {
    setSeekValue(e.target.value);
  };

  const toggleShuffle = () => {
    setIsShuffle(!isShuffle);
  };

  const toggleRepeat = () => {
    setIsRepeat(!isRepeat);
  };

  const changePlaybackSpeed = (speed) => {
    setPlaybackSpeed(speed);
  };


  const musicTracks = [
    './1.mp3',
    './2.mp3',
    './3.mp3',
    "./4.mp3",
    "./5.mp3",
    "./6.mp3",
    "./7.mp3",
    "./8.mp3"
  ];





  const playPauseHandler = () => {
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const stopHandler = () => {
    audioRef.current.pause();
    audioRef.current.currentTime = 0;
    setIsPlaying(false);
  };

  const volumeChangeHandler = (e) => {
    const newVolume = parseFloat(e.target.value);
    audioRef.current.volume = newVolume;
    setVolume(newVolume);
  };

  return (
    <div className="audio-player">
      <audio ref={audioRef} src={musicTracks[currentTrackIndex]} />
      <div className="controls">
        <button className='icon' onClick={playPrevTrack}><BiSolidSkipPreviousCircle /></button>
        <button className='icon' onClick={playPauseHandler}>{isPlaying ? <IoPauseCircle /> : <FaPlayCircle />}</button>
        <button className='icon' onClick={playNextTrack}><BiSolidSkipNextCircle /></button>
      </div>
      <div>
        <div className="speed-controls">
          <button className='icon' onClick={toggleRepeat} style={{ color: isRepeat ? '#4fa3d1' : '#61dafb' }}><FaRepeat /></button>
          <button className='icon' onClick={toggleShuffle} style={{ color: isShuffle ? '#4fa3d1' : '#61dafb' }}><FaShuffle /></button>
          <select id="speedSelect" onChange={handleSpeedChange} value={playbackSpeed}>
            {speedOptions.map((speed) => (
              <option key={speed} value={speed}>
                {speed}x
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className='volume'>
        <input
          type="range"
          min={0}
          max={100}
          value={isSeeking ? seekValue : (currentTime / duration) * 100 || 0}
          onMouseDown={seekStartHandler}
          onMouseUp={seekEndHandler}
          onChange={seekHandler}
        />
       
        <input
          type="range"
          min={0}
          max={1}
          step={0.01}
          value={volume}
          onChange={volumeChangeHandler}
        />
         <label>volume</label>
      </div>
    </div>
  );
};

export default App;

"use client";
import React, { useState, useRef } from "react";
import Hls from "hls.js";

const SnapshotCapture = () => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [snapshots, setSnapshots] = useState([]);
  const [intervalSecs, setIntervalSecs] = useState(2);
  const [totalImages, setTotalImages] = useState(5);
  const [cameraURL, setCameraURL] = useState(
    "http://192.168.49.3/hls/live/Office/index.m3u8"
  );
  const [timer, setTimer] = useState(null);

  const takeSnapshot = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext("2d").drawImage(video, 0, 0, canvas.width, canvas.height);
    const image = canvas.toDataURL("image/png");
    setSnapshots((prev) => [...prev, image]);
  };

  const setupVideo = (url) => {
    const video = videoRef.current;
    if (Hls.isSupported()) {
      const hls = new Hls();
      hls.loadSource(url);
      hls.attachMedia(video);
      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        video.play().then(takeSnapshot);
      });
    } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = url;
      video.play().then(takeSnapshot);
    }
  };

  const handleCyclicSnap = () => {
    clearInterval(timer);
    let count = 0;
    const intervalId = setInterval(() => {
      setupVideo(cameraURL);
      count++;
      if (count >= totalImages) {
        clearInterval(intervalId);
      }
    }, intervalSecs * 1000);
    setTimer(intervalId);
  };

  return (
    <div>
      <div>
        <label>Camera URL:</label>
        <select
          value={cameraURL}
          onChange={(e) => setCameraURL(e.target.value)}
          className="text-black"
        >
          <option value="http://192.168.49.3/hls/live/Office/index.m3u8">
            Office
          </option>
          <option value="http://192.168.49.3/hls/live/Warehouse/index.m3u8">
            Warehouse
          </option>
          {/* Add more camera options as needed */}
        </select>
      </div>
      <div>
        <label>Interval (secs):</label>
        <input
          type="number"
          value={intervalSecs}
          onChange={(e) => setIntervalSecs(parseInt(e.target.value))}
          className="text-black"
        />
      </div>
      <div>
        <label>Total Images:</label>
        <input
          type="number"
          value={totalImages}
          onChange={(e) => setTotalImages(parseInt(e.target.value))}
          className="text-black"
        />
      </div>
      <button onClick={() => setupVideo(cameraURL)}>Snap</button>
      <button onClick={handleCyclicSnap}>Cyclic Snap</button>
      <video ref={videoRef} style={{ display: "none" }} />
      <canvas ref={canvasRef} style={{ display: "none" }} />
      <div style={{ marginTop: "20px" }}>
        <h3>Snapshot Gallery</h3>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
          {snapshots.map((imgSrc, index) => (
            <img
              key={index}
              src={imgSrc}
              alt={`Snapshot ${index + 1}`}
              style={{ width: "550px", height: "auto" }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default SnapshotCapture;

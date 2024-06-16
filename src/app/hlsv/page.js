// pages/player.jsx

import dynamic from "next/dynamic";
import React from "react";

const DynamicVideoPlayer = dynamic(() => import("@/component/hls"), {
  ssr: false, // Ensure the video player is only rendered client-side
});

const handleError = (cameraId) => {
  console.error("Error occurred in video player for camera ID:", cameraId);
};

const PlayerPage = () => {
  const camera = {
    id: 1, // Example camera ID
    imageUrl: "http://192.168.49.3/hls/live/Office/index.m3u8", // Your HLS link
  };

  return (
    <div>
      <h1>Video Stream</h1>
      <DynamicVideoPlayer
        src={camera.imageUrl}
        handleError={handleError}
        cameraId={camera.id}
      />
    </div>
  );
};

export default PlayerPage;

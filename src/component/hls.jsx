// components/VideoPlayer.jsx

import React, { useEffect, useRef } from "react";
import Hls from "hls.js";

const VideoPlayer = ({ src, handleError, cameraId }) => {
  const videoRef = useRef(null);

  useEffect(() => {
    let hls;

    // Dynamically import HLS.js only on the client side
    if (Hls.isSupported()) {
      const video = videoRef.current;
      hls = new Hls();
      hls.loadSource(src);
      hls.attachMedia(video);
      hls.on(Hls.Events.MANIFEST_PARSED, function () {
        video.play().catch((error) => {
          console.error("Error auto-playing video: ", error);
          handleError(cameraId);
        });
      });
    }

    // Handling native HLS support without HLS.js
    if (videoRef.current.canPlayType("application/vnd.apple.mpegurl")) {
      videoRef.current.src = src;
      videoRef.current.addEventListener("loadedmetadata", () => {
        videoRef.current.play().catch((error) => {
          console.error("Error auto-playing video: ", error);
          handleError(cameraId);
        });
      });
    }

    videoRef.current.addEventListener("error", () => {
      console.log("Error Occurred while loading video stream");
      handleError(cameraId);
    });

    return () => {
      if (hls) {
        hls.destroy();
      }
      videoRef.current.removeEventListener("error", handleError);
    };
  }, [src, handleError, cameraId]);

  return (
    <video
      ref={videoRef}
      muted={true}
      autoPlay={true}
      controls={false}
      width="100%"
      height="auto"
      style={{ width: "100%", height: "auto" }}
    />
  );
};

export default VideoPlayer;

import React from "react";

const VideoPlayer = ({ src }) => {
  return (
    <iframe
      id="player_frame"
      src={src}
      frameBorder="0"
      allowFullScreen
      scrolling="no"
      style={{ width: "100%", height: "380px" }} // Adjust the size as necessary
    ></iframe>
  );
};

export default VideoPlayer;

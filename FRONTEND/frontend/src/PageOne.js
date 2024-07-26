import React from "react";
import "./PageOne.css";
import VideoDownload from "./VideoDownload";

const PageOne = ({ onButtonClick }) => {
  return (
    <main
      className="pt5 black-80 center"
      style={{ maxWidth: "40%", maxHeight: "30%", margin: "auto", padding: 20 }}
    >
      <form className="measure">
        <VideoDownload onButtonClick={onButtonClick} />
      </form>
    </main>
  );
};

export default PageOne;

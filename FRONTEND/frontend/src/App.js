// App.js
import React, { useState } from "react";
import VideoCropper from "./VideoCropper";
import "./App.css"; // Import your global CSS here
import VideoTrimmer from "./VideoTrimmer";

import { useEffect, useRef } from "react";
import Nouislider from "nouislider-react";
import VideoDownload from "./VideoDownload";

import MultiStepProgressBar from "./MultiStepProgressBar";
import PageOne from "./PageOne";
import PageTwo from "./PageTwo";
import PageThree from "./PageThree";
import PageFour from "./PageFour";

let ffmpeg; //Store the ffmpeg instance
function App() {
  const [page, setPage] = useState("pageone");

  const nextPage = (page) => {
    setPage(page);
  };

  const nextPageNumber = (pageNumber) => {
    switch (pageNumber) {
      case "1":
        setPage("pageone");
        break;
      case "2":
        setPage("pagetwo");
        break;
      case "3":
        setPage("pagethree");
        break;
    }
  };

  return (
    <div>
      {/* <MultiStepProgressBar page={page} onPageNumberClick={nextPageNumber} /> */}
      <MultiStepProgressBar page={page} onPageNumberClick={nextPageNumber} />
      {
        {
          pageone: <PageOne onButtonClick={nextPage} />,
          pagetwo: <PageTwo onButtonClick={nextPage} />,
          pagethree: <PageThree onButtonClick={nextPage} />,
          pagefour: <PageFour onButtonClick={nextPage} />,
        }[page]
      }
    </div>
  );
}

export default App;

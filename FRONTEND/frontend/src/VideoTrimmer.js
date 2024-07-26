// App.js
// import React, { useState } from "react";
// import VideoCropper from "./VideoCropper";
// import "./App.css"; // Import your global CSS here
// // import VideoTrimmer from "./VideoTrimmer";

// import { useEffect, useRef } from "react";
// import Nouislider from "nouislider-react";
// import "nouislider-react/node_modules/nouislider/distribute/nouislider.css";

// let ffmpeg; //Store the ffmpeg instance
// function VideoTrimmer() {
//   const [videoDuration, setVideoDuration] = useState(0);
//   const [endTime, setEndTime] = useState(0);
//   const [startTime, setStartTime] = useState(0);
//   const [videoSrc, setVideoSrc] = useState("");
//   const [videoFileValue, setVideoFileValue] = useState("");
//   const [isScriptLoaded, setIsScriptLoaded] = useState(false);
//   const [videoTrimmedUrl, setVideoTrimmedUrl] = useState("");
//   const videoRef = useRef();
//   let initialSliderValue = 0;

//   //Created to load script by passing the required script and append in head tag
//   const loadScript = (src) => {
//     return new Promise((onFulfilled, _) => {
//       const script = document.createElement("script");
//       let loaded;
//       script.async = "async";
//       script.defer = "defer";
//       script.setAttribute("src", src);
//       script.onreadystatechange = script.onload = () => {
//         if (!loaded) {
//           onFulfilled(script);
//         }
//         loaded = true;
//       };
//       script.onerror = function () {
//         console.log("Script failed to load");
//       };
//       document.getElementsByTagName("head")[0].appendChild(script);
//     });
//   };

//   //Handle Upload of the video
//   const handleFileUpload = (event) => {
//     const file = event.target.files[0];
//     const blobURL = URL.createObjectURL(file);
//     setVideoFileValue(file);
//     setVideoSrc(blobURL);
//   };

//   //Convert the time obtained from the video to HH:MM:SS format
//   const convertToHHMMSS = (val) => {
//     const secNum = parseInt(val, 10);
//     let hours = Math.floor(secNum / 3600);
//     let minutes = Math.floor((secNum - hours * 3600) / 60);
//     let seconds = secNum - hours * 3600 - minutes * 60;

//     if (hours < 10) {
//       hours = "0" + hours;
//     }
//     if (minutes < 10) {
//       minutes = "0" + minutes;
//     }
//     if (seconds < 10) {
//       seconds = "0" + seconds;
//     }
//     let time;
//     // only mm:ss
//     if (hours === "00") {
//       time = minutes + ":" + seconds;
//     } else {
//       time = hours + ":" + minutes + ":" + seconds;
//     }
//     return time;
//   };

//   useEffect(() => {
//     //Load the ffmpeg script
//     loadScript(
//       "https://cdn.jsdelivr.net/npm/@ffmpeg/ffmpeg@0.11.2/dist/ffmpeg.min.js"
//     ).then(() => {
//       if (typeof window !== "undefined") {
//         // creates a ffmpeg instance.
//         ffmpeg = window.FFmpeg.createFFmpeg({ log: true });
//         //Load ffmpeg.wasm-core script
//         ffmpeg.load();
//         //Set true that the script is loaded
//         setIsScriptLoaded(true);
//       }
//     });
//   }, []);

//   //Get the duration of the video using videoRef
//   useEffect(() => {
//     if (videoRef && videoRef.current) {
//       const currentVideo = videoRef.current;
//       currentVideo.onloadedmetadata = () => {
//         setVideoDuration(currentVideo.duration);
//         setEndTime(currentVideo.duration);
//       };
//     }
//   }, [videoSrc]);

//   //Called when handle of the nouislider is being dragged
//   const updateOnSliderChange = (values, handle) => {
//     setVideoTrimmedUrl("");
//     let readValue;
//     if (handle) {
//       readValue = values[handle] | 0;
//       if (endTime !== readValue) {
//         setEndTime(readValue);
//       }
//     } else {
//       readValue = values[handle] | 0;
//       if (initialSliderValue !== readValue) {
//         initialSliderValue = readValue;
//         if (videoRef && videoRef.current) {
//           videoRef.current.currentTime = readValue;
//           setStartTime(readValue);
//         }
//       }
//     }
//   };

//   //Play the video when the button is clicked
//   const handlePlay = () => {
//     if (videoRef && videoRef.current) {
//       videoRef.current.play();
//     }
//   };

//   //Pause the video when then the endTime matches the currentTime of the playing video
//   const handlePauseVideo = (e) => {
//     const currentTime = Math.floor(e.currentTarget.currentTime);

//     if (currentTime === endTime) {
//       e.currentTarget.pause();
//     }
//   };

//   //Trim functionality of the video
//   const handleTrim = async () => {
//     if (isScriptLoaded) {
//       const { name, type } = videoFileValue;
//       //Write video to memory
//       ffmpeg.FS(
//         "writeFile",
//         name,
//         await window.FFmpeg.fetchFile(videoFileValue)
//       );
//       const videoFileType = type.split("/")[1];
//       //Run the ffmpeg command to trim video
//       await ffmpeg.run(
//         "-i",
//         name,
//         "-ss",
//         `${convertToHHMMSS(startTime)}`,
//         "-to",
//         `${convertToHHMMSS(endTime)}`,
//         "-acodec",
//         "copy",
//         "-vcodec",
//         "copy",
//         `out.${videoFileType}`
//       );
//       //Convert data to url and store in videoTrimmedUrl state
//       const data = ffmpeg.FS("readFile", `out.${videoFileType}`);
//       const url = URL.createObjectURL(
//         new Blob([data.buffer], { type: videoFileValue.type })
//       );
//       setVideoTrimmedUrl(url);
//     }
//   };

//   return (
//     <div className="App">
//       <input type="file" onChange={handleFileUpload} />
//       <br />
//       {videoSrc.length ? (
//         <React.Fragment>
//           <video
//             style={{ width: "500px" }}
//             src={videoSrc}
//             ref={videoRef}
//             onTimeUpdate={handlePauseVideo}
//           >
//             <source src={videoSrc} type={videoFileValue.type} />
//           </video>
//           <br />
//           <Nouislider
//             behaviour="tap-drag"
//             step={1}
//             margin={3}
//             limit={60}
//             range={{ min: 0, max: videoDuration || 2 }}
//             start={[0, videoDuration || 2]}
//             connect
//             onUpdate={updateOnSliderChange}
//           />
//           <br />
//           Start duration: {convertToHHMMSS(startTime)} &nbsp; End duration:{" "}
//           {convertToHHMMSS(endTime)}
//           <br />
//           <button onClick={handlePlay}>Play</button> &nbsp;
//           <button onClick={handleTrim}>Trim</button>
//           <br />
//           {videoTrimmedUrl && (
//             <>
//               <video style={{ width: "500px" }} controls>
//                 <source src={videoTrimmedUrl} type={videoFileValue.type} />
//               </video>
//               <br />
//               <button>save</button>
//             </>
//           )}
//         </React.Fragment>
//       ) : (
//         ""
//       )}
//     </div>
//   );
// }

// export default VideoTrimmer;

// App.js
import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import Nouislider from "nouislider-react";
import "nouislider-react/node_modules/nouislider/distribute/nouislider.css";

const VideoTrimmer = ({ onButtonClick }) => {
  const [videoDuration, setVideoDuration] = useState(0);
  const [endTime, setEndTime] = useState(0);
  const [startTime, setStartTime] = useState(0);
  const [videoSrc, setVideoSrc] = useState("");
  const [videoFile, setVideoFile] = useState(null);
  const [trimmedVideoSrc, setTrimmedVideoSrc] = useState("");
  const videoRef = useRef();
  let initialSliderValue = 0;

  const convertToHHMMSS = (val) => {
    const secNum = parseInt(val, 10);
    let hours = Math.floor(secNum / 3600);
    let minutes = Math.floor((secNum - hours * 3600) / 60);
    let seconds = secNum - hours * 3600 - minutes * 60;

    if (hours < 10) hours = "0" + hours;
    if (minutes < 10) minutes = "0" + minutes;
    if (seconds < 10) seconds = "0" + seconds;
    return hours === "00"
      ? `${minutes}:${seconds}`
      : `${hours}:${minutes}:${seconds}`;
  };

  useEffect(() => {
    // Assuming the combined video is named output.mp4
    setVideoSrc("http://localhost:5000/download/output.mp4");
    const fetchVideo = async () => {
      try {
        const response = await fetch(
          "http://localhost:5000/downloadblob/output.mp4"
        );
        const blob = await response.blob();
        const blobURL = URL.createObjectURL(blob);
        setVideoSrc(blobURL);
      } catch (error) {
        console.error("Error fetching video:", error);
      }
    };

    fetchVideo();
  }, []);

  useEffect(() => {
    if (videoRef && videoRef.current) {
      const currentVideo = videoRef.current;
      currentVideo.onloadedmetadata = () => {
        setVideoDuration(currentVideo.duration);
        setEndTime(currentVideo.duration);
      };
    }
  }, [videoSrc]);

  const updateOnSliderChange = (values, handle) => {
    setTrimmedVideoSrc("");
    const readValue = values[handle] | 0;
    if (handle) {
      if (endTime !== readValue) setEndTime(readValue);
    } else {
      initialSliderValue = readValue;
      if (videoRef && videoRef.current) {
        videoRef.current.currentTime = readValue;
        setStartTime(readValue);
      }
    }
  };

  const handlePlay = () => {
    if (videoRef && videoRef.current) videoRef.current.play();
  };

  const handleStop = () => {
    if (videoRef && videoRef.current) {
      videoRef.current.pause();
      // videoRef.current.currentTime = 0; // Reset the playback time to 0
    }
  };

  const handlePauseVideo = (e) => {
    const currentTime = Math.floor(e.currentTarget.currentTime);
    if (currentTime === endTime) e.currentTarget.pause();
  };

  const handleTrim = async () => {
    if (videoSrc) {
      // const formData = new FormData();
      // formData.append("file", videoFile);

      // const uploadResponse = await axios.post(
      //   "http://localhost:5000/uploadtrim",
      //   formData,
      //   {
      //     headers: { "Content-Type": "multipart/form-data" },
      //   }
      // );
      // const { filepath } = uploadResponse.data;

      const trimResponse = await axios.post("http://localhost:5000/trim", {
        start_time: convertToHHMMSS(startTime),
        end_time: convertToHHMMSS(endTime),
      });

      const { trimmed_path } = trimResponse.data;
      setTrimmedVideoSrc(`http://localhost:5000/trimmed/${trimmed_path}`);
    }
  };

  return (
    <div>
      <div>
        <div
          style={{
            display: "flex",
            minHeight: "300px",
            width: "100%",
            backgroundColor: "powderblue",
            justifyContent: "space-between",
          }}
        >
          <div
            className="card"
            style={{
              width: "50%",
              height: 400,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <div>
              <video
                style={{ width: "500px" }}
                src={videoSrc}
                ref={videoRef}
                onTimeUpdate={handlePauseVideo}
              />
              <br />
            </div>
          </div>
          <div
            className="card"
            style={{
              width: "50%",
              height: 400,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            {!trimmedVideoSrc && <h5 className="card-title">Preview Pane</h5>}
            {trimmedVideoSrc && (
              <>
                <div>
                  <video style={{ width: "500px" }} controls>
                    <source src={trimmedVideoSrc} />
                  </video>
                </div>
              </>
            )}
          </div>
        </div>
        <div className="card">
          <div style={{ width: "50%", padding: 20 }}>
            <Nouislider
              behaviour="tap-drag"
              step={1}
              margin={3}
              limit={60}
              range={{ min: 0, max: videoDuration || 2 }}
              start={[0, videoDuration || 2]}
              connect
              onUpdate={updateOnSliderChange}
            />
            <br />
            Start duration: {convertToHHMMSS(startTime)} &nbsp; End duration:{" "}
            {convertToHHMMSS(endTime)}
            <br />
            <button onClick={handlePlay} className="btn btn-primary">
              Play
            </button>{" "}
            &nbsp;
            <button onClick={handleStop} className="btn btn-danger">
              Stop
            </button>{" "}
            &nbsp;
            <button onClick={handleTrim} className="btn btn-success">
              Trim & Preview
            </button>
            <br />
          </div>
        </div>
      </div>
      <div style={{ display: "grid", justifyContent: "center" }}>
        <button
          type="submit"
          className="btn btn-primary"
          onClick={() => onButtonClick("pagethree")}
          style={{ width: 300 }}
          disabled={!trimmedVideoSrc}
        >
          Next
        </button>
      </div>

      {/* {videoSrc && (
        <>
          <div style={{ display: "flex", justifyContent: "space-around" }}>
            <div>
              <video
                style={{ width: "500px" }}
                src={videoSrc}
                ref={videoRef}
                onTimeUpdate={handlePauseVideo}
              />
              <br />
              <Nouislider
                behaviour="tap-drag"
                step={1}
                margin={3}
                limit={60}
                range={{ min: 0, max: videoDuration || 2 }}
                start={[0, videoDuration || 2]}
                connect
                onUpdate={updateOnSliderChange}
              />
              <br />
              Start duration: {convertToHHMMSS(startTime)} &nbsp; End duration:{" "}
              {convertToHHMMSS(endTime)}
              <br />
              <button onClick={handlePlay} className="btn btn-primary">
                Play
              </button>{" "}
              &nbsp;
              <button onClick={handleStop} className="btn btn-danger">
                Stop
              </button>{" "}
              &nbsp;
              <button onClick={handleTrim} className="btn btn-success">
                Trim
              </button>
              <br />
            </div>
            {trimmedVideoSrc && (
              <>
                <div>
                  <video style={{ width: "500px" }} controls>
                    <source src={trimmedVideoSrc} />
                  </video>
                  <button
                    type="submit"
                    className="btn btn-primary"
                    onClick={() => onButtonClick("pagethree")}
                  >
                    Save & Crop
                  </button>
                </div>
              </>
            )}
          </div>
        </>
      )} */}
    </div>
  );
};

export default VideoTrimmer;

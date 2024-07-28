// App.js
import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import Nouislider from "nouislider-react";
import "nouislider-react/node_modules/nouislider/distribute/nouislider.css";
import { connection_string } from "./global";

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
    setVideoSrc(`${connection_string}output.mp4`);
    const fetchVideo = async () => {
      try {
        const response = await fetch(
          `${connection_string}downloadblob/output.mp4`
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
      const trimResponse = await axios.post(`${connection_string}trim`, {
        start_time: convertToHHMMSS(startTime),
        end_time: convertToHHMMSS(endTime),
      });

      const { trimmed_path } = trimResponse.data;
      setTrimmedVideoSrc(`${connection_string}trimmed/${trimmed_path}`);
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

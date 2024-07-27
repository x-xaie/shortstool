import React, { useState } from "react";
import axios from "axios";
import { ThreeCircles } from "react-loader-spinner";
import { connection_string } from "./global";
const isValidYoutubeUrl = (url) => {
  const regex = /^(https?\:\/\/)?(www\.youtube\.com|youtu\.?be)\/.+$/;
  return regex.test(url);
};

const VideoDownload = ({ onButtonClick }) => {
  const [url, setUrl] = useState("");
  const [error, setError] = useState("");
  const [downloadStatus, setStatus] = useState("downloaded");

  const handleChange = (e) => {
    setUrl(e.target.value);
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isValidYoutubeUrl(url)) {
      setError("Please enter a valid YouTube URL");
      return;
    }

    try {
      setStatus("downloading");
      const response = await axios.post(`${connection_string}/download`, {
        ytUrl: url,
      });
      console.log(response.data);
      setStatus("downloaded");
      onButtonClick("pagetwo");
    } catch (error) {
      console.error("There was an error!", error);
      setError("Failed to download the video. Please try again.");
      setStatus("downloaded");
    }
  };

  return (
    <div style={{ textAlign: "center" }}>
      {downloadStatus == "downloading" ? (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
          }}
        >
          <>
            <div style={{ marginTop: 30 }}>
              <ThreeCircles
                visible={true}
                height="100"
                width="100"
                color="#4fa94d"
                ariaLabel="three-circles-loading"
                wrapperStyle={{}}
                wrapperClass=""
              />
            </div>
            <br />
            <div>
              <h3 className="card-subtitle mb-2 text-muted">Downloading...</h3>
            </div>
          </>
        </div>
      ) : (
        <>
          <div className="form-group">
            <label style={{ textAlign: "center" }}>Youtube Video URL</label>
            <input
              type="text"
              className="form-control"
              aria-describedby="emailHelp"
              placeholder="Enter Youtube Video URL"
              onChange={handleChange}
            />
          </div>
          <button
            type="submit"
            className="btn btn-primary"
            onClick={handleSubmit}
          >
            Submit
          </button>
        </>
      )}

      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
};

export default VideoDownload;

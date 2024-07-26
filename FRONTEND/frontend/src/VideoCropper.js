import React, { useState, useEffect, Suspense } from "react";
import Cropper from "react-easy-crop";
import axios from "axios";
import "./VideoCropper.css";
import { ThreeCircles, ThreeDots } from "react-loader-spinner";

const VideoCropper = ({ onButtonClick }) => {
  const [mergeStatus, setStatus] = useState("");
  const [videoFile, setVideoFile] = useState(null);
  const [frame, setFrame] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [croppedVideoUrl, setCroppedVideoUrl] = useState(null);
  const [filePath, setFilePath] = useState("");

  useEffect(() => {
    const fetchVideoFile = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/trimmedblob/trimmed_output.mp4",
          {
            responseType: "blob",
          }
        );
        const file = new File([response.data], "video.mp4", {
          type: "video/mp4",
        });

        const formData = new FormData();
        formData.append("file", file);

        const uploadResponse = await axios.post(
          "http://localhost:5000/upload",
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );

        if (uploadResponse.data.filepath) {
          setFilePath(uploadResponse.data.filepath);
        }

        setVideoFile(file);
      } catch (error) {
        console.error("Error downloading the video:", error);
      }
    };
    fetchVideoFile();
  }, []);
  useEffect(() => {
    const extractFrame = async () => {
      if (videoFile) {
        const url = URL.createObjectURL(videoFile);
        const video = document.createElement("video");
        video.src = url;
        video.currentTime = 1; // Extract frame at 1 second
        video.onloadeddata = () => {
          video.pause();
          const canvas = document.createElement("canvas");
          canvas.width = video.videoWidth;
          canvas.height = video.videoHeight;
          const context = canvas.getContext("2d");
          context.drawImage(video, 0, 0, canvas.width, canvas.height);
          setFrame(canvas.toDataURL());
        };
      }
    };
    extractFrame();
  }, [videoFile]);

  const onCropComplete = (croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  };

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    setVideoFile(file);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const uploadResponse = await axios.post(
        "http://localhost:5000/upload",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (uploadResponse.data.filepath) {
        setFilePath(uploadResponse.data.filepath);
      }
    } catch (error) {
      console.error("Error uploading video:", error);
    }
  };

  const uploadAndCropVideo = async () => {
    // window.alert("Hello");
    try {
      const cropResponse = await axios.post(
        "http://localhost:5000/crop",
        {
          filepath: filePath,
          x: croppedAreaPixels.x,
          y: croppedAreaPixels.y,
          width: croppedAreaPixels.width,
          height: croppedAreaPixels.height,
        },
        {
          responseType: "blob",
        }
      );

      const blob = new Blob([cropResponse.data], { type: "video/mp4" });
      const croppedUrl = URL.createObjectURL(blob);
      setCroppedVideoUrl(croppedUrl);
    } catch (error) {
      console.error("Error cropping video:", error);
    }
  };

  const handleMerge = async () => {
    try {
      setStatus("merging");
      const response = await axios.post("http://localhost:5000/merge");
      if (response.status == 200) {
        setStatus("merged");
        onButtonClick("pagefour");
      }
    } catch (error) {
      setStatus("");
      console.error("Error Merging the video:", error);
    }
  };

  return (
    <>
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
          <div className="cropper-container">
            {/* <input type="file" accept="video/*" onChange={handleFileChange} /> */}
            {mergeStatus !== "merging" ? (
              <>
                <div style={{ display: "flex" }}>
                  {frame && (
                    <div className="cropper-wrapper">
                      <Cropper
                        image={frame}
                        crop={crop}
                        zoom={zoom}
                        aspect={16 / 9}
                        cropSize={{ width: 200, height: 200 }}
                        onCropChange={setCrop}
                        onZoomChange={setZoom}
                        onCropComplete={onCropComplete}
                        showGrid={false}
                      />
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <ThreeCircles
                  visible={true}
                  height="100"
                  width="100"
                  color="#4fa94d"
                  ariaLabel="three-circles-loading"
                  wrapperStyle={{}}
                  wrapperClass=""
                />
              </>
            )}
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
          {!croppedVideoUrl && <h5 className="card-title">Preview Pane</h5>}
          {croppedVideoUrl && (
            <video
              style={{ width: 300, height: 300 }}
              src={croppedVideoUrl}
              controls
            />
          )}
        </div>
      </div>
      <div
        className="card"
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          width: "50%",
        }}
      >
        <div style={{ padding: 20 }}>
          <button className="crop-button" onClick={uploadAndCropVideo}>
            Crop & Preview
          </button>
        </div>
      </div>

      <div style={{ display: "grid", justifyContent: "center" }}>
        <button
          onClick={handleMerge}
          type="submit"
          className="btn btn-primary"
          style={{ width: 300, margin: 20 }}
          disabled={mergeStatus !== "merging"}
        >
          Merge
        </button>
      </div>
    </>
  );
};

export default VideoCropper;

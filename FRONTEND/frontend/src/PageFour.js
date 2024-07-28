import { useEffect, useState } from "react";
import { connection_string } from "./global";

const PageFour = () => {
  const mergedVideoUrl = `${connection_string}download/final.mp4`;
  const handleDownload = () => {
    window.open(mergedVideoUrl, "_blank");
  };
  return (
    <>
      <div style={{ display: "flex", justifyContent: "center" }}>
        <div
          className="card"
          style={{
            width: "50%",
            height: 500,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {" "}
          {mergedVideoUrl && (
            <>
              <video
                style={{ width: 300, height: 500 }}
                src={mergedVideoUrl}
                controls
              />
            </>
          )}
        </div>
      </div>

      <div style={{ display: "grid", justifyContent: "center", margin: 10 }}>
        <button className="btn btn-primary" onClick={handleDownload}>
          Download
        </button>
      </div>
    </>
  );
};

export default PageFour;

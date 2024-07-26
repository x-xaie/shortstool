import React, { Suspense } from "react";
import "./PageOne.css";
import VideoCropper from "./VideoCropper";
import { ThreeDots } from "react-loader-spinner";

const PageThree = ({ onButtonClick }) => {
  return (
    <Suspense
      fallback={
        <ThreeDots
          visible={true}
          height="80"
          width="80"
          color="#4fa94d"
          radius="9"
          ariaLabel="three-dots-loading"
          wrapperStyle={{}}
          wrapperClass=""
        />
      }
    >
      {" "}
      <VideoCropper onButtonClick={onButtonClick} />
    </Suspense>
  );
};

export default PageThree;

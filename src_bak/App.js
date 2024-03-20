import React, { useCallback, useEffect, useRef, useState } from "react";
import Webcam from "react-webcam";
import { saveAs } from "file-saver";
import { Spin } from "antd";
import { LoadingOutlined } from '@ant-design/icons';
import classNames from "classnames";
import Login from "./containers/login/Login"
import Main from "./containers/router/Router";
import "./App.css"
import Demo from "./containers/DemoTable";

// export default function App() {
//   const webRef = useRef(null);
//   const FACING_MODE_USER = "user";
//   const FACING_MODE_ENVIRONMENT = "environment";
//   const [imgSrc, setImgSrc] = useState(null);
//   const [spinning, setSpinning] = React.useState(false);
//   const [facingMode, setFacingMode] = React.useState(FACING_MODE_USER);


//   const capture = useCallback(() => {
//     const imageSrc = webRef.current.getScreenshot();
//     console.log(imageSrc);
//     setImgSrc(imageSrc);
//   }, [webRef]);

//   const handleClick = () => {
//     let url = imgSrc;
//     saveAs(url, "ImageSoruces.jpg");
//   };
//   const onDownload = () => {
//     const link = document.createElement("a");
//     link.href = imgSrc;
//     link.download = `Image.jpg`;
//     link.click();
//   };
//   const showLoader = () => {
//     setSpinning(true);
//     setTimeout(() => {
//       setSpinning(false);
//     }, 2000);

//   };

//   const videoConstraints = {
//     facingMode: FACING_MODE_USER,
//     width: "100%",
//     // height: 1000,
//   };
//   const switchCamera = useCallback(() => {
//     setFacingMode((prevState) =>
//       prevState === FACING_MODE_USER
//         ? FACING_MODE_ENVIRONMENT
//         : FACING_MODE_USER
//     );
//     showLoader();
//   }, []);

//   return (
//     <div className="App">
//       <Spin indicator={<LoadingOutlined style={{ fontSize: 24 }}spin />} spinning={spinning} />
//       <Webcam
//           width={"100%"}
//           height={1000}
//           ref={webRef}
//           forceScreenshotSourceSize={true}
//           // minScreenshotHeight={1000}
//           minScreenshotWidth={"100%"}
//           videoConstraints={{
//             ...videoConstraints,
//             facingMode,
//           }}
//           mirrored={true}
//           disablePictureInPicture={true}
//           screenshotFormat="image/webp"
//           screenshotQuality={0.92}
//         />
//       <div className="btn-container">
//         <button onClick={capture}>Chụp ảnh</button>
//       </div>
//       {imgSrc ? <img src={imgSrc} alt="webcam" /> : <></>}
//       <button onClick={switchCamera}>Switch camera</button>

//       <a href="" onClick={onDownload}>
//         Download Image
//       </a>
//       <a href="" onClick={handleClick}>
//         Download Image
//       </a>
//     </div>
//   );
// }

// export default function App() {
//   const webcamRef = React.useRef(null);
//   const mediaRecorderRef = React.useRef(null);
//   const [capturing, setCapturing] = React.useState(false);
//   const [recordedChunks, setRecordedChunks] = React.useState([]);
//   const FACING_MODE_USER = "user";
//   const [isAnimating, setIsAnimating] = useState(false);
//   const FACING_MODE_ENVIRONMENT = "environment";
//   const [imgSrc, setImgSrc] = useState([]);
//   const [spinning, setSpinning] = React.useState(false);
//   const [isShowImage, setIsShowImage] = useState(false)
//   const [facingMode, setFacingMode] = React.useState(FACING_MODE_USER);
//   const handleStartCaptureClick = React.useCallback(() => {
//     setCapturing(true);
//     mediaRecorderRef.current = new MediaRecorder(webcamRef.current.stream, {
//       mimeType: "video/webm"
//     });
//     mediaRecorderRef.current.addEventListener(
//       "dataavailable",
//       handleDataAvailable
//     );
//     mediaRecorderRef.current.start();
//   }, [webcamRef, setCapturing, mediaRecorderRef]);

//   const handleDataAvailable = React.useCallback(
//     ({ data }) => {
//       if (data.size > 0) {
//         setRecordedChunks((prev) => prev.concat(data));
//       }
//     },
//     [setRecordedChunks]
//   );

//   const handleStopCaptureClick = React.useCallback(() => {
//     mediaRecorderRef.current.stop();
//     setCapturing(false);
//   }, [mediaRecorderRef, webcamRef, setCapturing]);

//   const handleDownload = React.useCallback(() => {
//     if (imgSrc !== undefined) {
//       const blob = new Blob([imgSrc], {
//         type: "image/jpeg"
//       });

//       // const newBlob = blob.slice(0, blob.size, "image/png");

//       const url = URL.createObjectURL(blob);

//       // Tạo thẻ <a> để tạo liên kết download
//       const a = document.createElement("a");
//       document.body.appendChild(a);
//       a.style = "display: none";
//       a.href = url;
//       a.download = "downloaded_image.png"; // Tên file khi được tải về

//       // Kích hoạt sự kiện click trên thẻ <a>
//       a.click();

//       // Giải phóng tài nguyên
//       window.URL.revokeObjectURL(url);
//       // setImgSrc([]);
//     }
//   }, [imgSrc]);

//   // const showLoader = () => {
//   //   setSpinning(true);
//   //   setTimeout(() => {
//   //     setSpinning(false);
//   //   }, 2000);
//   // };

//   const switchCamera = useCallback(() => {
//     setFacingMode((prevState) =>
//       prevState === FACING_MODE_USER
//         ? FACING_MODE_ENVIRONMENT
//         : FACING_MODE_USER
//     );
//     // showLoader();
//   }, []);

//   const capture = useCallback(() => {
//     const imageSrc = webcamRef.current.getScreenshot();
//     console.log(imageSrc);
//     setImgSrc(imageSrc);
//   }, [webcamRef]);

//   const videoConstraints = {
//     facingMode: FACING_MODE_USER,
//   };

//   const handleClick = () => {
//     setIsAnimating(true);
//     setTimeout(() => {
//       setFacingMode(
//         prevState =>
//           prevState === FACING_MODE_USER
//             ? FACING_MODE_ENVIRONMENT
//             : FACING_MODE_USER
//       );
//       setIsAnimating(false);
//     }, 400); // 500ms, should match the animation duration
//   };

//   const showImage = () => {
//     setIsShowImage(!isShowImage)
//   }

//   // return (
//   //   <>
//   //     <div style={{width: "100%"}}>
//   //       {isShowImage === false ? 
//   //       <Webcam
//   //         audio={false}
//   //         ref={webcamRef}
//   //         width={"100%"}
//   //         style={{ height: "80vh" }}
//   //         forceScreenshotSourceSize={true}
//   //         // minScreenshotHeight={1000}
//   //         // minScreenshotWidth={"100%"}
//   //         videoConstraints={{
//   //           // ...videoConstraints,
//   //           facingMode,
//   //         }}
//   //         mirrored={false}
//   //         disablePictureInPicture={true}
//   //         // screenshotFormat="image/png"
//   //         screenshotQuality={0.92}
//   //       />
//   //       : <img onClick={showImage} style={{ width: "100%", height: "80vh" }} src={imgSrc} alt="webcam" />}

//   //       {/* {capturing ? (
//   //         <button onClick={handleStopCaptureClick}>Stop Capture</button>
//   //       ) : (
//   //         <button onClick={handleStartCaptureClick}>Start Capture</button>
//   //       )} */}
//   //       {imgSrc && (
//   //         <button onClick={handleDownload}>Download</button>
//   //       )}
//   //       <button onClick={capture}>Chụp ảnh</button>

//   //       <button onClick={handleClick}>Switch camera</button>
//   //       {imgSrc && <img onClick={showImage} style={{ width: "100%", height: "80vh", transform: "scale(0.1)"}} src={imgSrc} alt="webcam" />}
//   //     </div>
//   //   </>
//   // );


//   return (<>
//     <Main />
//   </>)
// }
export default function App() {
  const webcamRef = React.useRef(null);
  const mediaRecorderRef = React.useRef(null);
  const [capturing, setCapturing] = React.useState(false);
  const [recordedChunks, setRecordedChunks] = React.useState([]);
  const FACING_MODE_USER = "user";
  const [isAnimating, setIsAnimating] = useState(false);
  const FACING_MODE_ENVIRONMENT = "environment";
  const [imgSrc, setImgSrc] = useState([]);
  const [spinning, setSpinning] = React.useState(false);
  const [isShowImage, setIsShowImage] = useState(false)
  const [facingMode, setFacingMode] = React.useState(FACING_MODE_USER);
  const handleStartCaptureClick = React.useCallback(() => {
    setCapturing(true);
    mediaRecorderRef.current = new MediaRecorder(webcamRef.current.stream, {
      mimeType: "video/webm"
    });
    mediaRecorderRef.current.addEventListener(
      "dataavailable",
      handleDataAvailable
    );
    mediaRecorderRef.current.start();
  }, [webcamRef, setCapturing, mediaRecorderRef]);

  const handleDataAvailable = React.useCallback(
    ({ data }) => {
      if (data.size > 0) {
        setRecordedChunks((prev) => prev.concat(data));
      }
    },
    [setRecordedChunks]
  );

  const handleStopCaptureClick = React.useCallback(() => {
    mediaRecorderRef.current.stop();
    setCapturing(false);
  }, [mediaRecorderRef, webcamRef, setCapturing]);

  const handleDownload = React.useCallback(() => {
    if (imgSrc !== undefined) {
      const blob = new Blob([imgSrc], {
        type: "image/jpeg"
      });

      // const newBlob = blob.slice(0, blob.size, "image/png");

      const url = URL.createObjectURL(blob);

      // Tạo thẻ <a> để tạo liên kết download
      const a = document.createElement("a");
      document.body.appendChild(a);
      a.style = "display: none";
      a.href = url;
      a.download = "downloaded_image.png"; // Tên file khi được tải về

      // Kích hoạt sự kiện click trên thẻ <a>
      a.click();

      // Giải phóng tài nguyên
      window.URL.revokeObjectURL(url);
      // setImgSrc([]);
    }
  }, [imgSrc]);

  // const showLoader = () => {
  //   setSpinning(true);
  //   setTimeout(() => {
  //     setSpinning(false);
  //   }, 2000);
  // };

  const switchCamera = useCallback(() => {
    setFacingMode((prevState) =>
      prevState === FACING_MODE_USER
        ? FACING_MODE_ENVIRONMENT
        : FACING_MODE_USER
    );
    // showLoader();
  }, []);

  const capture = useCallback(() => {
    const imageSrc = webcamRef.current.getScreenshot();
    console.log(imageSrc);
    setImgSrc(imageSrc);
  }, [webcamRef]);

  const videoConstraints = {
    facingMode: FACING_MODE_USER,
  };

  const handleClick = () => {
    setIsAnimating(true);
    setTimeout(() => {
      setFacingMode(
        prevState =>
          prevState === FACING_MODE_USER
            ? FACING_MODE_ENVIRONMENT
            : FACING_MODE_USER
      );
      setIsAnimating(false);
    }, 400); // 500ms, should match the animation duration
  };

  const showImage = () => {
    setIsShowImage(!isShowImage)
  }

  // return (
  //   <>
  //     <div style={{width: "100%"}}>
  //       {isShowImage === false ? 
  //       <Webcam
  //         audio={false}
  //         ref={webcamRef}
  //         width={"100%"}
  //         style={{ height: "80vh" }}
  //         forceScreenshotSourceSize={true}
  //         // minScreenshotHeight={1000}
  //         // minScreenshotWidth={"100%"}
  //         videoConstraints={{
  //           // ...videoConstraints,
  //           facingMode,
  //         }}
  //         mirrored={false}
  //         disablePictureInPicture={true}
  //         // screenshotFormat="image/png"
  //         screenshotQuality={0.92}
  //       />
  //       : <img onClick={showImage} style={{ width: "100%", height: "80vh" }} src={imgSrc} alt="webcam" />}

  //       {/* {capturing ? (
  //         <button onClick={handleStopCaptureClick}>Stop Capture</button>
  //       ) : (
  //         <button onClick={handleStartCaptureClick}>Start Capture</button>
  //       )} */}
  //       {imgSrc && (
  //         <button onClick={handleDownload}>Download</button>
  //       )}
  //       <button onClick={capture}>Chụp ảnh</button>

  //       <button onClick={handleClick}>Switch camera</button>
  //       {imgSrc && <img onClick={showImage} style={{ width: "100%", height: "80vh", transform: "scale(0.1)"}} src={imgSrc} alt="webcam" />}
  //     </div>
  //   </>
  // );


  return (<>
    <Main />
    {/* <Demo /> */}
  </>)
}



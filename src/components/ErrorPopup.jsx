import React, { useEffect, useState } from "react";
import { useRecoilValue, useSetRecoilState } from "recoil";

import { errorAtom } from "../state/error";
import Error from "../atoms/Error";

const ErrorPopup = () => {
  const [showPopup, setShowPopup] = useState(false);
  const error = useRecoilValue(errorAtom);
  const setError = useSetRecoilState(errorAtom);

  useEffect(() => {
    if (!error) return;

    setShowPopup(true);

    const timer = setTimeout(() => {
      setShowPopup(false);
      setError(null);
    }, 5000);

    return () => clearTimeout(timer);
  }, [error]);

  if (!showPopup) {
    return null;
  }

  return (
    <div
      style={{
        position: "fixed",
        top: "20%",
        left: "50%",
        transform: "translateX(-50%)",
        boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
      }}
    >
      <Error />
    </div>
  );
};

export default ErrorPopup;
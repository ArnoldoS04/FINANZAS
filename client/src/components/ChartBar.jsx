import React, { useRef, useEffect } from "react";
import Chart from "chart.js/auto";

const ChartBar = ({ type = "bar", data, options, style, className }) => {
  const ref = useRef(null);

  useEffect(() => {
    const chart = new Chart(ref.current.getContext("2d"), {
      type,
      data,
      options,
    });
    return () => chart.destroy();
  }, [type, data, options]);

  return <canvas ref={ref} style={style} className={className}></canvas>;
};

export default ChartBar;

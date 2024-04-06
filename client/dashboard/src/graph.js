import React, { useEffect, useRef, useState } from "react";
import Chart from "chart.js/auto";
import axios from "axios";

const GraphicalRepresentation = ({ data }) => {
  const [xData, setXData] = useState([]);
  const [yData, setYData] = useState([]);
  const chartRef = useRef(null);
  const chartInstance = useRef(null);
  const options = ["daily", "monthly"];
  const [selectedVal, setSelectedVal] = useState("");
  let axiosData = null;

  function handleSelect(event) {
    setSelectedVal(event.target.value);
  }

  async function getData() {
    try {
      const data = await axios.get("http://localhost:3000/logs/dau-mau", {
        params: { time: selectedVal },
      });
      let xAxisData = [];
      let yAxisData = [];
      if (selectedVal == "monthly") {
        data.data.forEach((obj) => {
          xAxisData.push(obj.month);
          yAxisData.push(obj.count);
        });
        yAxisData.sort(function (a, b) {
          return a - b;
        });
      } else {
        let temp = data.data[0];
        xAxisData = Object.keys(temp);
        yAxisData = Object.values(temp);
      }
      setXData(xAxisData);
      setYData(yAxisData);
      console.log(data);
      axiosData = data;
    } catch (err) {
      console.log(err?.message || err);
    }
  }

  useEffect(() => {
    getData();
  }, [selectedVal]);

  useEffect(() => {
    if (chartInstance.current !== null) {
      chartInstance.current.destroy();
    }

    const ctx = chartRef.current.getContext("2d");

    chartInstance.current = new Chart(ctx, {
      type: "bar",
      data: {
        labels: xData,
        datasets: [
          {
            label: "Data",
            data: yData,
            borderColor: "red",
            backgroundColor: "#9BD0F5",
            tension: 0.1,
          },
        ],
      },
      options: {
        scales: {
          x: {
            title: {
              display: true,
              text: "Days",
            },
          },
          y: {
            title: {
              display: true,
              text: "Data",
            },
          },
        },
      },
    });

    return () => {
      if (chartInstance.current !== null) {
        chartInstance.current.destroy();
      }
    };
  }, [yData]);

  return (
    <div>
      <select onChange={handleSelect}>
        {options.map((option) => (
          <option value={option}>{option}</option>
        ))}
      </select>
      <canvas ref={chartRef} />
    </div>
  );
};

export default GraphicalRepresentation;

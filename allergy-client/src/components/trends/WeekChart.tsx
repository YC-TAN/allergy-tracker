import Box from "@mui/material/Box";
import { LineChart } from "@mui/x-charts/LineChart";
import { SeverityLabel } from "../../schemas/labels";
import type { SeverityRatingType } from "../../schemas";

const WeekChart = () => {
  const margin={ left: 0, top: 30, bottom: 0 }
  const pData = [0, 0, 3, 2, 0, 0, 1];
  const xLabels = [
    "2026-06-03",
    "2026-06-04",
    "2026-06-05",
    "2026-06-06",
    "2026-06-07",
    "2026-06-08",
    "2026-06-09",
  ];

  return (
    <Box className="w-full h-[75dvh]">
      <LineChart
        series={[{ data: pData, label: "symptom", showMark: true }]}
        xAxis={[
          {
            scaleType: "point",
            data: xLabels,
            tickLabelStyle: {
              angle: -45,
              textAnchor: "end",
              dominantBaseline: "central",
            },
            height: 100,
          },
        ]}
        yAxis={[
          {
            min: 0,
            max: 3,
            tickNumber: 4,
            // Replace numeric ticks with severity labels
            valueFormatter: (value: SeverityRatingType) => SeverityLabel[value] ?? "",
            // tickLabelStyle: {
            //   angle: -25,
            //   textAnchor: "end",
            //   dominantBaseline: "central",
            // },
            width: 100,
          },
        ]}
        margin={margin}
        hideLegend
      />
    </Box>
  );
};

export default WeekChart;

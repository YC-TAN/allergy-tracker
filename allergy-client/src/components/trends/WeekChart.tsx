import { LineChart } from "@mui/x-charts/LineChart";
import { SeverityLabel } from "../../schemas/labels";
import type { SeverityRatingType } from "../../schemas";
import { loadAll } from "../../utils/storage";
import { getLast7Days } from "../../utils/dates";

const WeekChart = () => {
  const allEntries = loadAll();
  const sevenDayEntries = getLast7Days().map((date) => ({
    date,
    severity: allEntries[date]?.severity ?? null,
  }));

  return (
    <div className="w-full h-[40dvh] mt-4">
      <LineChart
        dataset={sevenDayEntries}
        series={[
          {
            dataKey: "severity",
            label: "Severity",
            showMark: true,
            connectNulls: false,
            curve: "monotoneX",
            valueFormatter: (v: number | null) => {
              if (v === null) return "No entry";
              return SeverityLabel[v as SeverityRatingType] ?? "";
            },
          },
        ]}
        xAxis={[
          {
            scaleType: "point",
            dataKey: "date",
            valueFormatter: (dateStr: string) =>
              new Date(dateStr).toLocaleDateString("en-NZ", {
                day: "numeric",
                month: "short", // '16 Jun'
              }),
            tickLabelStyle: {
              angle: -90,
              textAnchor: "end",
              dominantBaseline: "central",
            },
            height: "auto",
          },
        ]}
        yAxis={[
          {
            min: 0,
            max: 3,
            tickNumber: 4,
            // Replace numeric ticks with severity labels
            valueFormatter: (value: SeverityRatingType) =>
              SeverityLabel[value] ?? "",
            tickLabelStyle: {
              angle: -45,
              textAnchor: "end",
              dominantBaseline: "central",
            },
            width: 80,
          },
        ]}
        grid={{ horizontal: true }}
        hideLegend
      />
    </div>
  );
};

export default WeekChart;

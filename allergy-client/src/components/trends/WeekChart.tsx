import { SeverityLabel } from "../../schemas/labels";
import type { SeverityRatingType } from "../../schemas";
import { loadAll } from "../../utils/storage";
import { getRelativeDays } from "../../utils/dates";
import BaseCard from "../ui/BaseCard";
import { BarChart } from "@mui/x-charts";
import { PiecewiseColorLegend } from "@mui/x-charts/ChartsLegend";
import { useTheme } from "@mui/material/styles";


const NO_SYMPTOM_DISPLAY_VALUE = 0.15;

const WeekChart = () => {
  const theme = useTheme();
  const allEntries = loadAll();

  const sevenDayEntries = getRelativeDays().map((date) => {
    const severity = allEntries[date]?.severity ?? null;
    return {
      date,
      severity,
      displayValue:
        severity === null
          ? null
          : severity === 0
            ? NO_SYMPTOM_DISPLAY_VALUE
            : severity,
    };
  });

  const severityColors = [
    theme.palette.severity.noSymptoms,     // 0 - green
    theme.palette.severity.mild,           // 1 - yellow
    theme.palette.severity.moderate,       // 2 - orange
    theme.palette.severity.severe,         // 3 - red
  ];

  return (
    <BaseCard>
      <BarChart
        className="h-[40dvh] pt-2"
        dataset={sevenDayEntries}
        series={[
          {
            dataKey: "displayValue",
            label: "Severity Level",
            valueFormatter: (v: number | null) => {
              if (v === null) return "No entry";
              return SeverityLabel[v as SeverityRatingType] ?? "";
            },
          },
        ]}
        xAxis={[
          {
            scaleType: "band",
            dataKey: "date",
            valueFormatter: (dateStr: string) =>
              new Date(dateStr).toLocaleDateString("en-NZ", {
                weekday: "short",
                day: "numeric",
              }),
            tickLabelStyle: {
              fontSize: 11,
            },
          },
        ]}
        yAxis={[
          {
            min: 0,
            max: 3,
            tickMinStep: 1,
            tickNumber: 4,
            // Replace numeric ticks with severity labels
            valueFormatter: (value: SeverityRatingType) =>
              SeverityLabel[value] ?? "",
            tickLabelStyle: {
              fontSize: 11,
              textAnchor: "end",
            },
            width: 4,
            colorMap: {
              type: "piecewise",
              thresholds: [0.5, 1.5, 2.5],
              colors: severityColors,
            },
          },
        ]}
        grid={{ horizontal: true }}
        slots={{ legend: PiecewiseColorLegend }}
      slotProps={{
        legend: {
          axisDirection: "y",
          direction: "horizontal",
          position: {
            vertical: "bottom"
          },
          sx: { padding: 0 },
          labelFormatter: ({ index }) =>
            index !== null
              ? (SeverityLabel[index as SeverityRatingType] ?? null)
              : null,
        },
      }}
      />
      
    </BaseCard>
  );
};

export default WeekChart;

import { Card, CardContent, Typography } from "@mui/material";

const TomorrowCard = () => {

  const forecast = {
    pollenRisk: "Low",
    condition: "Fine apart from morning fog or frost. High cloud developing in the evening. Light winds."
  }
  return (
    <Card 
      className="w-full mb-6"
      sx={{
        backgroundColor: "#f0f7f0",
        // border: "1px solid #a5d6a7",
      }}
    >
      <CardContent>
        <Typography variant="body1" gutterBottom>
          Tomorrow's Conditions 
          <br />
          {forecast.condition}
          <br />
          Pollen risk: {forecast.pollenRisk}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default TomorrowCard;

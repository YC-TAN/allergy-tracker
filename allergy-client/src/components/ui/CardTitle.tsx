import { Typography } from "@mui/material";

interface CardTitleProps {
  title: string;
  optional?: boolean;
}

const CardTitle = ({ title, optional = false }: CardTitleProps) => {
  return (
    <Typography
      variant="caption"
      color="textSecondary"
      className="block mb-2.5 md:px-[5%]"
    >
      {title}
      {optional && (
        <Typography
          component="span"
          variant="caption"
          sx={{
            fontWeight: 400,
            textTransform: "none",
          }}
        >
          {" "}
          (optional)
        </Typography>
      )}
    </Typography>
  );
};

export default CardTitle;

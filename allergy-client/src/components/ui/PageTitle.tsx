import { Typography } from "@mui/material";

interface PageTitleProps {
  title: string;
}

const PageTitle = ({ title }: PageTitleProps) => {
  return (
    <div className="flex flex-col pb-3">
      <Typography variant="h6" gutterBottom>
        {title}
      </Typography>
    </div>
  );
};

export default PageTitle;

import { Typography } from "@mui/material";

interface PageTitleProps {
  children: string;
}

const PageTitle = ({ children }: PageTitleProps) => {
  return (
    <div className="flex flex-col px-5 pb-6">
      <Typography variant="h5" gutterBottom>
        {children}
      </Typography>
    </div>
  );
};

export default PageTitle;

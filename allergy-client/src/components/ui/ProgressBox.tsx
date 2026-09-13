import CircularProgress from '@mui/material/CircularProgress';

const ProgressBox = () => {
  return (
    <div className="flex w-full justify-center items-center py-2">
      <CircularProgress aria-label="Loading…" />
    </div>
  );
}

export default ProgressBox;
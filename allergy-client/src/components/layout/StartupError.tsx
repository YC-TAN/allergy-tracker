import { AppBar, Box, Button, Toolbar, Typography } from "@mui/material";

const StartupError = () => {
//   const [copied, setCopied] = useState(false);

  const handleReload = () => {
    window.location.reload();
  };

  // Unregisters service workers
//   const handleUpdateApp = async () => {
//     try {
//       const registrations =
//         (await navigator.serviceWorker?.getRegistrations()) ?? [];
//       await Promise.all(registrations.map((r) => r.unregister()));
//     } catch (error: unknown) {
//       console.error("Failed to unregister service workers:", error);
//     }
//     window.location.reload();
//   };

//   const handleCopyDetails = async () => {
//     try {
//       await navigator.clipboard.writeText(`${error.name}: ${error.message}`);
//       setCopied(true);
//     } catch (error: unknown) {
//       console.error("Failed to copy error details:", error);
//     }
//   };

  return (
    <Box className="flex flex-col mx-auto h-dvh w-full lg:max-w-180">
      <AppBar position="static">
        <Toolbar className="px-5 md:px-auto">
          {/* Plain Typography: no <Link>, there is no Router on this path */}
          <Typography variant="h5" className="text-inherit">
            Allergy Tracker
          </Typography>
        </Toolbar>
      </AppBar>

      <main className="flex-1 flex flex-col items-center justify-center gap-4 px-5 py-6 text-center md:px-[10%] md:py-[5%]">
        <Typography variant="h6">We couldn't load your saved entries</Typography>
        <Typography color="text.secondary">
          Please try reloading the app.
        </Typography>

        <div className="flex flex-col items-center gap-2">
          <Button variant="contained" onClick={handleReload}>
            Reload
          </Button>
          {/* <Button variant="text" onClick={handleUpdateApp}>
            Update app
          </Button>
          <Button variant="text" size="small" onClick={handleCopyDetails}>
            {copied ? "Copied" : "Copy error details"}
          </Button> */}
        </div>
      </main>
    </Box>
  );
};

export default StartupError;
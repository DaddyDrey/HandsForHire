import { Box, Button, Typography } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";

import ContainerMax from "../../components/common/ContainerMax";
import paths from "../../routes/paths";

export default function NotFoundPage() {
  return (
    <ContainerMax>
      <Box
        sx={{
          minHeight: "calc(100vh - 180px)",
          display: "grid",
          placeItems: "center",
          py: { xs: 8, md: 12 },
          textAlign: "center",
        }}
      >
        <Box sx={{ maxWidth: 520 }}>
          <Typography variant="overline" color="primary" sx={{ fontWeight: 900 }}>
            404
          </Typography>
          <Typography variant="h1" sx={{ mt: 1, mb: 1.5 }}>
            Page not found
          </Typography>
          <Typography color="text.secondary" sx={{ mb: 3 }}>
            The page you are looking for does not exist or has been moved.
          </Typography>
          <Button component={RouterLink} to={paths.home} variant="contained">
            Back home
          </Button>
        </Box>
      </Box>
    </ContainerMax>
  );
}

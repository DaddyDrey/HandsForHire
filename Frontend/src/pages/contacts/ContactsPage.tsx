import { Box, Typography } from "@mui/material";
import ContainerMax from "../../components/common/ContainerMax";

export default function ContactsPage() {
  return (
    <Box
      component="section"
      sx={{
        minHeight: "calc(100vh - 180px)",
        display: "flex",
        alignItems: "center",
        py: { xs: 8, md: 12 },
        background:
          "radial-gradient(circle at 50% 20%, rgba(124, 92, 255, 0.22), transparent 34%), #080C16",
      }}
    >
      <ContainerMax>
        <Box sx={{ maxWidth: 820, mx: "auto", textAlign: "center" }}>
          <Typography
            component="h1"
            sx={{
              fontSize: { xs: "2.6rem", md: "4.8rem" },
              fontWeight: 950,
              lineHeight: 1.05,
              color: "text.primary",
            }}
          >
            Contacts page is in progress
          </Typography>

          <Typography
            sx={{
              mt: 2,
              fontSize: { xs: "1.15rem", md: "1.45rem" },
              fontWeight: 700,
              color: "text.secondary",
            }}
          >
            This section will open soon.
          </Typography>
        </Box>
      </ContainerMax>
    </Box>
  );
}

import { Box, Button, Container, Divider, Stack, Typography } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import paths from "../../../routes/paths";
import { useLanguage } from "../../../i18n/useLanguage";

export default function MainFooter() {
  const { t } = useLanguage();
  const supportEmail = "handsforhiresupp@gmail.com";

  const contactSupportHref = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(
    supportEmail
  )}&su=${encodeURIComponent("HandsForHire - Contact support")}`;

  return (
    <Box component="footer" sx={{ mt: 6 }}>
      <Divider sx={{ borderColor: "rgba(255,255,255,0.08)" }} />

      <Box
        sx={{
          py: 3,
          backgroundColor: "rgba(11,15,25,0.55)",
          backdropFilter: "blur(10px)",
        }}
      >
        <Container maxWidth="lg">
          <Stack
            direction={{ xs: "column", md: "row" }}
            spacing={2}
            alignItems={{ md: "center" }}
            justifyContent="space-between"
          >
            <Box>
              <Typography sx={{ fontWeight: 900, letterSpacing: 0.2 }}>
                HandsForHire
              </Typography>
              <Typography variant="body2" color="text.secondary">
                © {new Date().getFullYear()} {t("footerRights")}
              </Typography>
            </Box>

            <Stack direction="row" spacing={1} sx={{ flexWrap: "wrap" }}>
              <Button component={RouterLink} to={paths.home} variant="text">
                {t("contacts")}
              </Button>

              <Button component={RouterLink} to={paths.about ?? paths.home} variant="text">
                {t("about")}
              </Button>

              <Button component={RouterLink} to={paths.terms ?? paths.home} variant="text">
                {t("termsAndConditions")}
              </Button>

              <Button
                component="a"
                href={contactSupportHref}
                target="_blank"
                rel="noreferrer"
                variant="contained"
              >
                {t("contactSupport")}
              </Button>
            </Stack>
          </Stack>
        </Container>
      </Box>
    </Box>
  );
}
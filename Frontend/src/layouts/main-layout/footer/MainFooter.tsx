import { Box, Button, Container, Divider, Stack, Typography } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import paths from "../../../routes/paths";
import { useLanguage } from "../../../translations/useLanguage";

export default function MainFooter() {
  const { t } = useLanguage();
  const supportEmail = "handsforhiresupp@gmail.com";

  const contactSupportHref = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(
    supportEmail
  )}&su=${encodeURIComponent("HandsForHire - Contact support")}`;

  return (
    <Box component="footer" sx={{ mt: 0 }}>
      <Divider sx={{ borderColor: "rgba(255,255,255,0.08)" }} />

      <Box
        sx={{
          py: { xs: 1.5, md: 1.75 },
          backgroundColor: "rgba(11,15,25,0.55)",
          backdropFilter: "blur(10px)",
        }}
      >
        <Container maxWidth="lg">
          <Stack
            direction="row"
            spacing={1.5}
            alignItems="center"
            justifyContent="space-between"
            sx={{ flexWrap: "wrap", rowGap: 1 }}
          >
            <Stack direction="row" spacing={1} alignItems="center" sx={{ minWidth: 0 }}>
              <Typography sx={{ fontSize: "0.95rem", fontWeight: 900, letterSpacing: 0.2, lineHeight: 1.15 }}>
                HandsForHire
              </Typography>
              <Typography variant="caption" color="text.secondary" sx={{ lineHeight: 1.2 }}>
                © {new Date().getFullYear()} {t("footerRights")}
              </Typography>
            </Stack>

            <Stack direction="row" spacing={0.75} sx={{ flexWrap: "wrap" }}>
              <Button component={RouterLink} to={paths.contacts} variant="text" size="small" sx={{ minHeight: 34, px: 1.25, py: 0.5 }}>
                {t("contacts")}
              </Button>

              <Button component={RouterLink} to={paths.about ?? paths.home} variant="text" size="small" sx={{ minHeight: 34, px: 1.25, py: 0.5 }}>
                {t("about")}
              </Button>

              <Button component={RouterLink} to={paths.terms ?? paths.home} variant="text" size="small" sx={{ minHeight: 34, px: 1.25, py: 0.5 }}>
                {t("termsAndConditions")}
              </Button>

              <Button
                component="a"
                href={contactSupportHref}
                target="_blank"
                rel="noreferrer"
                variant="contained"
                size="small"
                sx={{ minHeight: 34, px: 1.75, py: 0.5 }}
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

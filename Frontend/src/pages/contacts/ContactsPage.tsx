import {
  Box,
  Button,
  Divider,
  Stack,
  Typography,
} from "@mui/material";
import EmailRoundedIcon from "@mui/icons-material/EmailRounded";
import GitHubIcon from "@mui/icons-material/GitHub";
import PhoneRoundedIcon from "@mui/icons-material/PhoneRounded";
import ContainerMax from "../../components/common/ContainerMax";
import { useLanguage } from "../../translations/useLanguage";

const contacts = [
  {
    name: "Toncu Nichita",
    email: "toncunikita@icloud.com",
    phone: "+37379242495",
    github: "Nikitos_git",
    githubUrl: "https://github.com/Nikitos-git",
  },
  {
    name: "Lisnic Andrei",
    email: "andreilisnic2005@gmail.com",
    phone: "+37368568045",
    github: "DaddyDrey",
    githubUrl: "https://github.com/DaddyDrey",
  },
  {
    name: "Bobescu Adriana",
    email: "adrianabobescu1@gmail.com",
    phone: "+37360277914",
    github: "sutonna",
    githubUrl: "https://github.com/sutonna",
  },
];

function initials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export default function ContactsPage() {
  const { t } = useLanguage();

  return (
    <Box
      component="section"
      sx={{
        minHeight: "calc(100vh - 80px)",
        py: { xs: 6, md: 9 },
        background:
          "linear-gradient(135deg, rgba(45,212,191,0.13), transparent 30%), linear-gradient(180deg, #080C16 0%, #0B1020 50%, #07130F 100%)",
      }}
    >
      <ContainerMax>
        <Stack spacing={{ xs: 4.5, md: 6 }}>
          <Box
            sx={{
              px: { xs: 2.5, md: 4 },
              py: { xs: 3, md: 4 },
              borderRadius: 3,
              border: "1px solid rgba(255,255,255,0.08)",
              background:
                "linear-gradient(135deg, rgba(124,92,255,0.14) 0%, rgba(34,197,94,0.07) 55%, rgba(255,255,255,0.03) 100%)",
              boxShadow: "0 24px 80px rgba(0,0,0,0.22)",
            }}
          >
            <Typography
              component="h1"
              sx={{
                maxWidth: 760,
                fontSize: { xs: "2.25rem", md: "3.25rem" },
                fontWeight: 950,
                lineHeight: 1.05,
                color: "text.primary",
              }}
            >
              {t("contactsHeroTitle")}
            </Typography>

            <Typography
              sx={{
                mt: 1,
                maxWidth: 760,
                lineHeight: 1.7,
                color: "text.secondary",
              }}
            >
              {t("contactsHeroText")}
            </Typography>
          </Box>

          <Divider sx={{ borderColor: "rgba(255,255,255,0.08)" }} />

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", md: "repeat(3, 1fr)" },
              gap: 2,
            }}
          >
            {contacts.map((contact) => (
              <Box
                key={contact.email}
                sx={{
                  minHeight: 360,
                  p: { xs: 2.25, md: 2.75 },
                  display: "flex",
                  flexDirection: "column",
                  border: "1px solid rgba(255,255,255,0.12)",
                  borderRadius: 4,
                  bgcolor: "rgba(15,23,42,0.68)",
                  boxShadow: "0 22px 70px rgba(0,0,0,0.28)",
                }}
              >
                <Stack spacing={2.25} sx={{ flex: 1 }}>
                  <Box
                    sx={{
                      width: 64,
                      height: 64,
                      display: "grid",
                      placeItems: "center",
                      borderRadius: "50%",
                      bgcolor:
                        "linear-gradient(135deg, rgba(124,92,255,0.9), rgba(45,212,191,0.75))",
                      color: "white",
                      fontSize: "1.05rem",
                      fontWeight: 950,
                      boxShadow: "0 14px 38px rgba(0,0,0,0.3)",
                    }}
                  >
                    {initials(contact.name)}
                  </Box>

                  <Box>
                    <Typography sx={{ fontSize: "1.35rem", fontWeight: 950 }}>
                      {contact.name}
                    </Typography>
                    <Typography sx={{ mt: 0.5, color: "text.secondary", lineHeight: 1.6 }}>
                      {t("contactsTeamMember")}
                    </Typography>
                  </Box>

                  <Stack spacing={1.25}>
                    <Button
                      component="a"
                      href={`mailto:${contact.email}`}
                      variant="outlined"
                      startIcon={<EmailRoundedIcon />}
                      sx={{ justifyContent: "flex-start", minHeight: 44 }}
                    >
                      {contact.email}
                    </Button>
                    <Button
                      component="a"
                      href={`tel:${contact.phone}`}
                      variant="outlined"
                      startIcon={<PhoneRoundedIcon />}
                      sx={{ justifyContent: "flex-start", minHeight: 44 }}
                    >
                      {contact.phone}
                    </Button>
                    <Button
                      component="a"
                      href={contact.githubUrl}
                      target="_blank"
                      rel="noreferrer"
                      variant="contained"
                      startIcon={<GitHubIcon />}
                      sx={{ justifyContent: "flex-start", minHeight: 44 }}
                    >
                      {contact.github}
                    </Button>
                  </Stack>
                </Stack>
              </Box>
            ))}
          </Box>
        </Stack>
      </ContainerMax>
    </Box>
  );
}

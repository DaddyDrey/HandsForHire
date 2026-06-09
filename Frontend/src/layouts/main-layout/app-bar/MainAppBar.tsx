import { useEffect, useState, useSyncExternalStore } from "react";
import {
  AppBar,
  Avatar,
  Badge,
  Box,
  Button,
  Divider,
  Drawer,
  IconButton,
  Menu,
  MenuItem,
  Toolbar,
  Typography,
} from "@mui/material";
import ChatBubbleOutlineRoundedIcon from "@mui/icons-material/ChatBubbleOutlineRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import MenuRoundedIcon from "@mui/icons-material/MenuRounded";
import { Link as RouterLink, useNavigate } from "react-router-dom";

import Logo from "../../../components/base/Logo";
import paths from "../../../routes/paths";
import { useLanguage } from "../../../translations/useLanguage";
import { type Language } from "../../../translations/translations";
import { getUser, logout, getAvatarDataUrl, clearAvatar, isAdmin } from "../../../auth/auth";
import { fetchAllConversations, getMessagesTick, subscribeToMessages, totalUnread } from "../../../services/messagesStore";
import { useMessagesDrawer } from "../../../components/messages/MessagesDrawerContext";


const languages: Language[] = ["en", "ro", "ru"];

export default function MainAppBar() {
  const { t, language, setLanguage } = useLanguage();
  const nav = useNavigate();

  const user = getUser();
  const avatar = getAvatarDataUrl();

  const initials = user?.email ? user.email.trim()[0].toUpperCase() : "?";

  useSyncExternalStore(subscribeToMessages, getMessagesTick, getMessagesTick);
  const unread = user ? totalUnread(user.email) : 0;

  useEffect(() => {
    if (!user) return;

    fetchAllConversations(user.email);
    const id = window.setInterval(() => {
      fetchAllConversations(user.email);
    }, 5000);

    return () => window.clearInterval(id);
  }, [user?.email]);

  const { openDrawer } = useMessagesDrawer();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  const cycleLanguage = () => {
    const currentIndex = languages.indexOf(language);
    const nextIndex = (currentIndex + 1) % languages.length;
    setLanguage(languages[nextIndex]);
  };

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const openMenu = (e: React.MouseEvent<HTMLElement>) => setAnchorEl(e.currentTarget);
  const closeMenu = () => setAnchorEl(null);
  const closeMobileNav = () => setMobileNavOpen(false);

  const goProfile = () => {
    closeMenu();
    nav(isAdmin(user) ? paths.admin : paths.account);
  };

  const doLogout = () => {
    closeMenu();
    logout();
    clearAvatar();
    nav(paths.home, { replace: true });
  };

  const goMobileProfile = () => {
    closeMobileNav();
    nav(isAdmin(user) ? paths.admin : paths.account);
  };

  const goMobileListings = () => {
    closeMobileNav();
    nav(paths.myListings);
  };

  const goMobileSettings = () => {
    closeMobileNav();
    nav(paths.settings);
  };

  const doMobileLogout = () => {
    closeMobileNav();
    logout();
    clearAvatar();
    nav(paths.home, { replace: true });
  };

  return (
    <>
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          backdropFilter: "blur(10px)",
          backgroundColor: "rgba(11,15,25,0.55)",
          borderBottom: "1px solid rgba(255,255,255,0.08)",
        }}
      >
        <Toolbar sx={{ display: "flex", justifyContent: "space-between", gap: 1.5 }}>
          <Logo />

          <Box sx={{ display: { xs: "none", md: "flex" }, gap: 1, alignItems: "center" }}>
            {user && (
              <Button
                onClick={() => openDrawer()}
                color="inherit"
                startIcon={
                  <Badge color="primary" badgeContent={unread} overlap="circular">
                    <ChatBubbleOutlineRoundedIcon />
                  </Badge>
                }
              >
                {t("messagesNav")}
              </Button>
            )}

            <Button component={RouterLink} to={paths.findAPro} color="inherit">
              {t("findAPro")}
            </Button>

            <Button component={RouterLink} to="/become-a-pro" color="inherit">
              {t("becomeAPro")}
            </Button>

            <Button onClick={cycleLanguage} color="inherit" sx={{ minWidth: 44, fontWeight: 800 }}>
              {language.toUpperCase()}
            </Button>

            {!user ? (
              <Button variant="contained" component={RouterLink} to={paths.login}>
                {t('signIn')}
              </Button>
            ) : (
              <>
                <IconButton onClick={openMenu} sx={{ p: 0.5 }}>
                  <Avatar
                    src={avatar ?? undefined}
                    sx={{
                      width: 38,
                      height: 38,
                      border: "1px solid rgba(255,255,255,0.25)",
                    }}
                  >
                    {initials}
                  </Avatar>
                </IconButton>

                <Menu
                  anchorEl={anchorEl}
                  open={open}
                  onClose={closeMenu}
                  transformOrigin={{ horizontal: "right", vertical: "top" }}
                  anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
                >
                  <MenuItem onClick={goProfile}>
                    <Box sx={{ display: "grid" }}>
                      <Typography sx={{ fontWeight: 750 }}>{t('profileLabel')}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        {user.email}
                      </Typography>
                    </Box>
                  </MenuItem>

                  <MenuItem onClick={() => { closeMenu(); nav(paths.myListings); }}>
                    My listings
                  </MenuItem>

                  <MenuItem onClick={() => { closeMenu(); nav(paths.settings); }}>
                    {t('settingsLabel')}
                  </MenuItem>

                  <MenuItem onClick={doLogout}>{t('logoutButton')}</MenuItem>
                </Menu>
              </>
            )}
          </Box>

          <Box sx={{ display: { xs: "flex", md: "none" }, alignItems: "center", gap: 0.5 }}>
            {user && (
              <IconButton color="inherit" aria-label={t("messagesNav")} onClick={() => openDrawer()}>
                <Badge color="primary" badgeContent={unread} overlap="circular">
                  <ChatBubbleOutlineRoundedIcon />
                </Badge>
              </IconButton>
            )}

            <IconButton
              color="inherit"
              aria-label="Open navigation"
              onClick={() => setMobileNavOpen(true)}
            >
              <MenuRoundedIcon />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>

      <Drawer
        anchor="right"
        open={mobileNavOpen}
        onClose={closeMobileNav}
        PaperProps={{
          sx: {
            width: { xs: "86vw", sm: 360 },
            maxWidth: "360px",
            backgroundColor: "rgba(11,15,25,0.96)",
            backgroundImage: "none",
            color: "common.white",
            borderLeft: "1px solid rgba(255,255,255,0.1)",
          },
        }}
      >
        <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100%", p: { xs: 2, sm: 2.5 } }}>
          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 1 }}>
            <Logo />
            <IconButton color="inherit" aria-label="Close navigation" onClick={closeMobileNav}>
              <CloseRoundedIcon />
            </IconButton>
          </Box>

          <Divider sx={{ borderColor: "rgba(255,255,255,0.1)", mb: 1.5 }} />

          <Box sx={{ display: "grid", gap: 1 }}>
            <Button
              component={RouterLink}
              to={paths.findAPro}
              color="inherit"
              fullWidth
              onClick={closeMobileNav}
              sx={{ justifyContent: "flex-start", minHeight: 44 }}
            >
              {t("findAPro")}
            </Button>

            <Button
              component={RouterLink}
              to="/become-a-pro"
              color="inherit"
              fullWidth
              onClick={closeMobileNav}
              sx={{ justifyContent: "flex-start", minHeight: 44 }}
            >
              {t("becomeAPro")}
            </Button>

            <Button
              onClick={cycleLanguage}
              color="inherit"
              fullWidth
              sx={{ justifyContent: "flex-start", minHeight: 44, fontWeight: 800 }}
            >
              {language.toUpperCase()}
            </Button>
          </Box>

          <Box sx={{ mt: "auto", display: "grid", gap: 1, pt: 2 }}>
            {!user ? (
              <Button variant="contained" component={RouterLink} to={paths.login} onClick={closeMobileNav} fullWidth>
                {t("signIn")}
              </Button>
            ) : (
              <>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1.25, px: 1, py: 1 }}>
                  <Avatar src={avatar ?? undefined} sx={{ width: 38, height: 38 }}>
                    {initials}
                  </Avatar>
                  <Box sx={{ minWidth: 0 }}>
                    <Typography sx={{ fontWeight: 750 }}>{t("profileLabel")}</Typography>
                    <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.68)", wordBreak: "break-word" }}>
                      {user.email}
                    </Typography>
                  </Box>
                </Box>

                <Button onClick={goMobileProfile} color="inherit" fullWidth sx={{ justifyContent: "flex-start" }}>
                  {t("profileLabel")}
                </Button>
                <Button onClick={goMobileListings} color="inherit" fullWidth sx={{ justifyContent: "flex-start" }}>
                  My listings
                </Button>
                <Button onClick={goMobileSettings} color="inherit" fullWidth sx={{ justifyContent: "flex-start" }}>
                  {t("settingsLabel")}
                </Button>
                <Button onClick={doMobileLogout} color="inherit" fullWidth sx={{ justifyContent: "flex-start" }}>
                  {t("logoutButton")}
                </Button>
              </>
            )}
          </Box>
        </Box>
      </Drawer>
    </>
  );
}

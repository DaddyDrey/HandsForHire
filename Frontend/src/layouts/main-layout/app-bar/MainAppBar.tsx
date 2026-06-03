import { useEffect, useState, useSyncExternalStore } from "react";
import {
  AppBar,
  Avatar,
  Badge,
  Box,
  Button,
  Fab,
  IconButton,
  Menu,
  MenuItem,
  Toolbar,
  Typography,
} from "@mui/material";
import ChatBubbleOutlineRoundedIcon from "@mui/icons-material/ChatBubbleOutlineRounded";
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

  const cycleLanguage = () => {
    const currentIndex = languages.indexOf(language);
    const nextIndex = (currentIndex + 1) % languages.length;
    setLanguage(languages[nextIndex]);
  };

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const openMenu = (e: React.MouseEvent<HTMLElement>) => setAnchorEl(e.currentTarget);
  const closeMenu = () => setAnchorEl(null);

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
        <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
          <Logo />

          <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
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

                  <MenuItem onClick={() => { closeMenu(); nav(paths.account); }}>
                    {t('settingsLabel')}
                  </MenuItem>

                  <MenuItem onClick={doLogout}>{t('logoutButton')}</MenuItem>
                </Menu>
              </>
            )}
          </Box>
        </Toolbar>
      </AppBar>

      <Fab
        onClick={cycleLanguage}
        size="small"
        sx={{
          position: "fixed",
          left: 16,
          bottom: 16,
          zIndex: (theme) => theme.zIndex.drawer + 1,
          borderRadius: "999px",
          minWidth: 0,
          px: 2,
          fontWeight: 800,
          letterSpacing: "0.04em",
        }}
      >
        {language.toUpperCase()}
      </Fab>
    </>
  );
}

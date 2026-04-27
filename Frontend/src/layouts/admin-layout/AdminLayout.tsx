import { useEffect, useState } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { Box, Drawer, List, ListItemButton, ListItemIcon, ListItemText, Typography, Chip, useTheme } from "@mui/material";
import DashboardRoundedIcon from "@mui/icons-material/DashboardRounded";
import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import PeopleRoundedIcon from "@mui/icons-material/PeopleRounded";
import StarRoundedIcon from "@mui/icons-material/StarRounded";
import WorkRoundedIcon from "@mui/icons-material/WorkRounded";
import FlagRoundedIcon from "@mui/icons-material/FlagRounded";
import adminPaths from "./adminPaths";
import Logo from "../../components/base/Logo";
import paths from "../../routes/paths";
import ScrollToTop from "../../components/common/ScrollToTop";
import { reportsApi } from "../../api/reportsApi";

const SIDEBAR_WIDTH = 230;

interface NavItem {
  label: string;
  icon: React.ReactNode;
  path: string;
  badge?: number;
}

interface NavGroup {
  section: string;
  items: NavItem[];
}

function buildNavItems(pendingReports: number): NavGroup[] {
  return [
    {
      section: "Overview",
      items: [
        { label: "Dashboard", icon: <DashboardRoundedIcon fontSize="small" />, path: adminPaths.dashboard },
      ],
    },
    {
      section: "Management",
      items: [
        { label: "Users", icon: <PeopleRoundedIcon fontSize="small" />, path: adminPaths.users },
        { label: "Pros", icon: <StarRoundedIcon fontSize="small" />, path: adminPaths.pros },
        { label: "Job listings", icon: <WorkRoundedIcon fontSize="small" />, path: adminPaths.jobs },
      ],
    },
    {
      section: "Moderation",
      items: [
        {
          label: "Reports & flags",
          icon: <FlagRoundedIcon fontSize="small" />,
          path: adminPaths.reports,
          badge: pendingReports > 0 ? pendingReports : undefined,
        },
      ],
    },
  ];
}

export default function AdminLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const [pendingReports, setPendingReports] = useState(0);

  useEffect(() => {
    let cancelled = false;
    reportsApi.getAll()
      .then((data) => {
        if (cancelled) return;
        setPendingReports(data.filter((r) => r.status === "Pending").length);
      })
      .catch(() => {
        if (cancelled) return;
        setPendingReports(0);
      });
    return () => { cancelled = true; };
  }, [location.pathname]);

  const navItems = buildNavItems(pendingReports);

  const isActive = (path: string) => location.pathname === path;

  return (
    <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: "background.default" }}>
      <ScrollToTop />
      {/* Sidebar */}
      <Drawer
        variant="permanent"
        sx={{
          width: SIDEBAR_WIDTH,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: SIDEBAR_WIDTH,
            boxSizing: "border-box",
            bgcolor: "background.paper",
            borderRight: `1px solid ${theme.palette.divider}`,
            overflowX: "hidden",
          },
        }}
      >
        <Box sx={{ px: 2.5, py: 2.5, borderBottom: `1px solid ${theme.palette.divider}` }}>
          <Logo />
          <Typography variant="caption" color="text.secondary">
            Admin panel
          </Typography>
        </Box>

        {/* Nav */}
        <Box sx={{ flex: 1, py: 1 }}>
          <List dense disablePadding sx={{ mb: 1 }}>
            <ListItemButton
              onClick={() => navigate(paths.home)}
              sx={{
                mx: 1,
                px: 1.5,
                py: 0.9,
                borderRadius: 1.5,
                "&:hover": { bgcolor: "rgba(255,255,255,0.04)" },
              }}
            >
              <ListItemIcon sx={{ minWidth: 32, color: "text.secondary" }}>
                <HomeRoundedIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText primary="Home" primaryTypographyProps={{ fontSize: "0.8rem", fontWeight: 400 }} />
            </ListItemButton>
          </List>

          {navItems.map((group) => (
            <Box key={group.section} sx={{ mb: 1 }}>
              <Typography
                variant="caption"
                sx={{
                  px: 2.5,
                  py: 1,
                  display: "block",
                  color: "text.disabled",
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                  fontSize: "0.65rem",
                  fontWeight: 600,
                }}
              >
                {group.section}
              </Typography>
              <List dense disablePadding>
                {group.items.map((item) => (
                  <ListItemButton
                    key={item.path}
                    onClick={() => navigate(item.path)}
                    selected={isActive(item.path)}
                    sx={{
                      mx: 1,
                      px: 1.5,
                      py: 0.9,
                      borderRadius: 1.5,
                      mb: 0.25,
                      "&.Mui-selected": {
                        bgcolor: "rgba(124,92,255,0.12)",
                        color: "primary.main",
                        "& .MuiListItemIcon-root": { color: "primary.main" },
                      },
                      "&.Mui-selected:hover": { bgcolor: "rgba(124,92,255,0.18)" },
                      "&:hover": { bgcolor: "rgba(255,255,255,0.04)" },
                    }}
                  >
                    <ListItemIcon sx={{ minWidth: 32, color: isActive(item.path) ? "primary.main" : "text.secondary" }}>
                      {item.icon}
                    </ListItemIcon>
                    <ListItemText
                      primary={item.label}
                      primaryTypographyProps={{ fontSize: "0.8rem", fontWeight: isActive(item.path) ? 600 : 400 }}
                    />
                    {item.badge && (
                      <Chip
                        label={item.badge}
                        size="small"
                        sx={{
                          height: 18,
                          fontSize: "0.65rem",
                          bgcolor: "rgba(248,113,113,0.15)",
                          color: "#F87171",
                          "& .MuiChip-label": { px: 0.8 },
                        }}
                      />
                    )}
                  </ListItemButton>
                ))}
              </List>
            </Box>
          ))}
        </Box>
      </Drawer>

      {/* Main content */}
      <Box
        component="main"
        sx={{
          flex: 1,
          minWidth: 0,
          px: { xs: 2, md: 4 },
          py: 4,
          pb: 8,
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
}

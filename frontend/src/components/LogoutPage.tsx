import { Box, Button, Typography } from "@mui/material"
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

export const LogoutPage = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();

    const backToLogin = () => {
        navigate("/login");
    }

    const backToHome = () => {
        navigate("/");
    }
  return (
    <Box>
        <Typography variant="h4" sx={{ textAlign: "center", marginTop: 5 }}>
            {t("logoutPage.loggedOut")}
        </Typography>
        <Typography variant="body1" sx={{ textAlign: "center", marginTop: 2 }}>
            {t("logoutPage.thankYou")}
        </Typography>
        <Box sx={{ textAlign: "center", marginTop: 3 }}>
            <Button
            variant="contained"
            color="primary"
            onClick={backToLogin}
            sx={{ marginRight: 2 }}
            >
                {t("logoutPage.goToLogin")}
            </Button>
            <Button
            variant="contained"
            color="primary"
            onClick={backToHome}
            >
                {t("common.home")}
            </Button>
        </Box>
    </Box>
  )
}


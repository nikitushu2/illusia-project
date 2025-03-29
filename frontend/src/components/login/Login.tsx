import { Box, Button, TextField, Typography } from "@mui/material"


export const Login = () => {
  return (
    <Box sx={{margin: 'auto', textAlign: 'center', maxWidth: 600, px: 2}}>
        <Box sx={{ paddingTop: 10, mb: 4}}>
            <Typography variant="h3">Welcome!</Typography>
            <Typography variant="subtitle1">Log in to your account.</Typography>
        </Box>
        <Box sx={{}}>
            <TextField fullWidth label="username/email" variant="outlined" sx={{ mb: 4, maxWidth: 500 }} />
            <TextField fullWidth label="Password" type="password" variant="outlined" sx={{ mb: 4, maxWidth: 500 }} />
        </Box>
        <Box>
            <Button
            variant="contained"
            sx={{ 
                padding: 1,
            }}
            >
            Login
            </Button>
        </Box>
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          my: 2,
          maxWidth: 500,
          mx: 'auto'
        }}>
          <Box sx={{ 
            flexGrow: 1, 
            height: '1px', 
            backgroundColor: 'rgba(0, 0, 0, 0.2)' 
          }} />
          <Typography sx={{ px: 2 }}>or</Typography>
          <Box sx={{ 
            flexGrow: 1, 
            height: '1px', 
            backgroundColor: 'rgba(0, 0, 0, 0.2)' 
          }} />
        </Box>
        <Box>
            <Button
            variant="contained"
            sx={{ 
            textTransform: 'none',
            background: 'transparent',
            color: 'black',
            border: '1px solid orange',
            padding: 1,
            width: 200,
            mb: 2
            }}
            >
            Login with Google
            </Button>
        </Box>

        <Box>
            <Button
            href="#text-buttons"
            sx={{ 
            padding: 1,
            textTransform: 'none'
            }}
            >
            New user register here
            </Button>
        </Box>

        <Box>
            <Button
            href="#text-buttons"
            sx={{ 
            padding: 1,
            textTransform: 'none'
            }}
            >
            Admin Login here
            </Button>
        </Box>
    </Box>
  )
}


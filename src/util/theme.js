import { createMuiTheme } from '@material-ui/core/styles';

export const theme = createMuiTheme({
  palette: {
    primary: {
      light: '#af1038',
      main: '#222649',
      dark: '#af1038',
      contrastText: '#fff',
    },
    secondary: {
      light: '#f5d18f',
      main: '#EE446F',
      dark: '#f5d18f',
      contrastText: '#fff',
    },
  },
  typography: {
    fontFamily: "['Oswald', 'sans-serif'].join(',')",
  },
});

export const styles = (theme) => ({});

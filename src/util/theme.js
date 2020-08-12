import { createMuiTheme } from '@material-ui/core/styles';

export const theme = createMuiTheme({
  palette: {
    primary: {
      light: '#33c9dc',
      main: '#af1038',
      dark: '#EE446F',
      contrastText: '#fff',
    },
    secondary: {
      light: '#DE2548',
      main: '#EE446F',
      dark: '#b22a00',
      contrastText: '#fff',
    },
  },
  typography: {
    fontFamily: "['Oswald', 'sans-serif'].join(',')",
  },
});

export const styles = (theme) => ({});

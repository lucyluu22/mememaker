// import original module declarations
import 'styled-components'

export interface AppTheme {
  scheme: 'light' | 'dark',
  colors: {
    primary: string;
    primaryDark: string;
    primaryBorder: string;
    onPrimary: string;
    onPrimaryDark: string;
  };
}

// and extend them!
declare module 'styled-components' {
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  export interface DefaultTheme extends AppTheme {}
}

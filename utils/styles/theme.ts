import { Theme } from '@react-navigation/native';

export type CustomTheme = Theme & {
    //colors: Record<'focus' | 'warning', string>
    colors: Record<'white' | 'darkGrey' | 'paper' | 'secondary' | 'paperTransparent' | 'inputBg' | 'grey' | 'success' | 'danger', string>
};

export type ColorNames = keyof Theme['colors'];

enum Colors {
    black = '#000000',
    darkGrey = '#2A2A2A',
    midGrey = '#6C6C6C',
    lightGrey = '#EDEDED',
    blue = '#2541FC',
    coral = '#FF4A6E',
    pink = '#DE00A5',
    lightPink = '#E28FC7',
    red = '#FF0000',
    white = '#FFFFFF',
}

export const darkTheme: CustomTheme = {
    dark: true,
    colors: {
        white: '#000',
        primary: '#e99127',
        secondary: 'rgb(10, 132, 255)',
        background: 'rgb(1, 1, 1)',
        card: 'rgb(18, 18, 18)',
        text: 'rgb(229, 229, 231)',
        border: 'rgb(39, 39, 41)',
        notification: 'rgb(255, 69, 58)',
        paper: '#38383a',
        paperTransparent: 'rgba(56, 56, 58, 0.35)',
        inputBg: '#333333',
        grey: '#bdbdbd',
        success: '#66bb6a',
        danger: '#d32f2f',
        darkGrey: '#6b7280'
    }
};

export const lightTheme: CustomTheme = {
    dark: false,
    colors: {
        white: '#fff',
        primary: '#e99127',
        secondary: 'rgb(0, 122, 255)',
        background: 'rgb(242, 242, 242)',
        card: 'rgb(255, 255, 255)',
        text: 'rgb(28, 28, 30)',
        border: 'rgb(216, 216, 216)',
        notification: 'rgb(255, 59, 48)',
        paper: '#f5f5f5',
        paperTransparent: 'rgba(245, 245, 245, 0.35)',
        inputBg: '#f2f2f2',
        grey: '#bdbdbd',
        success: '#81c784',
        danger: '#e57373',
        darkGrey: '#6b7280'
    }
};

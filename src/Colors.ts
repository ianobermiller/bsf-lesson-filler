import {injectGlobal} from 'emotion';

injectGlobal`
  ::-webkit-scrollbar {
    -webkit-appearance: none;
    width: 7px;
  }
  ::-webkit-scrollbar-thumb {
    border-radius: 4px;
    background-color: rgba(0,0,0,.5);
    box-shadow: 0 0 1px rgba(255,255,255,.5);
  }

  :root {
    --xs: 4px;
    --s: 8px;
    --m: 16px;
    --l: 24px;
    --xl: 32px;
    --xxl: 40px;

    --font-size-xs: 10px;
    --font-size-s: 12px;
    --font-size-m: 14px;
    --font-size-l: 16px;
    --font-size-xl: 20px;

    --radius-s: 4px;
    --radius-m: 6px;
    --radius-l: 8px;

    --background-empty: #ffffff;
    --background-primary: #f9f9fa;
    --background-secondary: #f3f3f6;
    --background-tertiary: #edeeef;
    --background-strong: #b0b7c2;
    --background-inverted: #212b4a;
    --border-primary: rgba(41, 54, 87, 0.17);
    --border-secondary: rgba(41, 54, 87, 0.2);
    --border-tertiary: #a5aebb;
    --border-disabled: rgba(60, 76, 109, 0.07);
    --blue-light: #c5e1fe;
    --blue-light-alpha: rgba(60, 149, 252, 0.3);
    --blue: #036ffa;
    --blue-dark: #0138a6;
    --content-primary: #212b4a;
    --content-secondary: #3c4c6d;
    --content-placeholder: #637797;
    --content-disabled: #99a4b4;
    --content-interactive: #036ffa;
    --content-negative: #de3700;
    --content-positive: #1c9b46;
    --content-inverted: #ffffff;
    --content-warning: #ffd76d;
    --control-background: rgba(60, 76, 109, 0.07);
    --control-background-hover: rgba(60, 76, 109, 0.12);
    --control-background-active: rgba(41, 54, 87, 0.17);
    --control-background-disabled: rgba(60, 76, 109, 0.03);
    --control-background-selected: rgba(60, 149, 252, 0.13);
    --green-light: #e5f7ec;
    --green-light-alpha: rgba(122, 221, 159, 0.3);
    --green: #1c9b46;
    --green-dark: #084513;
    --purple-light: #e5dcf6;
    --purple-light-alpha: rgba(176, 136, 237, 0.25);
    --purple: #9c64ec;
    --purple-dark: #300151;
    --red-light: #ffcab3;
    --red-light-alpha: rgba(255, 80, 15, 0.25);
    --red: #de3700;
    --red-dark: #6a0b00;
    --yellow-light-alpha: rgba(253, 178, 0, 0.3);
    --yellow-light: #fff0c4;
    --yellow: #fdb200;
    --yellow-dark: #2f1d00;

    @media (prefers-color-scheme: dark) {
      --background-empty: #3a3f4e;
      --background-primary: #252834;
      --background-secondary: #2a2d3a;
      --background-tertiary: #2f3341;
      --background-strong: #171820;
      --background-inverted: #036ffa;
      --border-primary: #1c1d27;
      --border-secondary: #3a3f4e;
      --border-tertiary: #747c95;
      --border-disabled: #454b5c;
      --blue-light: #0138a6;
      --blue-light-alpha: rgba(60, 149, 252, 0.3);
      --blue: #036ffa;
      --blue-dark: #9dccfd;
      --content-primary: #c7cbd4;
      --content-secondary: #9aa0b1;
      --content-placeholder: #80889f;
      --content-disabled: #747c95;
      --content-interactive: #3c95fc;
      --content-negative: #de3700;
      --content-positive: #1c9b46;
      --content-inverted: #ffffff;
      --content-warning: #ffd76d;
      --control-background: rgba(96, 104, 128, 0.25);
      --control-background-hover: rgba(96, 104, 128, 0.35);
      --control-background-active: rgba(154, 160, 177, 0.65);
      --control-background-disabled: rgba(96, 104, 128, 0.12);
      --control-background-selected: rgba(60, 149, 252, 0.13);
      --green-light: #e5f7ec;
      --green-light-alpha: rgba(122, 221, 159, 0.3);
      --green: #1c9b46;
      --green-dark: #084513;
      --purple-light: #e5dcf6;
      --purple-light-alpha: rgba(176, 136, 237, 0.25);
      --purple: #9c64ec;
      --purple-dark: #300151;
      --red-light: #ffcab3;
      --red-light-alpha: rgba(255, 80, 15, 0.25);
      --red: #de3700;
      --red-dark: #6a0b00;
      --yellow-light-alpha: rgba(253, 178, 0, 0.3);
      --yellow-light: #fff0c4;
      --yellow: #fdb200;
      --yellow-dark: #2f1d00;
    }
  }
`;

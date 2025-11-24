export interface IColors {
  mainColors: {
    brightRed(brightRed: any, arg1: number): string;
    main: string;
    brightGreen: string;
    emeraldGreen: string;
    darkTeal: string;
    lightGreen: string;
    verylightGreen: string;
    dark_green: string;
    primary:string;
    borderColor:string;
    blueGrayTitle:string;
    scrollBar:string;
    carbonGray:string;
    slateBlue:string;
  };
  grayScale: {
    black: string;
    richBlack:string;
    darkGray: string;
    grayDark: string;
    mediumGray: string;
    lightGray: string;
    veryLightGray: string;
    graylight:string;
    slateGray:string;
    bluetintedgray:string;
  };
  gradients: {
    greenToBlack: [string, string];
    greenToDarkTeal: [string, string];
    greenSegementButton: [string, string];
  };
  neutrals: {
    lightGray: string;
    darkGray: string;
    black: string;
    lightYellow: string;
    lightOrange: string;
    lightRed: string;
    red:string,
  };
  common: {
    white: string;
    transparent: string;
    black: string;
    grayBlack: string;
    backdrop: string;
  };
  input: {
    inputOutline: string;
  };
  barchart:{
    lightGray: string,
  }
}

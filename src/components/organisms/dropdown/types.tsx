import { RefObject } from "react";
import {StyleProp, TextStyle, ViewStyle } from "react-native";

export interface Option {
    [key: string]: any;
}

export interface DropdownProps {
    label: string;
    options: Option[];
    labelKey: string;
    valueKey: string; 
    onSelect: (value: Option) => void;
    error?: string; 
    disableDropdown?:boolean;
    hasMoreData?:()=>void,
    containerStyle?:StyleProp<ViewStyle>;
    onChangeText: (text : string) => void;
    textStyle?:StyleProp<TextStyle>;
    isLoader?:boolean;
    clearText?:boolean;
    isUnitDropdown?:boolean;
    dropdownLabel?:string;
    requiredField?:boolean;
    setValue?:string
    testID?:string
    ref?: RefObject<any>
    customContainerStyle?: object;
    customBorderStyle?:object;
    handleOnClose?:()=>void;
    disabled?: boolean;
    customLabelStyle?:StyleProp<TextStyle>
    loaderStyle?:StyleProp<TextStyle>
}
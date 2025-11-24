import {View,Text,ViewStyle, Animated,TouchableOpacity} from 'react-native';
import React,{FC} from 'react';

interface ScalePressProps{
    onPress?:()=>void;
    onLongPress?:()=>void;
    children:React.ReactNode;
    styles?:ViewStyle| ViewStyle[];
}

const ScalePress:FC<ScalePressProps>=({
    onLongPress,
    onPress,
    children,
    styles
})=>{
    const scaleValue= new Animated.Value(1);

    const onPressIn=()=>{
        Animated.spring(scaleValue,{
            toValue:0.96,
            useNativeDriver:true,
        }).start();
    };
    const onPressOut=()=>{
        Animated.timing(scaleValue,{
            toValue:1,
            duration:300,
            useNativeDriver:true,
        }).start();
    };
    return (
        <TouchableOpacity 
        onPress={onPress}
        onPressOut={onPressOut}
        onLongPress={onLongPress}
        onPressIn={onPressIn}
        activeOpacity={1}
        style={{...styles}}>
            <Animated.View style={{transform:[{scale:scaleValue}],width:'100%'}}>
                {children}
            </Animated.View>
        </TouchableOpacity>
    );
};

export default ScalePress
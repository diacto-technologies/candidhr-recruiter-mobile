import React, { FC } from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesome6Icons from 'react-native-vector-icons/FontAwesome6'

interface IconProps {
    color?: string;
    size: number;
    name: string;
    iconFamily: 'Ionicons' | 'MaterialCommunityIcons' | 'MaterialIcons'|'FontAwesome6Icons';
}

const Icon: FC<IconProps> = ({ color, size, name, iconFamily }) => {
    return (
        <>
            {iconFamily === 'Ionicons' && <Ionicons name={name} size={size} color={color} />}
            {iconFamily === 'MaterialIcons' && <MaterialIcons name={name} size={size} color={color} />}
            {iconFamily === 'MaterialCommunityIcons' && <MaterialCommunityIcons name={name} size={size} color={color} />}
            {iconFamily === 'FontAwesome6Icons' && <FontAwesome6Icons name={name} size={size} color={color} />}
        </>
    );
};

export default Icon;

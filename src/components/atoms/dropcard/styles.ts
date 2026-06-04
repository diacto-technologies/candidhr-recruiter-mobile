import {StyleSheet} from 'react-native';
export const useStyles = () => {
    return StyleSheet.create({
        dropcard: {
          width: 260,
          paddingVertical: 0,
          flexDirection: "column",
          alignItems: "flex-start",
      
          borderRadius: 8,
          borderWidth: 1,
          borderColor: "#E9EAEB",
          backgroundColor: "#FFFFFF",
      
          // shadow-lg (iOS)
          shadowColor: "#0A0D12",
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.03,
          shadowRadius: 6,
      
          // elevation (Android)
          elevation: 3,
        },
      })
    }
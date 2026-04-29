import React from 'react'
import { View, Pressable } from 'react-native'
import { SvgXml } from 'react-native-svg'
import Typography from '../../atoms/typography'
import { colors } from '../../../theme/colors'
import Card from '../../atoms/card'

type Props = {
  title: string
  description: string
  icon: string
  isSelected: boolean
  onPress: () => void
}

const SelectableCard: React.FC<Props> = ({
  title,
  description,
  icon,
  isSelected,
  onPress,
}) => {
  return (
    <Card
      onPress={onPress}
      style={{
        flexDirection: 'row',
        height: 93,
        padding: 16,
        borderRadius: 12,
        borderWidth: 2,
        borderColor: isSelected ? colors.brand[500] : colors.gray[200],
        backgroundColor: colors.base.white,
      }}
    >
      {/* Icon */}
      <SvgXml xml={icon} style={{ marginRight: 12 }} />

      {/* Text */}
      <View style={{ flex: 1 }}>
        <Typography variant="semiBoldTxtmd" color={colors.gray[700]}>
          {title}
        </Typography>
        <Typography variant="regularTxtsm" color={colors.gray[600]}>
          {description}
        </Typography>
      </View>

      {/* Radio */}
      <View
        style={{
          width: 20,
          height: 20,
          borderRadius: 10,
          borderWidth: isSelected ? 6 : 1,
          borderColor: isSelected
            ? colors.brand[500]
            : colors.gray[300],
        }}
      />
    </Card>
  )
}

export default SelectableCard
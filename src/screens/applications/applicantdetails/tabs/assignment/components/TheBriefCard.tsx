import React from 'react';
import { View } from 'react-native';
import { SvgXml } from 'react-native-svg';
import Typography from '../../../../../../components/atoms/typography';
import Card from '../../../../../../components/atoms/card';
import { colors } from '../../../../../../theme/colors';
import { fileIconWithColor } from '../../../../../../assets/svg/file';
import { useStyles } from '../styles';

interface Props {
  description: string;
}

export const TheBriefCard: React.FC<Props> = React.memo(({ description }) => {
  const styles = useStyles();

  if (!description) return null;

  return (
    <Card style={styles.card}>
      <View style={styles.briefHeaderRow}>
        <Typography style={styles.briefTitle} variant="semiBoldTxtlg">
          The Brief
        </Typography>
      </View>

      <Typography style={styles.briefDescription}>
        {description}
      </Typography>
    </Card>
  );
});

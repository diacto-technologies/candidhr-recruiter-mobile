import React from 'react';
import { StyleSheet, View } from 'react-native';
import { SvgXml } from 'react-native-svg';

import Typography from '../../atoms/typography';
import { Illustrations } from '../../../assets/svg/illustrations';
import { colors } from '../../../theme/colors';

export type ListEmptyStateProps = {
    /** Headline (defaults match design: “No projects found”). */
    title?: string;
    /** Supporting line under the title. */
    description?: string;
    /** Defaults to the shared search / empty illustration SVG in the app. */
    illustrationXml?: string;
    /** Optional cap on illustration width for dense layouts. */
    illustrationWidth?: number;
    illustrationHeight?: number;
};

const DEFAULT_TITLE = 'No projects found';

const DEFAULT_DESCRIPTION =
    'Your search “Landing page design” did not match any projects. Please try again.';

/**
 * Centered empty state: illustration + title + description (reusable for lists and cards).
 */
const ListEmptyState: React.FC<ListEmptyStateProps> = ({
    title = DEFAULT_TITLE,
    description = DEFAULT_DESCRIPTION,
    illustrationXml = Illustrations,
    illustrationWidth,
    illustrationHeight,
}) => {
    return (
        <View style={styles.wrap} accessibilityLabel={`${title}. ${description}`}>
            <SvgXml
                xml={illustrationXml}
                width={illustrationWidth ?? 152}
                height={illustrationHeight ?? 118}
            />
            <Typography variant="semiBoldTxtmd" color={colors.gray[900]} style={styles.title}>
                {title}
            </Typography>
            <Typography variant="regularTxtsm" color={colors.gray[500]} style={styles.desc}>
                {description}
            </Typography>
        </View>
    );
};

export default ListEmptyState;

const styles = StyleSheet.create({
    wrap: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 24,
        paddingHorizontal: 12,
        gap: 10,
    },
    title: {
        textAlign: 'center',
    },
    desc: {
        textAlign: 'center',
        maxWidth: 320,
        lineHeight: 20,
    },
});

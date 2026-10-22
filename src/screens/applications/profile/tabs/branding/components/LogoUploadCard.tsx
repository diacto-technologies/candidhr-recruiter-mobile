import React from 'react';
import { View, Image, Pressable } from 'react-native';
import { SvgXml, SvgUri } from 'react-native-svg';
import Typography from '../../../../../../components/atoms/typography';
import { colors } from '../../../../../../theme/colors';
import { pageReloadIcon } from '../../../../../../assets/svg/pageReload';
import { deleteIcon } from '../../../../../../assets/svg/deleteicon';
import { LogoUploadCardProps } from '../branding.d';
import { useStyles } from '../styles';

const uploadSvg = `<svg width="14" height="14" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M14 10V12.6667C14 13.0203 13.8595 13.3594 13.6095 13.6095C13.3594 13.8595 13.0203 14 12.6667 14H3.33333C2.97971 14 2.64057 13.8595 2.39052 13.6095C2.14048 13.3594 2 13.0203 2 12.6667V10M11.3333 5.33333L8 2M8 2L4.66667 5.33333M8 2V10" stroke="#535862" stroke-width="1.33" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`;

export const LogoUploadCard: React.FC<LogoUploadCardProps> = React.memo(({
  type,
  title,
  specs,
  currentUrl,
  localFile,
  onReplace,
  onDelete,
  isAutoBadge,
  autoBadgeText = 'AUTO',
  disabled = false,
  productName = '',
  brandColor = colors.brand[600],
  autoSubText,
}) => {
  const styles = React.useMemo(() => useStyles(brandColor), [brandColor]);
  const [loadError, setLoadError] = React.useState(false);

  const previewUri = localFile?.uri || currentUrl || null;
  const isAuto = Boolean(!previewUri || isAutoBadge);

  const trimmedName = productName?.trim() || '';
  const showContent = Boolean(trimmedName);
  const firstLetter = showContent ? trimmedName[0].toUpperCase() : '';

  React.useEffect(() => {
    setLoadError(false);
  }, [previewUri]);

  const formattedUri = React.useMemo(() => {
    if (!previewUri) return null;
    if (
      previewUri.startsWith('http://') ||
      previewUri.startsWith('https://') ||
      previewUri.startsWith('file://') ||
      previewUri.startsWith('data:') ||
      previewUri.startsWith('content://')
    ) {
      return previewUri;
    }
    return `file://${previewUri}`;
  }, [previewUri]);

  const isSvg = Boolean(
    formattedUri && (formattedUri.endsWith('.svg') || formattedUri.includes('.svg?'))
  );

  return (
    <View style={styles.logoCard}>
      <View style={styles.previewContainer}>
        {formattedUri && !loadError ? (
          isSvg ? (
            <View style={styles.previewSvg}>
              <SvgUri
                uri={formattedUri}
                width={type === 'favicon' ? 32 : 120}
                height={type === 'favicon' ? 32 : 60}
              />
            </View>
          ) : (
            <Image
              source={{ uri: formattedUri }}
              style={type === 'favicon' ? styles.previewFaviconImage : styles.previewImage}
              resizeMode="contain"
              onError={() => setLoadError(true)}
            />
          )
        ) : (
          <View style={styles.previewPlaceholder}>
            {type === 'logo' && showContent && (
              <View style={styles.autoLogoPreviewRow}>
                <View style={[styles.autoLetterBadge, { backgroundColor: brandColor }]}>
                  <Typography variant="semiBoldTxtmd" color={colors.base.white}>
                    {firstLetter}
                  </Typography>
                </View>
                <Typography variant="semiBoldTxtlg" color={colors.gray[900]} style={styles.autoLogoText}>
                  {trimmedName}
                </Typography>
              </View>
            )}

            {type === 'secondary_logo' && showContent && (
              <View style={[styles.autoCompactBadge, { backgroundColor: brandColor }]}>
                <Typography variant="boldDsm" color={colors.base.white}>
                  {firstLetter}
                </Typography>
              </View>
            )}

            {type === 'favicon' && showContent && (
              <View style={[styles.autoFaviconBadge, { backgroundColor: brandColor }]}>
                <Typography variant="semiBoldTxtmd" color={colors.base.white}>
                  {firstLetter}
                </Typography>
              </View>
            )}
          </View>
        )}

        {isAuto && (
          <View style={styles.autoBadge}>
            <Typography variant="mediumTxtxs" color={colors.gray[600]}>
              {autoBadgeText || 'AUTO'}
            </Typography>
          </View>
        )}
      </View>

      <View style={styles.logoMetaRow}>
        <View style={styles.logoTitle}>
          <Typography variant="semiBoldTxtsm" color={colors.gray[900]}>
            {title}
          </Typography>
          {isAuto && Boolean(autoSubText) && (
            <Typography variant="mediumTxtxs" color={colors.brand[600]} style={styles.autoSubText}>
              {autoSubText}
            </Typography>
          )}
          <Typography variant="regularTxtxs" color={colors.gray[500]} style={styles.specsText}>
            {specs}
          </Typography>
        </View>

        <View style={styles.logoActions}>
          {isAuto ? (
            <Pressable
              style={styles.uploadTextBtn}
              onPress={onReplace}
              disabled={disabled}
              hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
            >
              <SvgXml xml={uploadSvg} width={14} height={14} />
              <Typography variant="mediumTxtxs" color={colors.gray[700]}>
                Upload
              </Typography>
            </Pressable>
          ) : (
            <>
              <Pressable
                style={styles.actionIconBtn}
                onPress={onReplace}
                disabled={disabled}
                hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
                accessibilityLabel={`Replace ${title}`}
              >
                <SvgXml xml={pageReloadIcon(colors.gray[500])} width={16} height={16} />
              </Pressable>

              <Pressable
                style={styles.actionIconBtn}
                onPress={onDelete}
                disabled={disabled}
                hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
                accessibilityLabel={`Delete ${title}`}
              >
                <SvgXml xml={deleteIcon} width={16} height={16} />
              </Pressable>
            </>
          )}
        </View>
      </View>
    </View>
  );
});

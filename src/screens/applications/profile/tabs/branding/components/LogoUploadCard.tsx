import React from 'react';
import { View, Image, Pressable } from 'react-native';
import { SvgXml, SvgUri } from 'react-native-svg';
import Typography from '../../../../../../components/atoms/typography';
import { colors } from '../../../../../../theme/colors';
import { pageReloadIcon } from '../../../../../../assets/svg/pageReload';
import { getDeleteIcon } from '../../../../../../assets/svg/deleteicon';
import { LogoUploadCardProps } from '../branding.d';
import { useStyles } from '../styles';

const uploadSvg = `<svg width="14" height="14" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M14 10V12.6667C14 13.0203 13.8595 13.3594 13.6095 13.6095C13.3594 13.8595 13.0203 14 12.6667 14H3.33333C2.97971 14 2.64057 13.8595 2.39052 13.6095C2.14048 13.3594 2 13.0203 2 12.6667V10M11.3333 5.33333L8 2M8 2L4.66667 5.33333M8 2V10" stroke="#535862" stroke-width="1.33" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`;

const imagePlaceholderSvg = `<svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<rect x="3" y="3" width="18" height="18" rx="4" stroke="#98A2B3" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
<circle cx="8.5" cy="8.5" r="1.5" fill="#98A2B3"/>
<path d="M21 15L16 10L5 21" stroke="#98A2B3" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
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
  fallbackText,
  compactLogoUrl,
  errorMessage,
  recommendedResolution,
}) => {
  const styles = React.useMemo(() => useStyles(brandColor), [brandColor]);
  const [loadError, setLoadError] = React.useState(false);
  const [compactLoadError, setCompactLoadError] = React.useState(false);
  const [detectedResolution, setDetectedResolution] = React.useState<string | null>(null);

  const previewUri = localFile?.uri || currentUrl || null;
  const isAuto = Boolean(!previewUri || isAutoBadge);

  const trimmedName = productName?.trim() || '';
  const displayInitials = fallbackText || (trimmedName ? trimmedName[0].toUpperCase() : '');
  const showContent = Boolean(displayInitials || trimmedName || compactLogoUrl);
  const firstLetter = displayInitials;

  React.useEffect(() => {
    setLoadError(false);
  }, [previewUri]);

  React.useEffect(() => {
    setCompactLoadError(false);
  }, [compactLogoUrl]);

  // Resolution detection: priority to localFile.width/height, then Image.getSize
  React.useEffect(() => {
    if (localFile?.width && localFile?.height) {
      setDetectedResolution(`${Math.round(localFile.width)} × ${Math.round(localFile.height)} px`);
      return;
    }
    if (previewUri && !previewUri.endsWith('.svg') && !previewUri.includes('.svg?')) {
      const uriToInspect =
        previewUri.startsWith('http://') ||
        previewUri.startsWith('https://') ||
        previewUri.startsWith('file://') ||
        previewUri.startsWith('content://') ||
        previewUri.startsWith('data:')
          ? previewUri
          : `file://${previewUri}`;

      Image.getSize(
        uriToInspect,
        (w, h) => {
          setDetectedResolution(`${Math.round(w)} × ${Math.round(h)} px`);
        },
        () => {
          setDetectedResolution(null);
        }
      );
    } else {
      setDetectedResolution(null);
    }
  }, [localFile?.width, localFile?.height, previewUri]);

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

  const formattedCompactUri = React.useMemo(() => {
    if (!compactLogoUrl) return null;
    if (
      compactLogoUrl.startsWith('http://') ||
      compactLogoUrl.startsWith('https://') ||
      compactLogoUrl.startsWith('file://') ||
      compactLogoUrl.startsWith('data:') ||
      compactLogoUrl.startsWith('content://')
    ) {
      return compactLogoUrl;
    }
    return `file://${compactLogoUrl}`;
  }, [compactLogoUrl]);

  const isSvg = Boolean(
    formattedUri && (formattedUri.endsWith('.svg') || formattedUri.includes('.svg?'))
  );

  const isCompactSvg = Boolean(
    formattedCompactUri &&
      (formattedCompactUri.endsWith('.svg') || formattedCompactUri.includes('.svg?'))
  );

  return (
    <View style={styles.logoCard}>
      <View style={[styles.previewContainer, errorMessage ? styles.previewContainerError : null]}>
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
                {formattedCompactUri && !compactLoadError ? (
                  isCompactSvg ? (
                    <View style={styles.autoLetterBadge}>
                      <SvgUri uri={formattedCompactUri} width={34} height={34} />
                    </View>
                  ) : (
                    <Image
                      source={{ uri: formattedCompactUri }}
                      style={styles.autoLetterBadge}
                      resizeMode="contain"
                      onError={() => setCompactLoadError(true)}
                    />
                  )
                ) : (
                  <View style={[styles.autoLetterBadge, { backgroundColor: brandColor }]}>
                    <Typography variant="semiBoldTxtmd" color={colors.base.white}>
                      {firstLetter}
                    </Typography>
                  </View>
                )}
                {Boolean(trimmedName) && (
                  <Typography variant="semiBoldTxtlg" color={colors.gray[900]} style={styles.autoLogoText}>
                    {trimmedName}
                  </Typography>
                )}
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

            {!showContent && (
              <View style={styles.emptyPlaceholderIconWrap}>
                <SvgXml xml={imagePlaceholderSvg} width={type === 'favicon' ? 24 : 30} height={type === 'favicon' ? 24 : 30} />
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
            {detectedResolution && previewUri
              ? `${detectedResolution}\n${specs}`
              : recommendedResolution
              ? `${recommendedResolution}\n${specs}`
              : specs}
          </Typography>
          {Boolean(errorMessage) && (
            <Typography
              variant="regularTxtxs"
              color={colors.error[600]}
              style={styles.cardErrorMessage}
            >
              {errorMessage}
            </Typography>
          )}
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
                style={styles.actionDeleteBtn}
                onPress={onDelete}
                disabled={disabled}
                hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
                accessibilityLabel={`Delete ${title}`}
              >
                <SvgXml xml={getDeleteIcon(colors.error[600])} width={16} height={16} />
              </Pressable>
            </>
          )}
        </View>
      </View>
    </View>
  );
});

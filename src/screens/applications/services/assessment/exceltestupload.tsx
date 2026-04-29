import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native'
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import CustomSafeAreaView from '../../../../components/atoms/customsafeareaview'
import { Button, Header, Typography } from '../../../../components'
import { colors } from '../../../../theme/colors'
import { SvgXml } from 'react-native-svg'
import { uploadIcon } from '../../../../assets/svg/upload'
import { downloadIcon } from '../../../../assets/svg/download'
import Card from '../../../../components/atoms/card'
import { goBack, navigate } from '../../../../utils/navigationUtils'
import FooterButtons from '../../../../components/molecules/footerbuttons'
import { uploadIcon2 } from '../../../../assets/svg/upload2'
import {
    pick,
    keepLocalCopy,
    types,
    errorCodes,
    isErrorWithCode,
} from '@react-native-documents/picker'
import { ProgressBar } from 'react-native-paper'
import { deleteIcon } from '../../../../assets/svg/deleteicon'
import { showToastMessage } from '../../../../utils/toast'
import { useDispatch, useSelector } from 'react-redux'
import { useRoute } from '@react-navigation/native'
import { downloadTestTemplateRequestAction, testBulkUploadRequestAction } from '../../../../features/assessments/actions'

export type ExcelTestUploadProps = {
    /** When true, render only inner content (for use inside tabbed screens). */
    embedded?: boolean
    id?: string
}

type UploadStatus = 'ready' | 'uploading' | 'complete' | 'failed'

type PickedFile = {
    name: string
    uri: string
    size: number
    type?: string | null
}

type UploadRowError = { row: number; error: string }

const MAX_XLSX_BYTES = 5 * 1024 * 1024

const ExcelTestUpload = ({ embedded = false, id }: ExcelTestUploadProps) => {
    const route = useRoute<any>()
    const dispatch = useDispatch()
    const assessmentId = route?.params?.assessmentId;
    const testIdFromStore = useSelector((state: any) => state?.assessments?.testDetail?.data?.id ?? null)
    const testId = id || assessmentId || testIdFromStore
    const downloadLoading = useSelector(
        (state: any) => Boolean(state?.assessments?.downloadTestTemplateLoading)
    )
    const bulkUploadLoading = useSelector(
        (state: any) => Boolean(state?.assessments?.testBulkUploadLoading)
    )
    const bulkUploadResult = useSelector(
        (state: any) => state?.assessments?.testBulkUploadResult ?? null
    )
    const bulkUploadError = useSelector(
        (state: any) => state?.assessments?.testBulkUploadError ?? null
    )

    const summary = useMemo(() => {
        const created = Number(bulkUploadResult?.created_count ?? 0)
        const skipped = Number(bulkUploadResult?.skipped_count ?? 0)
        const errors = Number(bulkUploadResult?.error_count ?? 0)

        return {
            created: Number.isFinite(created) ? created : 0,
            skipped: Number.isFinite(skipped) ? skipped : 0,
            errors: Number.isFinite(errors) ? errors : 0,
            message: (bulkUploadResult?.message ?? '').toString(),
        }
    }, [bulkUploadResult])

    const [errorsExpanded, setErrorsExpanded] = useState(true)

    const [pickedFile, setPickedFile] = useState<PickedFile | null>(null)
    const [uploadStatus, setUploadStatus] = useState<UploadStatus>('ready')
    const [uploadProgress, setUploadProgress] = useState<number>(0)
    const [fileError, setFileError] = useState<string | null>(null)
    const uploadTimerRef = useRef<ReturnType<typeof setInterval> | null>(null)

    const clearUploadTimer = useCallback(() => {
        if (uploadTimerRef.current) {
            clearInterval(uploadTimerRef.current)
            uploadTimerRef.current = null
        }
    }, [])

    const fileSizeLabel = useMemo(() => {
        const size = pickedFile?.size ?? 0
        const mb = size / (1024 * 1024)
        if (!pickedFile) return ''
        if (mb < 1) return `${Math.round((size / 1024) * 10) / 10} KB`
        return `${Math.round(mb * 10) / 10} MB`
    }, [pickedFile])

    const statusLabel = useMemo(() => {
        if (!pickedFile) return ''
        if (uploadStatus === 'uploading') return 'Uploading...'
        if (uploadStatus === 'complete') return 'Complete'
        if (uploadStatus === 'failed') return 'Failed'
        return 'Ready'
    }, [pickedFile, uploadStatus])

    const handleFilePick = async () => {
        try {
            // `types.xlsx` resolves to UTType on iOS and spreadsheet MIME on Android.
            const [file] = await pick({
                type: [types.xlsx],
                allowMultiSelection: false,
            })

            setFileError(null)

            const baseName = (file?.name ?? '').trim() || 'upload.xlsx'
            const size = Number(file?.size ?? 0)
            const mimeType = file?.type

            if (file?.error) {
                setPickedFile(null)
                setFileError(file.error)
                showToastMessage(file.error, 'error')
                return
            }

            if (!file?.uri) {
                setPickedFile(null)
                setFileError('Unable to read selected file.')
                showToastMessage('Unable to read selected file.', 'error')
                return
            }

            const exportMime =
                file.isVirtual && file.convertibleToMimeTypes?.length
                    ? file.convertibleToMimeTypes.find((m) =>
                        String(m.mimeType).includes('spreadsheet'),
                    )?.mimeType ?? file.convertibleToMimeTypes[0]?.mimeType
                    : undefined

            const [copyResult] = await keepLocalCopy({
                files: [
                    {
                        uri: file.uri,
                        fileName: baseName,
                        ...(exportMime ? { convertVirtualFileToType: exportMime } : {}),
                    },
                ],
                destination: 'cachesDirectory',
            })

            if (copyResult.status === 'error') {
                setPickedFile(null)
                const msg = copyResult.copyError || 'Could not prepare the file for upload.'
                setFileError(msg)
                showToastMessage(msg, 'error')
                return
            }

            const uri = copyResult.localUri

            if (!baseName.toLowerCase().endsWith('.xlsx')) {
                setPickedFile(null)
                setFileError('Only .xlsx files are allowed')
                showToastMessage('Only .xlsx files are allowed', 'error')
                return
            }

            if (!Number.isFinite(size) || size <= 0) {
                setPickedFile(null)
                setFileError('Unable to read file size.')
                showToastMessage('Unable to read file size.', 'error')
                return
            }

            if (size > MAX_XLSX_BYTES) {
                setPickedFile(null)
                setFileError('File exceeds the 5 MB limit.')
                showToastMessage('File exceeds the 5 MB limit.', 'error')
                return
            }

            clearUploadTimer()
            setPickedFile({ name: baseName, uri, size, type: mimeType })
            setUploadStatus('ready')
            setUploadProgress(0)
        } catch (err) {
            if (isErrorWithCode(err) && err.code === errorCodes.OPERATION_CANCELED) {
                return
            }
            console.log('Document pick error:', err)
        }
    }

    const handleRemoveFile = useCallback(() => {
        clearUploadTimer()
        setPickedFile(null)
        setUploadStatus('ready')
        setUploadProgress(0)
        setFileError(null)
    }, [clearUploadTimer])

    const startUploadImport = useCallback(() => {
        if (!testId) {
            showToastMessage('Missing test id. Please open a test first.', 'error')
            return
        }
        if (!pickedFile || fileError) return
        dispatch(
            testBulkUploadRequestAction({
                testId,
                file: {
                    uri: pickedFile.uri,
                    name: pickedFile.name,
                    type: pickedFile.type,
                    size: pickedFile.size,
                },
            })
        )
    }, [dispatch, fileError, pickedFile, testId])

    const canUpload = Boolean(pickedFile) && !fileError && !bulkUploadLoading

    // Reflect redux upload state in the UI status badge / bar.
    useEffect(() => {
        if (bulkUploadLoading) {
            setUploadStatus('uploading')
            setUploadProgress(0.5)
            return
        }
        if (bulkUploadError) {
            setUploadStatus('failed')
            setUploadProgress(0)
            return
        }
        if (bulkUploadResult) {
            setUploadStatus('complete')
            setUploadProgress(1)
        }
    }, [bulkUploadLoading, bulkUploadError, bulkUploadResult])

    const body = (
        <>
            {!embedded && (
                <Header title="Upload files" backNavigation centerTitle onBack={goBack} />
            )}
            <ScrollView
                bounces={false}
                showsVerticalScrollIndicator={false}
                style={embedded ? styles.embeddedScroll : undefined}
            >
                <View style={{ flex: 1, padding: 16, gap: 16 }}>
                    <View style={{ gap: 6 }}>
                        <View>
                            <Typography variant="semiBoldTxtsm" color={colors.gray[700]}>Excel Bulk Upload (Up to 500 rows)</Typography>
                            <Typography variant="regularTxtxs" color={colors.gray[500]}>Import questions from a spreadsheet — row-level errors are reported and valid rows are always saved.</Typography>
                        </View>
                        <View
                            style={{
                                borderWidth: 2,
                                borderStyle: 'dashed',
                                borderColor: colors.gray[300],
                                borderRadius: 16,
                                paddingVertical: 20,
                                paddingHorizontal: 20,
                                alignItems: 'center',
                                gap: 12,
                                backgroundColor: colors.common.white,
                            }}
                        >
                            <View style={{ alignItems: 'center' }}>
                                <SvgXml xml={uploadIcon} height={60} width={60} />
                            </View>

                            <View style={{ gap: 6, alignItems: 'center' }}>
                                <Typography variant="semiBoldTxtmd" color={colors.gray[900]}>
                                    Upload xlsx file
                                </Typography>
                                <Typography variant="regularTxtxs" color={colors.gray[500]}>
                                    Supported file : xlsx only · max 5 MB
                                </Typography>
                            </View>

                            <View style={{ width: 100, marginTop: 6 }}>
                                <Button
                                    variant="outline"
                                    buttonColor={colors.base.white}
                                    borderWidth={1}
                                    borderColor={colors.gray[200]}
                                    textColor={colors.gray[700]}
                                    onPress={() => { handleFilePick() }}
                                >
                                    Select file
                                </Button>
                            </View>
                        </View>
                        {!!pickedFile && (
                            <Card style={styles.fileCard}>
                                <View style={styles.fileRowTop}>
                                    <View style={styles.fileLeft}>
                                        <View style={styles.fileIcon}>
                                            <Typography variant="semiBoldTxtxs" color={colors.brand[700]}>
                                                XLSX
                                            </Typography>
                                        </View>
                                        <View style={styles.fileMeta}>
                                            <Typography variant="semiBoldTxtsm" color={colors.gray[900]}>
                                                {pickedFile.name}
                                            </Typography>
                                            <View style={styles.fileSubRow}>
                                                <Typography variant="regularTxtxs" color={colors.gray[500]}>
                                                    {fileSizeLabel}
                                                </Typography>
                                                <Typography variant="regularTxtxs" color={colors.gray[400]}>
                                                    {'  |  '}
                                                </Typography>
                                                <Typography
                                                    variant="regularTxtxs"
                                                    color={
                                                        uploadStatus === 'failed'
                                                            ? colors.error[600]
                                                            : uploadStatus === 'complete'
                                                                ? colors.success[600]
                                                                : colors.gray[500]
                                                    }
                                                >
                                                    {statusLabel}
                                                </Typography>
                                            </View>
                                        </View>
                                    </View>

                                    <Pressable
                                        accessibilityRole="button"
                                        onPress={handleRemoveFile}
                                        hitSlop={12}
                                        style={styles.trashBtn}
                                    >
                                        <SvgXml xml={deleteIcon} width={18} height={18} color={colors.gray[400]} />
                                    </Pressable>
                                </View>
                            </Card>
                        )}
                        <View style={{ justifyContent: 'space-between', flexDirection: 'row', padding: 10 }}>
                            <Button
                                variant="outline"
                                buttonColor={colors.base.white}
                                borderWidth={1}
                                borderColor={colors.gray[200]}
                                textColor={colors.gray[700]}
                                paddingHorizontal={10}
                                size={40}
                                disabled={!canUpload}
                                onPress={startUploadImport}
                                startIcon={<SvgXml xml={uploadIcon2} height={20} width={20} color={colors.gray[400]} />}
                            >
                                Upload & Import
                            </Button>
                            <Button
                                variant="outline"
                                buttonColor={colors.base.white}
                                borderWidth={1}
                                borderColor={colors.gray[200]}
                                textColor={colors.gray[700]}
                                paddingHorizontal={10}
                                size={40}
                                onPress={() => {
                                    if (!testId) {
                                        showToastMessage('Missing test id. Please open a test first.', 'error')
                                        return
                                    }
                                    dispatch(downloadTestTemplateRequestAction({ testId }))
                                }}
                                startIcon={<SvgXml xml={downloadIcon} height={20} width={20} color={colors.gray[400]} />}
                            // disabled={downloadLoading || !testId}
                            >
                                Download template
                            </Button>
                        </View>
                    </View>

                    {!!bulkUploadResult?.warnings?.length && (
                        <Card style={styles.warningsCard}>
                            <Typography variant="semiBoldTxtsm" color={colors.warning[800]}>
                                Warnings
                            </Typography>
                            <View style={styles.warningsList}>
                                {bulkUploadResult.warnings.map((w: string, idx: number) => (
                                    <Typography
                                        key={`${idx}-${w}`}
                                        variant="regularTxtsm"
                                        color={colors.warning[800]}
                                    >
                                        {w}
                                    </Typography>
                                ))}
                            </View>
                        </Card>
                    )}

                    {!!bulkUploadError && (
                        <Card style={styles.inlineErrorCard}>
                            <View style={styles.inlineErrorHeader}>
                                <View style={styles.inlineErrorIconCircle}>
                                    <Typography variant="semiBoldTxtsm" color={colors.error[700]}>
                                        ×
                                    </Typography>
                                </View>
                                <View style={{ flex: 1 }}>
                                    <Typography
                                        variant="regularTxtsm"
                                        color={colors.error[700]}
                                        style={{ flexWrap: 'wrap' }}
                                    >
                                        {String(bulkUploadError)}
                                    </Typography>
                                </View>
                            </View>
                        </Card>
                    )}

                    {!!bulkUploadResult?.errors?.length && (
                        <Card style={styles.errorsCard}>
                            <Pressable
                                onPress={() => setErrorsExpanded((v) => !v)}
                                style={styles.errorsHeaderRow}
                                hitSlop={8}
                            >
                                <View style={styles.errorsHeaderLeft}>
                                    <View style={styles.errorsHeaderIconCircle}>
                                        <Typography variant="semiBoldTxtsm" color={colors.error[700]}>
                                            ×
                                        </Typography>
                                    </View>
                                    <Typography variant="semiBoldTxtsm" color={colors.error[700]}>
                                        {String(bulkUploadResult?.error_count ?? bulkUploadResult.errors.length)} rows with errors
                                    </Typography>
                                </View>
                                <Typography variant="semiBoldTxtmd" color={colors.error[700]}>
                                    {errorsExpanded ? '˄' : '˅'}
                                </Typography>
                            </Pressable>

                            {errorsExpanded && (
                                <View style={styles.errorsTable}>
                                    <View style={styles.errorsTableHeader}>
                                        <Typography variant="semiBoldTxtxs" color={colors.error[700]} style={styles.errorsColRow}>
                                            Row
                                        </Typography>
                                        <Typography variant="semiBoldTxtxs" color={colors.error[700]} style={styles.errorsColError}>
                                            Error
                                        </Typography>
                                    </View>

                                    {(bulkUploadResult.errors as UploadRowError[]).map((e, idx) => (
                                        <View
                                            key={`${e.row}-${idx}`}
                                            style={[
                                                styles.errorsTableRow,
                                                idx === bulkUploadResult.errors.length - 1 ? styles.errorsTableRowLast : null,
                                            ]}
                                        >
                                            <Typography variant="regularTxtsm" color={colors.error[700]} style={styles.errorsColRow}>
                                                {String(e.row)}
                                            </Typography>
                                            <Typography variant="regularTxtsm" color={colors.gray[700]} style={styles.errorsColError}>
                                                {e.error}
                                            </Typography>
                                        </View>
                                    ))}
                                </View>
                            )}
                        </Card>
                    )}
                    <Card style={{ padding: 16, gap: 16 }}>
                        <Typography variant="semiBoldTxtsm" color={colors.gray[700]}>
                            Upload Summary
                        </Typography>

                        {pickedFile ? (
                            <>
                                <View style={styles.successCard}>
                                    <View style={styles.row}>
                                        <View>
                                            <Typography variant='semiBoldDxs'>{String(summary.created)}</Typography>
                                            <Typography variant='regularTxtsm'>
                                                questions created
                                            </Typography>
                                        </View>
                                    </View>
                                </View>

                                <View style={styles.bottomRow}>
                                    <View style={styles.skipCard}>
                                        <Typography variant='semiBoldDxs'>{String(summary.skipped)}</Typography>
                                        <Typography variant='regularTxtsm'>
                                            skipped (dupe)
                                        </Typography>
                                    </View>

                                    <View style={styles.errorCard}>
                                        <Typography variant='semiBoldDxs'>{String(summary.errors)}</Typography>
                                        <Typography variant='regularTxtsm'>
                                            row errors
                                        </Typography>
                                    </View>
                                </View>

                                <Typography variant="regularTxtsm" style={styles.footerText}>
                                    {summary.message
                                        ? summary.message
                                        : `${summary.created} questions created, ${summary.skipped} duplicates skipped, ${summary.errors} rows had errors.`}
                                </Typography>
                            </>
                        ) : (
                            <Typography variant="regularTxtsm" style={styles.footerText}>
                                Upload a file to see your results here.
                            </Typography>
                        )}
                    </Card>
                    <Card style={{ padding: 16, gap: 10 }}>
                        <View>
                            {/* <SvgXml xml={}/> */}
                            <Typography variant="semiBoldTxtsm" color={colors.gray[700]}>How it works</Typography>
                        </View>
                        <View style={{ alignSelf: 'flex-start', gap: 6 }}>
                            <Typography variant="regularTxtsm" color={colors.gray[700]}>1. Download the template — it includes example rows and dropdown validations.</Typography>
                            <Typography variant="regularTxtsm" color={colors.gray[700]}>2. Fill in question text, type, difficulty, points and choices.</Typography>
                            <Typography variant="regularTxtsm" color={colors.gray[700]}>3. Upload the .xlsx file (max 5 MB · max 500 rows).</Typography>
                            <Typography variant="regularTxtsm" color={colors.gray[700]}>
                                4. Invalid rows are skipped with a detailed error report — valid ones are always saved.
                            </Typography>
                        </View>
                    </Card>
                </View>
            </ScrollView>
            {!embedded && (
                <FooterButtons
                    leftButtonProps={{
                        children: 'Back',
                        size: 44,
                        buttonColor: colors.base.white,
                        textColor: colors.gray[700],
                        borderColor: colors.gray[300],
                        borderWidth: 1,
                        borderRadius: 8,
                        borderGradientOpacity: 0.25,
                        shadowColor: colors.gray[700],
                        onPress: () => {
                            goBack()
                        },
                    }}
                    rightButtonProps={{
                        children: 'Next',
                        size: 44,
                        borderWidth: 1,
                        buttonColor: colors.brand[600],
                        textColor: colors.base.white,
                        borderColor: colors.base.white,
                        borderRadius: 8,
                        onPress: () => {
                            navigate('CreateTestQuestion')
                        },
                    }}
                />
            )}
        </>
    )

    if (embedded) {
        return <View style={styles.embeddedRoot}>{body}</View>
    }

    return <CustomSafeAreaView>{body}</CustomSafeAreaView>
}

export default ExcelTestUpload
const styles = StyleSheet.create({
    embeddedRoot: {
        flex: 1,
    },
    embeddedScroll: {
        flex: 1,
    },
    fileCard: {
        padding: 14,
        gap: 10,
    },
    fileRowTop: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 12,
    },
    fileLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        flex: 1,
    },
    fileIcon: {
        width: 42,
        height: 42,
        borderRadius: 10,
        backgroundColor: colors.brand[50],
        borderWidth: 1,
        borderColor: colors.brand[200],
        alignItems: 'center',
        justifyContent: 'center',
    },
    fileMeta: {
        flex: 1,
        gap: 2,
    },
    fileSubRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    trashBtn: {
        padding: 4,
    },
    progress: {
        height: 6,
        borderRadius: 999,
        backgroundColor: colors.gray[100],
    },
    retryWrap: {
        alignSelf: 'flex-start',
        paddingTop: 2,
    },
    warningsCard: {
        padding: 14,
        gap: 8,
        backgroundColor: colors.warning[50],
        borderWidth: 1,
        borderColor: colors.warning[200],
    },
    warningsList: {
        gap: 6,
    },
    inlineErrorCard: {
        padding: 14,
        // gap: 8,
        backgroundColor: colors.error[50],
        borderWidth: 1,
        borderColor: colors.error[200],
    },
    inlineErrorHeader: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    inlineErrorIconCircle: {
        width: 22,
        height: 22,
        borderRadius: 11,
        borderWidth: 1,
        borderColor: colors.error[300],
        backgroundColor: colors.base.white,
        alignItems: 'center',
        justifyContent: 'center',
    },
    errorsCard: {
        padding: 0,
        overflow: 'hidden',
        backgroundColor: colors.error[50],
        borderWidth: 1,
        borderColor: colors.error[200],
    },
    errorsHeaderRow: {
        paddingHorizontal: 14,
        paddingVertical: 12,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: colors.error[50],
    },
    errorsHeaderLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    errorsHeaderIconCircle: {
        width: 22,
        height: 22,
        borderRadius: 11,
        borderWidth: 1,
        borderColor: colors.error[300],
        backgroundColor: colors.base.white,
        alignItems: 'center',
        justifyContent: 'center',
    },
    errorsHeaderDot: {
        width: 18,
        height: 18,
        borderRadius: 9,
        borderWidth: 1,
        borderColor: colors.error[300],
        backgroundColor: colors.base.white,
    },
    errorsTable: {
        borderTopWidth: 1,
        borderTopColor: colors.error[200],
        backgroundColor: colors.base.white,
    },
    errorsTableHeader: {
        flexDirection: 'row',
        paddingHorizontal: 14,
        paddingVertical: 10,
        backgroundColor: colors.error[50],
        borderBottomWidth: 1,
        borderBottomColor: colors.error[200],
    },
    errorsTableRow: {
        flexDirection: 'row',
        paddingHorizontal: 14,
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: colors.gray[100],
        backgroundColor: colors.base.white,
    },
    errorsTableRowLast: {
        borderBottomWidth: 0,
    },
    errorsColRow: {
        width: 54,
    },
    errorsColError: {
        flex: 1,
        paddingRight: 8,
    },
    successCard: {
        backgroundColor: colors.success[50],
        borderRadius: 8,
        padding: 16,
        borderWidth: 1,
        borderColor: colors.success[200],
    },

    row: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },

    iconCircle: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: '#D1FADF',
        alignItems: 'center',
        justifyContent: 'center',
    },

    successValue: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#065F46',
    },

    successText: {
        color: '#047857',
    },

    bottomRow: {
        flexDirection: 'row',
        marginTop: 16,
        gap: 12,
    },

    skipCard: {
        flex: 1,
        backgroundColor: colors.warning[50],
        borderRadius: 8,
        padding: 16,
        alignItems: 'center',
        borderColor: colors.warning[200],
        borderWidth: 1
    },

    skipValue: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#D97706',
    },

    skipText: {
        color: '#F59E0B',
    },

    errorCard: {
        flex: 1,
        backgroundColor: colors.error[50],
        borderRadius: 8,
        padding: 16,
        alignItems: 'center',
        borderColor: colors.error[200],
        borderWidth: 1
    },

    errorValue: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#DC2626',
    },

    errorText: {
        color: '#EF4444',
    },

    footerText: {
        marginTop: 12,
        color: '#6B7280',
    },
});


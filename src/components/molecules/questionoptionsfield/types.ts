export type QuestionOptionItem = { id: string; text: string }

export type QuestionOptionsSelectionMode = 'single' | 'multiple'

export type QuestionOptionsFieldProps = {
    /** Single = radio (one correct); multiple = checkboxes */
    mode: QuestionOptionsSelectionMode
    options: QuestionOptionItem[]
    /** Whether each option is marked as a correct answer */
    isOptionCorrect: (id: string) => boolean
    onOptionTextChange: (id: string, text: string) => void
    onAddOption: () => void
    onRemoveOption: (id: string) => void
    onToggleCorrect: (id: string) => void
    /** Minimum rows before remove is allowed (default 2) */
    minOptions?: number
    /** Section label (default "Options") */
    label?: string
    /** Label text color (default gray[700]) */
    labelColor?: string
    /** Shows required asterisk after label */
    required?: boolean
    disabled?: boolean
    /** Show "Add option" row (default true) */
    showAddOption?: boolean
    /** Allow editing option text (default true) */
    optionInputsEditable?: boolean
    /**
     * Yes/No: whole row is tappable; selected row uses brand[50] bg and brand[200] border.
     * Standard: inputs + radio (single) or checkboxes (multiple).
     */
    optionsPresentation?: 'standard' | 'yesNo'
}

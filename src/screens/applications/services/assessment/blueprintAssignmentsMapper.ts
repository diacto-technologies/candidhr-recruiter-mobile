import type { CandidateAssignmentRow } from '../../../../components/organisms/candidateassignmentstable /candidateassignmentstable';
import type {
    BlueprintAssignment,
    BlueprintAssignmentProctoringSession,
} from '../../../../features/assessments/types';

const formatDateShort = (value?: string): string => {
    if (!value) return '';
    const d = new Date(value);
    if (Number.isNaN(d.getTime())) return value;
    return d.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
};

const formatDateTimeShort = (value?: string): string => {
    if (!value) return '';
    const d = new Date(value);
    if (Number.isNaN(d.getTime())) return value;
    return d.toLocaleString(undefined, {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });
};

const initialsFromName = (name: string): string => {
    const parts = name.trim().split(/\s+/).filter(Boolean);
    if (parts.length === 0) return '?';
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
};

function proctoringFlagCount(session: BlueprintAssignmentProctoringSession | null | undefined): number {
    if (!session) return 0;
    return (
        (session.tab_switch_count ?? 0) +
        (session.tab_close_count ?? 0) +
        (session.fullscreen_exit_count ?? 0) +
        (session.mouse_leave_count ?? 0) +
        (session.page_reload_count ?? 0) +
        (session.multiple_screen_count ?? 0) +
        (session.video_off_count ?? 0) +
        (session.audio_off_count ?? 0) +
        (session.multiple_faces_count ?? 0) +
        (session.no_face_count ?? 0) +
        (session.mobile_detected_count ?? 0) +
        (session.voice_detected_count ?? 0) +
        (session.eye_gaze_violation_count ?? 0) +
        (session.device_violation_count ?? 0) +
        (session.ip_violation_count ?? 0) +
        (session.right_click_count ?? 0) +
        (session.copy_paste_count ?? 0) +
        (session.print_count ?? 0) +
        (session.room_scan_failure_count ?? 0) +
        (session.id_verification_failure_count ?? 0)
    );
}

function assignmentStatusTone(
    status?: string
): CandidateAssignmentRow['status']['tone'] {
    const s = (status || '').toLowerCase();
    if (['failed', 'disqualified', 'rejected'].includes(s)) return 'error';
    if (['passed', 'completed'].includes(s)) return 'success';
    if (['in_progress', 'started', 'assigned', 'pending', 'invited'].includes(s)) return 'info';
    return 'warning';
}

function formatPassingPercent(a: BlueprintAssignment): string {
    const override = a.passing_score_override;
    if (override != null && Number.isFinite(Number(override))) {
        return `${Math.round(Number(override))}%`;
    }
    const th = a.blueprint_score?.passing_threshold;
    if (th != null && Number.isFinite(Number(th))) {
        return `${Math.round(Number(th))}%`;
    }
    return '—';
}

function formatScorePercent(a: BlueprintAssignment): string {
    if (typeof a.candidate_percentage === 'number' && Number.isFinite(a.candidate_percentage)) {
        return `${Math.round(a.candidate_percentage)}%`;
    }
    const p = a.blueprint_score?.percentage;
    if (typeof p === 'number' && Number.isFinite(p)) {
        return `${Math.round(p)}%`;
    }
    if (a.blueprint_score?.status === 'not_completed') return '—';
    return '—';
}

export function mapBlueprintAssignmentToTableRow(a: BlueprintAssignment): CandidateAssignmentRow {
    const name =
        a.candidate_name?.trim() ||
        a.application?.candidate?.name?.trim() ||
        a.application?.name?.trim() ||
        '';
    const email =
        a.candidate_email?.trim() || a.application?.candidate?.email?.trim() || '—';

    const session = a.proctoring_session;
    let proctoring: CandidateAssignmentRow['proctoring'];
    if (session?.is_terminated) {
        proctoring = { label: 'Terminated', tone: 'error', icon: 'shield' };
    } else {
        const n = proctoringFlagCount(session);
        if (n > 0) {
            proctoring = {
                label: `${n} flag${n === 1 ? '' : 's'}`,
                tone: 'info',
                icon: 'time',
            };
        } else {
            proctoring = { label: 'Clean', tone: 'success', icon: 'check' };
        }
    }

    const logsLen = Array.isArray(a.reminder_logs) ? a.reminder_logs.length : 0;
    let reminders = '—';
    if (logsLen > 0) {
        reminders = `${logsLen} sent`;
    } else if (a.reminders_enabled) {
        reminders = 'Enabled';
    }

    const statusKey = a.status || '';
    const label = a.status_display?.trim() || statusKey || '—';

    const validFrom = formatDateShort(a.valid_from);
    const validTo = formatDateShort(a.valid_to);
    const validity =
        validFrom && validTo ? `From ${validFrom} To ${validTo}` : validFrom || validTo || '—';

    const durMin = a.time_duration_in_minutes;
    const duration =
        typeof durMin === 'number' && Number.isFinite(durMin) ? `${Math.round(durMin)} min` : '—';

    const assignedAt = formatDateTimeShort(a.created_at);
    const byName = a.created_by?.name?.trim() || '—';
    const assigned = assignedAt ? `${assignedAt} by ${byName}` : `— by ${byName}`;

    const candidateId =
        a.application?.candidate?.id?.trim() || a.application?.id?.trim() || a.id;
    const profilePic = a.application?.candidate?.profile_pic ?? '';

    return {
        id: a.id,
        candidate: {
            id: candidateId,
            name,
            email,
            profile_pic: profilePic,
            initials: initialsFromName(name),
        },
        status: { label, tone: assignmentStatusTone(statusKey) },
        validity,
        duration,
        passingScore: formatPassingPercent(a),
        score: formatScorePercent(a),
        assigned,
        proctoring,
        reminders,
    };
}

export function mapBlueprintAssignmentsToTableRows(
    results: BlueprintAssignment[] | undefined | null
): CandidateAssignmentRow[] {
    if (!Array.isArray(results)) return [];
    return results.map(mapBlueprintAssignmentToTableRow);
}

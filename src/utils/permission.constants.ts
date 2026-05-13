export const PERMISSIONS = {
    SHARE_JOB: 'share_job',
    VIEW_JOB: 'view_job',
    ADD_JOB: 'add_job',
    UPDATE_JOB: 'update_job',
    DELETE_JOB: 'delete_job',
    GENERATE_JOB_DESCRIPTION_USING_AI: 'generate_job_description_using_ai',
    SCREENING_QUESTIONS: 'screening_questions',
    CRITERIA: 'criteria',
    PUBLISH_JOB: 'publish_job',
  
    ADD_USER: 'add_user',
    UPDATE_USER: 'update_user',
    DELETE_USER: 'delete_user',
    VIEW_USER: 'view_user',
  
    ADD_ROLE: 'add_role',
    UPDATE_ROLE: 'update_role',
    VIEW_ROLE: 'view_role',
    DELETE_ROLE: 'delete_role',
    ASSIGN_ROLE: 'assign_role',
  
    UPDATE_ORGANIZATION_DETAILS: 'update_organization_details',
  
    VIEW_APPLICATION: 'view_application_list',
    UPDATE_APPLICATION_STATUS: 'update_application_status',
    SHARE_APPLICATION: 'share_application',
    NOTIFY_APPLICANT: 'notify_applicant',
  
    VIEW_RESUME_SCREENING_STAGE: 'view_resume_screening_stage',
    VIEW_ASSESSMENT_STAGE: 'view_assessment_stage',
    VIEW_AUTOMATED_VIDEO_INTERVIEW_STAGE:
      'view_automated_video_interview_stage',
  
    BULK_UPLOAD_APPLICATIONS: 'bulk_upload_applications',
    VIEW_BULK_UPLOAD_LOGS: 'view_bulk_upload_logs',
  
    EXPORT_APPLICATIONS: 'export_applications',
    EXPORT_APPLICATION_PROFILE: 'export_application_profile',
  
    VIEW_RESUME_FILE: 'view_resume_file',
    UPDATE_RESUME_SCREENING_STATUS: 'update_resume_screening_status',
  
    CREATE_ASSESSMENT: 'create_assessment',
    UPDATE_ASSESSMENT: 'update_assessment',
    DELETE_ASSESSMENT: 'delete_assessment',
    VIEW_ASSESSMENT: 'view_assessment',
    ASSIGN_ASSESSMENT: 'assign_assessment',
    SHARE_ASSESSMENT: 'share_assessment',
    PUBLISH_ASSESSMENT: 'publish_assessment',
  
    GENERATE_QUESTION_USING_AI: 'generate_question_using_ai',
    UPLOAD_QUESTION_USING_EXCEL: 'upload_question_using_excel',
    BULK_UPLOAD_QUESTIONS: 'bulk_upload_questions',
  
    CREATE_QUESTION: 'create_question',
    UPDATE_QUESTION: 'update_question',
    VIEW_QUESTION: 'view_question',
    DELETE_QUESTION: 'delete_question',
  
    VIEW_ASSESSMENT_REPORT: 'view_assessment_report',
    UPDATE_ASSESSMENT_REPORT_STATUS: 'update_assessment_report_status',
  
    VIEW_ASSIGNED_ASSESSMENTS: 'view_assigned_assessments',
    VIEW_PREBUILT_ASSESSMENTS: 'view_prebuilt_assessments',
  
    ASSIGN_AUTOMATED_VIDEO_INTERVIEW:
      'assign_automated_video_interview',
    UPDATE_AUTOMATED_VIDEO_INTERVIEW_STATUS:
      'update_automated_video_interview_status',
    VIEW_AUTOMATED_VIDEO_INTERVIEW:
      'view_automated_video_interview',
    VIEW_VIDEO_INTERVIEW_ANALYSIS:
      'view_video_interview_analysis',
  
    VIEW_DASHBOARD: 'view_dashboard',
  
    ADD_COMMENT: 'add_comment',
    VIEW_COMMENTS: 'view_comments',
  
    CREATE_REASON: 'create_reason',
    VIEW_REASONS: 'view_reasons',
  
    CODING_ASSESSMENT: 'coding_assessment',
  
    VIEW_APPLICATION_PROFILE: 'view_application_profile',
  } as const;
  
  export type PermissionCodename =
  typeof PERMISSIONS[keyof typeof PERMISSIONS];
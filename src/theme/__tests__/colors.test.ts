import { colors, setBrandColor } from '../colors';

describe('Theme setBrandColor', () => {
  it('correctly updates brand scale and mainColors with a primary color', () => {
    const tealColor = '#0F766E';
    setBrandColor(tealColor);

    expect(colors.brand[600]).toBe('#0F766E');
    expect(colors.mainColors.main).toBe('#0F766E');
    expect(colors.mainColors.slateBlue).toBe('#0F766E');

    // Tints should be lighter hexes
    expect(colors.brand[50]).toMatch(/^#[0-9A-F]{6}$/);
    expect(colors.brand[100]).toMatch(/^#[0-9A-F]{6}$/);

    // Shades should be darker hexes
    expect(colors.brand[700]).toMatch(/^#[0-9A-F]{6}$/);
    expect(colors.brand[800]).toMatch(/^#[0-9A-F]{6}$/);

    // Gradients should reflect the brand colors
    expect(colors.gradients.brand.g600_500[0]).toBe('#0F766E');
    expect(colors.gradients.brand.g600_500[1]).toBe(colors.brand[500]);
  });

  it('handles 3-character hex input', () => {
    setBrandColor('#F00');
    expect(colors.brand[600]).toBe('#FF0000');
    expect(colors.mainColors.main).toBe('#FF0000');
  });

  it('ignores invalid hex codes', () => {
    const previous = colors.brand[600];
    setBrandColor('not-a-color');
    expect(colors.brand[600]).toBe(previous);
  });

  it('generates matching report palette for custom brand color', () => {
    const { getReportPalette } = require('../../components/organisms/ApplicationDetails/buildApplicationPdfHtml');
    const palette = getReportPalette('#0F766E');
    expect(palette.indigo600.toUpperCase()).toBe('#0F766E');
    expect(palette.indigo700).toMatch(/^#[0-9a-fA-F]{6}$/);
    expect(palette.indigo50).toMatch(/^#[0-9a-fA-F]{6}$/);
  });

  it('builds application PDF HTML with custom brand color without reference errors', () => {
    const { buildApplicationPdfHtml } = require('../../components/organisms/ApplicationDetails/buildApplicationPdfHtml');
    const html = buildApplicationPdfHtml({
      application: {
        id: 'app-1',
        applicant: {
          name: 'Jane Doe',
          email: 'jane@example.com',
          contact: '+1234567890',
          location: 'San Francisco, CA',
        },
        job: { title: 'Software Engineer' },
        scorecard_v3: {
          components: [
            {
              key: 'skills',
              tiered_items: [
                { name: 'TypeScript', tier: 'high', reason: 'Strong match' },
                { name: 'React Native', tier: 'medium' },
              ],
            },
            {
              key: 'experience',
              tiered_items: [
                {
                  title: 'Senior Developer',
                  company: 'Acme Careers',
                  responsibilities: ['Built mobile apps', 'Maintained codebase'],
                  tier: 'high',
                },
              ],
            },
          ],
        },
      },
      applicant: {
        name: 'Jane Doe',
        appliedAt: 'Oct 12, 2026',
        email: 'jane@example.com',
        contact: '+1234567890',
        location: 'San Francisco, CA',
      },
      job: {
        title: 'Software Engineer',
      },
      stages: [
        {
          id: 'stage-1',
          name: 'Screening',
          statusText: 'Approved',
          rawStatus: 'approved',
          date: 'Oct 12, 2026',
        },
      ],
      aiSummary: {
        summary: 'Strong candidate with React Native experience.',
        potentialRedFlags: [],
        recruiterRecommendation: 'Proceed to interview',
        matchedSkills: ['TypeScript', 'React Native'],
        missingSkills: [],
        jobReadinessScore: 88,
        matchScore: 92,
        keyInsights: ['Solid background in cross-platform development'],
      },
      brandColor: '#0F766E',
      productName: 'TalentHub',
    });

    expect(typeof html).toBe('string');
    expect(html).toContain('Jane Doe');
    expect(html).toContain('TalentHub');
    expect(html).toContain('#0F766E');
    expect(html).toContain('Matched');
    expect(html).toContain('Highly Relevant');
  });

  it('builds preview HTML via generatePreviewHtmlString with custom brand color without error', () => {
    const { generatePreviewHtmlString } = require('../../screens/applications/applicantdetails/utils/htmlBuilderUtils');
    const html = generatePreviewHtmlString({
      application: {
        id: 'app-2',
        applicant: {
          name: 'John Smith',
          email: 'john@example.com',
          contact: '+1987654321',
          location: 'New York, NY',
        },
        applied_at: '2026-10-01T00:00:00Z',
        job: { title: 'Product Designer' },
        resume: {
          ai_summary_json: JSON.stringify({
            summary: 'Experienced UI/UX designer',
            recruiter_recommendation: 'Recommend for interview',
            job_readiness_score: 85,
            match_score: 90,
          }),
        },
      },
      stages: [],
      resumeScreeningReport: null,
      brandColor: '#2563eb',
      productName: 'MyBrand',
    });

    expect(typeof html).toBe('string');
    expect(html).toContain('John Smith');
    expect(html).toContain('MyBrand');
    expect(html).toContain('#2563eb');
  });

  it('shows CandidHR when showPoweredBy is true, and hides CandidHR when showPoweredBy is false', () => {
    const { buildApplicationPdfHtml } = require('../../components/organisms/ApplicationDetails/buildApplicationPdfHtml');
    const baseParams = {
      application: { id: 'app-3', applicant: { name: 'Harish Malviya' }, job: { title: 'Developer' } },
      applicant: {
        name: 'Harish Malviya',
        appliedAt: 'Oct 12, 2026',
        email: 'harish@example.com',
        contact: '+123456789',
        location: 'Mumbai, India',
      },
      job: { title: 'Developer' },
      stages: [],
      aiSummary: {
        summary: 'Good candidate',
        potentialRedFlags: [],
        recruiterRecommendation: 'Hire',
        matchedSkills: [],
        missingSkills: [],
        jobReadinessScore: 80,
        matchScore: 80,
      },
    };

    const htmlWithPoweredBy = buildApplicationPdfHtml({
      ...baseParams,
      showPoweredBy: true,
    });
    expect(htmlWithPoweredBy).toContain('CandidHR');

    const htmlWithoutPoweredBy = buildApplicationPdfHtml({
      ...baseParams,
      showPoweredBy: false,
    });
    expect(htmlWithoutPoweredBy).not.toContain('CandidHR');
  });
});




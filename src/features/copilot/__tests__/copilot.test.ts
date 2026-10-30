import { createSseParser } from '../sseParser';
import copilotReducer, {
  chatStreamRequest,
  chatStreamEventReceived,
  chatStreamSuccess,
  chatStreamFailure,
  chatStreamReset,
  copilotInitialState,
  initialStreamState,
} from '../slice';
import {
  selectCopilotChatStreamState,
  selectCopilotIsStreaming,
  selectCopilotStreamCurrentStep,
  selectCopilotStreamStatusMessage,
  selectCopilotStreamStatusSteps,
  selectCopilotStreamResult,
  selectCopilotStreamCandidates,
  selectCopilotStreamSessionId,
  selectCopilotStreamSessionTitle,
  selectCopilotStreamIsComplete,
  selectCopilotStreamError,
} from '../selectors';
import {
  chatStreamRequestAction,
  chatStreamCancelAction,
  chatStreamResetAction,
} from '../actions';
import { COPILOT_ACTION_TYPES } from '../constants';
import {
  CopilotStreamEvent,
  CopilotResultEvent,
  CopilotSessionEvent,
  CopilotStatusEvent,
} from '../types';
import { RootState } from '../../../store';

describe('Copilot SSE Parser', () => {
  it('parses single SSE data events correctly', () => {
    const events: CopilotStreamEvent[] = [];
    const parser = createSseParser((e) => events.push(e));

    parser.feed('data: {"type": "session", "session_id": "sess-123", "title": "Test Title"}\n\n');
    parser.flush();

    expect(events).toHaveLength(1);
    expect(events[0]).toEqual({
      type: 'session',
      session_id: 'sess-123',
      title: 'Test Title',
    });
  });

  it('handles chunks split across arbitrary boundaries', () => {
    const events: CopilotStreamEvent[] = [];
    const parser = createSseParser((e) => events.push(e));

    // Chunk 1: partial line
    parser.feed('data: {"type": "status", "st');
    expect(events).toHaveLength(0);

    // Chunk 2: completion of line
    parser.feed('ep": "routing", "message": "Understanding your query..."}\n');
    expect(events).toHaveLength(1);
    expect(events[0]).toEqual({
      type: 'status',
      step: 'routing',
      message: 'Understanding your query...',
    });
  });

  it('parses multiple events in a single chunk', () => {
    const events: CopilotStreamEvent[] = [];
    const parser = createSseParser((e) => events.push(e));

    const chunk = [
      'data: {"type": "status", "step": "step1", "message": "Message 1"}',
      '',
      'data: {"type": "status", "step": "step2", "message": "Message 2"}',
      '',
      'data: {"type": "done"}',
      '',
    ].join('\n');

    parser.feed(chunk);
    parser.flush();

    expect(events).toHaveLength(3);
    expect(events[0].type).toBe('status');
    expect(events[1].type).toBe('status');
    expect(events[2].type).toBe('done');
  });

  it('handles [DONE] marker as a done event', () => {
    const events: CopilotStreamEvent[] = [];
    const parser = createSseParser((e) => events.push(e));

    parser.feed('data: [DONE]\n');
    parser.flush();

    expect(events).toEqual([{ type: 'done' }]);
  });

  it('ignores comments and empty lines safely', () => {
    const events: CopilotStreamEvent[] = [];
    const parser = createSseParser((e) => events.push(e));

    parser.feed(': keep-alive ping\n\n\ndata: {"type": "done"}\n');
    parser.flush();

    expect(events).toHaveLength(1);
    expect(events[0]).toEqual({ type: 'done' });
  });

  it('ignores invalid JSON without throwing', () => {
    const events: CopilotStreamEvent[] = [];
    const parser = createSseParser((e) => events.push(e));

    expect(() => {
      parser.feed('data: {invalid json}\n\ndata: {"type": "done"}\n');
      parser.flush();
    }).not.toThrow();

    expect(events).toHaveLength(1);
    expect(events[0]).toEqual({ type: 'done' });
  });
});

describe('Copilot Slice - Chat Streaming Reducers', () => {
  it('initializes stream with default values', () => {
    expect(copilotInitialState.stream).toEqual(initialStreamState);
  });

  it('sets streaming state on chatStreamRequest', () => {
    const nextState = copilotReducer(
      copilotInitialState,
      chatStreamRequest({ query: 'Who applied for Software engineer?' })
    );

    expect(nextState.stream.isStreaming).toBe(true);
    expect(nextState.stream.query).toBe('Who applied for Software engineer?');
    expect(nextState.stream.statusMessage).toBe('Connecting to Copilot...');
    expect(nextState.stream.isComplete).toBe(false);
  });

  it('processes session event correctly', () => {
    const sessionEvt: CopilotSessionEvent = {
      type: 'session',
      session_id: '3LJakxC1GhkxidpAEPyRX4DYbWf',
      title: 'Software engineer query',
    };

    const nextState = copilotReducer(
      copilotInitialState,
      chatStreamEventReceived(sessionEvt)
    );

    expect(nextState.stream.sessionId).toBe('3LJakxC1GhkxidpAEPyRX4DYbWf');
    expect(nextState.stream.sessionTitle).toBe('Software engineer query');
  });

  it('processes status events and appends to statusSteps', () => {
    const statusEvt1: CopilotStatusEvent = {
      type: 'status',
      step: 'routing',
      message: 'Understanding your query...',
    };
    const statusEvt2: CopilotStatusEvent = {
      type: 'status',
      step: 'searching',
      message: 'Searching candidates...',
    };

    let state = copilotReducer(copilotInitialState, chatStreamEventReceived(statusEvt1));
    state = copilotReducer(state, chatStreamEventReceived(statusEvt2));

    expect(state.stream.currentStep).toBe('searching');
    expect(state.stream.statusMessage).toBe('Searching candidates...');
    expect(state.stream.statusSteps).toHaveLength(2);
    expect(state.stream.statusSteps[0].step).toBe('routing');
    expect(state.stream.statusSteps[1].step).toBe('searching');
  });

  it('processes result event with candidate data', () => {
    const resultEvt: CopilotResultEvent = {
      type: 'result',
      session_id: '3LJakxC1GhkxidpAEPyRX4DYbWf',
      intent: 'search_candidates',
      result_type: 'candidate',
      filters: { job_title: 'Copy Software engineer' },
      results: [
        {
          candidate_id: 'cand-1',
          application_id: 'app-1',
          name: 'jemav',
          match_score: 0.5848,
          skills: ['python', 'aws'],
        },
      ],
      result_total: 1,
      result_shown: 1,
      result_offset: 0,
      suggested_actions: ['open_profile', 'shortlist'],
      message: 'Showing 1 candidate',
    };

    const nextState = copilotReducer(
      copilotInitialState,
      chatStreamEventReceived(resultEvt)
    );

    expect(nextState.stream.candidates).toHaveLength(1);
    expect(nextState.stream.candidates[0].name).toBe('jemav');
    expect(nextState.stream.result?.result_total).toBe(1);
    expect(nextState.stream.statusMessage).toBe('Showing 1 candidate');
  });

  it('marks streaming as complete on done event', () => {
    const streamingState = {
      ...copilotInitialState,
      stream: {
        ...initialStreamState,
        isStreaming: true,
      },
    };

    const nextState = copilotReducer(
      streamingState,
      chatStreamEventReceived({ type: 'done' })
    );

    expect(nextState.stream.isStreaming).toBe(false);
    expect(nextState.stream.isComplete).toBe(true);
  });

  it('records error message on error event', () => {
    const streamingState = {
      ...copilotInitialState,
      stream: {
        ...initialStreamState,
        isStreaming: true,
      },
    };

    const nextState = copilotReducer(
      streamingState,
      chatStreamEventReceived({ type: 'error', message: 'Rate limit exceeded' })
    );

    expect(nextState.stream.isStreaming).toBe(false);
    expect(nextState.stream.error).toBe('Rate limit exceeded');
  });

  it('handles chatStreamFailure and chatStreamReset', () => {
    let state = copilotReducer(
      copilotInitialState,
      chatStreamFailure('Server disconnected')
    );
    expect(state.stream.isStreaming).toBe(false);
    expect(state.stream.error).toBe('Server disconnected');

    state = copilotReducer(state, chatStreamReset());
    expect(state.stream).toEqual(initialStreamState);
  });
});

describe('Copilot Selectors', () => {
  const mockRootState = {
    copilot: {
      ...copilotInitialState,
      stream: {
        query: 'Test query',
        sessionId: 'sess-999',
        sessionTitle: 'Test Session',
        isStreaming: true,
        isComplete: false,
        currentStep: 'searching',
        statusMessage: 'Searching now...',
        statusSteps: [
          { step: 'routing', message: 'Routing...', timestamp: 1000 },
        ],
        result: {
          session_id: 'sess-999',
          intent: 'search',
          result_type: 'candidate',
          results: [],
          result_total: 5,
          result_shown: 0,
          result_offset: 0,
        },
        candidates: [
          {
            candidate_id: 'c1',
            application_id: 'a1',
            name: 'Candidate One',
            match_score: 0.9,
          },
        ],
        error: null,
      },
    },
  } as unknown as RootState;

  it('selects streaming state fields accurately', () => {
    expect(selectCopilotIsStreaming(mockRootState)).toBe(true);
    expect(selectCopilotStreamIsComplete(mockRootState)).toBe(false);
    expect(selectCopilotStreamCurrentStep(mockRootState)).toBe('searching');
    expect(selectCopilotStreamStatusMessage(mockRootState)).toBe('Searching now...');
    expect(selectCopilotStreamStatusSteps(mockRootState)).toHaveLength(1);
    expect(selectCopilotStreamSessionId(mockRootState)).toBe('sess-999');
    expect(selectCopilotStreamSessionTitle(mockRootState)).toBe('Test Session');
    expect(selectCopilotStreamCandidates(mockRootState)).toHaveLength(1);
    expect(selectCopilotStreamCandidates(mockRootState)[0].name).toBe('Candidate One');
    expect(selectCopilotStreamResult(mockRootState)?.result_total).toBe(5);
    expect(selectCopilotStreamError(mockRootState)).toBeNull();
  });
});

describe('Copilot Action Creators', () => {
  it('creates CHAT_STREAM_REQUEST action correctly', () => {
    const action = chatStreamRequestAction({
      query: 'Who applied for Software engineer?',
    });
    expect(action).toEqual({
      type: COPILOT_ACTION_TYPES.CHAT_STREAM_REQUEST,
      payload: { query: 'Who applied for Software engineer?' },
    });
  });

  it('creates cancel and reset actions correctly', () => {
    expect(chatStreamCancelAction()).toEqual({
      type: COPILOT_ACTION_TYPES.CHAT_STREAM_CANCEL,
    });
    expect(chatStreamResetAction()).toEqual({
      type: COPILOT_ACTION_TYPES.CHAT_STREAM_RESET,
    });
  });
});

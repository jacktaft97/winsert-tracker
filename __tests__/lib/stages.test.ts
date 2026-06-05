import { initStages, getActiveStage } from '@/lib/stages';

describe('initStages', () => {
  it('returns 8 stages all with pending status', () => {
    const stages = initStages();
    expect(stages).toHaveLength(8);
    expect(stages.every((s) => s.status === 'pending')).toBe(true);
  });

  it('assigns sequential IDs starting at 1', () => {
    const stages = initStages();
    expect(stages.map((s) => s.id)).toEqual([1, 2, 3, 4, 5, 6, 7, 8]);
  });

  it('first stage is Measure and last is Sign-Off', () => {
    const stages = initStages();
    expect(stages[0].name).toBe('Measure');
    expect(stages[7].name).toBe('Sign-Off');
  });
});

describe('getActiveStage', () => {
  it('returns the highest-id stage that is active or complete with a note', () => {
    const stages = initStages();
    stages[0].status = 'complete';
    stages[0].note = 'Measured June 5';
    stages[1].status = 'active';
    stages[1].note = 'Order placed June 5';
    expect(getActiveStage(stages)?.id).toBe(2);
    expect(getActiveStage(stages)?.name).toBe('Order Placed');
  });

  it('returns null if no stages have notes', () => {
    const stages = initStages();
    expect(getActiveStage(stages)).toBeNull();
  });

  it('skips stages without notes', () => {
    const stages = initStages();
    stages[0].status = 'complete';
    stages[0].note = 'Measured June 5';
    stages[1].status = 'active';
    // stage 2 has no note
    expect(getActiveStage(stages)?.id).toBe(1);
  });
});

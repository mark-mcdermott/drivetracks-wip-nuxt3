import { vi } from 'vitest';

// mocks 
global.definePageMeta = vi.fn(() => { });
global.ref = vi.fn((initialValue) => { return { value: initialValue } })
global.useAuth = vi.fn(() => { return { status: 'unauthenticated' } })
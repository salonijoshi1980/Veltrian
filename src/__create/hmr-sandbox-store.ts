import { create } from 'zustand';

export type SandboxStatus =
	| 'idle'
	| 'codegen-started'
	| 'codegen-generating'
	| 'codegen-complete'
	| 'codegen-error'
	| 'codegen-stopped'
	| 'refresh-requested'
	| 'refresh-complete';

interface SandboxState {
	status: SandboxStatus;
	isGenerating: boolean;
	hasError: boolean;

	setStatus: (status: SandboxStatus) => void;

	startCodeGen: () => void;
	setCodeGenGenerating: () => void;
	completeCodeGen: () => void;
	errorCodeGen: () => void;
	stopCodeGen: () => void;
	resetToIdle: () => void;
}

export const useSandboxStore = create<SandboxState>((set, get) => ({
	status: 'idle',
	isGenerating: false,
	hasError: false,

	setStatus: (status) =>
		set({
			status,
			isGenerating:
				status === 'codegen-started' || status === 'codegen-generating',
			hasError: status === 'codegen-error',
		}),

	startCodeGen: () => get().setStatus('codegen-started'),
	setCodeGenGenerating: () => get().setStatus('codegen-generating'),
	completeCodeGen: () => get().setStatus('codegen-complete'),
	errorCodeGen: () => get().setStatus('codegen-error'),
	stopCodeGen: () => get().setStatus('codegen-stopped'),
	resetToIdle: () => get().setStatus('idle'),
}));

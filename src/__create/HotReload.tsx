import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { useSandboxStore } from './hmr-sandbox-store';

export function HotReloadIndicator() {
	const { status: sandboxStatus } = useSandboxStore();

	useEffect(() => {
		if (!import.meta.hot) return;

		const toastStyle = {
			padding: '16px',
			background: '#18191B',
			border: '1px solid #2C2D2F',
			color: 'white',
			borderRadius: '8px',
			boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
			width: 'var(--width)',
			fontSize: '13px',
			display: 'flex',
			alignItems: 'center',
			gap: '6px',
		};

		let reloadTimeout: ReturnType<typeof setTimeout> | null = null;

		const onBeforeUpdate = () => {
			if (reloadTimeout) {
				clearTimeout(reloadTimeout);
				reloadTimeout = null;
			}

			toast.custom(
				() => (
					<div style={{ ...toastStyle, padding: '10px' }}>
						<img
							src="https://www.create.xyz/images/project-revision-button-building-loading-state-white.gif"
							alt="loading"
							className="w-8 h-8"
						/>
						<span>Updating</span>
					</div>
				),
				{
					id: 'vite-hmr',
					duration: 30000,
				}
			);
			window.parent.postMessage({ type: 'sandbox:web:reload:started' }, '*');
		};

		const onAfterUpdate = () => {
			reloadTimeout = setTimeout(() => {
				toast.custom(
					() => (
						<div style={toastStyle}>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								viewBox="0 0 20 20"
								fill="currentColor"
								height="20"
								width="20"
							>
								<title>Success</title>
								<path
									fillRule="evenodd"
									d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
									clipRule="evenodd"
								/>
							</svg>
							<span>Updated Successfully!</span>
						</div>
					),
					{
						id: 'vite-hmr',
						duration: 3000,
					}
				);
				window.parent.postMessage({ type: 'sandbox:web:reload:finished' }, '*');
			}, 3000);
		};

		const onError = () => {
			if (reloadTimeout) {
				clearTimeout(reloadTimeout);
				reloadTimeout = null;
			}

			toast.custom(
				() => (
					<div style={toastStyle}>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							viewBox="0 0 24 24"
							fill="currentColor"
							height="20"
							width="20"
						>
							<title>Error</title>
							<path
								fillRule="evenodd"
								d="M9.401 3.003c1.155-2 4.043-2 5.197 0l7.355 12.748c1.154 2-.29 4.5-2.599 4.5H4.645c-2.309 0-3.752-2.5-2.598-4.5L9.4 3.003zM12 8.25a.75.75 0 01.75.75v3.75a.75.75 0 01-1.5 0V9a.75.75 0 01.75-.75zm0 8.25a.75.75 0 100-1.5.75.75 0 000 1.5z"
								clipRule="evenodd"
							/>
						</svg>
						<span>Update failed</span>
					</div>
				),
				{
					id: 'vite-hmr',
					duration: 5000,
				}
			);
			window.parent.postMessage({ type: 'sandbox:web:reload:error' }, '*');
		};

		import.meta.hot.on('vite:beforeUpdate', onBeforeUpdate);
		import.meta.hot.on('vite:afterUpdate', onAfterUpdate);
		import.meta.hot.on('vite:error', onError);

		return () => {
			import.meta.hot?.off('vite:beforeUpdate', onBeforeUpdate);
			import.meta.hot?.off('vite:afterUpdate', onAfterUpdate);
			import.meta.hot?.off('vite:error', onError);
			if (reloadTimeout) {
				clearTimeout(reloadTimeout);
			}
		};
	}, []);

	useEffect(() => {
		const toastStyle = {
			padding: '16px',
			background: '#18191B',
			border: '1px solid #2C2D2F',
			color: 'white',
			borderRadius: '8px',
			boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
			width: 'var(--width)',
			fontSize: '13px',
			display: 'flex',
			alignItems: 'center',
			gap: '6px',
		};

		const successTimeout: ReturnType<typeof setTimeout> | null = null;

		switch (sandboxStatus) {
			case 'codegen-started':
			case 'codegen-generating':
				toast.custom(
					() => (
						<div style={{ ...toastStyle, padding: '10px' }}>
							<img
								src="https://www.create.xyz/images/project-revision-button-building-loading-state-white.gif"
								alt="loading"
								className="w-8 h-8"
							/>
							<span>Updating</span>
						</div>
					),
					{
						id: 'sandbox-codegen',
						duration: 3000,
					}
				);
				break;

			case 'codegen-complete':
				toast.custom(
					() => (
						<div style={toastStyle}>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								viewBox="0 0 20 20"
								fill="currentColor"
								height="20"
								width="20"
							>
								<title>Success</title>
								<path
									fillRule="evenodd"
									d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
									clipRule="evenodd"
								/>
							</svg>
							<span>Updated successfully</span>
						</div>
					),
					{
						id: 'sandbox-codegen',
						duration: 3000,
					}
				);
				break;

			case 'codegen-error':
				toast.custom(
					() => (
						<div style={toastStyle}>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								viewBox="0 0 24 24"
								fill="currentColor"
								height="20"
								width="20"
							>
								<title>Error</title>
								<path
									fillRule="evenodd"
									d="M9.401 3.003c1.155-2 4.043-2 5.197 0l7.355 12.748c1.154 2-.29 4.5-2.599 4.5H4.645c-2.309 0-3.752-2.5-2.598-4.5L9.4 3.003zM12 8.25a.75.75 0 01.75.75v3.75a.75.75 0 01-1.5 0V9a.75.75 0 01.75-.75zm0 8.25a.75.75 0 100-1.5.75.75 0 000 1.5z"
									clipRule="evenodd"
								/>
							</svg>
							<span>Update failed</span>
						</div>
					),
					{
						id: 'sandbox-codegen',
						duration: 5000,
					}
				);
				break;
		}

		return () => {
			if (successTimeout) {
				clearTimeout(successTimeout);
			}
		};
	}, [sandboxStatus]);

	return null;
}

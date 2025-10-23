(() => {
  if (!import.meta.env.DEV) return; // skip in prod

  let panel = null; // active overlay element
  let lastError = null; // remember error for "Fix"

  const html = (parts, ...vals) => parts.reduce((s, c, i) => s + c + (vals[i] ?? ''), '');

  function mount(msg, stack, errObj) {
    lastError = errObj ?? new Error(msg); // keep a real Error

    if (!panel) {
      panel = document.createElement('div');
      panel.id = '__create_error_panel';
      document.body.appendChild(panel);
    }
    window.onload = () => {
      window.parent.postMessage({ type: 'sandbox:web:ready' }, '*');
      const [fix, logs, copy] = [
        document.getElementById('fix'),
        document.getElementById('logs'),
        document.getElementById('copy'),
      ];
      const isInIframe = window.self !== window.top;
      if (isInIframe) {
        // show all the buttons
        [fix, copy, logs].forEach((button) => {
          button?.classList.remove('opacity-0');
          button?.classList.add('opacity-100');
        });
      } else {
        // show all the buttons
        [copy].forEach((button) => {
          button?.classList.remove('opacity-0');
          button?.classList.add('opacity-100');
        });
        [fix, logs].forEach((button) => {
          button?.classList.add('hidden');
        });
      }
      const healthyResponseType = 'sandbox:web:healthcheck:response';
      const healthyResponse = {
        type: healthyResponseType,
        healthy: true,
        hasError: true,
      };
      const handleMessage = (event) => {
        if (event.data.type === 'sandbox:navigation') {
          window.location.pathname = event.data.pathname;
        }
        if (event.data.type === 'sandbox:web:healthcheck') {
          window.parent.postMessage(healthyResponse, '*');
        }
      };
      window.addEventListener('message', handleMessage);
      console.error(lastError);
    };

    panel.outerHTML = html`
      <div id="__create_error_panel"
           class="fixed bottom-4 left-1/2 -translate-x-1/2 z-[2147483647]
                  transition-all duration-500 ease-out translate-y-0 opacity-100">
        <div
          class="bg-[#18191B] text-[#F2F2F2] rounded-lg p-4 max-w-md
                 w-[calc(100vw-2rem)] mx-4 shadow-lg flex flex-col gap-2">
          <div class="flex items-start gap-3">
            <div class="flex-shrink-0">
              <div
                class="w-8 h-8 bg-[#F2F2F2] rounded-full flex
                       items-center justify-center">
                <span class="text-black text-[1.125rem] leading-none">⚠</span>
              </div>
            </div>

            <div class="flex flex-col gap-2 flex-1">
              <p class="font-light text-sm">App Error Detected</p>
              <p class="text-[#959697] text-sm font-light">
                It looks like an error occurred while trying to use your app.
              </p>

              <div class="flex gap-2">
                <button id="fix"
                  class="flex flex-row items-center justify-center gap-[4px]
                         outline-none transition-all rounded-[8px] border-[1px]
                         bg-[#f9f9f9] hover:bg-[#dbdbdb] active:bg-[#c4c4c4]
                         border-[#c4c4c4] text-[#18191B] text-sm px-[8px] py-[4px] opacity-0">
                  Try to fix
                </button>

                <button id="logs"
                  class="flex flex-row items-center justify-center gap-[4px]
                         outline-none transition-all rounded-[8px] border-[1px]
                         bg-[#2C2D2F] hover:bg-[#414243] active:bg-[#555658]
                         border-[#414243] text-white text-sm px-[8px] py-[4px] opacity-0">
                  Show logs
                </button>

                <button id="copy"
                  class="flex flex-row items-center justify-center gap-[4px]
                         outline-none transition-all rounded-[8px] border-[1px]
                         bg-[#2C2D2F] hover:bg-[#414243] active:bg-[#555658]
                         border-[#414243] text-white text-sm px-[8px] py-[4px] opacity-0">
                  Copy error
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;

    panel = document.getElementById('__create_error_panel');

    /* button wiring --------------------------------------------------- */
    panel.querySelector('#copy').onclick = () =>
      navigator.clipboard.writeText(`${msg}\n${stack || ''}`);

    panel.querySelector('#logs').onclick = sendLogsMessage;
    panel.querySelector('#fix').onclick = sendFixMessage;
  }

  function clear() {
    panel?.classList.add('translate-y-[200%]', 'opacity-0');
    setTimeout(() => panel?.remove(), 400);
    panel = null;
  }

  function sendLogsMessage() {
    window.parent?.postMessage({ type: 'sandbox:web:show-logs' }, '*');
  }

  function sendFixMessage() {
    window.parent?.postMessage(
      { type: 'sandbox:web:fix', error: { message: lastError?.message } },
      '*'
    );
    clear();
  }

  /* vite HMR channel ------------------------------------------------- */
  if (import.meta.hot) {
    import.meta.hot.on('vite:error', (payload) => {
      const err = payload.err || payload;
      mount(err.message, err.stack);
    });
    ['vite:beforeUpdate', 'vite:afterUpdate', 'vite:beforeFullReload'].forEach((evt) =>
      import.meta.hot.on(evt, clear)
    );
  }
})();

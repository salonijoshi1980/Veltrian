import { serializeError } from 'serialize-error';

export const getHTMLForErrorPage = (err: unknown): string => {
  return `
<html>
  <head>
    <script src="https://cdn.tailwindcss.com"></script>
    <script>
    function sendFixMessage() {
      window.parent.postMessage({ type: 'sandbox:web:fix', error: ${JSON.stringify(serializeError(err))} }, '*');
    }
    function sendLogsMessage() {
      window.parent.postMessage({ type: 'sandbox:web:show-logs' }, '*');
    }
    function copyError () {
      navigator.clipboard.writeText(JSON.stringify(${JSON.stringify(serializeError(err))}, null, 2))
    }
    window.onload = () => {
      window.parent.postMessage({ type: 'sandbox:web:ready' }, '*');
      const [fix, logs, copy] = [document.getElementById('fix'), document.getElementById('logs'), document.getElementById('copy')];
      const isInIframe = window.self !== window.top;
      if (isInIframe) {
        // show all the buttons
        [fix, copy, logs].forEach(button => {
          button.classList.remove('opacity-0');
          button.classList.add('opacity-100');
        });
      } else {
        // show all the buttons
        [copy].forEach(button => {
          button.classList.remove('opacity-0');
          button.classList.add('opacity-100');
        });
        [fix, logs].forEach(button => {
          button.classList.add('hidden');
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
      console.error(${JSON.stringify(serializeError(err))});
    }
    </script>
  </head>
  <body>
    <div class="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 transition-all duration-500 ease-out opacity-100" >
    <div class="bg-[#18191B] text-[#F2F2F2] rounded-lg p-4 max-w-md w-full mx-4 shadow-lg" >
      <div class="flex items-start gap-3" >
        <div class="flex-shrink-0" >
          <div class="w-8 h-8 bg-[#F2F2F2] rounded-full flex items-center justify-center" ><span class="text-black text-[1.125rem] leading-none" >⚠</span></div>
        </div>
        <div class="flex flex-col gap-2 flex-1" >
          <div class="flex flex-col gap-1" >
            <p class="font-light text-[#F2F2F2] text-sm" >App Error Detected</p>
            <p class="text-[#959697] text-sm font-light" >It looks like an error occurred while trying to use your app.</p>
          </div>
          <div class="flex gap-2">
            <button id="fix" onclick="sendFixMessage()" class="flex flex-row items-center justify-center gap-[4px] outline-none transition-all opacity-0 rounded-[8px] border-[1px] bg-[#f9f9f9] hover:bg-[#dbdbdb] active:bg-[#c4c4c4] border-[#c4c4c4] text-[#18191B] text-sm px-[8px] py-[4px] cursor-pointer" type="button" tabindex="0" data-react-aria-pressable="true" >Try to fix</button>
            <button id="logs" onclick="sendLogsMessage()" class="flex flex-row items-center justify-center gap-[4px] outline-none transition-all opacity-0 rounded-[8px] border-[1px] bg-[#2C2D2F] hover:bg-[#414243] active:bg-[#555658] border-[#414243] text-white text-sm px-[8px] py-[4px] cursor-pointer" type="button" tabindex="0" data-react-aria-pressable="true">Show logs</button>
            <button id="copy" onclick="copyError()" class="flex flex-row items-center justify-center gap-[4px] outline-none transition-all opacity-0 rounded-[8px] border-[1px] bg-[#2C2D2F] hover:bg-[#414243] active:bg-[#555658] border-[#414243] text-white text-sm px-[8px] py-[4px] cursor-pointer">Copy error</button>
          </div>
        </div>
      </div>
    </div>
  </body>
</html>
    `;
};

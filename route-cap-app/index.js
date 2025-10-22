// Route Captain Floating Chat Web Component
// - Creates a floating chat button bottom-right of the page
// - Uses Tailwind utility classes when available; falls back to minimal CSS
// - Auto-initializes when this script is loaded in the page <head>

(function () {
	const STYLE_ID = 'route-captain-chat-styles';
	const COMPONENT_NAME = 'route-captain-chat';

	// Minimal fallback CSS to use if Tailwind isn't present or for shadow-free styling
	const fallbackCss = `
	.rc-portal { position: fixed; right: 1rem; bottom: 1.25rem; z-index: 9999; font-family: Inter, ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial; }
	.rc-btn { display: inline-flex; align-items: center; justify-content: center; width: 56px; height: 56px; border-radius: 9999px; background: linear-gradient(135deg,#06b6d4,#3b82f6); color: white; box-shadow: 0 10px 30px rgba(2,6,23,0.2); cursor: pointer; border: none; }
	.rc-panel { width: 320px; max-width: calc(100vw - 2rem); height: 420px; background: white; border-radius: 12px; box-shadow: 0 12px 48px rgba(2,6,23,0.15); overflow: hidden; display: flex; flex-direction: column; }
	.rc-panel.dark { background: #0f172a; color: #e6eef8; }
	.rc-header { padding: 12px 16px; font-weight: 600; display:flex; align-items:center; justify-content:space-between; }
	.rc-messages { padding: 12px; flex:1; overflow:auto; background: transparent; }
	.rc-input-wrap { padding: 8px; border-top: 1px solid rgba(0,0,0,0.06); display:flex; gap:8px; }
	.rc-input { flex:1; padding:8px 10px; border-radius:8px; border:1px solid rgba(0,0,0,0.08); }
	.rc-hidden { display:none !important; }
	@media (max-width:420px){ .rc-portal{ right:0.5rem; bottom:0.75rem } .rc-panel{ width: 92vw; height: 60vh } }
	`;

	function ensureStyles() {
		if (document.getElementById(STYLE_ID)) return;
		const style = document.createElement('style');
		style.id = STYLE_ID;
		style.textContent = fallbackCss;
		document.head.appendChild(style);
	}

	class RouteCaptainChat extends HTMLElement {
		constructor() {
			super();
			this._open = false;
			this._container = null;
			this._panel = null;
			this._button = null;
		}

		connectedCallback() {
			ensureStyles();
			// Prevent duplicate render
			if (document.querySelector('.rc-portal[data-rc-initialized]')) return;

			this._render();
			this._attachEvents();
		}

		disconnectedCallback() {
			this._detachEvents();
		}

		_render() {
			// Create container appended to body so Tailwind classes (if present) apply
			const portal = document.createElement('div');
			portal.className = 'rc-portal';
			portal.setAttribute('data-rc-initialized', 'true');

			// Panel (hidden by default)
			const panel = document.createElement('div');
			panel.className = 'rc-panel rc-hidden';
			// Use Tailwind classes where helpful (they'll simply be ignored if Tailwind not loaded)
			panel.className += ' bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 shadow-lg rounded-xl overflow-hidden w-80 h-96 flex flex-col';

			panel.innerHTML = `
				<div class="rc-header px-4 py-3 bg-gradient-to-r from-teal-400 to-blue-500 text-white flex items-center justify-between">
					<div class="flex items-center gap-3">
						<div class="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center">💬</div>
						<div>
							<div class="text-sm font-semibold">Route Captain</div>
							<div class="text-xs opacity-80">How can I help you today?</div>
						</div>
					</div>
					<div class="flex items-center gap-2">
						<button aria-label="Minimize chat" class="rc-minimize text-white/90 hover:text-white">—</button>
						<button aria-label="Close chat" class="rc-close text-white/90 hover:text-white">×</button>
					</div>
				</div>
				<div class="rc-messages p-4 overflow-auto bg-white dark:bg-slate-900 flex-1">
					<div class="text-xs text-slate-500">This is a demo chat. Integrate your chat provider or API to handle messages.</div>
				</div>
				<div class="rc-input-wrap px-3 py-2 bg-slate-50 dark:bg-slate-800">
					<input class="rc-input flex-1 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100" placeholder="Type a message..." />
					<button class="rc-send px-3 py-1 bg-blue-600 text-white rounded-md">Send</button>
				</div>
			`;

			// Floating button
			const btn = document.createElement('button');
			btn.className = 'rc-btn';
			btn.title = 'Open chat';
			btn.setAttribute('aria-label', 'Open chat');
			btn.innerHTML = `
				<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="w-6 h-6">
					<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
				</svg>
			`;

			// Enhancement: add Tailwind utility classes to button for nicer default styling when Tailwind is present
			btn.className += ' p-3 rounded-full text-white hover:scale-105 transition-transform';

			portal.appendChild(panel);
			portal.appendChild(btn);

			document.body.appendChild(portal);

			this._container = portal;
			this._panel = panel;
			this._button = btn;
		}

		_attachEvents() {
			if (!this._button || !this._panel) return;
			this._onToggle = this._toggle.bind(this);
			this._onDocumentKey = this._onDocumentKey.bind(this);
			this._onSend = this._onSend.bind(this);

			this._button.addEventListener('click', this._onToggle);
			const closeBtn = this._panel.querySelector('.rc-close');
			const minimizeBtn = this._panel.querySelector('.rc-minimize');
			const sendBtn = this._panel.querySelector('.rc-send');
			const input = this._panel.querySelector('.rc-input');

			if (closeBtn) closeBtn.addEventListener('click', this._toggle);
			if (minimizeBtn) minimizeBtn.addEventListener('click', () => this._minimize());
			if (sendBtn) sendBtn.addEventListener('click', this._onSend);
			if (input) input.addEventListener('keydown', (e) => { if (e.key === 'Enter') this._onSend(); });

			document.addEventListener('keydown', this._onDocumentKey);
		}

		_detachEvents() {
			if (!this._button) return;
			this._button.removeEventListener('click', this._onToggle);
			document.removeEventListener('keydown', this._onDocumentKey);
		}

		_onDocumentKey(e) {
			if (e.key === 'Escape' && this._open) this._toggle();
			if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); this._openPanel(); const input = this._panel.querySelector('.rc-input'); if (input) input.focus(); }
		}

		_minimize() {
			this._panel.classList.toggle('rc-hidden');
			this._open = !this._panel.classList.contains('rc-hidden');
		}

		_toggle() {
			if (this._panel.classList.contains('rc-hidden')) this._openPanel();
			else this._closePanel();
		}

		_openPanel() {
			this._panel.classList.remove('rc-hidden');
			this._open = true;
			// focus input
			const input = this._panel.querySelector('.rc-input');
			if (input) setTimeout(() => input.focus(), 80);
		}

		_closePanel() {
			this._panel.classList.add('rc-hidden');
			this._open = false;
		}

		_onSend() {
			const input = this._panel.querySelector('.rc-input');
			const messages = this._panel.querySelector('.rc-messages');
			if (!input || !messages) return;
			const text = input.value && input.value.trim();
			if (!text) return;

			const bubble = document.createElement('div');
			bubble.className = 'rc-bubble rc-bubble-user mb-2 text-sm';
			bubble.textContent = text;
			bubble.style.background = '#e6f4ff';
			bubble.style.padding = '8px 10px';
			bubble.style.borderRadius = '8px';
			bubble.style.display = 'inline-block';

			messages.appendChild(bubble);
			messages.scrollTop = messages.scrollHeight;
			input.value = '';

			// Placeholder: here you could call an API or integrate a bot
			setTimeout(() => {
				const reply = document.createElement('div');
				reply.className = 'rc-bubble rc-bubble-bot mb-2 text-sm';
				reply.textContent = 'Thanks for your message — integrate your chat backend to send real responses.';
				reply.style.background = '#f1f5f9';
				reply.style.padding = '8px 10px';
				reply.style.borderRadius = '8px';
				reply.style.display = 'inline-block';
				messages.appendChild(reply);
				messages.scrollTop = messages.scrollHeight;
			}, 700);
		}
	}

	// Register component if not already
	if (!customElements.get(COMPONENT_NAME)) {
		customElements.define(COMPONENT_NAME, RouteCaptainChat);
	}

	// Auto-initialize: if the host page didn't place an element, create one and append to body
	function autoInit() {
		if (document.querySelector(COMPONENT_NAME)) return;
		const el = document.createElement(COMPONENT_NAME);
		document.body && document.body.appendChild(el);
	}

	if (document.readyState === 'loading') {
		document.addEventListener('DOMContentLoaded', autoInit);
	} else {
		// Give callers a microtick so other scripts in head can run
		setTimeout(autoInit, 0);
	}

})();


    const STORAGE_KEY = 'captainHighlightTourData';

    /**
     * Captain Highlight Web Component (Custom Element: <captain-highlight>)
     * * Creates a DevTools-style highlight and inspector panel.
     * * Use Shift + Ctrl + L to lock the highlight on the current element.
     */
    class CaptainHighlightElement extends HTMLElement {
        constructor() {
            super();
            this.overlay = null; 
            this.instructionText = null; 
            this.inspector = null; 
            this.currentTarget = null; 
            this.lockedElement = null; 
            this.resizeObserver = null;
            this.mutationObserver = null; 
            this.attachDebounceTimeout = null; 
            this.appIdPrefix = 'captain-highlight-';

            // this.tourData property is removed as data is now read directly from localStorage
        }

        /**
         * Generates a unique XPath for an element.
         * @param {HTMLElement} element - The DOM element.
         * @returns {string} The computed XPath.
         */
        static getElementXPath(element) {
            if (element.id !== '') {
                return `id("${element.id}")`;
            }
            if (element === document.body) {
                return '/html/body';
            }

            let ix = 0;
            const siblings = element.parentNode ? element.parentNode.childNodes : [];
            for (let i = 0; i < siblings.length; i++) {
                const sibling = siblings[i];
                if (sibling === element) {
                    // Recursively call the static method using the class name
                    return CaptainHighlightElement.getElementXPath(element.parentNode) + '/' + element.tagName.toLowerCase() + '[' + (ix + 1) + ']';
                }
                if (sibling.nodeType === 1 && sibling.tagName === element.tagName) {
                    ix++;
                }
            }
            return '';
        }

        /**
         * Lifecycle callback when the component is inserted into the DOM.
         */
        connectedCallback() {
            this.createUI();
            this.setupEventListeners();
            this.setupMutationObserver(); 

            // Use a small timeout to ensure the React component's DOM has fully rendered
            setTimeout(() => {
                this.autoAttachElements();
            }, 50); 
        }

        /**
         * Cleans up global resources when the component is removed.
         */
        disconnectedCallback() {
            window.removeEventListener('scroll', this.updatePositionBound);
            window.removeEventListener('resize', this.updatePositionBound);
            document.removeEventListener('keydown', this.handleKeydownBound);
            this.resizeObserver?.disconnect();
            this.mutationObserver?.disconnect(); 
            if (this.attachDebounceTimeout) clearTimeout(this.attachDebounceTimeout); 
            this.overlay?.remove();
            this.inspector?.remove();
            this.instructionText?.remove(); 
        }
        
        /**
         * Sets up the MutationObserver to watch for dynamic DOM changes.
         */
        setupMutationObserver() {
            this.mutationObserver = new MutationObserver((mutationsList) => {
                let shouldReAttach = false;
                for (const mutation of mutationsList) {
                    if (mutation.type === 'childList' && (mutation.addedNodes.length > 0 || mutation.removedNodes.length > 0)) {
                        shouldReAttach = true;
                        break;
                    }
                }

                if (shouldReAttach) {
                    this.debouncedAutoAttach();
                }
            });

            this.mutationObserver.observe(document.body, { childList: true, subtree: true });
        }

        /**
         * Debounces the call to autoAttachElements to prevent performance issues on rapid changes.
         */
        debouncedAutoAttach() {
            if (this.attachDebounceTimeout) {
                clearTimeout(this.attachDebounceTimeout);
            }
            this.attachDebounceTimeout = setTimeout(() => {
                if (!this.lockedElement) {
                     this.autoAttachElements();
                }
            }, 100); 
        }

        /**
         * Creates the persistent overlay and inspector panel elements.
         */
        createUI() {
            // --- 1. OVERLAY (HIGHLIGHT BOX) ---
            this.overlay = document.createElement('div');
            this.overlay.id = this.appIdPrefix + 'overlay';
            this.overlay.style.cssText = `
                position: fixed;
                background-color: rgba(135, 206, 250, 0.4); /* Sky Blue */
                border: 1px solid deepskyblue;
                box-sizing: border-box;
                z-index: 9999; 
                transition: all 50ms ease-out;
                pointer-events: none; /* Allows clicks to pass through */
                display: none; /* Starts hidden */
            `;
            document.body.appendChild(this.overlay);

            // --- 1.5 INSTRUCTION TEXT ---
            this.instructionText = document.createElement('span');
            this.instructionText.id = this.appIdPrefix + 'instruction-text';
            this.instructionText.style.cssText = `
                position: fixed; 
                background-color: #333;
                color: #fff;
                padding: 4px 8px;
                border-radius: 4px;
                font-size: 12px;
                font-family: Inter, sans-serif;
                font-weight: normal; 
                white-space: nowrap;
                pointer-events: none; 
                z-index: 10001; 
                display: none; 
                box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
            `;
            this.instructionText.innerHTML = `
                Press 
                <code style="
                    font-family: monospace;
                    background-color: #555;
                    padding: 2px 4px;
                    border-radius: 3px;
                    color: #ffe082;
                    font-size: 11px;
                    font-weight: bold;
                    margin: 0 4px;
                ">Shift+Ctrl+L</code> 
                to Lock
            `;
            document.body.appendChild(this.instructionText);

            // --- 2. INSPECTOR PANEL (INPUTS) ---
            this.inspector = document.createElement('div');
            this.inspector.id = this.appIdPrefix + 'inspector-panel';
            this.inspector.className = 'captain-highlight-inspector'; 
            this.inspector.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                width: 300px;
                padding: 12px;
                background-color: #333;
                color: #fff;
                border-radius: 8px;
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);
                z-index: 10000; 
                font-family: Inter, sans-serif;
                font-size: 14px;
                flex-direction: column;
                gap: 10px;
                display: none; 
            `;

            this.inspector.innerHTML = `
                <div id="${this.appIdPrefix}inspector-header" style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #444; padding-bottom: 8px; margin-bottom: 10px;">
                    <div id="${this.appIdPrefix}inspector-title" style="font-weight: bold; font-size: 16px;">Captain Highlight Inspector</div>
                    <button id="${this.appIdPrefix}dismiss-button" title="Dismiss (Unlock)" style="padding: 4px 8px; background-color: #f44336; color: white; border: none; border-radius: 4px; cursor: pointer; font-weight: bold; line-height: 1; border-radius: 4px;">
                        X
                    </button>
                </div>
                
                <!-- JSON Display Area -->
                <div id="${this.appIdPrefix}tour-list-container" style="display: none; margin-top: 10px; border-top: 1px solid #444; padding-top: 10px;">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 5px;">
                        <h4 style="font-weight: bold;">Tour Data Preview</h4>
                        <button id="${this.appIdPrefix}copy-json-button" title="Copy JSON" style="background: #555; color: white; border: none; padding: 4px 8px; border-radius: 4px; cursor: pointer; font-size: 12px; display: flex; align-items: center; gap: 4px; transition: background-color 0.3s;">
                            <!-- Clipboard SVG Icon -->
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
                                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
                            </svg>
                            <span id="${this.appIdPrefix}copy-text">Copy</span>
                        </button>
                    </div>
                    <pre id="${this.appIdPrefix}tour-json-display" style="max-height: 200px; overflow-y: auto; background: #222; padding: 8px; border-radius: 4px; font-size: 11px; color: #a5d6a7; white-space: pre-wrap;">
                        No data yet.
                    </pre>
                </div>

                <!-- XPath DISPLAY -->
                <div style="background: #444; padding: 6px; border-radius: 4px; overflow-x: auto; white-space: nowrap;">
                    <label style="color: #bbb; display: block; margin-bottom: 2px;">XPath:</label>
                    <code id="${this.appIdPrefix}xpath-display" style="color: #ffe082;">/html/body</code>
                </div>

                <!-- TITLE INPUT -->
                <div>
                    <label for="${this.appIdPrefix}title-input" style="color: #bbb; display: block;">Title:</label>
                    <input id="${this.appIdPrefix}title-input" type="text" placeholder="Enter title for this element..." style="width: 100%; padding: 6px; border-radius: 4px; border: none; background: #555; color: #fff;">
                </div>

                <!-- DESCRIPTION INPUT -->
                <div>
                    <label for="${this.appIdPrefix}description-input" style="color: #bbb; display: block;">Description:</label>
                    <textarea id="${this.appIdPrefix}description-input" placeholder="Enter description..." style="width: 100%; padding: 6px; border-radius: 4px; border: none; background: #555; color: #fff; resize: vertical;"></textarea>
                </div>

                <!-- Action Buttons Block -->
                <div style="display: flex; gap: 8px; margin-top: 10px; padding-top: 10px; border-top: 1px solid #444;">
                    <button id="${this.appIdPrefix}save-button" style="flex-grow: 1; padding: 8px; background-color: #4CAF50; color: white; border: none; border-radius: 4px; cursor: pointer; font-weight: bold;">
                        Save Element
                    </button>
                    <button id="${this.appIdPrefix}show-tour-button" style="flex-grow: 1; padding: 8px; background-color: #2196F3; color: white; border: none; border-radius: 4px; cursor: pointer; font-weight: bold;">
                        Show Tour JSON
                    </button>
                </div>
            `;
            document.body.appendChild(this.inspector);
        }

        /**
         * Binds and sets up global event listeners.
         */
        setupEventListeners() {
            this.updatePositionBound = this.updatePosition.bind(this);
            this.handleKeydownBound = this.handleKeydown.bind(this);

            window.addEventListener('scroll', this.updatePositionBound);
            window.addEventListener('resize', this.updatePositionBound);
            document.addEventListener('keydown', this.handleKeydownBound);
            
            document.getElementById(this.appIdPrefix + 'dismiss-button')
                    .addEventListener('click', () => this.lockCurrentTarget(false)); 

            document.getElementById(this.appIdPrefix + 'save-button')
                    .addEventListener('click', () => {
                        this.saveLockedElement(); 
                    });

            document.getElementById(this.appIdPrefix + 'show-tour-button')
                    .addEventListener('click', () => {
                        this.toggleTourListDisplay();
                    });

            document.getElementById(this.appIdPrefix + 'copy-json-button')
                    .addEventListener('click', () => {
                        this.copyTourJson();
                    });

            this.resizeObserver = new ResizeObserver(() => this.updatePosition());
        }

        /**
         * Copies the generated tour JSON to the clipboard using document.execCommand('copy').
         */
        copyTourJson() {
            const jsonDisplay = document.getElementById(this.appIdPrefix + 'tour-json-display');
            const copyButton = document.getElementById(this.appIdPrefix + 'copy-json-button');
            const copyTextSpan = document.getElementById(this.appIdPrefix + 'copy-text');
            
            if (!jsonDisplay || !copyButton || !copyTextSpan) return;
            
            const originalText = copyTextSpan.textContent;
            const originalBackgroundColor = copyButton.style.backgroundColor;

            try {
                const textarea = document.createElement('textarea');
                textarea.value = jsonDisplay.textContent;
                textarea.style.position = 'fixed'; 
                textarea.style.opacity = '0';
                document.body.appendChild(textarea);
                
                textarea.select();
                document.execCommand('copy');
                document.body.removeChild(textarea);

                copyTextSpan.textContent = 'Copied!';
                copyButton.style.backgroundColor = '#76ff03'; 

                setTimeout(() => {
                    copyTextSpan.textContent = originalText;
                    copyButton.style.backgroundColor = originalBackgroundColor;
                }, 1000);

            } catch (err) {
                console.error('Failed to copy text:', err);
                copyTextSpan.textContent = 'Error!';
                copyButton.style.backgroundColor = '#f44336'; 
                setTimeout(() => {
                    copyTextSpan.textContent = originalText;
                    copyButton.style.backgroundColor = originalBackgroundColor;
                }, 1000);
            }
        }

        /**
         * Scans the DOM and attaches the highlighter to common elements.
         */
        autoAttachElements() {
            const selector = 'div, p, h1, h2, h3, button, a, span, li, section, article, header, footer';
            const elements = document.querySelectorAll(selector);

            elements.forEach(element => {
                const tagName = element.tagName.toUpperCase();

                if (tagName === 'CAPTAIN-HIGHLIGHT' || ['HTML', 'BODY', 'HEAD'].includes(tagName)) {
                    return;
                }
                
                const elementId = element.id || '';
                if (elementId.startsWith(this.appIdPrefix)) {
                    return;
                }

                this.attach(element, 'on-hover');
            });
        }

        /**
         * Attaches mouse event handlers to a specific element.
         */
        attach(element, trigger = 'on-hover') {
            if (!(element instanceof HTMLElement)) return;

            if (element.hasAttribute('data-captain-attached')) return;
            element.setAttribute('data-captain-attached', 'true');

            if (trigger === 'on-hover') {
                element.addEventListener('mouseenter', () => {
                    this.highlight(element);
                });

                element.addEventListener('mouseleave', (event) => {
                    if (this.lockedElement) {
                        return;
                    }
                    if (element.contains(event.relatedTarget)) {
                        return; 
                    }
                    this.hide(); 
                });
            }
        }

        /**
         * Highlights the given element.
         */
        highlight(element) {
            if (element === this.currentTarget) {
                this.updatePosition(); 
                return;
            }

            if (this.currentTarget) {
                this.resizeObserver.unobserve(this.currentTarget);
            }

            this.currentTarget = element;
            this.resizeObserver.observe(this.currentTarget);
            
            this.updatePosition(); 
            this.showInspectorPanel(element);
        }

        /**
         * Clears the current target and hides UI if not locked.
         */
        hide() {
            if (this.lockedElement) return;

            this.overlay.style.display = 'none';
            this.inspector.style.display = 'none';
            if (this.instructionText) {
                this.instructionText.style.display = 'none'; 
            }

            if (this.currentTarget) {
                this.resizeObserver.unobserve(this.currentTarget);
                this.currentTarget = null;
            }
        }

        /**
         * Toggles the visibility of the tour list JSON display within the inspector.
         * IMPORTANT: Reads data directly from localStorage to guarantee freshness.
         */
        toggleTourListDisplay() {
            const container = document.getElementById(this.appIdPrefix + 'tour-list-container');
            const jsonDisplay = document.getElementById(this.appIdPrefix + 'tour-json-display');
            
            if (!container || !jsonDisplay) return;

            // 1. READ DATA DIRECTLY FROM LOCAL STORAGE
            let currentTourData = [];
            try {
                const stored = window.localStorage.getItem(STORAGE_KEY);
                currentTourData = stored ? JSON.parse(stored) : [];
            } catch (e) {
                console.error("Error reading localStorage for display:", e);
            }

            // 2. Generate JSON structure from received data
            const tourJSON = {
                name: 'pageTour',
                label: 'Page Capture Tour',
                tour: currentTourData.map(item => ({
                    xpath: item.xpath,
                    popover: {
                        title: item.title || 'Untitled Element',
                        description: item.description || 'No description provided.',
                    }
                })),
            };

            // 3. Populate and toggle display
            if (container.style.display === 'none') {
                jsonDisplay.textContent = JSON.stringify(tourJSON, null, 2);
                container.style.display = 'block';
            } else {
                container.style.display = 'none';
            }
        }

        /**
         * Updates the overlay's position and size to match the current target element.
         */
        updatePosition() {
            if (!this.overlay || !this.currentTarget || !this.instructionText) return;

            const rect = this.currentTarget.getBoundingClientRect();
            
            this.overlay.style.width = `${rect.width}px`;
            this.overlay.style.height = `${rect.height}px`;
            this.overlay.style.top = `${rect.top}px`;
            this.overlay.style.left = `${rect.left}px`;
            this.overlay.style.display = 'block';

            if (!this.lockedElement) {
                this.instructionText.style.top = `${rect.top - 28}px`; 
                this.instructionText.style.left = `${rect.left}px`;
                this.instructionText.style.display = 'block';
            } else {
                this.instructionText.style.display = 'none';
            }
        }

        /**
         * Updates the inspector panel content and makes it visible.
         */
        showInspectorPanel(element) {
            const xpathDisplay = document.getElementById(this.appIdPrefix + 'xpath-display');
            
            if (xpathDisplay) {
                const elementToShow = this.lockedElement || element;
                xpathDisplay.textContent = CaptainHighlightElement.getElementXPath(elementToShow);
            }

            this.inspector.style.display = this.lockedElement ? 'flex' : 'none';
        }

        /**
         * Handles the keyboard shortcut (Shift + Ctrl + L) for locking.
         */
        handleKeydown(event) {
            if (event.shiftKey && event.ctrlKey && event.key.toUpperCase() === 'L') {
                event.preventDefault();
                this.lockCurrentTarget(); 
            }
        }

        /**
         * SAVES the currently locked element data directly to localStorage.
         * Dispatches a custom event to notify external listeners (like React) of the change.
         */
        saveLockedElement() {
            if (!this.lockedElement) return;

            const titleInput = document.getElementById(this.appIdPrefix + 'title-input');
            const descInput = document.getElementById(this.appIdPrefix + 'description-input');
            const inspectorTitle = document.getElementById(this.appIdPrefix + 'inspector-title');
            
            // 1. Capture Data
            const elementData = {
                id: Date.now(), 
                xpath: CaptainHighlightElement.getElementXPath(this.lockedElement),
                title: titleInput?.value || '',
                description: descInput?.value || 'No description provided.',
            };

            // --- LOCAL STORAGE LOGIC ---
            let currentTour = [];
            try {
                // Read existing data
                const stored = window.localStorage.getItem(STORAGE_KEY);
                currentTour = stored ? JSON.parse(stored) : [];
            } catch (e) {
                console.error("Error reading localStorage during save:", e);
            }

            // Append new data
            const updatedElements = [...currentTour, elementData];
            
            // Write updated data back to localStorage
            try {
                window.localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedElements));
            } catch (e) {
                console.error("Could not save to localStorage:", e);
            }
            // --------------------------

            // 2. Dispatch custom event to notify React that the data has changed
            this.dispatchEvent(new CustomEvent('tour-data-saved', { 
                bubbles: true, 
                composed: true 
            }));
            
            // 3. Show Temporary Visual Confirmation
            if (inspectorTitle) {
                inspectorTitle.textContent = 'Element SAVED! (LOCKED)';
                inspectorTitle.style.color = '#76ff03'; // Bright green for success
            }

            // 4. Clear inputs and reset title after a delay for user feedback
            setTimeout(() => {
                if(titleInput) titleInput.value = '';
                if(descInput) descInput.value = '';
                
                if (inspectorTitle) {
                    inspectorTitle.textContent = 'Captain Highlight Inspector (LOCKED)'; 
                    inspectorTitle.style.color = '#fff'; 
                }
            }, 500); 
        }

        /**
         * Locks or unlocks the inspection UI.
         */
        lockCurrentTarget(lock = !this.lockedElement) {
            const inspectorTitle = document.getElementById(this.appIdPrefix + 'inspector-title');

            if (lock) {
                if (this.currentTarget) {
                    this.lockedElement = this.currentTarget;
                    
                    if (inspectorTitle) {
                        inspectorTitle.textContent = 'Captain Highlight Inspector (LOCKED)';
                        inspectorTitle.style.color = '#fff'; 
                    }

                    this.updatePosition(); 
                    this.showInspectorPanel(this.lockedElement);
                }
            } else {
                this.lockedElement = null;
                this.hide(); 
                if (inspectorTitle) {
                    inspectorTitle.textContent = 'Captain Highlight Inspector';
                    inspectorTitle.style.color = '#fff';
                }
                const container = document.getElementById(this.appIdPrefix + 'tour-list-container');
                if (container) container.style.display = 'none';
            }
        }
    }

    if (!customElements.get('captain-highlight')) {
        customElements.define('captain-highlight', CaptainHighlightElement);
    }

class ShortcutManager {
    constructor() {
        this.shortcuts = {
            's': this.savePrompt,
            'f': this.focusSearch,
            'n': this.newPrompt,
            't': this.toggleTheme,
            'e': this.exportPrompts,
            'i': this.importPrompts,
            'd': this.deletePrompt,
            'p': this.previewPrompt
        };
        this.initTheme();
        this.initShortcuts();
    }

    initTheme() {
        chrome.storage.sync.get(['darkMode'], (result) => {
            const isDarkMode = result.darkMode === undefined ? true : result.darkMode;
            if (result.darkMode === undefined) {
                chrome.storage.sync.set({ darkMode: true });
            }
            
            if (!isDarkMode) {
                document.body.setAttribute('data-theme', 'light');
            }

            // Add theme toggle button to header
            const headerControls = document.querySelector('.header-controls');
            const themeBtn = document.createElement('button');
            themeBtn.className = 'theme-btn social-btn';
            themeBtn.innerHTML = `<i class="fas fa-${isDarkMode ? 'moon' : 'sun'}"></i>`;
            themeBtn.title = 'Toggle Dark Mode';
            themeBtn.onclick = () => this.toggleTheme();
            headerControls.querySelector('.social-icons').appendChild(themeBtn);
        });
    }

    initShortcuts() {
        document.addEventListener('keydown', (e) => {
            // Only trigger if Ctrl/Cmd + key is pressed
            if ((e.ctrlKey || e.metaKey) && this.shortcuts[e.key]) {
                e.preventDefault();
                this.shortcuts[e.key].call(this);
            }
        });

        // Add keyboard shortcuts info
        this.createShortcutsModal();
        const shortcutsBtn = document.createElement('button');
        shortcutsBtn.className = 'shortcuts-btn social-btn';
        shortcutsBtn.innerHTML = '<i class="fas fa-keyboard"></i>';
        shortcutsBtn.title = 'Keyboard Shortcuts';
        shortcutsBtn.onclick = () => this.showShortcutsModal();
        document.querySelector('.social-icons').appendChild(shortcutsBtn);
    }

    savePrompt() {
        document.getElementById('savePrompt').click();
    }

    focusSearch() {
        document.getElementById('searchInput').focus();
    }

    newPrompt() {
        document.getElementById('headingInput').focus();
    }

    toggleTheme() {
        const isLightMode = document.body.getAttribute('data-theme') === 'light';
        if (isLightMode) {
            document.body.removeAttribute('data-theme');
        } else {
            document.body.setAttribute('data-theme', 'light');
        }
        chrome.storage.sync.set({ darkMode: !isLightMode });
        
        // Update theme button icon
        const themeBtn = document.querySelector('.theme-btn i');
        themeBtn.className = isLightMode ? 'fas fa-moon' : 'fas fa-sun';
    }

    exportPrompts() {
        document.getElementById('exportBtn').click();
    }

    importPrompts() {
        document.getElementById('importBtn').click();
    }

    deletePrompt() {
        const activePrompt = document.querySelector('.prompt-item:hover');
        if (activePrompt) {
            activePrompt.querySelector('.delete-btn').click();
        }
    }

    previewPrompt() {
        const activePrompt = document.querySelector('.prompt-item:hover');
        if (activePrompt) {
            activePrompt.querySelector('.preview-btn').click();
        }
    }

    createShortcutsModal() {
        const modal = document.createElement('div');
        modal.className = 'shortcuts-modal';
        modal.innerHTML = `
            <div class="shortcuts-modal-content">
                <div class="shortcuts-modal-header">
                    <h3>Keyboard Shortcuts</h3>
                    <button class="share-modal-close">×</button>
                </div>
                <div class="shortcuts-list">
                    <div class="shortcut-item">
                        <span><kbd>Ctrl/⌘</kbd> + <kbd>S</kbd> Save prompt</span>
                    </div>
                    <div class="shortcut-item">
                        <span><kbd>Ctrl/⌘</kbd> + <kbd>F</kbd> Focus search</span>
                    </div>
                    <div class="shortcut-item">
                        <span><kbd>Ctrl/⌘</kbd> + <kbd>N</kbd> New prompt</span>
                    </div>
                    <div class="shortcut-item">
                        <span><kbd>Ctrl/⌘</kbd> + <kbd>T</kbd> Toggle theme</span>
                    </div>
                    <div class="shortcut-item">
                        <span><kbd>Ctrl/⌘</kbd> + <kbd>E</kbd> Export all</span>
                    </div>
                    <div class="shortcut-item">
                        <span><kbd>Ctrl/⌘</kbd> + <kbd>I</kbd> Import</span>
                    </div>
                    <div class="shortcut-item">
                        <span><kbd>Ctrl/⌘</kbd> + <kbd>D</kbd> Delete prompt</span>
                    </div>
                    <div class="shortcut-item">
                        <span><kbd>Ctrl/⌘</kbd> + <kbd>P</kbd> Preview prompt</span>
                    </div>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
        modal.style.display = 'none';

        const closeBtn = modal.querySelector('.share-modal-close');
        closeBtn.onclick = () => modal.style.display = 'none';
    }

    showShortcutsModal() {
        const modal = document.querySelector('.shortcuts-modal');
        modal.style.display = 'flex';
        
        // Close modal when clicking outside or pressing Escape
        const closeModal = () => {
            modal.style.display = 'none';
        };

        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeModal();
            }
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                closeModal();
            }
        });

        // Remove event listeners when modal is closed
        const cleanup = () => {
            document.removeEventListener('keydown', closeModal);
            modal.removeEventListener('click', closeModal);
        };

        modal.addEventListener('transitionend', cleanup, { once: true });
    }
}
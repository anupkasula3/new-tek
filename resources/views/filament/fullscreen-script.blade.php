<style>
/* Fullscreen mode for Filament Rich Editor */
.custom-rich-editor-fullscreen-active {
    position: fixed !important;
    top: 0 !important;
    left: 0 !important;
    width: 100vw !important;
    height: 100vh !important;
    z-index: 999999 !important;
    background-color: white !important;
    margin: 0 !important;
    border-radius: 0 !important;
    display: flex !important;
    flex-direction: column !important;
}

:is(.dark .custom-rich-editor-fullscreen-active) {
    background-color: #18181b !important; /* dark mode background */
}

/* Ensure editor area expands */
.custom-rich-editor-fullscreen-active > .fi-input,
.custom-rich-editor-fullscreen-active .ProseMirror,
.custom-rich-editor-fullscreen-active > div:last-child {
    flex-grow: 1 !important;
    height: 100% !important;
    min-height: 0 !important; /* Important for flex */
    max-height: none !important;
    overflow-y: auto !important;
}

/* Toolbar adjustments */
.custom-rich-editor-fullscreen-active > [role="toolbar"],
.custom-rich-editor-fullscreen-active .fi-fo-rich-editor-toolbar,
.custom-rich-editor-fullscreen-active > div:first-child {
    border-radius: 0 !important;
    border-left: none !important;
    border-right: none !important;
    border-top: none !important;
    position: sticky !important;
    top: 0 !important;
    z-index: 10 !important;
    background-color: inherit !important;
}

/* Ensure that inner containers also stretch */
.custom-rich-editor-fullscreen-active .tiptap,
.custom-rich-editor-fullscreen-active .ProseMirror {
    min-height: 100% !important;
    box-sizing: border-box;
}

/* Make sure the toolbar wrapper looks good */
.custom-rich-editor-fullscreen-active .gap-1 {
    width: 100% !important;
}

.custom-fs-btn:hover {
    background-color: rgba(107, 114, 128, 0.1) !important;
}
</style>

<script>
document.addEventListener('DOMContentLoaded', () => {
    function injectFullscreenButtons() {
        // Target Filament v3's RichEditor wrappers
        const editors = document.querySelectorAll('.fi-fo-rich-editor:not(.has-fs-btn)');
        
        editors.forEach(editor => {
            editor.classList.add('has-fs-btn');
            
            // Ensure the wrapper is relative so we can absolute position the button
            if (window.getComputedStyle(editor).position === 'static') {
                editor.style.position = 'relative';
            }

            const btn = document.createElement('button');
            btn.type = 'button';
            btn.title = 'Fullscreen';
            
            // Custom styling for absolute positioning
            btn.className = 'custom-fs-btn';
            btn.style.position = 'absolute';
            btn.style.top = '0.35rem';
            btn.style.right = '0.35rem';
            btn.style.zIndex = '50';
            btn.style.padding = '0.35rem';
            btn.style.borderRadius = '0.375rem';
            btn.style.color = '#6b7280';
            btn.style.backgroundColor = 'transparent';
            btn.style.border = 'none';
            btn.style.cursor = 'pointer';
            btn.style.display = 'flex';
            btn.style.alignItems = 'center';
            btn.style.justifyContent = 'center';
            btn.style.transition = 'background-color 0.2s';
            
            // Expand icon
            const expandIcon = `<svg style="width:1.25rem; height:1.25rem; pointer-events:none;" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15" /></svg>`;
            // Shrink icon
            const shrinkIcon = `<svg style="width:1.25rem; height:1.25rem; pointer-events:none;" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M9 9V4.5M9 9H4.5M9 9L3.75 3.75M9 15v4.5M9 15H4.5M9 15l-5.25 5.25M15 9h4.5M15 9V4.5M15 9l5.25-5.25M15 15h4.5M15 15v4.5m0-4.5l5.25 5.25" /></svg>`;
            
            btn.innerHTML = expandIcon;
            
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                editor.classList.toggle('custom-rich-editor-fullscreen-active');
                
                if (editor.classList.contains('custom-rich-editor-fullscreen-active')) {
                    document.body.style.overflow = 'hidden';
                    btn.innerHTML = shrinkIcon;
                    btn.style.position = 'fixed';
                    btn.style.top = '1rem';
                    btn.style.right = '2rem';
                    btn.style.zIndex = '9999999';
                    btn.style.backgroundColor = '#f3f4f6'; // visible bg when fixed
                } else {
                    document.body.style.overflow = '';
                    btn.innerHTML = expandIcon;
                    btn.style.position = 'absolute';
                    btn.style.top = '0.35rem';
                    btn.style.right = '0.35rem';
                    btn.style.zIndex = '50';
                    btn.style.backgroundColor = 'transparent';
                }
            });
            
            editor.appendChild(btn);
        });
    }

    // Run periodically to catch Livewire DOM updates dynamically.
    // 1000ms is cheap enough.
    setInterval(injectFullscreenButtons, 1000);
    // Also run immediately
    injectFullscreenButtons();
});
</script>

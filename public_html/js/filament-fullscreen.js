document.addEventListener('DOMContentLoaded', () => {
    function injectFullscreenButtons() {
        // Target Filament v3's RichEditor specifically
        const editors = document.querySelectorAll('.fi-fo-rich-editor:not(.has-fullscreen-btn-added)');
        
        editors.forEach(editorWrapper => {
            // Find the toolbar inside the editor wrapper.
            // Usually the first child div contains the buttons in a flex container.
            const toolbarContainer = editorWrapper.querySelector('[role="toolbar"]') || editorWrapper.querySelector('.border-b.flex') || editorWrapper.querySelector(':scope > div:first-child > .flex') || editorWrapper.querySelector('trix-toolbar') || editorWrapper.querySelector(':scope > div:first-child');
            
            if (!toolbarContainer) return;

            editorWrapper.classList.add('has-fullscreen-btn-added');

            // Need relative position on wrapper if we are going to make it fixed later
            editorWrapper.style.position = editorWrapper.style.position || 'relative';

            // Create the fullscreen toggle button
            const btn = document.createElement('button');
            btn.type = 'button';
            btn.title = 'Fullscreen';
            
            // Standard Filament button styling
            btn.className = 'fi-icon-btn relative inline-flex items-center justify-center rounded-lg outline-none transition duration-75 hover:bg-gray-50 focus-visible:ring-2 disabled:pointer-events-none disabled:opacity-70 dark:hover:bg-white/5 bg-transparent p-2 text-gray-500 dark:text-gray-400 ml-auto';
            
            // Expand icon
            const expandIcon = `<svg style="width:1.25rem; height:1.25rem; pointer-events:none;" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15" /></svg>`;
            // Shrink icon
            const shrinkIcon = `<svg style="width:1.25rem; height:1.25rem; pointer-events:none;" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M9 9V4.5M9 9H4.5M9 9L3.75 3.75M9 15v4.5M9 15H4.5M9 15l-5.25 5.25M15 9h4.5M15 9V4.5M15 9l5.25-5.25M15 15h4.5M15 15v4.5m0-4.5l5.25 5.25" /></svg>`;
            
            btn.innerHTML = expandIcon;
            
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                editorWrapper.classList.toggle('custom-rich-editor-fullscreen-active');
                
                if (editorWrapper.classList.contains('custom-rich-editor-fullscreen-active')) {
                    document.body.style.overflow = 'hidden';
                    btn.innerHTML = shrinkIcon;
                } else {
                    document.body.style.overflow = '';
                    btn.innerHTML = expandIcon;
                }
            });
            
            // Try to find the inner flex container with gap-1 to append the button
            const buttonGroup = toolbarContainer.querySelector('.gap-1') || toolbarContainer;
            
            // Push it to the right
            btn.style.marginLeft = 'auto'; // Flex magic
            
            // If the toolbar is a flex container, we can just append it.
            buttonGroup.appendChild(btn);
        });
    }

    injectFullscreenButtons();
    
    // Filament uses Livewire so elements can be replaced dynamically
    const observer = new MutationObserver(() => {
        injectFullscreenButtons();
    });
    
    // Defer observation slightly to allow Alpine/Livewire to boot
    setTimeout(() => {
        observer.observe(document.body, { childList: true, subtree: true });
    }, 100);
});

<x-dynamic-component
    :component="$getFieldWrapperView()"
    :field="$field"
>
    <div
        x-data="{
            state: $wire.$entangle('{{ $getStatePath() }}'),
            isOpen: false,
            init() {
                this.$watch('state', val => {
                    console.log('MediaPicker [{{ $getId() }}] state updated:', val);
                    console.log('resolvedState:', this.resolvedState);
                    console.log('fileUrl:', this.fileUrl);
                    console.log('isImage:', this.isImage);
                });
            },
            openPicker() {
                this.isOpen = true;
                this.$nextTick(() => {
                    window.dispatchEvent(new CustomEvent('open-media-picker', { 
                        detail: { fieldId: '{{ $getId() }}' } 
                    }));
                });
            },
            selectMedia(path) {
                this.state = path;
            },
            removeMedia() {
                this.state = null;
            },
            get resolvedState() {
                const val = this.state;
                if (val === null || val === undefined) return '';
                if (typeof val === 'string') return val;
                if (Array.isArray(val)) {
                    const first = val[0];
                    return typeof first === 'string' ? first : (first ? String(first) : '');
                }
                if (typeof val === 'object') {
                    if (typeof val.path === 'string') return val.path;
                    if (typeof val.url === 'string') return val.url;
                    const values = Object.values(val);
                    if (values.length > 0) {
                        const first = values[0];
                        return typeof first === 'string' ? first : (first ? String(first) : '');
                    }
                }
                return String(val);
            },
            get isImage() {
                const path = this.resolvedState;
                if (!path) return false;
                const ext = path.split('.').pop().toLowerCase();
                return ['jpg', 'jpeg', 'png', 'gif', 'webp', 'avif', 'svg'].includes(ext);
            },
            get fileName() {
                const path = this.resolvedState;
                if (!path) return '';
                return path.split('/').pop();
            },
            get fileUrl() {
                const path = this.resolvedState;
                if (!path) return '';
                if (path.includes('://')) return path;
                return path.startsWith('/') ? path : '/' + path;
            }
        }"
        x-on:media-selected.window="
            if ($event.detail.fieldId === '{{ $getId() }}') { 
                selectMedia($event.detail.path); 
                isOpen = false; 
            }
        "
        class="relative w-full"
    >
        <div class="flex flex-col gap-3">
            <!-- Preview Area -->
            <div 
                x-on:click="openPicker()"
                class="relative group rounded-xl overflow-hidden bg-slate-50 border-2 border-dashed border-slate-300 cursor-pointer hover:border-primary-500 hover:bg-slate-100 transition-all w-full max-w-sm flex items-center justify-center min-h-[120px]"
            >
                <!-- Has State (Selected) -->
                <div x-show="resolvedState" class="w-full flex items-center justify-center p-3">
                    <!-- Image Preview -->
                    <div x-show="isImage" class="flex items-center justify-center w-full">
                        <img 
                            :src="fileUrl" 
                            class="max-h-[180px] w-auto object-contain rounded-lg shadow-sm border border-slate-100 bg-white"
                        >
                    </div>
                    <!-- Non-Image File Preview -->
                    <div x-show="!isImage" class="flex flex-col items-center gap-2 text-slate-500 p-4 rounded-lg w-full">
                        <svg class="w-10 h-10 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"></path></svg>
                        <span class="text-xs font-medium truncate w-full text-center" x-text="fileName"></span>
                    </div>

                    <!-- Hover Overlay to Replace -->
                    <div class="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]">
                        <span class="bg-white px-4 py-2 rounded-full text-xs font-bold text-slate-900 shadow-xl flex items-center gap-2">
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"></path></svg>
                            Replace Media
                        </span>
                    </div>
                </div>
                
                <!-- No State (Empty) -->
                <div x-show="!resolvedState" class="flex flex-col items-center gap-2 text-slate-400 p-4">
                    <div class="p-2.5 bg-white rounded-full shadow-sm group-hover:shadow group-hover:-translate-y-0.5 transition-all">
                        <svg class="w-5 h-5 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path></svg>
                    </div>
                    <span class="text-sm font-semibold text-slate-600">Select Media</span>
                    <span class="text-xs text-slate-400">Click to browse</span>
                </div>
            </div>

            <div class="flex items-center justify-between max-w-sm" x-show="resolvedState">
                <span class="text-xs font-medium text-slate-500 truncate pr-4" x-text="fileName"></span>
                <button type="button" x-on:click="removeMedia()" class="text-xs font-semibold text-red-500 hover:text-red-700 bg-red-50 hover:bg-red-100 px-2 py-1 rounded transition-colors">Remove</button>
            </div>
        </div>

        <!-- Modal -->
        <template x-teleport="body">
            <div 
                x-show="isOpen" 
                class="fixed inset-0 flex items-center justify-center p-4 sm:p-8"
                style="position: fixed !important; z-index: 1000000 !important;"
                x-cloak
            >
                <div class="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity" 
                     x-show="isOpen" 
                     x-transition:enter="ease-out duration-300"
                     x-transition:enter-start="opacity-0"
                     x-transition:enter-end="opacity-100"
                     x-transition:leave="ease-in duration-200"
                     x-transition:leave-start="opacity-100"
                     x-transition:leave-end="opacity-0"
                     x-on:click="isOpen = false"></div>
                
                <div 
                    x-show="isOpen"
                    x-transition:enter="ease-out duration-300"
                    x-transition:enter-start="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                    x-transition:enter-end="opacity-100 translate-y-0 sm:scale-100"
                    x-transition:leave="ease-in duration-200"
                    x-transition:leave-start="opacity-100 translate-y-0 sm:scale-100"
                    x-transition:leave-end="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                    class="relative bg-white rounded-2xl shadow-2xl w-full max-w-6xl h-[85vh] flex flex-col overflow-hidden border border-slate-200"
                >
                    <!-- Header -->
                    <div class="px-6 py-4 border-b border-slate-200 flex justify-between items-center bg-white shrink-0">
                        <h3 class="text-lg font-bold text-slate-800 flex items-center gap-2">
                            <svg class="w-5 h-5 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                            Media Library
                        </h3>
                        <button x-on:click="isOpen = false" class="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-colors">
                            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                        </button>
                    </div>
                    
                    <!-- Content -->
                    <div class="flex-1 overflow-hidden bg-slate-50/50">
                        <div id="media-picker-mount-{{ $getId() }}" class="w-full h-full">
                            <!-- React will mount here -->
                        </div>
                    </div>
                </div>
            </div>
        </template>
    </div>
</x-dynamic-component>

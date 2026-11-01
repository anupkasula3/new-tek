<x-filament-panels::page>
    <div x-data="{ showDeleteModal: false, mediaToDeleteId: null, mediaToDeleteName: '' }">
        {{-- ─── Upload + Search Bar ─── --}}
        <div style="display:flex; flex-wrap:wrap; align-items:center; justify-content:space-between; gap:16px; margin-bottom:24px;">
            {{-- Upload Button --}}
            <div x-data="{ dragging: false, uploading: false }"
                 x-on:dragover.prevent="dragging = true"
                 x-on:dragleave.prevent="dragging = false"
                 x-on:drop.prevent="
                     dragging = false;
                     $refs.fileInput.files = $event.dataTransfer.files;
                     $refs.fileInput.dispatchEvent(new Event('change', { bubbles: true }));
                 "
                 x-on:livewire-upload-start="uploading = true"
                 x-on:livewire-upload-finish="uploading = false"
                 x-on:livewire-upload-error="uploading = false"
                 style="position:relative;"
            >
                <label
                    x-show="!uploading"
                    :style="dragging ? 'border-color:#6366f1; background:#eef2ff;' : ''"
                    style="display:flex; align-items:center; gap:12px; padding:12px 20px; border:2px dashed #d1d5db; border-radius:12px; cursor:pointer; transition:all .2s; background:#fff;"
                    onmouseover="this.style.borderColor='#818cf8'"
                    onmouseout="this.style.borderColor='#d1d5db'"
                >
                    <div style="display:flex; align-items:center; justify-content:center; width:40px; height:40px; border-radius:8px; background:#eef2ff;">
                        <svg style="width:20px; height:20px; color:#4f46e5;" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                        </svg>
                    </div>
                    <div>
                        <span style="display:block; font-size:14px; font-weight:600; color:#374151;">Upload Files</span>
                        <span style="display:block; font-size:12px; color:#9ca3af;">or drag & drop here</span>
                    </div>
                    <input
                        x-ref="fileInput"
                        type="file"
                        wire:model="uploads"
                        multiple
                        accept="image/*,.pdf,.doc,.docx,.xls,.xlsx,.zip,.txt"
                        style="position:absolute; width:1px; height:1px; overflow:hidden; clip:rect(0,0,0,0);"
                    />
                </label>

                {{-- Upload Progress --}}
                <div x-show="uploading" x-cloak style="display:flex; align-items:center; gap:12px; padding:12px 20px; border:2px solid #c7d2fe; border-radius:12px; background:#eef2ff;">
                    <div style="display:flex; align-items:center; gap:8px; font-size:14px; color:#4f46e5; font-weight:500;">
                        <svg style="width:16px; height:16px; animation:spin 1s linear infinite;" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle style="opacity:0.25;" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                            <path style="opacity:0.75;" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                        </svg>
                        Uploading…
                    </div>
                </div>
            </div>

            {{-- Search --}}
            <div style="position:relative; width:320px; max-width:100%;">
                <svg style="position:absolute; left:12px; top:50%; transform:translateY(-50%); width:16px; height:16px; color:#9ca3af;" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                </svg>
                <input
                    wire:model.live.debounce.300ms="search"
                    type="text"
                    placeholder="Search media…"
                    style="width:100%; padding:10px 16px 10px 36px; font-size:14px; border-radius:12px; border:1px solid #d1d5db; background:#fff; color:#111827; outline:none; transition:border .2s;"
                    onfocus="this.style.borderColor='#6366f1'"
                    onblur="this.style.borderColor='#d1d5db'"
                />
            </div>
        </div>

        {{-- ─── Main Content: Grid + Detail Panel ─── --}}
        <div style="display:flex; gap:24px; height:calc(100vh - 280px);">

            {{-- Media Grid --}}
            <div style="flex:1; overflow-y:auto; padding-right:4px;" class="custom-scrollbar">
                @php $mediaItems = $this->media; @endphp

                @if($mediaItems->isEmpty())
                    <div style="display:flex; flex-direction:column; align-items:center; justify-content:center; height:100%; color:#9ca3af; gap:16px;">
                        <svg style="width:64px; height:64px; opacity:0.4;" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0 0 22.5 18.75V5.25A2.25 2.25 0 0 0 20.25 3H3.75A2.25 2.25 0 0 0 1.5 5.25v13.5A2.25 2.25 0 0 0 3.75 21Z" />
                        </svg>
                        <div style="text-align:center;">
                            <p style="font-size:18px; font-weight:600;">No media found</p>
                            <p style="font-size:14px; margin-top:4px;">Upload some files to get started</p>
                        </div>
                    </div>
                @else
                    <div style="display:grid; grid-template-columns:repeat(auto-fill, minmax(150px, 1fr)); gap:12px;">
                        @foreach($mediaItems as $item)
                            <div
                                wire:click="selectMedia({{ $item->id }})"
                                wire:key="media-{{ $item->id }}"
                                style="position:relative; border-radius:12px; overflow:hidden; cursor:pointer; aspect-ratio:1/1; border:2px solid {{ $selectedMediaId === $item->id ? '#6366f1' : 'transparent' }}; {{ $selectedMediaId === $item->id ? 'box-shadow:0 0 0 3px rgba(99,102,241,0.3); ' : '' }}transition:all .2s;"
                                class="media-grid-item"
                            >
                                @if(str_starts_with($item->mime_type, 'image/'))
                                    <img
                                        src="{{ $item->url }}"
                                        alt="{{ $item->alt ?: $item->original_name }}"
                                        style="width:100%; height:100%; object-fit:cover; background:#f3f4f6;"
                                        loading="lazy"
                                    />
                                @else
                                    <div style="width:100%; height:100%; display:flex; flex-direction:column; align-items:center; justify-content:center; background:#f3f4f6; padding:20px; gap:10px;">
                                        <svg width="48" height="48" style="width:48px; height:48px; color:#9ca3af; display:block;" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1" stroke="currentColor">
                                            <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                                        </svg>
                                        <span style="font-size:10px; font-family:monospace; color:#6b7280; text-align:center; word-break:break-all; line-height:1.2;">
                                            {{ Str::limit($item->original_name, 25) }}
                                        </span>
                                    </div>
                                @endif

                                {{-- Hover overlay --}}
                                <div class="media-overlay" style="position:absolute; inset:0; background:transparent; transition:background .2s; display:flex; align-items:flex-end;">
                                    <div class="media-name-bar" style="width:100%; padding:6px 8px; background:linear-gradient(to top, rgba(0,0,0,0.7), transparent); opacity:0; transition:opacity .2s;">
                                        <p style="color:#fff; font-size:10px; font-weight:500; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">{{ $item->original_name }}</p>
                                    </div>
                                </div>

                                {{-- Selected checkmark --}}
                                @if($selectedMediaId === $item->id)
                                    <div style="position:absolute; top:8px; right:8px; width:24px; height:24px; background:#6366f1; border-radius:50%; display:flex; align-items:center; justify-content:center; box-shadow:0 2px 4px rgba(0,0,0,0.2);">
                                        <svg style="width:14px; height:14px; color:#fff;" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                            <path fill-rule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clip-rule="evenodd" />
                                        </svg>
                                    </div>
                                @endif
                            </div>
                        @endforeach
                    </div>

                    {{-- Pagination --}}
                    <div style="margin-top:24px;">
                        @if($mediaItems->hasPages())
                            <div style="padding: 12px 20px; background: white; border-radius: 16px; border: 1px solid #e5e7eb; display: flex; align-items: center; justify-content: space-between; box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.05);">
                                <div style="font-size: 13px; color: #6b7280; font-weight: 500;">
                                    Showing <span style="font-weight: 700; color: #111827;">{{ $mediaItems->firstItem() }}</span> to <span style="font-weight: 700; color: #111827;">{{ $mediaItems->lastItem() }}</span> of <span style="font-weight: 700; color: #111827;">{{ $mediaItems->total() }}</span> results
                                </div>
                                
                                <div style="display: flex; align-items: center; gap: 6px;">
                                    @if ($mediaItems->onFirstPage())
                                        <span style="padding: 8px 14px; border-radius: 10px; background: #f9fafb; color: #d1d5db; font-size: 13px; font-weight: 600; cursor: not-allowed; border: 1px solid #f3f4f6;">Previous</span>
                                    @else
                                        <button wire:click="previousPage" style="padding: 8px 14px; border-radius: 10px; background: white; border: 1px solid #e5e7eb; color: #374151; font-size: 13px; font-weight: 600; cursor: pointer; transition: all 0.2s;" onmouseover="this.style.background='#f9fafb'; this.style.borderColor='#d1d5db'" onmouseout="this.style.background='white'; this.style.borderColor='#e5e7eb'">Previous</button>
                                    @endif

                                    <div style="display: flex; gap: 4px; margin: 0 8px;">
                                        @foreach ($mediaItems->getUrlRange(max(1, $mediaItems->currentPage() - 2), min($mediaItems->lastPage(), $mediaItems->currentPage() + 2)) as $page => $url)
                                            <button wire:click="gotoPage({{ $page }})" 
                                                    style="width: 36px; height: 36px; display: flex; align-items: center; justify-content: center; border-radius: 10px; font-size: 13px; font-weight: 700; cursor: pointer; transition: all 0.2s; 
                                                           {{ $page == $mediaItems->currentPage() ? 'background: #6366f1; color: white; border: none; box-shadow: 0 4px 12px rgba(99, 102, 241, 0.3);' : 'background: white; border: 1px solid #e5e7eb; color: #4b5563;' }}"
                                                    @if($page != $mediaItems->currentPage()) onmouseover="this.style.borderColor='#6366f1'; this.style.color='#6366f1'" onmouseout="this.style.borderColor='#e5e7eb'; this.style.color='#4b5563'" @endif>
                                                {{ $page }}
                                            </button>
                                        @endforeach
                                    </div>

                                    @if ($mediaItems->hasMorePages())
                                        <button wire:click="nextPage" style="padding: 8px 14px; border-radius: 10px; background: white; border: 1px solid #e5e7eb; color: #374151; font-size: 13px; font-weight: 600; cursor: pointer; transition: all 0.2s;" onmouseover="this.style.background='#f9fafb'; this.style.borderColor='#d1d5db'" onmouseout="this.style.background='white'; this.style.borderColor='#e5e7eb'">Next</button>
                                    @else
                                        <span style="padding: 8px 14px; border-radius: 10px; background: #f9fafb; color: #d1d5db; font-size: 13px; font-weight: 600; cursor: not-allowed; border: 1px solid #f3f4f6;">Next</span>
                                    @endif
                                </div>
                            </div>
                        @endif
                    </div>
                @endif
            </div>

            {{-- Detail Sidebar --}}
            @if($selectedMediaId && $this->selectedMedia)
                @php $sel = $this->selectedMedia; @endphp
                <div style="width:340px; flex-shrink:0; background:#fff; border-radius:16px; border:1px solid #e5e7eb; box-shadow:0 4px 20px rgba(0,0,0,0.08); overflow-y:auto;">
                    {{-- Preview --}}
                    <div style="position:relative; background:#f3f4f6; display:flex; align-items:center; justify-content:center; min-height:200px; max-height:280px;">
                        @if(str_starts_with($sel->mime_type, 'image/'))
                            <img src="{{ $sel->url }}" alt="{{ $sel->alt }}" style="max-width:100%; max-height:280px; object-fit:contain;" />
                        @else
                            <div style="display:flex; flex-direction:column; align-items:center; gap:12px; padding:48px;">
                                <svg width="80" height="80" style="width:80px; height:80px; color:#9ca3af; display:block;" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                                </svg>
                                <span style="font-size:14px; font-family:monospace; color:#6b7280;">{{ strtoupper(pathinfo($sel->filename, PATHINFO_EXTENSION)) }}</span>
                            </div>
                        @endif

                        {{-- Close button --}}
                        <button wire:click="closeDetails" style="position:absolute; top:12px; right:12px; width:32px; height:32px; background:rgba(255,255,255,0.9); border-radius:50%; display:flex; align-items:center; justify-content:center; border:none; cursor:pointer; box-shadow:0 1px 3px rgba(0,0,0,0.1); transition:background .2s;">
                            <svg style="width:16px; height:16px; color:#4b5563;" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    {{-- Info --}}
                    <div style="padding:20px; display:flex; flex-direction:column; gap:16px;">
                        <h3 style="font-weight:700; color:#111827; font-size:14px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;" title="{{ $sel->original_name }}">
                            {{ $sel->original_name }}
                        </h3>

                        <div style="display:grid; grid-template-columns:1fr 1fr; gap:12px; font-size:12px;">
                            <div>
                                <span style="display:block; color:#9ca3af; font-weight:600; text-transform:uppercase; letter-spacing:0.05em; margin-bottom:2px; font-size:10px;">Type</span>
                                <span style="color:#374151;">{{ $sel->mime_type }}</span>
                            </div>
                            <div>
                                <span style="display:block; color:#9ca3af; font-weight:600; text-transform:uppercase; letter-spacing:0.05em; margin-bottom:2px; font-size:10px;">Size</span>
                                <span style="color:#374151;">{{ $this->formatFileSize($sel->size) }}</span>
                            </div>
                            @if($sel->width && $sel->height)
                            <div>
                                <span style="display:block; color:#9ca3af; font-weight:600; text-transform:uppercase; letter-spacing:0.05em; margin-bottom:2px; font-size:10px;">Dimensions</span>
                                <span style="color:#374151;">{{ $sel->width }} × {{ $sel->height }}</span>
                            </div>
                            @endif
                            <div>
                                <span style="display:block; color:#9ca3af; font-weight:600; text-transform:uppercase; letter-spacing:0.05em; margin-bottom:2px; font-size:10px;">Uploaded</span>
                                <span style="color:#374151;">{{ $sel->created_at->format('M j, Y') }}</span>
                            </div>
                        </div>

                        <hr style="border:0; border-top:1px solid #e5e7eb;">

                        {{-- URL Field --}}
                        <div>
                            <label style="display:block; font-size:10px; font-weight:600; color:#6b7280; text-transform:uppercase; letter-spacing:0.05em; margin-bottom:6px;">File URL</label>
                            <div style="display:flex; align-items:center; gap:8px;">
                                <input
                                    type="text"
                                    value="{{ $sel->url }}"
                                    readonly
                                    style="flex:1; font-size:11px; padding:8px 12px; border-radius:8px; border:1px solid #e5e7eb; background:#f9fafb; color:#6b7280; font-family:monospace; outline:none;"
                                />
                                <button
                                    x-data
                                    x-on:click="navigator.clipboard.writeText('{{ $sel->url }}'); $el.innerText='✓'; setTimeout(() => $el.innerText='Copy', 1500)"
                                    style="padding:8px 12px; font-size:12px; font-weight:600; background:#f3f4f6; border:1px solid #e5e7eb; border-radius:8px; cursor:pointer; transition:background .2s; color:#374151;"
                                >Copy</button>
                            </div>
                        </div>

                        {{-- Editable Fields --}}
                        <div>
                            <label style="display:block; font-size:10px; font-weight:600; color:#6b7280; text-transform:uppercase; letter-spacing:0.05em; margin-bottom:6px;">Title</label>
                            <input
                                wire:model.defer="editTitle"
                                type="text"
                                style="width:100%; font-size:14px; padding:8px 12px; border-radius:8px; border:1px solid #d1d5db; background:#fff; color:#111827; outline:none; transition:border .2s;"
                                onfocus="this.style.borderColor='#6366f1'"
                                onblur="this.style.borderColor='#d1d5db'"
                            />
                        </div>

                        <div>
                            <label style="display:block; font-size:10px; font-weight:600; color:#6b7280; text-transform:uppercase; letter-spacing:0.05em; margin-bottom:6px;">Alt Text</label>
                            <textarea
                                wire:model.defer="editAlt"
                                rows="2"
                                style="width:100%; font-size:14px; padding:8px 12px; border-radius:8px; border:1px solid #d1d5db; background:#fff; color:#111827; outline:none; transition:border .2s; resize:none;"
                                onfocus="this.style.borderColor='#6366f1'"
                                onblur="this.style.borderColor='#d1d5db'"
                            ></textarea>
                        </div>

                        {{-- Actions --}}
                        <div style="display:flex; align-items:center; gap:12px; padding-top:8px;">
                            <button
                                wire:click="saveMediaDetails"
                                style="flex:1; padding:10px 16px; background:#4f46e5; color:#fff; font-size:14px; font-weight:600; border-radius:12px; border:none; cursor:pointer; transition:background .2s; box-shadow:0 1px 3px rgba(79,70,229,0.3);"
                                onmouseover="this.style.background='#4338ca'"
                                onmouseout="this.style.background='#4f46e5'"
                            >
                                Save Changes
                            </button>
                            <button
                                @click="mediaToDeleteId = {{ $sel->id }}; mediaToDeleteName = '{{ addslashes($sel->original_name) }}'; showDeleteModal = true"
                                style="padding:10px 16px; background:#fef2f2; color:#dc2626; font-size:14px; font-weight:600; border-radius:12px; border:none; cursor:pointer; transition:background .2s;"
                                onmouseover="this.style.background='#fee2e2'"
                                onmouseout="this.style.background='#fef2f2'"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            @endif
        </div>

        {{-- Delete Confirmation Modal --}}
        <template x-teleport="body">
            <div x-show="showDeleteModal" 
                 x-transition:enter="transition ease-out duration-300"
                 x-transition:enter-start="opacity-0"
                 x-transition:enter-end="opacity-100"
                 x-transition:leave="transition ease-in duration-200"
                 x-transition:leave-start="opacity-100"
                 x-transition:leave-end="opacity-0"
                 style="position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; z-index: 100000; background: rgba(0,0,0,0.5); backdrop-filter: blur(8px);"
                 x-cloak>
                
                <div x-show="showDeleteModal"
                     x-transition:enter="transition ease-out duration-300"
                     x-transition:enter-start="opacity-0 scale-95"
                     x-transition:enter-end="opacity-100 scale-100"
                     x-transition:leave="transition ease-in duration-200"
                     x-transition:leave-start="opacity-100 scale-100"
                     x-transition:leave-end="opacity-0 scale-95"
                     style="background: white; border-radius: 24px; width: 100%; max-width: 420px; padding: 40px; text-align: center; box-shadow: 0 25px 50px -12px rgba(0,0,0,0.25); border: 1px solid rgba(0,0,0,0.1); position: relative; top: 50%; left: 50%; transform: translate(-50%, -50%);"
                     @click.away="showDeleteModal = false">
                    
                    <div style="width: 80px; height: 80px; background: #fef2f2; color: #dc2626; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 24px auto; animation: bounce-short 1.5s ease-in-out infinite;">
                        <svg style="width: 40px; height: 40px;" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                        </svg>
                    </div>

                    <h2 style="font-size: 26px; font-weight: 900; color: #111827; margin-bottom: 8px;">Delete this media?</h2>
                    
                    <div style="margin-bottom: 24px;">
                        <div style="font-size: 15px; font-weight: 700; color: #374151; word-break: break-all;" x-text="mediaToDeleteName"></div>
                    </div>

                    <p style="font-size: 14px; color: #6b7280; margin-bottom: 32px; line-height: 1.6;">
                        This media will be permanently removed. This action <span style="font-weight: 800; color: #dc2626; text-decoration: underline;">cannot</span> be undone.
                    </p>

                    <div style="display: flex; gap: 12px; margin-top: 10px;">
                        <button @click="showDeleteModal = false" 
                                style="flex: 1; padding: 14px; border-radius: 12px; font-weight: 700; color: #4b5563; background: #f3f4f6; border: none; cursor: pointer; transition: all 0.2s;"
                                onmouseover="this.style.background='#e5e7eb'"
                                onmouseout="this.style.background='#f3f4f6'">
                            No, Cancel
                        </button>
                        <button @click="$wire.deleteMedia(mediaToDeleteId); showDeleteModal = false" 
                                style="flex: 1; padding: 14px; border-radius: 12px; font-weight: 700; color: white; background: #dc2626; border: none; cursor: pointer; transition: all 0.2s; box-shadow: 0 4px 12px rgba(220, 38, 38, 0.25);"
                                onmouseover="this.style.background='#b91c1c'; this.style.transform='translateY(-1px)'"
                                onmouseout="this.style.background='#dc2626'; this.style.transform='translateY(0)'">
                            Yes, Delete
                        </button>
                    </div>
                </div>
            </div>
        </template>
    </div>

    <style>
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #d1d5db; border-radius: 3px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #9ca3af; }
        
        .media-grid-item:hover { transform: translateY(-2px); border-color: #c7d2fe !important; box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05); }
        .media-grid-item:hover .media-overlay { background: rgba(0,0,0,0.25) !important; }
        .media-grid-item:hover .media-name-bar { opacity: 1 !important; }
        
        /* Fix for massive SVGs */
        .media-grid-item svg { max-width: 100%; max-height: 100%; display: block; }
        
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes bounce-short {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-8px); }
        }
        
        .animate-bounce-short { animation: bounce-short 1.5s ease-in-out infinite; }
        [x-cloak] { display: none !important; }
        
        /* Smooth transitions */
        .media-grid-item { transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); }
    </style>
</x-filament-panels::page>

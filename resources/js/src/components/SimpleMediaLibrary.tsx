import React, { useState, useEffect, useRef, useCallback } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    UploadCloud, X, Search, Image as ImageIcon, FileText, 
    Video, Clock, Check, Loader2, Trash2, ExternalLink, Copy, CheckCircle2
} from 'lucide-react';

import BASE_URL from '../global';

const ORIGIN = BASE_URL;

// Local axios instance that always targets the current server's /api
const api = axios.create({
    baseURL: ORIGIN + '/api',
    headers: { Accept: 'application/json' },
});

interface MediaItem {
    id: number; filename: string; original_name: string;
    path: string; url: string; mime_type: string;
    size: number; width: number | null; height: number | null;
    title: string | null; alt: string | null; created_at: string;
}
interface Props { fieldId: string; }
type View = 'library' | 'upload';

const fmtBytes = (b: number) => b < 1048576 ? (b / 1024).toFixed(0) + ' KB' : (b / 1048576).toFixed(1) + ' MB';
const fmtDate  = (d: string) => new Date(d).toLocaleDateString('en-US', { year:'numeric', month:'short', day:'numeric' });

const getMediaUrl = (item: MediaItem) => {
    if (item.path) {
        return `${ORIGIN}/${item.path.replace(/^\//, '')}`;
    }
    // Fallback: replace the host part of the stored URL with current origin
    try {
        const u = new URL(item.url);
        return ORIGIN + u.pathname;
    } catch {
        return item.url;
    }
};

function Thumb({ item }: { item: MediaItem }) {
    if (item.mime_type.startsWith('image/'))
        return <img src={getMediaUrl(item)} alt={item.alt||''} className="w-full h-full object-cover block" />;
    
    if (item.mime_type.startsWith('video/')) {
        return (
            <div className="w-full h-full bg-slate-800 flex flex-col items-center justify-center p-2">
                <Video className="text-white w-8 h-8 mb-2 opacity-80" />
                <span className="text-white/70 text-[10px] text-center break-all line-clamp-2 leading-tight">
                    {item.original_name}
                </span>
            </div>
        );
    }
    
    const ext = item.original_name.split('.').pop()?.toUpperCase() || 'FILE';
    return (
        <div className="w-full h-full bg-slate-100 flex flex-col items-center justify-center p-2 border border-slate-200">
            <FileText className="text-slate-400 w-8 h-8 mb-1" />
            <span className="text-slate-500 font-bold text-xs">{ext}</span>
            <span className="text-slate-400 text-[9px] mt-1 text-center break-all line-clamp-1 leading-tight">
                {item.original_name}
            </span>
        </div>
    );
}

export default function SimpleMediaLibrary({ fieldId }: Props) {
    const [view, setView] = useState<View>('library');
    const [items, setItems] = useState<MediaItem[]>([]);
    
    // Pagination & Loading state
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    
    // Filters & Search
    const [search, setSearch] = useState('');
    const [typeFilter, setTypeFilter] = useState('');
    
    // Upload state
    const [uploading, setUploading] = useState(false);
    const [drag, setDrag] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    
    const [selId, setSelId] = useState<number|null>(null);
    const [toast, setToast] = useState('');
    const fileRef = useRef<HTMLInputElement>(null);
    const observerRef = useRef<IntersectionObserver | null>(null);
    const loadMoreRef = useRef<HTMLDivElement>(null);

    const flash = (msg: string) => { setToast(msg); setTimeout(()=>setToast(''), 3000); };

    const load = useCallback(async (pageNum: number, reset = false) => {
        if (loading || (!hasMore && !reset)) return;
        setLoading(true);
        try {
            const r = await api.get('/media', { 
                params: { 
                    search: search || undefined, 
                    type: typeFilter || undefined,
                    page: pageNum,
                    per_page: 30 
                } 
            });
            const newItems = r.data.data ?? [];
            setItems(prev => reset ? newItems : [...prev, ...newItems]);
            setHasMore(pageNum < r.data.last_page);
            setPage(pageNum);
        } catch { 
            flash('⚠ Could not load media.'); 
        } finally { 
            setLoading(false); 
        }
    }, [search, typeFilter, loading, hasMore]);

    // Initial load and filter changes
    useEffect(() => {
        setHasMore(true);
        setPage(1);
        load(1, true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [search, typeFilter]);

    // Infinite scroll observer
    useEffect(() => {
        if (loading || !hasMore) return;
        
        observerRef.current = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting && hasMore && !loading) {
                load(page + 1, false);
            }
        }, { threshold: 0.1 });
        
        if (loadMoreRef.current) observerRef.current.observe(loadMoreRef.current);
        
        return () => {
            if (observerRef.current) observerRef.current.disconnect();
        };
    }, [loading, hasMore, page, load]);

    const upload = async (files: FileList|null) => {
        if (!files?.length) return;
        setUploading(true);
        setUploadProgress(0);
        
        let successCount = 0;
        for (let i=0; i<files.length; i++) {
            const fd = new FormData();
            fd.append('file', files[i]);
            try { 
                await api.post('/media', fd, {
                    onUploadProgress: (p) => {
                        const percentCompleted = Math.round(((i + (p.loaded / (p.total||1))) / files.length) * 100);
                        setUploadProgress(percentCompleted);
                    }
                }); 
                successCount++;
            } catch { 
                flash(`✗ Failed: ${files[i].name}`); 
            }
        }
        
        if (successCount > 0) {
            flash(`✓ ${successCount} file(s) uploaded`);
            setPage(1);
            setHasMore(true);
            await load(1, true); // Refresh list
        }
        
        setUploading(false);
        setUploadProgress(0);
        setView('library');
        if (fileRef.current) fileRef.current.value = '';
    };

    const del = async (id: number) => {
        if (!confirm('Delete this file permanently?')) return;
        try { 
            await api.delete(`/media/${id}`); 
            if (selId===id) setSelId(null); 
            flash('✓ Deleted'); 
            setItems(items.filter(i => i.id !== id));
        } catch { flash('✗ Delete failed'); }
    };

    const save = async () => {
        if (!sel) return;
        try { 
            await api.put(`/media/${sel.id}`, { title: sel.title, alt: sel.alt }); 
            flash('✓ Saved'); 
        } catch { flash('✗ Save failed'); }
    };

    const pick = (item: MediaItem) => {
        window.dispatchEvent(new CustomEvent('media-selected', { detail: { path: item.path, url: getMediaUrl(item), fieldId } }));
    };

    const sel = items.find(i=>i.id===selId) ?? null;

    return (
        <div className="flex flex-col h-full font-sans text-sm text-slate-800 bg-white sm:rounded-xl overflow-hidden">
            
            {/* Toast */}
            <AnimatePresence>
                {toast && (
                    <motion.div 
                        initial={{ opacity: 0, y: -20, x: '-50%' }}
                        animate={{ opacity: 1, y: 0, x: '-50%' }}
                        exit={{ opacity: 0, y: -20, x: '-50%' }}
                        className="fixed top-6 left-1/2 z-50 bg-slate-800 text-white px-5 py-2.5 rounded-lg shadow-lg flex items-center gap-2 text-sm font-medium"
                    >
                        {toast.startsWith('✓') && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                        {toast.replace(/^[✓✗] /, '')}
                    </motion.div>
                )}
            </AnimatePresence>

            <input ref={fileRef} type="file" multiple accept="image/*,video/*,application/pdf,.doc,.docx,.xls,.xlsx,.zip,.txt" className="hidden" onChange={e=>upload(e.target.files)} />

            {/* Header Tabs */}
            <div className="flex items-center px-6 border-b border-slate-200 bg-slate-50/50 shrink-0">
                <button 
                    onClick={()=>setView('upload')}
                    className={`py-4 px-2 mr-6 text-sm font-medium border-b-2 transition-colors ${view==='upload' ? 'border-primary-500 text-primary-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
                >
                    Upload Files
                </button>
                <button 
                    onClick={()=>setView('library')}
                    className={`py-4 px-2 text-sm font-medium border-b-2 transition-colors ${view==='library' ? 'border-primary-500 text-primary-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
                >
                    Media Library
                </button>
            </div>

            {/* Body */}
            <div className="flex flex-1 overflow-hidden relative bg-white">
                
                {/* UPLOAD VIEW */}
                <AnimatePresence>
                    {view === 'upload' && (
                        <motion.div 
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            className="absolute inset-0 flex flex-col p-8 bg-slate-50/50 z-10"
                        >
                            <div
                                onDragOver={e=>{e.preventDefault();setDrag(true);}}
                                onDragLeave={()=>setDrag(false)}
                                onDrop={e=>{e.preventDefault();setDrag(false);upload(e.dataTransfer.files);}}
                                className={`flex-1 flex flex-col items-center justify-center border-2 border-dashed rounded-2xl transition-all duration-200 ${drag ? 'border-primary-500 bg-primary-50' : 'border-slate-300 bg-white hover:border-primary-400 hover:bg-slate-50'}`}
                            >
                                <div className="p-4 bg-primary-100 rounded-full mb-4 text-primary-600">
                                    <UploadCloud className="w-10 h-10" />
                                </div>
                                <h3 className="text-xl font-semibold text-slate-700 mb-2">Drag and drop files here</h3>
                                <p className="text-slate-500 mb-6">or click to browse from your computer</p>
                                
                                <button 
                                    onClick={()=>fileRef.current?.click()} 
                                    disabled={uploading} 
                                    className="px-6 py-2.5 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 hover:text-primary-600 hover:border-primary-300 font-medium rounded-lg shadow-sm transition-all disabled:opacity-50"
                                >
                                    Select Files
                                </button>
                                <p className="text-xs text-slate-400 mt-6">Maximum upload size: 20 MB</p>
                                
                                {uploading && (
                                    <div className="w-64 mt-8">
                                        <div className="flex justify-between text-xs text-primary-600 font-medium mb-2">
                                            <span>Uploading...</span>
                                            <span>{uploadProgress}%</span>
                                        </div>
                                        <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                                            <motion.div 
                                                className="h-full bg-primary-500 rounded-full"
                                                initial={{ width: 0 }}
                                                animate={{ width: `${uploadProgress}%` }}
                                                transition={{ ease: "linear" }}
                                            />
                                        </div>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* LIBRARY VIEW */}
                <AnimatePresence>
                    {view === 'library' && (
                        <motion.div 
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            className="absolute inset-0 flex flex-col z-0"
                        >
                            {/* Toolbar */}
                            <div className="flex items-center justify-between p-4 border-b border-slate-100 shrink-0 bg-white">
                                <div className="flex items-center gap-3">
                                    <select 
                                        className="text-sm border border-slate-200 rounded-lg px-3 py-1.5 bg-slate-50 text-slate-700 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
                                        value={typeFilter}
                                        onChange={e => setTypeFilter(e.target.value)}
                                    >
                                        <option value="">All media items</option>
                                        <option value="image/">Images</option>
                                        <option value="video/">Videos</option>
                                        <option value="application/">Documents</option>
                                    </select>
                                    
                                    <select 
                                        className="text-sm border border-slate-200 rounded-lg px-3 py-1.5 bg-slate-50 text-slate-700 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
                                    >
                                        <option value="recent">Recent uploads</option>
                                    </select>
                                </div>
                                
                                <div className="relative">
                                    <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                                    <input 
                                        type="text" 
                                        placeholder="Search media..." 
                                        value={search} 
                                        onChange={e => setSearch(e.target.value)}
                                        className="pl-9 pr-4 py-1.5 text-sm border border-slate-200 rounded-lg bg-slate-50 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 w-64 transition-all" 
                                    />
                                </div>
                            </div>

                            {/* Main Layout (Grid + Sidebar) */}
                            <div className="flex flex-1 overflow-hidden relative">
                                
                                {/* Grid */}
                                <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
                                    {items.length === 0 && !loading ? (
                                        <div className="h-full flex flex-col items-center justify-center text-slate-400 space-y-4">
                                            <div className="p-4 bg-slate-50 rounded-full"><ImageIcon className="w-12 h-12 text-slate-300" /></div>
                                            <p className="text-base text-slate-500">No media found.</p>
                                        </div>
                                    ) : (
                                        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-8 gap-3">
                                            {items.map(item => {
                                                const active = selId === item.id;
                                                return (
                                                    <motion.div 
                                                        layoutId={`media-${item.id}`}
                                                        key={item.id} 
                                                        title={item.original_name}
                                                        onClick={() => setSelId(active ? null : item.id)}
                                                        onDoubleClick={() => fieldId !== 'standalone' && pick(item)}
                                                        className={`group relative aspect-square rounded-xl overflow-hidden cursor-pointer bg-slate-100 transition-all ${active ? 'ring-4 ring-primary-500 shadow-md ring-offset-2' : 'hover:ring-2 hover:ring-primary-300 hover:shadow-sm'}`}
                                                    >
                                                        <Thumb item={item} />
                                                        
                                                        {/* Checkmark overlay */}
                                                        {active && (
                                                            <div className="absolute top-2 right-2 bg-primary-500 text-white p-1 rounded-full shadow-sm z-10">
                                                                <Check className="w-3 h-3 stroke-[3]" />
                                                            </div>
                                                        )}
                                                        
                                                        {/* Hover overlay for picking */}
                                                        {!active && fieldId !== 'standalone' && (
                                                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                                <span className="bg-white text-slate-900 text-xs font-bold px-3 py-1.5 rounded-full shadow-lg">Select</span>
                                                            </div>
                                                        )}
                                                    </motion.div>
                                                );
                                            })}
                                        </div>
                                    )}
                                    
                                    {/* Infinite Scroll Loader */}
                                    {hasMore && (
                                        <div ref={loadMoreRef} className="py-8 flex justify-center">
                                            {loading && <Loader2 className="w-6 h-6 text-slate-400 animate-spin" />}
                                        </div>
                                    )}
                                </div>

                                {/* Sidebar */}
                                <AnimatePresence>
                                    {sel && (
                                        <motion.div 
                                            initial={{ x: 320, opacity: 0 }}
                                            animate={{ x: 0, opacity: 1 }}
                                            exit={{ x: 320, opacity: 0 }}
                                            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                                            className="w-[320px] bg-slate-50 border-l border-slate-200 flex flex-col shrink-0 absolute right-0 top-0 bottom-0 shadow-[-10px_0_30px_rgba(0,0,0,0.05)] z-20"
                                        >
                                            <div className="flex items-center justify-between p-4 border-b border-slate-200 bg-white">
                                                <h3 className="font-semibold text-slate-800">Attachment Details</h3>
                                                <button onClick={() => setSelId(null)} className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors">
                                                    <X className="w-5 h-5" />
                                                </button>
                                            </div>

                                            <div className="flex-1 overflow-y-auto p-5 space-y-6 custom-scrollbar">
                                                
                                                {/* Preview */}
                                                <div className="bg-slate-200 rounded-xl aspect-video overflow-hidden relative border border-slate-200/60 shadow-inner">
                                                    <Thumb item={sel} />
                                                    <a href={getMediaUrl(sel)} target="_blank" rel="noreferrer" className="absolute top-2 right-2 p-1.5 bg-black/50 hover:bg-black/70 text-white rounded-lg backdrop-blur-sm transition-colors">
                                                        <ExternalLink className="w-4 h-4" />
                                                    </a>
                                                </div>

                                                {/* Meta Info */}
                                                <div className="space-y-1.5 text-sm text-slate-600">
                                                    <div className="font-medium text-slate-900 break-all">{sel.original_name}</div>
                                                    <div className="flex items-center gap-2 text-xs">
                                                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                                                        {fmtDate(sel.created_at)}
                                                    </div>
                                                    <div className="text-xs text-slate-500">
                                                        {fmtBytes(sel.size)} {sel.width ? `· ${sel.width} × ${sel.height} px` : ''}
                                                    </div>
                                                </div>

                                                <hr className="border-slate-200" />

                                                {/* Form Fields */}
                                                <div className="space-y-4">
                                                    <div className="space-y-1.5">
                                                        <label className="text-xs font-semibold text-slate-700">Alt Text</label>
                                                        <textarea 
                                                            rows={2} 
                                                            className="w-full text-sm p-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 bg-white transition-all resize-none"
                                                            value={sel.alt || ''} 
                                                            onChange={e => setItems(items.map(i => i.id === sel.id ? { ...i, alt: e.target.value } : i))} 
                                                        />
                                                    </div>

                                                    <div className="space-y-1.5">
                                                        <label className="text-xs font-semibold text-slate-700">Title</label>
                                                        <input 
                                                            type="text" 
                                                            className="w-full text-sm p-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 bg-white transition-all"
                                                            value={sel.title || ''} 
                                                            onChange={e => setItems(items.map(i => i.id === sel.id ? { ...i, title: e.target.value } : i))} 
                                                        />
                                                    </div>
                                                    
                                                    <div className="space-y-1.5">
                                                        <div className="flex items-center justify-between">
                                                            <label className="text-xs font-semibold text-slate-700">File URL</label>
                                                            <button 
                                                                onClick={() => { navigator.clipboard.writeText(getMediaUrl(sel)); flash('✓ Copied!'); }} 
                                                                className="text-xs text-primary-600 hover:text-primary-700 font-medium flex items-center gap-1"
                                                            >
                                                                <Copy className="w-3 h-3" /> Copy URL
                                                            </button>
                                                        </div>
                                                        <input 
                                                            readOnly 
                                                            type="text" 
                                                            className="w-full text-xs p-2 border border-slate-200 rounded-md bg-slate-100 text-slate-500 cursor-text"
                                                            value={getMediaUrl(sel)} 
                                                            onClick={e => (e.target as HTMLInputElement).select()} 
                                                        />
                                                    </div>
                                                </div>

                                                <div className="flex flex-col gap-2 pt-2">
                                                    <button onClick={save} className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-medium rounded-lg shadow-sm transition-colors text-sm">
                                                        Save Changes
                                                    </button>
                                                    <button onClick={() => del(sel.id)} className="w-full py-2 flex items-center justify-center gap-1.5 text-red-600 hover:bg-red-50 text-sm font-medium rounded-lg transition-colors">
                                                        <Trash2 className="w-4 h-4" /> Delete permanently
                                                    </button>
                                                </div>
                                            </div>

                                            {/* Action Button */}
                                            {fieldId !== 'standalone' && (
                                                <div className="p-4 border-t border-slate-200 bg-white shrink-0 shadow-[0_-10px_20px_rgba(0,0,0,0.02)]">
                                                    <button 
                                                        onClick={() => pick(sel)} 
                                                        className="w-full py-2.5 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg shadow-sm transition-colors text-sm"
                                                    >
                                                        Insert Into Field
                                                    </button>
                                                </div>
                                            )}
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                                
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
            
            <style dangerouslySetInnerHTML={{__html: `
                .custom-scrollbar::-webkit-scrollbar { width: 6px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #94a3b8; }
            `}} />
        </div>
    );
}

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Search, MapPin, Calendar, Loader2 } from 'lucide-react';
import { Button } from './ui/Button';
import { fetchData } from '../axiosHook';
import BASE_URL from '../global';

interface SearchOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SearchOverlay({ isOpen, onClose }: SearchOverlayProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  // Debounced live search
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
        if (searchQuery.trim().length >= 2) {
            handleSearch();
        } else if (searchQuery.trim() === '') {
            setResults([]);
            setHasSearched(false);
        }
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  const handleSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!searchQuery.trim()) return;

    setLoading(true);
    setHasSearched(true);
    try {
      const data = await fetchData('/search?q=' + encodeURIComponent(searchQuery));
      setResults(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 overflow-y-auto"
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-gray-900/95 backdrop-blur-md"
            onClick={onClose}
          />

          {/* Content */}
          <div className="relative min-h-screen flex flex-col">
            {/* Close Button */}
            <div className="absolute top-6 right-6 z-10">
              <button
                onClick={onClose}
                className="p-3 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors"
                aria-label="Close search"
              >
                <X size={24} />
              </button>
            </div>

            {/* Search Form */}
            <div className="flex-shrink-0 pt-24 pb-12">
              <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="text-center mb-8"
                >
                  <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
                    Find Your Perfect Trip
                  </h2>
                  <p className="text-gray-300 text-lg">
                    Search through our collection of Himalayan adventures
                  </p>
                </motion.div>

                <motion.form
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  onSubmit={handleSearch}
                  className="bg-white rounded-2xl shadow-2xl p-8 md:p-12"
                >
                  {/* Search Input with Underline */}
                  <div className="mb-0">
                    <div className="relative">
                      <Search
                        className="absolute left-0 top-1/2 -translate-y-1/2 text-gray-400"
                        size={28}
                      />
                      <input
                        type="text"
                        placeholder="Search trips by name, location, or difficulty..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-12 pr-12 py-4 border-0 border-b-2 border-gray-300 focus:outline-none focus:border-[#0066FF] text-xl bg-transparent transition-colors placeholder:text-gray-400"
                        autoFocus
                      />
                      {loading && (
                          <Loader2 className="absolute right-0 top-1/2 -translate-y-1/2 text-[#0066FF] animate-spin" size={24} />
                      )}
                    </div>
                  </div>
                </motion.form>
              </div>
            </div>

            {/* Results */}
            <AnimatePresence>
              {hasSearched && !loading && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  transition={{ delay: 0.1 }}
                  className="flex-1 bg-white"
                >
                  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    <div className="mb-8">
                      <h3 className="text-2xl font-bold text-gray-900 mb-2">
                        Search Results
                      </h3>
                      <p className="text-gray-600">
                        Found {results.length} {results.length === 1 ? 'trip' : 'trips'}
                        {searchQuery && ` matching "${searchQuery}"`}
                      </p>
                    </div>

                    {results.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {results.map((trip, index) => (
                          <motion.a
                            key={trip.id}
                            href={`/${trip.slug}`}
                            onClick={onClose}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                            className="group bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all border border-gray-200 block"
                          >
                            <div className="relative h-48 overflow-hidden">
                              <img
                                src={trip.banner_image ? `${BASE_URL}/${trip.banner_image}` : "https://images.unsplash.com/photo-1544735716-392fe2489ffa?q=80"}
                                alt={trip.title}
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                              />
                              {trip.difficulty && (
                                <div className="absolute top-3 right-3 bg-white px-3 py-1 rounded-full text-xs font-semibold text-gray-800">
                                  {trip.difficulty}
                                </div>
                              )}
                            </div>
                            <div className="p-5">
                              <h4 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-[#0066FF] transition-colors line-clamp-1">
                                {trip.title}
                              </h4>
                              <div className="flex items-center gap-4 text-sm text-gray-600 mb-4 pb-4 border-b border-gray-100">
                                {trip.country && (
                                  <span className="flex items-center gap-1.5 shrink-0">
                                    <MapPin size={14} className="text-gray-400" />
                                    {trip.country}
                                  </span>
                                )}
                                {trip.duration_days && (
                                  <span className="flex items-center gap-1.5 shrink-0">
                                    <Calendar size={14} className="text-gray-400" />
                                    {trip.duration_days}
                                  </span>
                                )}
                              </div>
                              <div className="flex items-center justify-between">
                                <span className="text-xl font-bold text-gray-900">
                                  ${trip.price}
                                </span>
                                <span className="text-[#0066FF] font-medium text-sm flex items-center gap-1">
                                  View Details <span className="group-hover:translate-x-1 transition-transform">→</span>
                                </span>
                              </div>
                            </div>
                          </motion.a>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-16">
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                          <Search size={32} className="text-gray-400" />
                        </div>
                        <h4 className="text-xl font-bold text-gray-900 mb-2">
                          No trips found
                        </h4>
                        <p className="text-gray-600">
                          Try searching with different keywords
                        </p>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
import React from 'react';
import { motion } from 'framer-motion';
import { SectionHeading } from './ui/SectionHeading';
import BASE_URL from '../global';

export function WelcomeSection({ data, loading, error }: { data: any; loading: boolean; error: boolean }) {
    if (loading) return null;
    if (error || !data || !data.content_blocks || data.content_blocks.length === 0) return null;

    return (
        <section className="py-20  bg-white relative ">
      
            {data?.content_blocks &&
                data.content_blocks.map((block: any, index: number) => {
                    const hasImage = !!block?.image;

                    if (hasImage) {
                        // 2-column layout: text left, image right
                        return (
                            <div
                                key={index}
                                className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10 mb-20 last:mb-0"
                            >
                                <div className="flex flex-col-reverse md:flex-row items-start gap-10 md:gap-16">
                                    {/* Left: Text */}
                                    <motion.div
                                        initial={{ opacity: 0, x: -30 }}
                                        whileInView={{ opacity: 1, x: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ duration: 0.6 }}
                                        className="flex-1 text-left"
                                    >
                                        <SectionHeading
                                            title={block?.title}
                                            subtitle={block?.subtitle}
                                            centered={false}
                                        />
                                        <div
                                            className="prose prose-lg text-gray-600 leading-relaxed mt-4"
                                            dangerouslySetInnerHTML={{ __html: block?.content }}
                                        />
                                    </motion.div>

                                    {/* Right: Image — sticky */}
                                    <motion.div
                                        initial={{ opacity: 0, x: 30 }}
                                        whileInView={{ opacity: 1, x: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ duration: 0.6, delay: 0.15 }}
                                        className="flex-1 w-full md:sticky md:top-28"
                                    >
                                        <img
                                            src={`${BASE_URL}/${block.image}`}
                                            alt={block?.title ?? 'Section image'}
                                            className="w-full h-auto max-h-[500px] object-cover rounded-2xl shadow-xl"
                                        />
                                    </motion.div>
                                </div>
                            </div>
                        );
                    }

                    // Full-width centered layout (no image)
                    return (
                        <div
                            key={index}
                            className="max-w-4xl mx-auto px-4 sm:px-6 relative z-10 text-center mb-20 last:mb-0"
                        >
                            <SectionHeading title={block?.title} subtitle={block?.subtitle} />
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6, delay: 0.2 }}
                                className="prose prose-lg mx-auto text-gray-600 leading-relaxed"
                            >
                                <div dangerouslySetInnerHTML={{ __html: block?.content }} />
                            </motion.div>
                        </div>
                    );
                })}
        </section>
    );
}
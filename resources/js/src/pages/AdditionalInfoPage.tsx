import React, { useEffect, useState } from 'react';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { Button } from '../components/ui/Button';
import { motion } from 'framer-motion';
import { BookOpen, Mountain } from 'lucide-react';
import { useParams } from 'react-router-dom';
import { fetchData } from '../axiosHook';
import { Seo } from '../components/Seo';
import Loading from '../components/Loading';
import NotFound from '../components/NotFound';

export function AdditionalInfoPage() {
  const { slug } = useParams();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const fetchAdditionalInfoData = async () => {
    try {
      const res = await fetchData("/additional-info/" + slug);

      if (res) {
        setData(res);
      } else {
        setData(null);
      }
    } catch (err) {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdditionalInfoData();
  }, [slug]);

  // Function to transform raw HTML content (wrapping images in figures with captions, responsive tables/videos etc.)
  const transformBlogContent = (html: string) => {
    if (!html) return "";
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");
    
    const youtubeRegex = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})(?:\S+)?/;
    const vimeoRegex = /(?:https?:\/\/)?(?:www\.)?(?:vimeo\.com\/|player\.vimeo\.com\/video\/)(\d+)/;

    // 1. Scan for plain URLs in text
    const allElements = doc.querySelectorAll('p, div, span, strong, em');
    allElements.forEach(el => {
        if (el.children.length === 0) {
            const text = el.textContent?.trim() || "";
            const ytMatch = text.match(youtubeRegex);
            const vimeoMatch = text.match(vimeoRegex);

            if (ytMatch || vimeoMatch) {
                const videoSrc = ytMatch 
                    ? `https://www.youtube.com/embed/${ytMatch[1]}` 
                    : `https://player.vimeo.com/video/${vimeoMatch![1]}`;

                const container = doc.createElement("div");
                container.className = "aspect-video w-full mb-12 rounded-2xl overflow-hidden shadow-xl bg-black";
                container.innerHTML = `<iframe src="${videoSrc}" class="w-full h-full border-0" allowfullscreen allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"></iframe>`;
                
                el.parentNode?.replaceChild(container, el);
            }
        }
    });

    // 2. Transform Images
    const images = doc.querySelectorAll("img");
    images.forEach((img) => {
        const existingFigure = img.closest("figure");
        const captionText = img.getAttribute("alt");
        
        if (existingFigure) {
            existingFigure.className = "mb-12 rounded-2xl overflow-hidden shadow-xl";
            img.className = "w-full h-auto";
            
            let existingCaption = existingFigure.querySelector("figcaption");
            
            if (!existingCaption && captionText && captionText.trim() !== "") {
                const figcaption = doc.createElement("figcaption");
                figcaption.className = "bg-gray-50 px-6 py-4 text-sm text-gray-600 italic";
                figcaption.textContent = captionText;
                existingFigure.appendChild(figcaption);
            } else if (existingCaption) {
                existingCaption.className = "bg-gray-50 px-6 py-4 text-sm text-gray-600 italic";
            }
        } else {
            const figure = doc.createElement("figure");
            figure.className = "mb-12 rounded-2xl overflow-hidden shadow-xl";
            
            const newImg = img.cloneNode(true) as HTMLImageElement;
            newImg.className = "w-full h-auto";
            
            figure.appendChild(newImg);

            if (captionText && captionText.trim() !== "") {
                const figcaption = doc.createElement("figcaption");
                figcaption.className = "bg-gray-50 px-6 py-4 text-sm text-gray-600 italic";
                figcaption.textContent = captionText;
                figure.appendChild(figcaption);
            }
            
            img.parentNode?.replaceChild(figure, img);
        }
    });

    // 3. Transform Iframes
    const iframes = doc.querySelectorAll("iframe");
    iframes.forEach((iframe) => {
        if (iframe.closest(".aspect-video")) return;

        const container = doc.createElement("div");
        container.className = "aspect-video w-full mb-12 rounded-2xl overflow-hidden shadow-xl bg-black";
        
        const newIframe = iframe.cloneNode(true) as HTMLIFrameElement;
        newIframe.className = "w-full h-full border-0";
        newIframe.removeAttribute("width");
        newIframe.removeAttribute("height");
        
        if (!newIframe.getAttribute("allow")) {
            newIframe.setAttribute("allow", "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture");
        }
        newIframe.setAttribute("allowfullscreen", "true");
        
        container.appendChild(newIframe);
        iframe.parentNode?.replaceChild(container, iframe);
    });

    // 4. Transform Tables
    const tables = doc.querySelectorAll("table");
    tables.forEach((table) => {
        if (table.closest(".overflow-x-auto")) return;

        const wrapper = doc.createElement("div");
        wrapper.className = "overflow-x-auto rounded-xl border border-gray-200 shadow-sm mb-12";
        
        table.className = "w-full border-collapse bg-white";
        
        const thead = table.querySelector("thead");
        if (thead) {
            thead.className = "bg-gradient-to-r from-[#0066FF] to-[#06B6D4] text-white";
            const headerCells = thead.querySelectorAll("th, td");
            headerCells.forEach(cell => {
                cell.className = "px-6 py-4 text-left font-semibold text-sm uppercase tracking-wider whitespace-nowrap";
            });
        }

        const tbody = table.querySelector("tbody");
        if (tbody) {
            tbody.className = "divide-y divide-gray-200";
            const rows = tbody.querySelectorAll("tr");
            rows.forEach((tr, index) => {
                tr.className = index % 2 === 0 ? "bg-white hover:bg-gray-50 transition-colors" : "bg-gray-50 hover:bg-gray-100 transition-colors";
                const cells = tr.querySelectorAll("td");
                cells.forEach((cell, cellIndex) => {
                    const baseClass = "px-6 py-4 text-sm leading-relaxed";
                    cell.className = cellIndex === 0 
                        ? `${baseClass} font-medium text-gray-900` 
                        : `${baseClass} text-gray-700`;

                    const badges = cell.querySelectorAll("span");
                    badges.forEach(badge => {
                        const text = badge.textContent?.toLowerCase() || "";
                        let badgeClass = "px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wide";
                        
                        if (text.includes("essential")) {
                            badgeClass += " bg-red-100 text-red-800";
                        } else if (text.includes("recommended")) {
                            badgeClass += " bg-orange-100 text-orange-800";
                        } else {
                            badgeClass += " bg-blue-100 text-blue-800";
                        }
                        badge.className = badgeClass;
                    });
                });
            });
        }

        table.parentNode?.replaceChild(wrapper, table);
        wrapper.appendChild(table);
    });

    return doc.body.innerHTML;
  };

  if (loading) {
    return <Loading />;
  }

  if (error || !data) {
    return <NotFound message="Additional Information Not Found" />;
  }

  return (
    <div className="min-h-screen bg-white font-sans text-gray-900">
      <Seo
          seoMeta={data?.seo_meta}
          fallbackTitle={data?.title}
          fallbackDescription={data?.subtitle}
          fallbackImage={data?.cover_image}
          canonicalPath={`/additional-info/${slug}`}
          type="Article"
      />
      <Navbar />

      {/* Hero Section */}
      <div className="relative h-[60vh] min-h-[500px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/80 z-10" />
          <img 
            src={data.cover_image ? `/${data.cover_image}` : "https://images.unsplash.com/photo-1533130061792-649d45df8c2d?q=80&w=1978&auto=format&fit=crop"} 
            alt={data.title} 
            className="w-full h-full object-cover" 
          />
        </div>

        <div className="relative z-20 text-center px-4 max-w-4xl mx-auto mt-16">
          <motion.div 
            initial={{ opacity: 0, y: 30 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.8 }} 
            className="flex justify-center mb-6"
          >
            <div className="w-16 h-16 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center">
              {data.icon ? (
                 <img src={`/${data.icon}`} alt="" className="w-8 h-8 object-contain" />
              ) : (
                 <BookOpen className="text-white" size={32} />
              )}
            </div>
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.8, delay: 0.2 }} 
            className="text-4xl md:text-6xl font-bold text-white mb-4"
          >
            {data.title}
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.8, delay: 0.4 }} 
            className="text-xl text-gray-200 max-w-2xl mx-auto"
          >
            {data.subtitle}
          </motion.p>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Quick Facts */}
        {data.quick_facts && data.quick_facts.length > 0 && (
          <section className="mb-20">
            <motion.div 
              initial={{ opacity: 0, y: 20 }} 
              whileInView={{ opacity: 1, y: 0 }} 
              viewport={{ once: true }} 
              className="bg-gradient-to-r from-[#0066FF] to-[#06B6D4] rounded-2xl p-8 md:p-12"
            >
              <h2 className="text-3xl font-bold text-white mb-8 text-center">
                Quick Facts
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
                {(data.quick_facts || []).map((fact: any, index: number) => (
                  <motion.div 
                    key={index} 
                    initial={{ opacity: 0, scale: 0.9 }} 
                    whileInView={{ opacity: 1, scale: 1 }} 
                    viewport={{ once: true }} 
                    transition={{ delay: index * 0.1 }} 
                    className="text-center"
                  >
                    <p className="text-blue-100 text-sm mb-2">{fact.label}</p>
                    <p className="text-white text-lg font-bold">{fact.fact || fact.value}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </section>
        )}

        {/* Overview (Blog-like post layout) */}
        <section className="mb-20">
          <div className="max-w-4xl mx-auto">
            <motion.div 
              initial={{ opacity: 0, y: 20 }} 
              whileInView={{ opacity: 1, y: 0 }} 
              viewport={{ once: true }}
            >
              <h2 className="text-4xl font-bold text-gray-900 mb-6 text-center">
                {data.heading || 'Overview'}
              </h2>
              {data.subheading && (
                <p className="text-xl text-gray-600 text-center mb-8">{data.subheading}</p>
              )}
              <div 
                className="prose prose-lg max-w-none text-gray-700 prose-img:rounded-2xl prose-img:shadow-xl prose-headings:text-gray-900 prose-a:text-[#0066FF] hover:prose-a:text-[#06B6D4] pb-10"
                dangerouslySetInnerHTML={{ __html: transformBlogContent(data.description || '') }}
              />
            </motion.div>
          </div>
        </section>

        {/* Expert Tips */}
        {data.expert_tips && data.expert_tips.length > 0 && (
          <section className="mb-20">
            {(data.expert_tips || []).map((tip: any, index: number) => (
               <motion.div 
                 key={index} 
                 initial={{ opacity: 0, y: 20 }} 
                 whileInView={{ opacity: 1, y: 0 }} 
                 viewport={{ once: true }} 
                 className="bg-gradient-to-br from-blue-50 to-cyan-50 border-l-4 border-[#0066FF] rounded-r-2xl p-8 mb-8"
               >
                 <div className="flex items-start gap-4">
                   <div className="w-12 h-12 bg-[#0066FF] rounded-full flex items-center justify-center shrink-0 overflow-hidden">
                     {tip.icon ? (
                       <img src={`/${tip.icon}`} alt="" className="w-full h-full object-cover" />
                     ) : (
                       <img 
                          src={typeof document !== 'undefined' ? (document.querySelector("link[rel*='icon']")?.getAttribute('href') || '/favicon.ico') : '/favicon.ico'} 
                          alt="Favicon" 
                          className="w-6 h-6 object-contain filter invert brightness-0" 
                        />
                     )}
                   </div>
                   <div>
                     <h3 className="text-xl font-bold text-gray-900 mb-3">
                       {tip.title}
                     </h3>
                     <div className="text-gray-700 leading-relaxed mb-4 prose" dangerouslySetInnerHTML={{ __html: tip.content || '' }} />
                     <p className="text-gray-900 font-semibold">
                       {tip.guide}
                     </p>
                   </div>
                 </div>
               </motion.div>
            ))}
          </section>
        )}

        {/* CTA */}
        <section className="bg-gradient-to-r from-[#0066FF] to-[#06B6D4] rounded-2xl p-12 text-center text-white">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
             Ready to Explore {data?.title || 'the Himalayas'}?
          </h2>
          <p className="text-blue-100 text-lg mb-8 max-w-2xl mx-auto">
            Now that you have the complete guide for {data?.title || 'this destination'}, let our expert team help you
            plan your adventure. We'll handle all the logistics so you can focus
            on the experience.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="primary" size="lg" className="bg-white text-[#0066FF] hover:bg-gray-100 border-none">
              Book Your Trek
            </Button>
            <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-[#0066FF]">
              Contact Our Team
            </Button>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

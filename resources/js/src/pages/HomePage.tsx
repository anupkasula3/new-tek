import { BlogMasonry } from "../components/BlogMasonry";
import { DestinationsSection } from "../components/DestinationsSection";
import { Footer } from "../components/Footer";
import { Seo } from "../components/Seo";
import { HeroSection } from "../components/HeroSection";
import { Navbar } from "../components/Navbar";
import React,{ useEffect, useState} from "react";
import { ReviewsSection } from "../components/ReviewsSection";
import { TripsGrid } from "../components/TripsGrid";
import { TripsSection } from "../components/TripsSection";
import { WelcomeSection } from "../components/WelcomeSection";
import { WhyChooseUs } from "../components/WhyChooseUs";
import { fetchData } from "../axiosHook";
import { PopularTripsSection } from "../components/PopularTripsSection";
import { BestSellingTripsSection } from "../components/BestSellingTripsSection";
import StatsSection from "../components/StatsSection";
import TeamSection from "../components/TeamSection";
import AdvantageSection from "../components/AdvantageSection";
import LegalDocumentsSection from "../components/LegalDocumentsSection";
import CredentialsSection from "../components/CredentialsSection";
import { ContactSection } from "../components/ContactSection";
function HomeSkeleton() {
    return (
        <div className="min-h-screen bg-white">
            <Navbar />
            <main>
                {/* Hero Skeleton */}
                <div className="dc-skeleton dc-skeleton-hero" />
                
                {/* Popular Trips Skeleton */}
                <section className="dc-skeleton-section max-w-7xl mx-auto px-4">
                    <div className="flex flex-col items-center mb-12">
                        <div className="dc-skeleton dc-skeleton-title w-64" />
                        <div className="dc-skeleton dc-skeleton-text w-96" />
                    </div>
                    <div className="dc-skeleton-grid">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="dc-skeleton dc-skeleton-trip-card" />
                        ))}
                    </div>
                </section>

                {/* Destinations Skeleton */}
                <section className="dc-skeleton-section bg-gray-50">
                    <div className="max-w-7xl mx-auto px-4">
                        <div className="dc-skeleton dc-skeleton-title w-48 mb-8" />
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                            {[1, 2, 3, 4].map(i => (
                                <div key={i} className="dc-skeleton h-64 rounded-xl" />
                            ))}
                        </div>
                    </div>
                </section>
            </main>
        </div>
    );
}

export function HomePage() {
      const [data, setData] = useState<any>(null);
      const [allReviews, setAllReviews] = useState<any[]>([]);
      const [loading, setLoading] = useState(true);
      const [error, setError] = useState(false);


        const fetchHomepageData = async () => {
          try {
              const [res, reviewsRes] = await Promise.all([
                  fetchData("/page/homepage"),
                  fetchData<any[]>("/components/reviews").catch(() => null),
              ]);
             if (res) {
                  setData(res);
              } else {
                  console.warn("Homepage data is empty");
                  setData(null);
              }
              if (reviewsRes) {
                  setAllReviews(reviewsRes);
              }
          } catch (err) {
              console.error("Error fetching homepage data:", err);
              setError(true);
          } finally {
              setLoading(false);
          }
      };
  
      useEffect(() => {
          fetchHomepageData();
      }, []);

    if (loading) return <HomeSkeleton />;

    return (
        <div className="min-h-screen bg-white font-sans text-gray-900">
            <Seo
                seoMeta={data?.seo_meta}
                fallbackTitle="Explore the Best Treks in Nepal"
                fallbackDescription="Discover the beauty of Nepal with HimalayanTrekking. Explore top trekking destinations, guided tours, and unforgettable experiences in the Himalayas."
                fallbackKeywords="Nepal trekking, Himalayan treks, Everest Base Camp, Annapurna Circuit, trekking tours, guided treks, adventure travel Nepal"
                canonicalPath="/"
                type="WebSite"
                reviews={allReviews}
            />
            <Navbar />
            <main>
                {data && <HeroSection  data={data} error={error} loading={loading} />}
                <BestSellingTripsSection />
                {data && <WelcomeSection data={data} error={error} loading={loading} />}
                <PopularTripsSection />
                {data && data?.additional_sections?.includes("stats") && <StatsSection />}
                {data && data?.additional_sections?.includes("advantage") && <AdvantageSection />}
                <DestinationsSection />
                {data && data?.additional_sections?.map((section: string) => {
                    switch (section) {
                        case "team":
                            return <TeamSection key="team" />;
                        case "why_choose_us":
                            return <WhyChooseUs key="why_choose_us" />;
                        case "review":
                            return <ReviewsSection key="review" />;
                        case "credential":
                            return <CredentialsSection key="credential" />;
                        case "legal_info":
                            return <LegalDocumentsSection key="legal_info" />;
                        case "contact":
                            return <ContactSection key="contact" />;
                        default:
                            return null;
                    }
                })}
               <BlogMasonry />
            </main>
            <Footer />
        </div>
    );
}

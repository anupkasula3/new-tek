import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";
import { fetchData } from "../axiosHook";
import { Seo } from "../components/Seo";
import Loading from "../components/Loading";
import NotFound from "../components/NotFound";

// Reuse HomePage components
import { HeroSection } from "../components/HeroSection";
import { WelcomeSection } from "../components/WelcomeSection";
import StatsSection from "../components/StatsSection";
import AdvantageSection from "../components/AdvantageSection";
import { PopularTripsSection } from "../components/PopularTripsSection";
import { DestinationsSection } from "../components/DestinationsSection";
import TeamSection from "../components/TeamSection";
import { WhyChooseUs } from "../components/WhyChooseUs";
import { ReviewsSection } from "../components/ReviewsSection";
import CredentialsSection from "../components/CredentialsSection";
import LegalDocumentsSection from "../components/LegalDocumentsSection";
import { ContactSection } from "../components/ContactSection";
import { BlogMasonry } from "../components/BlogMasonry";

export function PlaceDetailPage() {
    const { slug } = useParams();
    const [place, setPlace] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [selectedProducts, setSelectedProducts] = useState<any[]>([]);

    useEffect(() => {
        setLoading(true);
        setError(false);
        fetchData(`/places/${slug}`)
            .then((res: any) => {
                if (res) {
                    setPlace(res);
                } else {
                    setError(true);
                }
            })
            .catch(() => {
                setError(true);
            })
            .finally(() => {
                setLoading(false);
            });
    }, [slug]);

    // Fetch linked packages specifically when place data changes
    useEffect(() => {
        if (!place) return;
        
        const fetchLinkedProducts = async () => {
            try {
                if (place?.content?.related_product_ids && Array.isArray(place.content.related_product_ids) && place.content.related_product_ids.length > 0) {
                    const res: any = await fetchData("/all-packages");
                    const allPackages = Array.isArray(res) ? res : (res.data || []);
                    const productIds = place.content.related_product_ids.map((id: any) => String(id));
                    const linked = allPackages.filter((p: any) => productIds.includes(String(p.id)));
                    setSelectedProducts(linked);
                } else {
                    setSelectedProducts([]);
                }
            } catch (err) {
                console.error("Linked products fetch failed:", err);
                setSelectedProducts([]);
            }
        };

        fetchLinkedProducts();
    }, [place]);

    if (loading) {
        return <Loading />;
    }

    if (error || !place) {
        return <NotFound message="Place Not Found" />;
    }

    // Map place attributes into structured data shape expected by HomePage sections:
    const dataForHomepageSections = {
        banner_image: place.featured_image,
        title: place.title,
        top_title: place.location,
        subtitle: place.tags, // Can show tags as subtitle
        content_blocks: [
            {
                title: "About " + place.title,
                content: place.overview,
            }
        ],
        additional_sections: place.additional_sections || [],
    };

    return (
        <div className="min-h-screen bg-white font-sans text-gray-900">
            <Seo
                seoMeta={place.seo_meta}
                fallbackTitle={`${place.title} - Explore`}
                fallbackDescription={place.overview ? String(place.overview).replace(/<[^>]*>/g, '').slice(0, 160) : undefined}
                fallbackImage={place.featured_image}
                canonicalPath={`/places/${place.slug}`}
                type="Place"
            />
            <Navbar />
            <main>
                <HeroSection data={dataForHomepageSections} error={error} loading={loading} />
                <WelcomeSection data={dataForHomepageSections} error={error} loading={loading} />
            
                {/* Popular trips / related packages linked specifically to this place */}
                <PopularTripsSection 
                    initialTrips={selectedProducts} 
                    title="Recommended Packages" 
                    subtitle={`Explore the best trekking and tour itineraries for ${place.title}.`}
                />
                
               
            </main>
            <Footer />
        </div>
    );
}

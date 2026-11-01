import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import { AboutPage } from "./pages/AboutPage";
import { ActivitiesPage } from "./pages/ActivitiesPage";
import { AltitudeSicknessPage } from "./pages/AltitudeSicknessPage";
import { BlogPostPage } from "./pages/BlogPostPage";
import { BlogSlugPage } from "./pages/BlogSlugPage";
import { BlogListPage } from "./pages/BlogListPage";
import { RelatedGuidesListPage } from "./pages/RelatedGuidesListPage";
import { RelatedGuideDetailPage } from "./pages/RelatedGuideDetailPage";
import { ChoosingAgencyPage } from "./pages/ChoosingAgencyPage";
import { ContactPage } from "./pages/ContactPage";
import { DestinationNepalPage } from "./pages/DestinationNepalPage";
import { DestinationSlugPage } from "./pages/DestinationSlugPage";
import { EverestBaseCampPage } from "./pages/EverestBaseCampPage";
import { EverestRegionTreksPage } from "./pages/EverestRegionTreksPage";
import { GuidePage } from "./pages/GuidePage";
import { AdditionalInfoPage } from "./pages/AdditionalInfoPage";
import { HelmetProvider } from "react-helmet-async";
import { HomePage } from "./pages/HomePage";
import { LegalDocumentsPage } from "./pages/LegalDocumentsPage";
import { NepalVisaPage } from "./pages/NepalVisaPage";
import { PackingListPage } from "./pages/PackingListPage";
import { PhotographyTipsPage } from "./pages/PhotographyTipsPage";
import { PlanTripPage } from "./pages/PlanTripPage";
import { PostTrekRecoveryPage } from "./pages/PostTrekRecoveryPage";
import { PrivacyPolicyPage } from "./pages/PrivacyPolicyPage";
import { SitemapPage } from "./pages/SitemapPage";
import { SpiritualJourneysPage } from "./pages/SpiritualJourneysPage";
import { SubDestinationSlugPage } from "./pages/SubDestinationSlugPage";
import { TermsOfUsePage } from "./pages/TermsOfUsePage";
import { ProductSlugPage } from "./pages/ProductSlugPage";
import { WhyChooseUsPage } from "./pages/WhyChooseUsPage";
import { ExperiencePage } from "./pages/ExperiencePage";
import { PageSection } from "./pages/PageSection";
import { TrekPage } from "./pages/TrekPage";
import { BookingSuccessPage } from "./pages/BookingSuccessPage";
import { BookingFailurePage } from "./pages/BookingFailurePage";
import { ContactSuccessPage } from "./pages/ContactSuccessPage";
import { TripPlanSuccessPage } from "./pages/TripPlanSuccessPage";
import { InvoicePage } from "./pages/InvoicePage";
import { NotFoundPage } from "./pages/NotFoundPage";
import { DepartureCalendarPage } from "./pages/DepartureCalendarPage";
import { DepartureBookingPage } from "./pages/DepartureBookingPage";
import { PackageBookingPage } from "./pages/PackageBookingPage";
import { DepartureAdminPage } from "./pages/DepartureAdminPage";
import ScrollToTop from "./components/ScrollToTop";
import PageTransitionLoader from "./components/PageTransitionLoader";
import { CertificateViewPage } from "./pages/CertificateViewPage";
import TeamCertificatesSection from "./components/TeamCertificatesSection";
import { TeamMemberCertificatesPage } from "./pages/TeamMemberCertificatesPage";
import { ReviewsPage } from "./pages/ReviewsPage";
import { WishlistPage } from "./pages/WishlistPage";
import { PlaceDetailPage } from "./pages/PlaceDetailPage";
import { AuthorSlugPage } from "./pages/AuthorSlugPage";

import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { fetchData } from "./axiosHook";

/** Fires gtag page_view on every client-side route change (SPA navigation). */
function RouteTracker() {
    const location = useLocation();
    useEffect(() => {
        if (typeof (window as any).gtag === 'function') {
            (window as any).gtag('config', 'AW-18352751866', {
                page_path: location.pathname + location.search,
            });
            (window as any).gtag('config', 'G-XPGNMJZ9LP', {
                page_path: location.pathname + location.search,
            });
        }
    }, [location]);
    return null;
}

export function App() {
    useEffect(() => {
        fetchData<any>("/global/settings")
            .then((settings) => {
                if (settings && settings.favicon_url) {
                    let link: HTMLLinkElement | null = document.querySelector("link[rel*='icon']");
                    if (!link) {
                        link = document.createElement('link');
                        link.rel = 'icon';
                        document.getElementsByTagName('head')[0].appendChild(link);
                    }
                    link.href = settings.favicon_url;
                }
            })
            .catch((err) => console.error("Error setting favicon from API:", err));
    }, []);

    return (
        <HelmetProvider>
            <BrowserRouter>
                <RouteTracker />
                <ScrollToTop />
                <PageTransitionLoader />
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    {/* <Route path="/about" element={<AboutPage />} /> */}
                    <Route path="/booking/success" element={<BookingSuccessPage />} />
                    <Route path="/booking/failed" element={<BookingFailurePage />} />
                    <Route path="/contact/success" element={<ContactSuccessPage />} />
                    <Route path="/plan-trip/success" element={<TripPlanSuccessPage />} />
                    <Route path="/invoice/:orderNo" element={<InvoicePage />} />
                    <Route path="/blog" element={<BlogListPage />} />
                    <Route path="/blog/:slug" element={<BlogSlugPage />} />
                    <Route path="/author/:slug" element={<AuthorSlugPage />} />
                    <Route path="/related-guides" element={<RelatedGuidesListPage />} />
                    <Route path="/related-guides/:slug" element={<RelatedGuideDetailPage />} />
                    <Route path="/destination/:slug" element={<DestinationSlugPage />} />
                    <Route path="/places/:slug" element={<PlaceDetailPage />} />
                    <Route path="/:destinationSlug/:slug" element={<SubDestinationSlugPage pageType={'sub-destination'} />} />
                    <Route path="/luxury/:slug" element={<ExperiencePage />} />
                    <Route path="/trekking/:slug" element={<SubDestinationSlugPage pageType={'trek'} />} />
                    <Route path="/guide/:slug" element={<GuidePage />} />
                    <Route path="/additional-info/:slug" element={<AdditionalInfoPage />} />



                    <Route path="/page/homepage" element={<Navigate to="/" replace />} />
                    <Route path="/page/:slug" element={<PageSection />} />

                    <Route path="/plan-trip" element={<PlanTripPage />} />
                    <Route path="/guide/:slug/packing-list" element={<PackingListPage />} />
                    <Route path="/guide/:slug/altitude-sickness" element={<AltitudeSicknessPage />} />
                    <Route path="/guide/:slug/photography-tips" element={<PhotographyTipsPage />} />
                    <Route path="/guide/:slug/nepal-visa" element={<NepalVisaPage />} />
                    <Route path="/guide/:slug/choosing-agency" element={<ChoosingAgencyPage />} />
                    <Route path="/guide/:slug/post-trek-recovery" element={<PostTrekRecoveryPage />} />

                    <Route path="/departures" element={<DepartureCalendarPage />} />
                    <Route path="/departures/book" element={<DepartureBookingPage />} />
                    <Route path="/book/:slug" element={<PackageBookingPage />} />
                    <Route path="/departures/admin" element={<DepartureAdminPage />} />
                    <Route path="/legal-documents" element={<LegalDocumentsPage />} />
                    <Route path="/team/certificates" element={<TeamCertificatesSection />} />
                    <Route path="/team/:memberName" element={<TeamMemberCertificatesPage />} />
                    <Route path="/legal-documents/:documentTitle" element={<CertificateViewPage />} />
                    <Route path="/sitemap" element={<SitemapPage />} />
                    <Route path="/reviews" element={<ReviewsPage />} />
                    <Route path="/wishlist" element={<WishlistPage />} />
                    <Route path="/:slug" element={<ProductSlugPage />} />
                    <Route path="*" element={<NotFoundPage />} />
                </Routes>
            </BrowserRouter>
        </HelmetProvider>
    );
}

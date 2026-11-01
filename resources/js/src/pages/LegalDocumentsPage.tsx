import React from 'react';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { SectionHeading } from '../components/ui/SectionHeading';
import { motion } from 'framer-motion';
import { FileText, Shield, Award, CheckCircle, Download } from 'lucide-react';
import LegalDocumentsSection from '../components/LegalDocumentsSection';
const documents = [{
  title: 'Tourism Business License',
  issuer: 'Nepal Tourism Board',
  number: 'NTB-2024-1234',
  validUntil: 'December 2025',
  image: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?q=80&w=2070&auto=format&fit=crop'
}, {
  title: 'Trekking Agency Registration',
  issuer: 'Ministry of Tourism',
  number: 'TAAN-567890',
  validUntil: 'December 2025',
  image: 'https://images.unsplash.com/photo-1554224311-beee460c201f?q=80&w=2070&auto=format&fit=crop'
}, {
  title: 'Environmental Compliance Certificate',
  issuer: 'Department of National Parks',
  number: 'DNPWC-2024-456',
  validUntil: 'December 2025',
  image: 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?q=80&w=2070&auto=format&fit=crop'
}, {
  title: 'Safety & Insurance Certificate',
  issuer: 'Nepal Insurance Authority',
  number: 'NIA-2024-789',
  validUntil: 'December 2025',
  image: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?q=80&w=2070&auto=format&fit=crop'
}];
const certifications = [{
  icon: Shield,
  title: 'Fully Licensed & Insured',
  description: 'All necessary permits and comprehensive insurance coverage for operations'
}, {
  icon: Award,
  title: 'Industry Certified',
  description: 'Member of TAAN (Trekking Agencies Association of Nepal) and NMA'
}, {
  icon: CheckCircle,
  title: 'Safety Compliant',
  description: 'Meets all government safety standards and environmental regulations'
}, {
  icon: FileText,
  title: 'Transparent Operations',
  description: 'All documentation available for review and verification'
}];
export function LegalDocumentsPage() {
  return <div className="min-h-screen bg-white font-sans">
      <Navbar />

      {/* Hero Section */}
      <div className="relative h-[60vh] min-h-[500px] flex items-center justify-center">
        <div className="absolute inset-0 bg-cover bg-center z-0" style={{
        backgroundImage: 'url("https://images.unsplash.com/photo-1589829545856-d10d557cf95f?q=80&w=2070&auto=format&fit=crop")'
      }}>
          <div className="absolute inset-0 bg-gradient-to-b from-slate-900/70 via-slate-900/50 to-slate-900/80" />
        </div>
        <div className="relative z-10 text-center text-white px-4 max-w-4xl mx-auto">
          <motion.div initial={{
          opacity: 0,
          y: 30
        }} animate={{
          opacity: 1,
          y: 0
        }} transition={{
          duration: 0.8
        }} className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center">
              <FileText className="text-white" size={32} />
            </div>
          </motion.div>
          <motion.h1 initial={{
          opacity: 0,
          y: 20
        }} animate={{
          opacity: 1,
          y: 0
        }} transition={{
          duration: 0.8,
          delay: 0.2
        }} className="text-5xl md:text-6xl font-bold mb-6 tracking-tight">
            Legal Documents
          </motion.h1>
          <motion.p initial={{
          opacity: 0,
          y: 20
        }} animate={{
          opacity: 1,
          y: 0
        }} transition={{
          duration: 0.8,
          delay: 0.4
        }} className="text-xl md:text-2xl text-slate-100 font-light max-w-2xl mx-auto">
            Fully licensed, certified, and compliant with all regulations
          </motion.p>
        </div>
      </div>

      {/* Overview Section */}
      <section className="py-20 px-4 max-w-4xl mx-auto">
        <motion.div initial={{
        opacity: 0,
        y: 30
      }} whileInView={{
        opacity: 1,
        y: 0
      }} viewport={{
        once: true
      }} transition={{
        duration: 0.6
      }}>
          <SectionHeading title="Our Credentials" subtitle="Overview" />
          <div className="prose prose-lg max-w-none text-stone-700 leading-relaxed space-y-4">
            <p>
              Himalayan Bespoke operates with full legal authorization and
              maintains all required licenses, permits, and certifications
              mandated by the Government of Nepal. Our commitment to
              transparency and compliance ensures you can trek with complete
              confidence and peace of mind.
            </p>
            <p>
              We are proud members of the Trekking Agencies Association of Nepal
              (TAAN) and the Nepal Mountaineering Association (NMA). These
              memberships demonstrate our adherence to industry best practices,
              ethical standards, and safety protocols.
            </p>
            <p>
              All our guides hold valid certifications from the Nepal Academy of
              Tourism and Hotel Management (NATHM) and are trained in wilderness
              first aid and high-altitude rescue procedures. We maintain
              comprehensive insurance coverage for all our operations, staff,
              and clients.
            </p>
            <p>
              Below you'll find our official licenses and certifications. We
              believe in complete transparency and are happy to provide
              verification of any document upon request.
            </p>
          </div>
        </motion.div>
      </section>

      {/* Certifications Grid */}
      <section className="bg-slate-50 py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            {certifications.map((cert, index) => <motion.div key={index} initial={{
            opacity: 0,
            y: 30
          }} whileInView={{
            opacity: 1,
            y: 0
          }} viewport={{
            once: true
          }} transition={{
            delay: index * 0.1
          }} className="bg-white rounded-2xl p-8 shadow-md text-center">
                <div className="w-14 h-14 bg-gradient-to-br from-slate-600 to-slate-800 rounded-xl flex items-center justify-center mx-auto mb-6">
                  <cert.icon size={28} className="text-white" />
                </div>
                <h3 className="text-lg font-bold text-stone-900 mb-3">
                  {cert.title}
                </h3>
                <p className="text-stone-600 text-sm leading-relaxed">
                  {cert.description}
                </p>
              </motion.div>)}
          </div>
        </div>
      </section>

      {/* Documents Section */}
      <LegalDocumentsSection />

      {/* Verification Notice */}
      <section className="bg-gradient-to-br from-blue-50 to-cyan-50 py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <motion.div initial={{
          opacity: 0,
          y: 20
        }} whileInView={{
          opacity: 1,
          y: 0
        }} viewport={{
          once: true
        }} className="bg-white rounded-2xl p-8 md:p-12 shadow-lg border-l-4 border-blue-600">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center shrink-0">
                <Shield className="text-white" size={24} />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-stone-900 mb-3">
                  Document Verification
                </h3>
                <p className="text-stone-700 leading-relaxed mb-4">
                  All licenses and certificates displayed on this page are
                  authentic and can be verified through the respective issuing
                  authorities. We encourage you to verify our credentials
                  independently if desired.
                </p>
                <p className="text-stone-700 leading-relaxed">
                  For verification assistance or to request copies of any
                  documents, please contact our office. We're committed to
                  complete transparency in all our operations.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div initial={{
          opacity: 0,
          y: 20
        }} whileInView={{
          opacity: 1,
          y: 0
        }} viewport={{
          once: true
        }}>
            <h2 className="text-3xl md:text-4xl font-bold text-stone-900 mb-4">
              Questions About Our Credentials?
            </h2>
            <p className="text-xl text-stone-600 mb-8">
              We're happy to provide additional documentation or answer any
              questions
            </p>
            <a href="#contact">
              <button className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-8 py-4 rounded-full font-semibold hover:from-blue-700 hover:to-cyan-700 transition-all">
                Contact Us
              </button>
            </a>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>;
}
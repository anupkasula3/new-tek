import React, { Children } from 'react';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { motion } from 'framer-motion';
import { Shield } from 'lucide-react';
export function PrivacyPolicyPage() {
  return <div className="min-h-screen bg-white font-sans text-gray-900">
      <Navbar />

      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-gray-900 to-gray-800 py-20 mt-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div initial={{
          opacity: 0,
          y: 20
        }} animate={{
          opacity: 1,
          y: 0
        }} transition={{
          duration: 0.6
        }} className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center">
              <Shield className="text-white" size={32} />
            </div>
          </motion.div>
          <motion.h1 initial={{
          opacity: 0,
          y: 20
        }} animate={{
          opacity: 1,
          y: 0
        }} transition={{
          duration: 0.6,
          delay: 0.2
        }} className="text-4xl md:text-5xl font-bold text-white mb-4">
            Privacy Policy
          </motion.h1>
          <motion.p initial={{
          opacity: 0,
          y: 20
        }} animate={{
          opacity: 1,
          y: 0
        }} transition={{
          duration: 0.6,
          delay: 0.4
        }} className="text-gray-300 text-lg">
            Last Updated: March 15, 2024
          </motion.p>
        </div>
      </div>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <motion.div initial={{
        opacity: 0,
        y: 20
      }} animate={{
        opacity: 1,
        y: 0
      }} transition={{
        duration: 0.6,
        delay: 0.6
      }} className="prose prose-lg max-w-none">
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Introduction
            </h2>
            <p className="text-gray-700 leading-relaxed">
              Himalayan Bespoke ("we," "our," or "us") is committed to
              protecting your privacy. This Privacy Policy explains how we
              collect, use, disclose, and safeguard your information when you
              visit our website or use our services. Please read this privacy
              policy carefully. If you do not agree with the terms of this
              privacy policy, please do not access the site.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Information We Collect
            </h2>

            <h3 className="text-2xl font-semibold text-gray-900 mb-3 mt-6">
              Personal Information
            </h3>
            <p className="text-gray-700 leading-relaxed mb-4">
              We may collect personal information that you voluntarily provide
              to us when you:
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-6">
              <li>Register for an account or book a trek</li>
              <li>Subscribe to our newsletter</li>
              <li>Fill out a contact form</li>
              <li>Participate in surveys or promotions</li>
              <li>Communicate with us via email or phone</li>
            </ul>
            <p className="text-gray-700 leading-relaxed">
              This information may include your name, email address, phone
              number, postal address, date of birth, passport information,
              emergency contact details, and payment information.
            </p>

            <h3 className="text-2xl font-semibold text-gray-900 mb-3 mt-6">
              Automatically Collected Information
            </h3>
            <p className="text-gray-700 leading-relaxed">
              When you visit our website, we may automatically collect certain
              information about your device, including information about your
              web browser, IP address, time zone, and some of the cookies
              installed on your device. We may also collect information about
              your browsing behavior, such as pages viewed and links clicked.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              How We Use Your Information
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              We use the information we collect to:
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li>Process your bookings and provide trekking services</li>
              <li>
                Communicate with you about your trips, including confirmations
                and updates
              </li>
              <li>Send you marketing communications (with your consent)</li>
              <li>Respond to your inquiries and provide customer support</li>
              <li>Improve our website and services</li>
              <li>Comply with legal obligations and protect our rights</li>
              <li>Detect and prevent fraud or security issues</li>
            </ul>
          </section>

          <section className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Sharing Your Information
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              We may share your information with:
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li>
                <strong>Service Providers:</strong> Third-party companies that
                help us operate our business (payment processors, email
                services, etc.)
              </li>
              <li>
                <strong>Local Partners:</strong> Hotels, guides, and other
                service providers necessary for your trek
              </li>
              <li>
                <strong>Government Authorities:</strong> When required by law or
                to obtain necessary permits
              </li>
              <li>
                <strong>Emergency Contacts:</strong> In case of medical
                emergencies during your trek
              </li>
            </ul>
            <p className="text-gray-700 leading-relaxed mt-4">
              We do not sell your personal information to third parties.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Cookies and Tracking Technologies
            </h2>
            <p className="text-gray-700 leading-relaxed">
              We use cookies and similar tracking technologies to track activity
              on our website and store certain information. You can instruct
              your browser to refuse all cookies or to indicate when a cookie is
              being sent. However, if you do not accept cookies, you may not be
              able to use some portions of our website.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Data Security
            </h2>
            <p className="text-gray-700 leading-relaxed">
              We implement appropriate technical and organizational security
              measures to protect your personal information. However, please
              note that no method of transmission over the internet or
              electronic storage is 100% secure. While we strive to protect your
              information, we cannot guarantee its absolute security.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Your Rights
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Depending on your location, you may have the following rights
              regarding your personal information:
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li>Access and receive a copy of your personal data</li>
              <li>Rectify inaccurate or incomplete data</li>
              <li>Request deletion of your personal data</li>
              <li>Object to or restrict processing of your data</li>
              <li>Withdraw consent for marketing communications</li>
              <li>Data portability</li>
            </ul>
            <p className="text-gray-700 leading-relaxed mt-4">
              To exercise these rights, please contact us at
              privacy@himalayantrekking.com
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Children's Privacy
            </h2>
            <p className="text-gray-700 leading-relaxed">
              Our services are not directed to individuals under the age of 18.
              We do not knowingly collect personal information from children. If
              you are a parent or guardian and believe your child has provided
              us with personal information, please contact us.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              International Data Transfers
            </h2>
            <p className="text-gray-700 leading-relaxed">
              Your information may be transferred to and processed in countries
              other than your country of residence. These countries may have
              different data protection laws. By using our services, you consent
              to such transfers.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Changes to This Privacy Policy
            </h2>
            <p className="text-gray-700 leading-relaxed">
              We may update this Privacy Policy from time to time. We will
              notify you of any changes by posting the new Privacy Policy on
              this page and updating the "Last Updated" date. You are advised to
              review this Privacy Policy periodically for any changes.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Contact Us
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              If you have any questions about this Privacy Policy, please
              contact us:
            </p>
            <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
              <p className="text-gray-700 mb-2">
                <strong>Email:</strong> privacy@himalayantrekking.com
              </p>
              <p className="text-gray-700 mb-2">
                <strong>Phone:</strong> +977 1 234 5678
              </p>
              <p className="text-gray-700">
                <strong>Address:</strong> Thamel Marg, Kathmandu 44600, Nepal
              </p>
            </div>
          </section>
        </motion.div>
      </main>

      <Footer />
    </div>;
}
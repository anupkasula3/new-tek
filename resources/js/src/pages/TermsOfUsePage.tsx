import React from 'react';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { motion } from 'framer-motion';
import { FileText } from 'lucide-react';
export function TermsOfUsePage() {
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
          duration: 0.6,
          delay: 0.2
        }} className="text-4xl md:text-5xl font-bold text-white mb-4">
            Terms of Use
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
              Agreement to Terms
            </h2>
            <p className="text-gray-700 leading-relaxed">
              These Terms of Use constitute a legally binding agreement between
              you and Himalayan Bespoke ("Company," "we," "us," or "our")
              concerning your access to and use of our website and services. By
              accessing or using our services, you agree to be bound by these
              Terms. If you do not agree with these Terms, you must not access
              or use our services.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Services Description
            </h2>
            <p className="text-gray-700 leading-relaxed">
              Himalayan Bespoke provides trekking and adventure travel services
              in Nepal, Tibet, and Bhutan. Our services include but are not
              limited to organizing treks, providing guides and porters,
              arranging accommodations, obtaining permits, and coordinating
              transportation.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Booking and Payment
            </h2>

            <h3 className="text-2xl font-semibold text-gray-900 mb-3 mt-6">
              Booking Process
            </h3>
            <p className="text-gray-700 leading-relaxed mb-4">
              To book a trek, you must:
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-6">
              <li>Be at least 18 years of age</li>
              <li>Provide accurate and complete information</li>
              <li>Pay the required deposit or full payment</li>
              <li>Accept these Terms of Use</li>
            </ul>

            <h3 className="text-2xl font-semibold text-gray-900 mb-3 mt-6">
              Payment Terms
            </h3>
            <p className="text-gray-700 leading-relaxed mb-4">
              Payment terms vary by trek and package:
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li>
                A deposit (typically 25-30%) is required to confirm your booking
              </li>
              <li>Full payment is due 45 days before trek departure</li>
              <li>Late payments may result in booking cancellation</li>
              <li>
                We accept major credit cards, bank transfers, and online payment
                systems
              </li>
            </ul>
          </section>

          <section className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Cancellation and Refund Policy
            </h2>

            <h3 className="text-2xl font-semibold text-gray-900 mb-3 mt-6">
              Cancellation by Client
            </h3>
            <p className="text-gray-700 leading-relaxed mb-4">
              If you need to cancel your booking, the following cancellation
              fees apply:
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-6">
              <li>More than 60 days before departure: 25% of total cost</li>
              <li>30-60 days before departure: 50% of total cost</li>
              <li>15-29 days before departure: 75% of total cost</li>
              <li>
                Less than 15 days before departure: 100% of total cost (no
                refund)
              </li>
            </ul>

            <h3 className="text-2xl font-semibold text-gray-900 mb-3 mt-6">
              Cancellation by Company
            </h3>
            <p className="text-gray-700 leading-relaxed">
              We reserve the right to cancel a trek due to insufficient
              bookings, weather conditions, political instability, or other
              circumstances beyond our control. In such cases, we will offer a
              full refund or alternative trek dates.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Travel Insurance
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Travel insurance is MANDATORY for all participants. Your insurance
              must cover:
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li>Medical expenses including emergency evacuation</li>
              <li>High-altitude trekking (up to 6,000 meters)</li>
              <li>Helicopter rescue and repatriation</li>
              <li>Trip cancellation and interruption</li>
              <li>Personal liability</li>
            </ul>
            <p className="text-gray-700 leading-relaxed mt-4">
              You must provide proof of insurance before trek departure. We are
              not responsible for any costs incurred due to lack of adequate
              insurance.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Health and Fitness Requirements
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Participants must:
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li>Be in good physical and mental health</li>
              <li>
                Disclose any medical conditions that may affect their ability to
                trek
              </li>
              <li>Obtain medical clearance if required</li>
              <li>
                Follow guide instructions regarding acclimatization and safety
              </li>
            </ul>
            <p className="text-gray-700 leading-relaxed mt-4">
              We reserve the right to refuse participation or remove
              participants from a trek if they pose a risk to themselves or
              others.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Assumption of Risk
            </h2>
            <p className="text-gray-700 leading-relaxed">
              Trekking in the Himalayas involves inherent risks including but
              not limited to altitude sickness, extreme weather, difficult
              terrain, and limited medical facilities. By participating, you
              acknowledge these risks and agree to assume full responsibility
              for your safety. You release Himalayan Bespoke from liability for
              any injury, loss, or damage arising from your participation.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Limitation of Liability
            </h2>
            <p className="text-gray-700 leading-relaxed">
              To the maximum extent permitted by law, Himalayan Bespoke shall
              not be liable for any indirect, incidental, special,
              consequential, or punitive damages arising from your use of our
              services. Our total liability shall not exceed the amount you paid
              for the trek.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Force Majeure
            </h2>
            <p className="text-gray-700 leading-relaxed">
              We are not responsible for failure to perform our obligations due
              to circumstances beyond our control, including natural disasters,
              war, terrorism, civil unrest, government actions, pandemics, or
              other force majeure events.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Intellectual Property
            </h2>
            <p className="text-gray-700 leading-relaxed">
              All content on our website, including text, images, logos, and
              designs, is owned by Himalayan Bespoke and protected by copyright
              and trademark laws. You may not reproduce, distribute, or create
              derivative works without our written permission.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Governing Law
            </h2>
            <p className="text-gray-700 leading-relaxed">
              These Terms shall be governed by and construed in accordance with
              the laws of Nepal. Any disputes shall be subject to the exclusive
              jurisdiction of the courts of Kathmandu, Nepal.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Changes to Terms
            </h2>
            <p className="text-gray-700 leading-relaxed">
              We reserve the right to modify these Terms at any time. Changes
              will be effective immediately upon posting to our website. Your
              continued use of our services after changes constitutes acceptance
              of the modified Terms.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Contact Information
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              For questions about these Terms, please contact us:
            </p>
            <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
              <p className="text-gray-700 mb-2">
                <strong>Email:</strong> legal@himalayantrekking.com
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
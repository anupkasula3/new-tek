import React from 'react';
import { motion } from 'framer-motion';
import { Phone, Mail, Clock } from 'lucide-react';
export function ContactInfo({ settings }: { settings?: any }) {
  return <motion.div initial={{
    opacity: 0,
    x: -20
  }} whileInView={{
    opacity: 1,
    x: 0
  }} viewport={{
    once: true
  }} transition={{
    duration: 0.6
  }} className="bg-gradient-to-br from-[#0066FF] to-[#06B6D4] rounded-2xl shadow-xl p-8 md:p-10 text-white h-full">
      <h3 className="text-2xl font-bold mb-8">Contact Information</h3>

      <div className="space-y-8">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center shrink-0">
            <Phone size={24} />
          </div>
          <div>
            <h4 className="font-bold text-lg mb-1">Phone Number</h4>
            <p className="text-blue-100">{settings?.primary_phone || '+977 1-4422334'}</p>
            {settings?.secondary_phone && <p className="text-blue-100 text-sm">{settings.secondary_phone}</p>}
          </div>
        </div>

        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center shrink-0">
            <Mail size={24} />
          </div>
          <div>
            <h4 className="font-bold text-lg mb-1">Email Address</h4>
            <p className="text-blue-100">{settings?.primary_email || 'info@himalayantrekking.com'}</p>
          </div>
        </div>

        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center shrink-0">
            <Clock size={24} />
          </div>
          <div>
            <h4 className="font-bold text-lg mb-1">Opening Hours</h4>
            <p className="text-blue-100">{settings?.opening_hours_days || 'Sunday - Friday'}</p>
            <p className="text-blue-100 font-semibold">{settings?.opening_hours_time || '9:00 AM - 6:00 PM'}</p>
            {settings?.opening_hours_off_day && <p className="text-blue-100 text-sm mt-2">{settings.opening_hours_off_day}</p>}
          </div>
        </div>

        <div className="pt-6 border-t border-white/20">
          <p className="text-blue-100 leading-relaxed">
            {settings?.location_info || (settings?.address ? `Our office is located in ${settings.address}. We're here to help you plan your perfect Himalayan adventure.`
            : "Our office is located in the heart of Thamel, Kathmandu. We're here to help you plan your perfect Himalayan adventure.")}
          </p>
        </div>
      </div>
    </motion.div>;
}
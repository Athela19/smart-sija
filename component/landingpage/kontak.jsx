"use client";

import { MapPin, Phone, Mail, Instagram, Youtube } from "lucide-react";
import { motion } from "framer-motion";

export default function KontakPage() {
  const contactItems = [
    {
      icon: (
        <MapPin className="w-6 h-6 text-[var(--secondary)] group-hover:text-white transform transition-300" />
      ),
      title: "Address",
      content:
        "Jl. Mahar Martanegara No.48, Utama, Kec. Cimahi Sel., Kota Cimahi, Jawa Barat 40533",
    },
    {
      icon: (
        <Phone className="w-6 h-6 text-[var(--secondary)] group-hover:text-white transform transition-300" />
      ),
      title: "Call",
      content: "+62 895 2804 0614",
    },
    {
      icon: (
        <Mail className="w-6 h-6 text-[var(--secondary)] group-hover:text-white transform transition-300" />
      ),
      title: "Email",
      content: "Sija@smkn1-cmi.sch.id",
    },
    {
      icon: (
        <Instagram className="w-6 h-6 text-[var(--secondary)] group-hover:text-white transform transition-300" />
      ),
      title: "Instagram",
      content: (
        <a
          href="https://www.instagram.com/tkjsija_smkn1cimahi?igsh=MXN3aWNia3A5aDZjdA=="
          target="_blank"
          rel="noopener noreferrer"
        >
          TKJ dan SIJA SMKN 1 CIMAHI
        </a>
      ),
    },
    {
      icon: (
        <Youtube className="w-6 h-6 text-[var(--secondary)] group-hover:text-white transform transition-300" />
      ),
      title: "YouTube",
      content: (
        <a
          href="https://youtube.com/@tkjsijasmknegeri1cimahi?si=Cumwy_BkaZ6QUKZk"
          target="_blank"
          rel="noopener noreferrer"
        >
          TKJ dan SIJA SMK NEGERI 1 CIMAHI
        </a>
      ),
    },
  ];

  return (
    <section id="Kontak" className="py-24 px-4 md:px-16 bg-white">
      {/* Section Title */}
      <motion.div
        initial={{ opacity: 0, y: 100 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="text-center mb-8"
      >
        <h1 className="text-base md:text-lg font-bold text-gray-600 flex items-center gap-4 text-center md:text-left">
          Kontak
          <span className="w-24 border-b-2 border-[var(--secondary)]" />
        </h1>
        <h2 className="text-2xl md:text-3xl font-semibold text-[var(--primary)] mt-2 text-left">
          Hubungi Kami
        </h2>
      </motion.div>

      <div className="container mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Kontak Info */}
        <div className="space-y-6">
          {contactItems.map((item, idx) => (
            <motion.div
              key={idx}
              className="group flex items-start gap-4 cursor-pointer"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 * idx, duration: 0.5 }}
            >
              <div className="w-12 h-12 bg-[var(--tertiary)] group-hover:bg-[var(--secondary)] transition-colors rounded-full flex items-center justify-center shrink-0">
                {item.icon}
              </div>
              <div>
                <h3 className="text-lg font-semibold group-hover:text-[var(--primary)] transition-colors">
                  {item.title}
                </h3>
                <p className="text-gray-700">{item.content}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Google Maps */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d467.5284975645926!2d107.53890351007917!3d-6.901523957414001!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e68e561cf1d33db%3A0x3041f97640822b7a!2sWorkshop%20SIJA!5e0!3m2!1sid!2sid!4v1738805366997!5m2!1sid!2sid"
            width="100%"
            height="400"
            className="rounded-xl w-full border-0 shadow-lg"
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>
        </motion.div>
      </div>
    </section>
  );
}

"use client"

import { useEffect, useState } from "react";
import HomePage from "./beranda";
import AboutPage from "./tentangKami";
import StatsPage from "./statistik";
import ProdukPage from "./produk";
import DokumentasiPage from "./dokumentasi";
import KutipanPage from "./kutipan";
import OrganigramPage from "./organigram";
import KontakPage from "./kontak";
 
export default function LandingPage() {
   const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

//   if (loading) return <Loading />;

  return(
    <>
    <HomePage />
    <AboutPage />
    <StatsPage />
    <ProdukPage />
    <DokumentasiPage />
    <KutipanPage />
    <OrganigramPage />
    <KontakPage />
    </>
  );
}

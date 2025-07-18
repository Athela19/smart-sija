import Statistik from "./statistik";
import Organigram from "./organigram";
import History from "./history";

export default function Beranda() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-10 gap-6 h-[calc(100vh-7rem)]">
      {/* Kiri: Statistik + Organigram (7/10 kolom) */}
      <div className="md:col-span-7 flex flex-col">
        <div className="h-[40%] mb-8">
          <Statistik />
        </div>
        <div className="h-[60%]">
          <Organigram />
        </div>
      </div>

      {/* Kanan: History (3/10 kolom) */}
      <div className="md:col-span-3">
        <History />
      </div>
    </div>
  );
}

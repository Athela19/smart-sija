import Statistik from "./statistik";
// import User from "./user";
import History from "./history";

export default function Beranda() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-10 gap-6 min-h-screen">
            {/* Kiri: 7/10 */}
            <div className="md:col-span-7 flex flex-col gap-6 h-[calc(100vh-4rem)]">
                <div className="h-[40%]">
                    <Statistik />
                </div>
                <div className="h-[60%] overflow-auto">
                    {/* <User /> */}
                </div>
            </div>


            {/* Kanan: 3/10 */}
            <div className="md:col-span-3">
                <History />
            </div>
        </div>
    );
}

import Board from "@/components/Board";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

function page() {
  return (
    <main className="bg-[#FFFDFC dark:bg-[#1A1F24]">
      <Header />
      <div style={{ minHeight: "calc(100vh - 100px)" }}>
        <Board />
      </div>
      <Footer />
    </main>
  );
}

export default page;

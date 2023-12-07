import Board from "@/components/Board";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

function page() {
  return (
    <main className="bg-[#FFFDFC]">
      <Header />
      <div style={{ minHeight: "calc(100vh - 100px)" }}>
        <Board />
      </div>
      <Footer />
    </main>
  );
}

export default page;

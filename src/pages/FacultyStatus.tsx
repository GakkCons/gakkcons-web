import Header from "./components/header";
import Navbar from "./components/navbar";

function FacultyStatus() {
  return (
    <div>
      <Header />
      <div className="mx-2 sm:mx-4 md:mx-10 details mt-4 mb-2">
        <div className="grid grid-cols-1 md:grid-cols-12 lg:grid-cols-12 gap-4">
          <div
            className="col-span-1 md:col-span-4 lg:col-span-3 detail-status"
            style={{ position: "relative" }}
          >
            <Navbar />
          </div>
        </div>
      </div>
    </div>
  );
}

export default FacultyStatus;

import Navbar from "./components/Navbar";
import Header from "./components/Header";
import SearchBar from "./components/SearchBar";
import JobCard from "./components/JobCard";
import jobData from "./JobDummyData";

import { useEffect, useState } from "react";
import { collection, query, orderBy, where, getDocs } from "firebase/firestore";
import {db} from "./firebase config";

function App() {
  const [jobs, setJobs] = useState(jobData); 
  const [customSearch, setCustomSearch] = useState(false);

  const fetchJobs = async () => {
    try {
      setCustomSearch(false);
      const tempJobs = [];
      const jobsRef = collection(db, "jobs");
      const q = query(jobsRef, orderBy("postedOn", "desc"));
      const req = await getDocs(q);

      req.forEach((job) => {
        tempJobs.push({
          ...job.data(),
          id: job.id,
          postedOn: job.data().postedOn.toDate(),
        });
      });

      if (tempJobs.length > 0) setJobs(tempJobs);
    } catch (error) {
      console.error("Error fetching jobs:", error);
    }
  };

  const fetchJobsCustom = async (jobCriteria) => {
    try {
      setCustomSearch(true);
      const tempJobs = [];
      const jobsRef = collection(db, "jobs");
      const q = query(
        jobsRef,
        where("type", "==", jobCriteria.type),
        where("title", "==", jobCriteria.title),
        where("experience", "==", jobCriteria.experience),
        where("location", "==", jobCriteria.location),
        orderBy("postedOn", "desc")
      );
      const req = await getDocs(q);

      req.forEach((job) => {
        tempJobs.push({
          ...job.data(),
          id: job.id,
          postedOn: job.data().postedOn.toDate(),
        });
      });

      setJobs(tempJobs);
    } catch (error) {
      console.error("Error fetching filtered jobs:", error);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      {/* Navbar Section */}
      <Navbar />

      {/* Header Section */}
      <div className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 py-10 text-center text-white shadow-md">
        <Header />
      </div>

      {/* Search Bar */}
      <div className="mt-8">
        <SearchBar fetchJobsCustom={fetchJobsCustom} />
      </div>

      {/* Clear Filter Button */}
      {customSearch && (
        <div className="flex justify-end mr-10 mt-4">
          <button
            onClick={fetchJobs}
            className="bg-gradient-to-r from-red-400 to-pink-500 px-6 py-2 rounded-md text-white font-semibold shadow-md hover:scale-105 transition-transform"
          >
            🔄 Clear Filters
          </button>
        </div>
      )}

      {/* Job Cards */}
      <div className="flex flex-wrap justify-center gap-6 mt-10 px-6">
        {jobs && jobs.length > 0 ? (
          jobs.map((job) => <JobCard key={job.id} {...job} />)
        ) : (
          <p className="text-gray-600 text-lg mt-10 animate-pulse">
            No jobs available ✨
          </p>
        )}
      </div>

      {/* Footer */}
      <footer className="text-center mt-12 py-6 text-gray-500">
        <p>
          © {new Date().getFullYear()} <span className="font-semibold text-indigo-600">Jobify Portal</span> — Made with 💻 by Nidhi Sahu
        </p>
      </footer>
    </div>
  );
}

export default App;

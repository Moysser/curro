import { useState, useEffect } from "react";
import { FaPlus, FaList, FaThLarge } from "react-icons/fa";
import { LuSearch } from "react-icons/lu";
import { RiDeleteBin5Line } from "react-icons/ri";

import AddNewJobs from "../Components/AddNewJob";
import EditJobModal from "../Components/EditJobModal";
import { applicationsService } from "../utils/applicationService";

const Applications = () => {
  const [showJobModal, setShowJobModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [activeTab, setActiveTab] = useState("all");
  const [checkedJobs, setCheckedJobs] = useState([]);
  const [isCardView, setIsCardView] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const storedApps = applicationsService.list();
    setJobs(storedApps);
  }, []);

  const handleAddApplication = (data) => {
    const newJob = applicationsService.create(data);
    setJobs((prev) => [newJob, ...prev]);
  };

  useEffect(() => {
    // Save jobs to localStorage whenever it changes
    localStorage.setItem("jobs", JSON.stringify(jobs));
  }, [jobs]);

  const handleOpenJobModal = () => {
    setShowJobModal(true);
  };

  const handleEditJob = (updatedJob) => {
    setJobs(jobs.map((job) => (job.id === updatedJob.id ? updatedJob : job)));
  };

  const handleOpenEditModal = (job) => {
    setSelectedJob(job);
    setShowEditModal(true);
  };

  const handleDeleteJob = (job) => {
    applicationsService.remove(job.id);
    setJobs((prev) => prev.filter((j) => j.id !== job.id));
  };

  const handleCheckJob = (job) => {
    setCheckedJobs((prev) => {
      if (prev.some((j) => j.id === job.id)) {
        // Already checked → remove it
        return prev.filter((j) => j.id !== job.id);
      } else {
        // Not checked → add it
        return [...prev, job];
      }
    });
  };

  const hasSearch = searchTerm.trim().length > 0;

  const displayedJobs = jobs.filter((job) => {
    const matchesTab = activeTab === "all" || job.status === activeTab;

    if (!hasSearch) return matchesTab;

    const query = searchTerm.toLowerCase();

    const matchesSearch =
      job.jobTitle.toLowerCase().includes(query) ||
      job.companyName.toLowerCase().includes(query) ||
      job.status.toLowerCase().includes(query);

    return matchesTab && matchesSearch;
  });

  const statusColors = {
    applied: "bg-blue-100 text-blue-700",
    interview: "bg-yellow-100 text-yellow-700",
    rejected: "bg-light-rejected text-rejected",
    offered: "bg-offered-light text-offered",
    default: "bg-grays-100 text-grays-700",
  };

  const cellClass = `
  px-2 sm:px-4 md:px-6
  py-2 sm:py-3 md:py-4
  text-[clamp(0.7rem,1.3vw,0.95rem)]
  whitespace-nowrap
`;

  const statusClass = (status) => {
    return statusColors[status.toLowerCase()] || statusColors.default;
  };

  const StatusBadge = ({ status }) => (
    <span className="flex items-center gap-2">
      {/* <span
        className={`w-[8px] h-[8px] rounded-full ${statusClass(status)}`}
      ></span> */}
      <span className={`${statusClass(status)} p-2 rounded-md font-semibold`}>
        {status}
      </span>
    </span>
  );

  return (
    <nav className="">
      <main className="flex justify-between items-center pb-4 p-2 sticky top-4 bg-white z-10 border-b-2">
        <div>
          <h2 className="font-semibold text-sm sm:text-base md:text-lg lg:text-3xl text-primary-text">
            Applications
          </h2>
          <p className="text-sm text-[#666]">
            {jobs.length === 0
              ? "No applications yet"
              : jobs.length === 1
                ? "1 application"
                : `${jobs.length} applications`}
          </p>
        </div>
        <div className="flex items-center gap-4">
          <button
            className="btn-primary flex justify-center items-center gap-3 text-sm"
            onClick={handleOpenJobModal}
          >
            {" "}
            <span className="text-sm">
              <FaPlus />
            </span>
            <p className="hidden md:flex font-bold">Add application</p>
          </button>
        </div>
      </main>

      {showJobModal && (
        <AddNewJobs
          setJobModal={setShowJobModal}
          onAddJob={handleAddApplication}
        />
      )}

      {showEditModal && (
        <EditJobModal
          job={selectedJob}
          setEditModal={setShowEditModal}
          onEditJob={handleEditJob}
        />
      )}

      <div className="flex flex-wrap gap-2 justify-between pt-4">
        <form className="flex flex-grow items-center gap-2 border border-tertiary-text rounded-lg pl-2 py-1.5">
          <label className="sr-only">Search</label>
          <LuSearch className="text-gray text-sm" />
          <input
            type="search"
            name="search"
            placeholder="search by title, role, or status..."
            className="outline-none bg-white flex-grow"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </form>
        <div className="flex justify-between items-center gap-4">
          <div className="hidden sm:flex items-center gap-2 py-1 px-2 cursor-pointer text-tertiary-text">
            <button onClick={() => setIsCardView(true)}>
              <FaThLarge />
            </button>
            <button onClick={() => setIsCardView(false)}>
              <FaList />
            </button>
          </div>
        </div>
      </div>

      <div className="mb-4 border-b ">
        <ul className="flex flex-wrap text-sm font-medium text-center">
          {["all", "applied", "interview", "offered", "rejected"].map((tab) => (
            <li className="me-2" key={tab}>
              <button
                className={`inline-block p-4 ${
                  activeTab === tab ? "border-b-4" : ""
                }`}
                onClick={() => setActiveTab(tab)}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Job Card view */}
      {isCardView ? (
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 mb-12">
          {displayedJobs.map((job) => (
            <div
              key={job.id}
              className="rounded-lg overflow-hidden mt-4 cursor-pointer bg-[#F8F9F8] border border-light-gray hover:[background:linear-gradient(135deg,#7c3aed0f,#0ae5e90f)] hover:[box-shadow:0_8px_24px_#0206171a,inset_0_0_0_1px_#7c3aed2e] hover:-translate-y-0.5 transition-all duration-300"
              onClick={() => handleOpenEditModal(job)}
            >
              <div className="p-4">
                <div className="flex justify-between items-center">
                  <p className="text-teal text-lg font-semibold ">
                    {job.jobTitle}
                  </p>
                  <span
                    className="text-gray text-lg cursor-pointer "
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteJob(job);
                    }}
                  >
                    <RiDeleteBin5Line className="text-rejected" />
                  </span>
                </div>
                <h3 className="text-xl text-gray-500 font-semibold mb-2 ">
                  {job.companyName}
                </h3>
                <p className="text-xs mb-4">
                  <StatusBadge status={job.status} />
                </p>
                <p className="text-grays-600">{job.notes}</p>
                <p className="text-sm text-grays-500 mt-2">
                  {job.status} on{" "}
                  {job.applicationDate
                    ? new Date(job.applicationDate).toLocaleDateString()
                    : "—"}
                </p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        // LIST VIEW
        <div className="overflow-x-auto rounded-t-2xl ">
          <table className="w-full text-sm text-left">
            <thead className="bg-[#E2E6E4] text-primary-text">
              <tr>
                <th className="px-2 sm:px-4 md:px-6 py-2 sm:py-3 text-xs sm:text-sm md:text-base"></th>
                <th className="px-2 sm:px-4 md:px-6 py-2 sm:py-3 text-xs sm:text-sm md:text-base">
                  Title
                </th>
                <th className="px-2 sm:px-4 md:px-6 py-2 sm:py-3 text-xs sm:text-sm md:text-base">
                  Company
                </th>
                <th className="px-2 sm:px-4 md:px-6 py-2 sm:py-3 text-xs sm:text-sm md:text-base">
                  Status
                </th>
                <th className="px-2 sm:px-4 md:px-6 py-2 sm:py-3 text-xs sm:text-sm md:text-base">
                  Date
                </th>
                <th className="px-2 sm:px-4 md:px-6 py-2 sm:py-3 text-xs sm:text-sm md:text-base">
                  Notes
                </th>
              </tr>
            </thead>
            <tbody>
              {displayedJobs.map((job) => (
                <tr
                  key={job.id}
                  className="border-b border-light-gray hover:[background:linear-gradient(135deg,#7c3aed0f,#0ae5e90f)] hover:[box-shadow:0_8px_24px_#0206171a,inset_0_0_0_1px_#7c3aed2e] hover:-translate-y-0.5 transition-all duration-300 cursor-pointer"
                  onClick={() => handleOpenEditModal(job)}
                >
                  <td className={`${cellClass} text-center`}>
                    <input
                      type="checkbox"
                      className="form-checkbox scale-75 sm:scale-90 md:scale-100"
                      checked={checkedJobs.some(
                        (checkedJob) => checkedJob.id === job.id,
                      )}
                      onChange={() => handleCheckJob(job)}
                      onClick={(e) => {
                        e.stopPropagation();
                      }}
                    />
                  </td>
                  <td className={cellClass}>{job.jobTitle}</td>
                  <td className={cellClass}>{job.companyName}</td>
                  <td className={cellClass}>
                    <StatusBadge status={job.status} />
                  </td>
                  <td className={cellClass}>
                    {job.applicationDate
                      ? new Date(job.applicationDate).toLocaleDateString()
                      : "—"}
                  </td>
                  <td className={cellClass}>{job.notes}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {checkedJobs.length > 0 && (
            <div className="flex justify-end mt-4  right-0 mr-5">
              <button
                className="bg-[#c40707] text-white py-1 px-4 rounded text-sm"
                onClick={() => {
                  const confirmDelete = window.confirm(
                    "Are you sure you want to delete the selected jobs?",
                  );
                  if (confirmDelete) {
                    setJobs(
                      jobs.filter(
                        (job) =>
                          !checkedJobs.some(
                            (checkedJob) => checkedJob.id === job.id,
                          ),
                      ),
                    );
                    setCheckedJobs([]);
                  }
                }}
              >
                Delete Selected
              </button>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};

export default Applications;

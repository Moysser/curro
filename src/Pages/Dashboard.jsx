import { useState, useEffect } from "react";
import { LuUserCircle2, LuSearch } from "react-icons/lu";
import { FaLongArrowAltRight, FaRegLightbulb } from "react-icons/fa";
import { BsBriefcase } from "react-icons/bs";
import DashboardCard from "../Components/DashboardCard";
import ApplicationStatsChart from "../Components/ApplicationStatsChart";
import "chart.js/auto";

const Dashboard = () => {
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");

  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    const storedJobs = JSON.parse(localStorage.getItem("jobs")) || [];
    const storedUser = JSON.parse(localStorage.getItem("user")) || {};
    setJobs(storedJobs);

    setUserName(storedUser.name || "");
    setUserEmail(storedUser.email || "");
  }, []);

  const resources = [
    {
      title: "Resume and cover letter template",
      viewUrl: "https://zety.com/cover-letter-templates",
    },
    {
      title: "Interview preparation guide",
      viewUrl:
        "https://www.themuse.com/advice/the-ultimate-interview-guide-30-prep-tips-for-job-interview-success",
    },
    {
      title: "Job search strategies",
      viewUrl: "https://www.careerflow.ai/blog/job-search-guide",
    },
    {
      title: "Networking tips",
      viewUrl: "https://hbr.org/2023/03/a-beginners-guide-to-networking",
    },
    { title: "Career development plan", viewUrl: "" },
    { title: "Salary negotiation tactics", viewUrl: "" },
  ];

  const getGreeting = () => {
    const currentHour = new Date().getHours();
    if (currentHour < 12) return "Good Morning";
    if (currentHour < 17) return "Good Afternoon";
    return "Good Evening";
  };

  return (
    <div>
      <div className="mb-5 flex flex-wrap justify-between items-center">
        <h1 className="font-bold text-[#2A2A2A] text-xl lg:text-2xl">
          {getGreeting()} {userName || "User"},
        </h1>
        <div className="gap-2 items-center border-l-2 border-[#5D6661] pl-4 hidden lg:flex">
          <div>
            <p className="text-[12px]">{userName || "User"}</p>
            <p className="text-[12px]">{userEmail || "example@gmail.com"}</p>
          </div>
        </div>
      </div>
      <div className="rounded-lg mb-4">
        <div>
          <h2 className="text-xl text-gray-dark">Getting Started</h2>
          <div className="w-44 bg-light-gray rounded-full h-1.5 mt-1.5">
            <div className="bg-dark-gray h-1.5 rounded-full w-20"></div>
          </div>
          <p className="mt-1 text-[12px]">45% done</p>
          <div className="mt-6 grid grid-cols-2 lg:grid-cols-4 gap-3 mb-12">
            <DashboardCard
              to="/dashboard/profile"
              icon={LuUserCircle2}
              title="Complete your profile"
              description="Add more details"
              className="no-underline"
            />
            <DashboardCard
              to="/dashboard/job"
              icon={LuSearch}
              title="Search for jobs"
              description="Find jobs that match your skills"
            />
            <DashboardCard
              to="/dashboard/applications"
              icon={BsBriefcase}
              title="Update application "
              description="Keep your job applications up to date"
            />
            <DashboardCard
              to="/dashboard"
              icon={FaRegLightbulb}
              title="Prepare for interview"
              description="Browse our interview resources to help you prepare"
            />
          </div>

          <div className="grid lg:grid-cols-3 gap-4">
            <div className="lg:col-span-2 p-4 relative">
              <div className="flex justify-between items-center">
                <h3 className="text-lg">Stats</h3>
              </div>
              <div className="w-full">
                <ApplicationStatsChart applications={jobs} />
              </div>
            </div>
            <div>
              <h3 className="mb-2">Resources</h3>
              <div className="grid md:grid-cols-2 gap-3 lg:grid-cols-1">
                {resources.map((resource, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between py-2 border-l-4 pl-3 pr-2 rounded shadow-sm"
                  >
                    <p>{resource.title}</p>
                    <a
                      href={resource.viewUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hidden md:flex items-center gap-2 bg-white rounded-full border p-1.5 pl-4 hover:bg-grays-900 hover:text-white hover:shadow-md group "
                    >
                      <p className="hidden md:flex">View</p>
                      <div className="group-hover:bg-gray group-hover:rounded-full group-hover:p-1.5 bg-white p-1.5">
                        <FaLongArrowAltRight className="text-gray-700" />
                      </div>
                    </a>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

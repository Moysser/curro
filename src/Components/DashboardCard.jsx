import { Link } from "react-router-dom";

const DashboardCard = ({ to, icon: Icon, title, description }) => {
  return (
    <div>
      <Link
        to={to}
        className="block w-full p-3 bg-white rounded-xl h-full border border-light-gray shadow-sm hover:[background:linear-gradient(135deg,#7c3aed0f,#0ae5e90f)] hover:[box-shadow:0_8px_24px_#0206171a,inset_0_0_0_1px_#7c3aed2e] hover:-translate-y-0.5 transition-all duration-300"
      >
        <span className="flex w-8 h-8 rounded-full items-center justify-center text-secondary-text text-xl">
          <Icon />
        </span>
        <h5 className="md:text-lg font-bold text-primary-text">{title}</h5>
        <p className="text-gray text-sm">{description}</p>
      </Link>
    </div>
  );
};

export default DashboardCard;

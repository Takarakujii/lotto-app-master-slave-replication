import { Link } from "react-router";

const NotFound = () => {
  return (
    <div className="h-screen flex flex-col items-center justify-center bg-gray-900 text-white">
      <h1 className="text-6xl font-bold">404</h1>
      <p className="text-xl mt-2">Oops! The page you're looking for doesn't exist.</p>
      <Link to="/" className="mt-4 px-6 py-2 bg-blue-500 text-white rounded-lg shadow-lg">
        Go Home
      </Link>
    </div>
  );
};

export default NotFound;

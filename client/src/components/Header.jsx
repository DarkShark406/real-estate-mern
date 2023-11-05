import { Link, useNavigate } from "react-router-dom";
import { FaSearch } from "react-icons/fa";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";

const Header = () => {
	const { currentUser } = useSelector((state) => state.user);
	const [searchTerm, setSearchTerm] = useState("");
	const navigate = useNavigate();

	const handleSubmit = (e) => {
		e.preventDefault();

		const urlParams = new URLSearchParams(window.location.search);
		urlParams.set("searchTerm", searchTerm + "123");
		const searchQuery = urlParams.toString();

		navigate("/search?" + searchQuery);
	};

	useEffect(() => {
		const urlParams = new URLSearchParams(location.search);
		const searchTermFromUrl = urlParams.get("searchTerm");
		if (searchTermFromUrl) {
			setSearchTerm(searchTermFromUrl);
		}
	}, [location.search]);

	return (
		<header className="bg-slate-200 shadow-md">
			<div className="flex justify-between items-center max-w-7xl mx-auto p-3">
				<Link to="/">
					<h1 className="font-bold text-sm sm:text-xl flex flex-wrap">
						<span className="text-slate-500">DarkShark</span>
						<span className="w-2"></span>
						<span className="text-slate-700">Estate</span>
					</h1>
				</Link>
				<form
					className="bg-slate-100 p-3 rounded-lg flex items-center"
					onSubmit={(e) => handleSubmit(e)}>
					<input
						type="text"
						placeholder="Search..."
						className="bg-transparent focus:outline-none w-24 sm:w-64"
						value={searchTerm}
						onChange={(e) => setSearchTerm(e.target.value)}
					/>
					<button>
						<FaSearch className="text-slate-600" />
					</button>
				</form>
				<ul className="flex gap-4 items-center">
					<Link to="/">
						<li className="hidden sm:inline text-slate-700 hover:underline">
							Home
						</li>
					</Link>
					<Link to="/about">
						<li className="hidden sm:inline text-slate-700 hover:underline">
							About
						</li>
					</Link>
					<Link to={"/profile"}>
						{currentUser ? (
							<img
								className="w-7 h-7 rounded-full object-cover"
								src={currentUser.avatar}></img>
						) : (
							<li className="hidden sm:inline text-slate-700 hover:underline">
								Sign In
							</li>
						)}
					</Link>
				</ul>
			</div>
		</header>
	);
};

export default Header;

import { useSelector } from "react-redux";

const Profile = () => {
	const { currentUser } = useSelector((state) => state.user);

	return (
		<div className="p-3 max-w-lg mx-auto">
			<h1 className="text-3xl font-semibold text-center my-7">Profile</h1>

			<form className="flex flex-col gap-4">
				<img
					className="h-24 w-24 rounded-full object-cover cursor-pointer self-center mt-2"
					src={currentUser.avatar}
					alt="profile"
				/>
				<input
					className="border p-3 rounded-lg"
					type="text"
					placeholder="username"
					id="username"
					value={currentUser.username}
				/>
				<input
					className="border p-3 rounded-lg"
					type="text"
					placeholder="email"
					id="email"
					value={currentUser.email}
				/>
				<input
					className="border p-3 rounded-lg"
					type="password"
					placeholder="password"
					id="password"
				/>
				<button className="bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80">
					Update
				</button>
				<button className="bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95">
					Create listing
				</button>
			</form>
			<div className="flex justify-between mt-3">
				<span className="text-red-700 cursor-pointer">Delete Account</span>
				<span className="text-red-700 cursor-pointer">Sign out</span>
			</div>
		</div>
	);
};

export default Profile;

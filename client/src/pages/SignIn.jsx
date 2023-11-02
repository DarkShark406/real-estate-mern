import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

const SignIn = () => {
	const [formData, setFormData] = useState({});
	const [error, setError] = useState(null);
	const [loading, setLoading] = useState(false);
	const navigate = useNavigate();

	// const [emailInput, SetEmailInput] = useState("");

	// function ValidateEmail(email) {
	// 	var validRegex =
	// 		/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
	// 	return email.match(validRegex);
	// }

	const handleChange = (e) => {
		setFormData({
			...formData,
			[e.target.id]: e.target.value,
		});
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		// Check validattion input
		// ....
		try {
			setLoading(true);
			const res = await fetch("/api/auth/signin", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(formData),
			});
			const data = await res.json();
			console.log(data);
			if (data.success === false) {
				setLoading(false);
				setError(data.message);
				return;
			}
			setLoading(false);
			setError(null);
			navigate("/");
		} catch (error) {
			setLoading(false);
			setError(error.message);
		}
	};

	return (
		<div className="p-3 max-w-lg mx-auto">
			<h1 className="text-3xl text-center font-semibold my-7">Sign In</h1>

			<form className="flex flex-col gap-4" onSubmit={(e) => handleSubmit(e)}>
				<input
					type="text"
					placeholder="email"
					className="border p-3 rounded-lg"
					id="email"
					onChange={(e) => handleChange(e)}
				/>
				<input
					type="password"
					placeholder="password"
					className="border p-3 rounded-lg"
					id="password"
					onChange={(e) => handleChange(e)}
				/>
				{/* <input
					type="password"
					placeholder="retype password"
					className="border p-3 rounded-lg"
					id="retypePassword"
				/> */}
				<button
					disabled={loading}
					className="bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80">
					{loading ? "Loading..." : "Sign In"}
				</button>
			</form>
			<div className="flex gap-2 mt-4">
				<p>Don&apos;t have an account?</p>
				<Link to={"/sign-up"}>
					<span className="text-blue-700 hover:underline">Sign up</span>
				</Link>
			</div>
			{error && <p className="text-red-500 mt-5">{error}</p>}
		</div>
	);
};

export default SignIn;

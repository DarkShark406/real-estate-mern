import { useSelector } from "react-redux";
import { useEffect, useRef, useState } from "react";
import {
	getDownloadURL,
	getStorage,
	ref,
	uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebase.js";
import {
	updateUserStart,
	updateUserSuccess,
	updateUserFailure,
	deleteUserFailure,
	deleteUserStart,
	deleteUserSuccess,
	signOutUserFailure,
	signOutUserSuccess,
	signOutUserStart,
} from "../redux/user/userSlice.js";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";

const Profile = () => {
	const { currentUser, loading, error } = useSelector((state) => state.user);
	const fileRef = useRef(null);
	const [file, setFile] = useState(undefined);
	const [filePerc, setFilePerc] = useState(0);
	const [fileUploadError, setFileUploadError] = useState(false);
	const [formData, setFormData] = useState({});
	const [updateSuccess, setUpdateSuccess] = useState(false);
	const dispatch = useDispatch();

	// firebase storage
	// 	 allow read;
	//   allow write: if
	//   request.resource.size < 2 * 1024 * 1024 &&
	//   request.resource.contentType.matches('image/.*')

	const handleFileUpload = (file) => {
		setFileUploadError(false);

		const storage = getStorage(app);
		const fileName = new Date().getTime() + file.name;
		const storageRef = ref(storage, fileName);
		const uploadTask = uploadBytesResumable(storageRef, file);

		uploadTask.on(
			"state_changed",
			(snapshot) => {
				const progress =
					(snapshot.bytesTransferred / snapshot.totalBytes) * 100;
				setFilePerc(Math.round(progress));
			},
			(error) => {
				setFileUploadError(true);
				return;
			},
			() => {
				getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) =>
					setFormData({ ...formData, avatar: downloadURL })
				);
			}
		);
	};

	useEffect(() => {
		if (file) {
			handleFileUpload(file);
		}
	}, [file]);

	const handleChange = (e) => {
		console.log(formData);
		setFormData({ ...formData, [e.target.id]: e.target.value });
	};

	const handleSubmit = async (e) => {
		e.preventDefault();

		try {
			dispatch(updateUserStart());
			console.log(formData);
			const res = await fetch("/api/user/update/" + currentUser._id, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(formData),
			});

			const data = await res.json();

			if (data.success === false) {
				dispatch(updateUserFailure(data.message));
				return;
			}

			dispatch(updateUserSuccess(data));
			setUpdateSuccess(true);
		} catch (error) {
			dispatch(updateUserFailure(error.message));
		}
	};

	const handleDeleteUser = async () => {
		try {
			dispatch(deleteUserStart());
			const res = await fetch(`/api/user/delete/${currentUser._id}`, {
				method: "DELETE",
			});
			const data = await res.json();
			if (data.success === false) {
				dispatch(deleteUserFailure(data.message));
				return;
			}
			dispatch(deleteUserSuccess(data));
		} catch (error) {
			dispatch(deleteUserFailure(error.message));
		}
	};

	const handleSignOut = async () => {
		try {
			dispatch(signOutUserStart());
			const res = await fetch("/api/auth/signout", {
				method: "GET",
			});
			const data = await res.json();
			if (data.success === data) {
				dispatch(signOutUserFailure(data.message));
				return;
			}
			dispatch(signOutUserSuccess(data));
		} catch (error) {
			dispatch(signOutUserFailure(error.message));
		}
	};

	return (
		<div className="p-3 max-w-lg mx-auto">
			<h1 className="text-3xl font-semibold text-center my-7">Profile</h1>

			<form className="flex flex-col gap-4" onSubmit={(e) => handleSubmit(e)}>
				<input
					type="file"
					ref={fileRef}
					hidden
					accept="image/*"
					onChange={(e) => setFile(e.target.files[0])}
				/>
				<img
					className="h-24 w-24 rounded-full object-cover cursor-pointer self-center mt-2"
					src={formData.avatar || currentUser.avatar}
					alt="profile"
					onClick={() => fileRef.current.click()}
				/>
				<p className="text-sm self-center">
					{fileUploadError ? (
						<span className="text-red-700">
							Error Image Upload. The image size must be less 2MB.
						</span>
					) : filePerc > 0 && filePerc < 100 ? (
						<span className="">{`Uploading ${filePerc}%`}</span>
					) : filePerc === 100 ? (
						<span className="text-green-700">
							Image Successfully Uploaded!{" "}
						</span>
					) : (
						""
					)}
				</p>
				<input
					className="border p-3 rounded-lg"
					type="text"
					placeholder="username"
					id="username"
					defaultValue={currentUser.username}
					onChange={(e) => handleChange(e)}
				/>
				<input
					className="border p-3 rounded-lg"
					type="text"
					placeholder="email"
					id="email"
					defaultValue={currentUser.email}
					onChange={(e) => handleChange(e)}
				/>
				<input
					className="border p-3 rounded-lg"
					type="password"
					placeholder="password"
					id="password"
					onChange={(e) => handleChange(e)}
				/>
				<button
					disabled={loading}
					className="bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80">
					{loading ? "Loading..." : "Update"}
				</button>
				<Link
					className="bg-green-700 text-white text-center p-3 rounded-lg uppercase hover:opacity-95"
					to={"/create-listing"}>
					Create listing
				</Link>
			</form>
			<div className="flex justify-between mt-3">
				<span
					className="text-red-700 cursor-pointer"
					onClick={handleDeleteUser}>
					Delete Account
				</span>
				<span className="text-red-700 cursor-pointer" onClick={handleSignOut}>
					Sign out
				</span>
			</div>

			<p className="text-red-700 mt-2">{error ? error : ""}</p>

			<p className="text-green-700 mt-2">
				{updateSuccess ? "User is updated successully" : ""}
			</p>
		</div>
	);
};

export default Profile;

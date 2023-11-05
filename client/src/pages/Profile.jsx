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
	const [showListingsError, setShowListingsError] = useState(false);
	const [userListings, setUserListings] = useState([]);

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

	const handleShowListings = async () => {
		try {
			setShowListingsError(false);
			const res = await fetch("/api/user/listings/" + currentUser._id);

			const data = await res.json();
			if (data.success === data) {
				setShowListingsError(true);
				return;
			}
			setUserListings(data);
		} catch (error) {
			setShowListingsError(true);
		}
	};

	const handleListingDelete = async (listingId) => {
		try {
			const res = await fetch("/api/listing/delete/" + listingId, {
				method: "DELETE",
			});
			const data = await res.json();
			if (data.success === false) {
				console.log(data.message);
				return;
			}

			setUserListings((prev) =>
				prev.filter((listing) => listing._id != listingId)
			);
		} catch (error) {
			console.log(error.message);
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

			<button className="text-green-700 w-full" onClick={handleShowListings}>
				Show Listings
			</button>
			{showListingsError && (
				<p className="text-red-700">Error showing listings</p>
			)}

			{userListings && userListings.length > 0 && (
				<div className="flex flex-col gap-4">
					<h1 className="text-center mt-7 text-3xl font-semibold">
						Your Listings
					</h1>
					{userListings.map((listing) => (
						<div
							key={listing._id}
							className="flex items-center justify-between border rounded-lg gap-4 p-3">
							<Link to={"/listing/" + listing._id}>
								<img
									className="h-20 w-20 rounded-lg object-contain"
									src={listing.imageUrls[0]}
									alt="listing image"
								/>
							</Link>
							<Link
								className="text-slate-700 font-semibold flex-1 hover:underline truncate"
								to={"/listing/" + listing._id}>
								<p>{listing.name}</p>
							</Link>
							<div className="flex flex-col gap-3">
								<button
									onClick={() => handleListingDelete(listing._id)}
									className="text-red-700 uppercase hover:underline">
									Delete
								</button>
								<button className="text-green-700 uppercase hover:underline">
									Edit
								</button>
							</div>
						</div>
					))}
				</div>
			)}
		</div>
	);
};

export default Profile;

import { useSelector } from "react-redux";
import { useEffect, useRef, useState } from "react";
import {
	getDownloadURL,
	getStorage,
	ref,
	uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebase.js";

const Profile = () => {
	const { currentUser } = useSelector((state) => state.user);
	const fileRef = useRef(null);
	const [file, setFile] = useState(undefined);
	const [filePerc, setFilePerc] = useState(0);
	const [fileUploadError, setFileUploadError] = useState(false);
	const [formData, setFormData] = useState({});

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

	return (
		<div className="p-3 max-w-lg mx-auto">
			<h1 className="text-3xl font-semibold text-center my-7">Profile</h1>

			<form className="flex flex-col gap-4">
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

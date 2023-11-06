/* eslint-disable no-unused-vars */
import {
	getDownloadURL,
	getStorage,
	ref,
	uploadBytesResumable,
} from "firebase/storage";
import { useState } from "react";
import { app } from "../firebase";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const CreateListing = () => {
	const { currentUser } = useSelector((state) => state.user);
	const navigate = useNavigate();
	const [files, setFiles] = useState([]);
	const [formData, setFormData] = useState({
		imageUrls: [],
		name: "",
		description: "",
		address: "",
		type: "rent",
		bedrooms: 1,
		bathrooms: 1,
		regularPrice: 50,
		discountPrice: 50,
		offer: false,
		parking: false,
		furnished: false,
	});

	const [imageUploadError, setImageUploadError] = useState(false);
	const [uploading, setUploading] = useState(false);
	const [error, setError] = useState(false);
	const [loading, setLoading] = useState(false);

	const storeImage = async (file) => {
		return new Promise((resolve, reject) => {
			const storage = getStorage(app);
			const fileName = new Date().getTime() + file.name;
			const storageRef = ref(storage, fileName);
			const uploadTask = uploadBytesResumable(storageRef, file);
			uploadTask.on(
				"state_changed",
				(snapshot) => {
					const progress = Math.ceil(
						(snapshot.bytesTransferred / snapshot.totalBytes) * 100
					);
					console.log(`Upload is ${progress}% done`);
				},
				(error) => {
					reject(error);
				},
				() => {
					getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
						resolve(downloadURL);
					});
				}
			);
		});
	};

	const handleImageUpload = (e) => {
		if (files.length === 0)
			return setImageUploadError("You have not chosen any images to upload!");
		if (files.length > 0 && files.length + formData.imageUrls.length < 7) {
			setUploading(true);
			setImageUploadError(false);
			const promises = [];

			for (let i = 0; i < files.length; i++) {
				promises.push(storeImage(files[i]));
			}
			Promise.all(promises)
				.then((urls) => {
					setFormData({
						...formData,
						imageUrls: formData.imageUrls.concat(urls),
					});
					setImageUploadError(false);
					setUploading(false);
				})
				.catch((err) => {
					setImageUploadError(
						"Image upload failded (2MB max per image). Please upload other images!"
					);
					setUploading(false);
				});
		} else {
			setImageUploadError("You can only upload 6 images per listing");
			setUploading(false);
		}
	};

	const handleRemoveImage = (index) => {
		setFormData({
			...formData,
			imageUrls: formData.imageUrls.filter((_, i) => i !== index),
		});
	};

	const handleChange = (e) => {
		const idInput = e.target.id;
		const typeInput = e.target.type;
		const valueInput = e.target.value;
		if (idInput === "sale" || idInput === "rent") {
			setFormData({ ...formData, type: idInput });
			return;
		}
		if (
			idInput === "parking" ||
			idInput === "furnished" ||
			idInput === "offer"
		) {
			setFormData({ ...formData, [idInput]: e.target.checked });
			return;
		}
		if (
			typeInput === "number" ||
			typeInput === "text" ||
			typeInput === "textarea"
		) {
			setFormData({
				...formData,
				[idInput]: valueInput,
			});
		}
	};

	const handleSubmit = async (e) => {
		e.preventDefault();

		try {
			if (formData.imageUrls.length === 0)
				return setError("You must upload at least 1 image!");
			// Plus before string number will convert string number to number
			if (+formData.regularPrice < +formData.discountPrice)
				return setError("Discount price must be lower than regular price.");
			setLoading(true);
			setError(false);
			const res = await fetch("/api/listing/create", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					...formData,
					userRef: currentUser._id,
				}),
			});

			const data = await res.json();
			setLoading(false);
			if (data.success === false) {
				setError(data.message);
			}
			navigate("/listing/" + data._id);
		} catch (error) {
			setError(error.message);
			setLoading(false);
		}
	};

	return (
		<main className="p-3 max-w-4xl mx-auto">
			<h1 className="text-3xl font-semibold text-center my-7">
				Create a Listing
			</h1>

			<form
				onSubmit={(e) => handleSubmit(e)}
				className="flex flex-col md:flex-row gap-4">
				<div className="flex flex-col gap-4 flex-1">
					<input
						type="text"
						placeholder="Name"
						className="border p-3 rounded-lg"
						id="name"
						maxLength={62}
						minLength={10}
						required
						onChange={(e) => handleChange(e)}
						value={formData.name}
					/>
					<textarea
						type="text"
						placeholder="Description"
						className="border p-3 rounded-lg"
						id="description"
						required
						onChange={(e) => handleChange(e)}
						value={formData.description}
					/>
					<input
						type="text"
						placeholder="Address"
						className="border p-3 rounded-lg"
						id="address"
						required
						onChange={(e) => handleChange(e)}
						value={formData.address}
					/>
					<div className="flex flex-col gap-4">
						<div className="flex gap-8">
							<div className="flex gap-2">
								<input
									type="radio"
									name="type"
									id="sale"
									className="w-5"
									onChange={(e) => handleChange(e)}
									checked={formData.type === "sale"}
								/>
								<label htmlFor="sale">Sell</label>
							</div>
							<div className="flex gap-2">
								<input
									type="radio"
									name="type"
									id="rent"
									className="w-5"
									onChange={(e) => handleChange(e)}
									checked={formData.type === "rent"}
								/>
								<label htmlFor="rent">Rent</label>
							</div>
						</div>

						<div className="flex gap-8">
							<div className="flex gap-2">
								<input
									type="checkbox"
									name=""
									id="parking"
									className="w-5"
									onChange={(e) => handleChange(e)}
									checked={formData.parking}
								/>
								<label htmlFor="parking">Parking slot</label>
							</div>
							<div className="flex gap-2">
								<input
									type="checkbox"
									name=""
									id="furnished"
									className="w-5"
									onChange={(e) => handleChange(e)}
									checked={formData.furnished}
								/>
								<label htmlFor="furnished">Furnished</label>
							</div>
							<div className="flex gap-2">
								<input
									type="checkbox"
									name=""
									id="offer"
									className="w-5"
									onChange={(e) => handleChange(e)}
									checked={formData.offer}
								/>
								<label htmlFor="offer">Offer</label>
							</div>
						</div>
					</div>
					<div className="flex flex-wrap gap-6">
						<div className="flex gap-2 items-center">
							<input
								className="p-3 border border-gray-300 rounded-lg text-right"
								type="number"
								name=""
								id="bedrooms"
								min={1}
								max={10}
								required
								onChange={(e) => handleChange(e)}
								value={formData.bedrooms}
							/>
							<label htmlFor="bedrooms">Beds</label>
						</div>
						<div className="flex gap-2 items-center">
							<input
								className="p-3 border border-gray-300 rounded-lg text-right"
								type="number"
								name=""
								id="bathrooms"
								min={1}
								max={10}
								required
								onChange={(e) => handleChange(e)}
								value={formData.bathrooms}
							/>
							<label htmlFor="bathrooms">Baths</label>
						</div>
						<div className="flex gap-2 items-center">
							<input
								className="p-3 border border-gray-300 rounded-lg text-right"
								type="number"
								name=""
								id="regularPrice"
								min={50}
								max={1000000}
								required
								onChange={(e) => handleChange(e)}
								value={formData.regularPrice}
							/>
							<label className="flex flex-col items-center" htmlFor="bedrooms">
								<span>Regular price</span>
								{formData.type === "rent" && (
									<span className="text-sm">($ / Month)</span>
								)}
							</label>
						</div>

						{formData.offer && (
							<div className="flex gap-2 items-center">
								<input
									className="p-3 border border-gray-300 rounded-lg text-right"
									type="number"
									name=""
									id="discountPrice"
									required
									onChange={(e) => handleChange(e)}
									value={formData.discountPrice}
								/>
								<label
									className="flex flex-col items-center"
									htmlFor="bedrooms">
									<span>Discount price</span>
									{formData.type === "rent" && (
										<span className="text-sm">($ / Month)</span>
									)}
								</label>
							</div>
						)}
					</div>
				</div>
				<div className="flex flex-col gap-4 flex-1 ">
					<p className="font-semibold ">
						Images:{" "}
						<span className="font-normal text-gray-600 ml-2">
							The first image will be the cover (max 6)
						</span>
					</p>
					<div className="flex gap-4">
						<input
							className="p-3 border border-gray-300 rounded w-full"
							type="file"
							id="images"
							accept="image/*"
							multiple
							onChange={(e) => setFiles(e.target.files)}
						/>
						<button
							className="p-3 text-green-700 border border-green-700 rounded uppercase transition duration-500 hover:bg-green-700 hover:text-white  disabled:opacity-95"
							type="button"
							onClick={(e) => handleImageUpload(e)}>
							{uploading ? "Uploading..." : "Upload"}
						</button>
					</div>
					{imageUploadError ? (
						<p className="text-red-700 text-sm">{imageUploadError}</p>
					) : (
						<></>
					)}
					{formData.imageUrls.length > 0 &&
						formData.imageUrls.map((url, index) => (
							<div
								key={index}
								className="flex justify-between p-3 items-center border">
								<img
									src={url}
									alt="listing image"
									className="w-40 h-40 object-contain rounded-lg"
								/>
								<button
									type="button"
									className="p-3 text-red-700 rounded-lg uppercase"
									onClick={() => handleRemoveImage(index)}>
									Delete
								</button>
							</div>
						))}
					<button
						className="p-3 bg-slate-700 text-white uppercase rounded-lg hover:opacity-95 disabled:opacity-80"
						disabled={loading || uploading}>
						{loading ? "Creating..." : "Create Listing"}
					</button>
					{error && <p className="text-red-700 text-sm">{error}</p>}
				</div>
			</form>
		</main>
	);
};

export default CreateListing;

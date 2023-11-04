const CreateListing = () => {
	return (
		<main className="p-3 max-w-4xl mx-auto">
			<h1 className="text-3xl font-semibold text-center my-7">
				Create a Listing
			</h1>

			<form className="flex flex-col md:flex-row gap-4">
				<div className="flex flex-col gap-4 flex-1">
					<input
						type="text"
						placeholder="Name"
						className="border p-3 rounded-lg"
						id="name"
						maxLength={62}
						minLength={10}
						required
					/>
					<textarea
						type="text"
						placeholder="Description"
						className="border p-3 rounded-lg"
						id="description"
						required
					/>
					<input
						type="text"
						placeholder="Address"
						className="border p-3 rounded-lg"
						id="address"
						required
					/>
					<div className="flex gap-6 flex-wrap">
						<div className="flex gap-2">
							<input type="checkbox" name="" id="sale" className="w-5" />
							<label htmlFor="sale">Sell</label>
						</div>
						<div className="flex gap-2">
							<input type="checkbox" name="" id="rent" className="w-5" />
							<label htmlFor="rent">Rent</label>
						</div>
						<div className="flex gap-2">
							<input type="checkbox" name="" id="parking" className="w-5" />
							<label htmlFor="parking">Parking slot</label>
						</div>
						<div className="flex gap-2">
							<input type="checkbox" name="" id="furnished" className="w-5" />
							<label htmlFor="furnished">Furnished</label>
						</div>
						<div className="flex gap-2">
							<input type="checkbox" name="" id="offer" className="w-5" />
							<label htmlFor="offer">Offer</label>
						</div>
					</div>
					<div className="flex flex-wrap gap-6">
						<div className="flex gap-2 items-center">
							<input
								className="p-3 border border-gray-300 rounded-lg"
								type="number"
								name=""
								id="bedrooms"
								min={1}
								max={10}
								required
							/>
							<label htmlFor="bedrooms">Beds</label>
						</div>
						<div className="flex gap-2 items-center">
							<input
								className="p-3 border border-gray-300 rounded-lg"
								type="number"
								name=""
								id="bathrooms"
								min={1}
								max={10}
								required
							/>
							<label htmlFor="bedrooms">Baths</label>
						</div>
						<div className="flex gap-2 items-center">
							<input
								className="p-3 border border-gray-300 rounded-lg"
								type="number"
								name=""
								id="regularPrice"
								min={1}
								max={10}
								required
							/>
							<label className="flex flex-col items-center" htmlFor="bedrooms">
								<span>Regular price</span>
								<span className="text-sm">($ / Month)</span>
							</label>
						</div>
						<div className="flex gap-2 items-center">
							<input
								className="p-3 border border-gray-300 rounded-lg"
								type="number"
								name=""
								id="discountPrice"
								min={1}
								max={10}
								required
							/>
							<label className="flex flex-col items-center" htmlFor="bedrooms">
								<span>Discount price</span>
								<span className="text-sm">($ / Month)</span>
							</label>
						</div>
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
						/>
						<button className="p-3 text-green-700 border border-green-700 rounded uppercase transition duration-400 hover:bg-green-700 hover:text-white  disabled:opacity-95">
							Upload
						</button>
					</div>
					<button className="p-3 bg-slate-700 text-white uppercase rounded-lg hover:opacity-95 disabled:opacity-80">
						Create Listing
					</button>
				</div>
			</form>
		</main>
	);
};

export default CreateListing;

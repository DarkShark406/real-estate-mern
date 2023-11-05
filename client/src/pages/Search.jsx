import { useState } from "react";

const Search = () => {
	return (
		<main className="flex flex-col md:flex-row">
			<div className="p-7 border-b-2 sm:border-r-2 md:min-h-screen">
				<form className="flex flex-col gap-8">
					<div className="flex items-center gap-2">
						<label
							className="whitespace-nowrap font-semibold"
							htmlFor="searchTerm">
							Search Term:
						</label>
						<input
							className="border rounded-lg p-3 w-full"
							type="text"
							placeholder="Search..."
							id="searchTerm"
						/>
					</div>
					<div className="flex items-center gap-2 flex-wrap">
						<label className="font-semibold">Type: </label>
						<div className="flex gap-2">
							<input className="w-5" type="radio" name="type" id="all" />
							<label htmlFor="all">Rent & Sale</label>
						</div>
						<div className="flex gap-2">
							<input className="w-5" type="radio" name="type" id="rent" />
							<label htmlFor="">Rent</label>
						</div>
						<div className="flex gap-2">
							<input className="w-5" type="radio" name="type" id="sale" />
							<label htmlFor="sale">Sale</label>
						</div>
						<div className="flex gap-2">
							<input className="w-5" type="checkbox" id="offer" />
							<label htmlFor="offer">Offer</label>
						</div>
					</div>
					<div className="flex items-center gap-2 flex-wrap">
						<label className="font-semibold">Amenities: </label>
						<div className="flex gap-2">
							<input className="w-5" type="checkbox" id="offer" />
							<label htmlFor="offer">Parking</label>
						</div>
						<div className="flex gap-2">
							<input className="w-5" type="checkbox" id="offer" />
							<label htmlFor="offer">Furnished</label>
						</div>
					</div>
					<div className="flex items-center gap-6 ">
						<label className="font-semibold">Sort:</label>
						<select className="p-3 rounded-lg border" id="sort_order">
							<option value="">Price high to low</option>
							<option value="">Price low to high</option>
							<option value="">Latest</option>
							<option value="">Oldest</option>
						</select>
					</div>
					<button className="bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95">
						Search
					</button>
				</form>
			</div>
			<div className="">
				<h1 className="text-3xl font-semibold p-3 text-slate-700">
					Listing results:
				</h1>
			</div>
		</main>
	);
};

export default Search;

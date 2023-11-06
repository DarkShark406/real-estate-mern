import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ListingItem from "../components/ListingItem";

const Search = () => {
	const navigate = useNavigate();

	const [sidebarData, setSidebarData] = useState({
		searchTerm: "",
		type: "all",
		offer: false,
		parking: false,
		furnished: false,
		sort: "createdAt",
		order: "desc",
	});
	const [loading, setLoading] = useState(false);
	const [listings, setListings] = useState([]);

	useEffect(() => {
		const urlParams = new URLSearchParams(location.search);
		const searchTermFromUrl = urlParams.get("searchTerm");
		const typeFromUrl = urlParams.get("type");
		const offerFromUrl = urlParams.get("offer");
		const parkingFromUrl = urlParams.get("parking");
		const furnishedFromUrl = urlParams.get("furnished");
		const sortFromUrl = urlParams.get("sort");
		const orderFromUrl = urlParams.get("order");

		if (
			searchTermFromUrl ||
			typeFromUrl ||
			offerFromUrl ||
			parkingFromUrl ||
			furnishedFromUrl ||
			sortFromUrl ||
			orderFromUrl
		) {
			setSidebarData({
				searchTerm: searchTermFromUrl,
				type: typeFromUrl,
				offer: offerFromUrl === "true" ? true : false,
				parking: parkingFromUrl === "true" ? true : false,
				furnished: furnishedFromUrl === "true" ? true : false,
				sort: sortFromUrl,
				order: orderFromUrl,
			});
		}

		const fetchListings = async () => {
			setLoading(true);
			const searchQuery = urlParams.toString();
			const res = await fetch("/api/listing/search?" + searchQuery);
			const data = await res.json();

			setListings(data);
			setLoading(false);
		};

		fetchListings();
	}, [location.search]);

	const handleChange = (e) => {
		const inputId = e.target.id;
		const inputValue = e.target.value;

		if (inputId === "all" || inputId === "rent" || inputId === "sale") {
			setSidebarData({ ...sidebarData, type: inputId });
			return;
		}

		if (inputId === "searchTerm") {
			setSidebarData({ ...sidebarData, searchTerm: inputValue });
			return;
		}

		if (
			inputId === "offer" ||
			inputId === "parking" ||
			inputId === "furnished"
		) {
			setSidebarData({ ...sidebarData, [inputId]: e.target.checked });
			return;
		}

		if (inputId === "sort_order") {
			const sort = inputValue.split("_")[0] || "createAt";
			const order = inputValue.split("_")[1] || "desc";
			setSidebarData({ ...sidebarData, sort, order });
			return;
		}
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		const urlParams = new URLSearchParams();
		urlParams.set("searchTerm", sidebarData.searchTerm);
		urlParams.set("type", sidebarData.type);
		urlParams.set("parking", sidebarData.parking);
		urlParams.set("furnished", sidebarData.furnished);
		urlParams.set("offer", sidebarData.offer);
		urlParams.set("sort", sidebarData.sort);
		urlParams.set("order", sidebarData.order);
		const searchQuery = urlParams.toString();
		navigate("/search?" + searchQuery);
	};

	console.log(listings);

	return (
		<main className="flex flex-col md:flex-row">
			<div className="p-7 border-b-2 sm:border-r-2 md:min-h-screen">
				<form className="flex flex-col gap-8" onSubmit={(e) => handleSubmit(e)}>
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
							value={sidebarData.searchTerm}
							onChange={(e) => handleChange(e)}
						/>
					</div>
					<div className="flex items-center gap-2 flex-wrap">
						<label className="font-semibold">Type: </label>
						<div className="flex gap-2">
							<input
								className="w-5"
								type="radio"
								name="type"
								id="all"
								checked={sidebarData.type === "all"}
								onChange={(e) => handleChange(e)}
							/>
							<label htmlFor="all">Rent & Sale</label>
						</div>
						<div className="flex gap-2">
							<input
								className="w-5"
								type="radio"
								name="type"
								id="rent"
								checked={sidebarData.type === "rent"}
								onChange={(e) => handleChange(e)}
							/>
							<label htmlFor="">Rent</label>
						</div>
						<div className="flex gap-2">
							<input
								className="w-5"
								type="radio"
								name="type"
								id="sale"
								checked={sidebarData.type === "sale"}
								onChange={(e) => handleChange(e)}
							/>
							<label htmlFor="sale">Sale</label>
						</div>
						<div className="flex gap-2">
							<input
								className="w-5"
								type="checkbox"
								id="offer"
								checked={sidebarData.offer}
								onChange={(e) => handleChange(e)}
							/>
							<label htmlFor="offer">Offer</label>
						</div>
					</div>
					<div className="flex items-center gap-2 flex-wrap">
						<label className="font-semibold">Amenities: </label>
						<div className="flex gap-2">
							<input
								className="w-5"
								type="checkbox"
								id="parking"
								checked={sidebarData.parking}
								onChange={(e) => handleChange(e)}
							/>
							<label htmlFor="parking">Parking</label>
						</div>
						<div className="flex gap-2">
							<input
								className="w-5"
								type="checkbox"
								id="furnished"
								checked={sidebarData.furnished}
								onChange={(e) => handleChange(e)}
							/>
							<label htmlFor="furnished">Furnished</label>
						</div>
					</div>
					<div className="flex items-center gap-6 ">
						<label className="font-semibold">Sort:</label>
						<select
							className="p-3 rounded-lg border"
							id="sort_order"
							defaultValue={"createdAt_desc"}
							onChange={(e) => handleChange(e)}>
							<option value="regularPrice_desc">Price high to low</option>
							<option value="regularPrice_asc">Price low to high</option>
							<option value="createdAt_desc">Latest</option>
							<option value="createdAt_asc">Oldest</option>
						</select>
					</div>
					<button className="bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95">
						Search
					</button>
				</form>
			</div>
			<div className="flex-1">
				<h1 className="text-3xl font-semibold p-3 text-slate-700">
					Listing results:
				</h1>
				<div className="p-7 flex flex-wrap gap-4 justify-center">
					{!loading && listings.length === 0 && (
						<p className="text-slate-700">No listing found</p>
					)}

					{loading && <p className="text-slate-700 text-center">Loading...</p>}

					{!loading &&
						listings &&
						listings.map((listing) => (
							<ListingItem key={listing._id} listing={listing} />
						))}
				</div>
			</div>
		</main>
	);
};

export default Search;

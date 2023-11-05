import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore from "swiper";
import { useSelector } from "react-redux";
import { Navigation } from "swiper/modules";
import "swiper/css/bundle";
import {
	FaBath,
	FaBed,
	FaChair,
	FaMapMarkedAlt,
	FaParking,
} from "react-icons/fa";
import Contact from "../components/Contact";

const Listing = () => {
	const params = useParams();
	const { currentUser } = useSelector((state) => state.user);

	const [listing, setListing] = useState(null);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(false);
	const [copied, setCopied] = useState(false);
	const [contact, setContact] = useState(false);

	// Swiper
	SwiperCore.use([Navigation]);

	useEffect(() => {
		const fetchListing = async () => {
			try {
				setLoading(true);
				const listingId = params.listingId;
				const res = await fetch("/api/listing/get/" + listingId);
				const data = await res.json();

				if (data.success === false) {
					setError(true);
					setLoading(false);
					return;
				}

				setListing(data);
				setLoading(false);
				setError(false);
			} catch (error) {
				setError(true);
				setLoading(false);
			}
		};

		fetchListing();
	}, []);

	return (
		<main>
			{loading && <p className="text-center my-7">Loading...</p>}{" "}
			{error && (
				<p className="text-red-700 my-7 text-center">Something went wrong!</p>
			)}
			{listing && !loading && !error && (
				<>
					<Swiper navigation>
						{listing.imageUrls.map((imageUrl) => (
							<SwiperSlide key={imageUrl}>
								<div
									className="h-[550px]"
									style={{
										background: `url(${imageUrl}) center no-repeat`,
										backgroundSize: "cover",
									}}></div>
							</SwiperSlide>
						))}
					</Swiper>

					<div className="flex flex-col max-w-4xl mx-auto p-3 my-7 gap-3">
						<h1 className="text-3xl font-semibold">
							{listing.name} - ${" "}
							{listing.offer
								? listing.discountPrice.toLocaleString("en-US")
								: listing.regularPrice.toLocaleString("en-US")}
							{listing.type === "rent" ? " / month" : ""}
						</h1>

						<p className="flex items-center text-slate-600 text-sm gap-2">
							<FaMapMarkedAlt className="text-green-700" />
							{listing.address}
						</p>
						<div className="flex items-center gap-4">
							<p className="bg-red-900 w-full max-w-[200px] text-white text-center p-1 rounded-md">
								{listing.type === "sale" ? "For Sale" : "For rent"}
							</p>
							{listing.offer && (
								<p className="bg-green-900 w-full max-w-[200px] text-white text-center p-1 rounded-md">
									${listing.regularPrice - listing.discountPrice} discount
								</p>
							)}
						</div>
						<p className="text-slate-800">
							<span className="font-semibold text-black">Description - </span>
							{listing.description}
						</p>
						<ul className="flex items-center gap-4 flex-wrap text-green-900 font-semibold text-sm">
							<li className="flex items-center gap-1 ">
								<FaBed className="text-lg" />
								{listing.bedrooms} {listing.bedrooms > 1 ? "Beds" : "Bed"}
							</li>
							<li className="flex items-center gap-1 ">
								<FaBath className="text-lg" />
								{listing.bathrooms} {listing.bathrooms > 1 ? "Baths" : "Bath"}
							</li>
							<li className="flex items-center gap-1 ">
								<FaParking className="text-lg" />
								{listing.parking ? "Parking spot" : "No parking"}
							</li>
							<li className="flex items-center gap-1 ">
								<FaChair className="text-lg" />
								{listing.parking ? "Furnished" : "Not furnished"}
							</li>
						</ul>

						{currentUser && listing.userRef !== currentUser._id && !contact && (
							<button
								className="bg-slate-700 uppercase text-white rounded-lg hover:opacity-95 p-3"
								onClick={() => setContact(true)}>
								Contactl landlord
							</button>
						)}
						{contact && <Contact listing={listing} />}
					</div>
				</>
			)}
		</main>
	);
};

export default Listing;

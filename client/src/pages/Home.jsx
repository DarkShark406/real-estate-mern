import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ListingItem from "../components/ListingItem";
// Swiper
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css/bundle";
import { Navigation } from "swiper/modules";
import SwiperCore from "swiper";

const Home = () => {
	const [offerlistings, setOfferListings] = useState([]);
	const [salelistings, setSaleListings] = useState([]);
	const [rentlistings, setRentListings] = useState([]);

	SwiperCore.use([Navigation]);

	useEffect(() => {
		const fetchOfferListings = async () => {
			try {
				const res = await fetch("/api/listing/search?offer=true&limit=3");
				const data = await res.json();
				setOfferListings(data);

				fetchRentListings();
			} catch (error) {
				console.log(error);
			}
		};

		const fetchRentListings = async () => {
			try {
				const res = await fetch("/api/listing/search?type=rent&limit=3");
				const data = await res.json();
				setRentListings(data);

				fetchSaleListings();
			} catch (error) {
				console.log(error);
			}
		};

		const fetchSaleListings = async () => {
			try {
				const res = await fetch("/api/listing/search?type=sale&limit=3");
				const data = await res.json();
				setSaleListings(data);
			} catch (error) {
				console.log(error);
			}
		};

		fetchOfferListings();
	}, []);
	return (
		<div>
			{/* top */}
			<div className="flex flex-col gap-6 py-28 px-3 max-w-7xl mx-auto">
				<h1 className="text-slate-700 font-bold text-3xl lg:text-7xl">
					Find your next <span className="text-slate-500">perfect</span>
					<br />
					place with ease
				</h1>
				<div className="text-gray-400 text-xs sm:text-sm">
					DarkShark Estate will help you find your home fast, easy and
					comfortable.
					<br />
					Our expert support are always available.
				</div>
				<Link
					to={"/search"}
					className="text-xs sm:text-sm text-blue-800 font-bold hover:underline">
					Let&apos;s start now.
				</Link>
			</div>
			{/* swiper */}

			<Swiper navigation>
				{offerlistings.length > 0 &&
					offerlistings.map((listing) => (
						<SwiperSlide key={listing._id}>
							<div
								className="h-[500px]"
								style={{
									background: `url(${listing.imageUrls[0]}) center no-repeat`,
									backgroundSize: "cover",
								}}></div>
						</SwiperSlide>
					))}
			</Swiper>

			{/* listing results for offer, sale and rent */}
			<div className="max-w-7xl mx-auto p-3 flex flex-col">
				{offerlistings.length > 0 && (
					<div className="my-3">
						<h2 className="text-2xl font-semibold text-slate-600">
							Recent Offers
						</h2>
						<Link
							to={"/search?offer=true"}
							className="text-sm text-blue-700 hover:underline">
							Show more offers
						</Link>
						<div className="flex gap-6 mt-4 flex-wrap justify-center md:justify-start">
							{offerlistings.map((listing) => (
								<div
									className="xl:w-[calc(33%-20px)] md:w-[calc(45%-20px)] max-w-[450px] w-full"
									key={listing._id}>
									<ListingItem listing={listing} />
								</div>
							))}
						</div>
					</div>
				)}

				{/* Rent */}
				{rentlistings.length > 0 && (
					<div className="my-3">
						<h2 className="text-2xl font-semibold text-slate-600">
							Recent places for rent
						</h2>
						<Link
							to={"/search?rent=true"}
							className="text-sm text-blue-700 hover:underline">
							Show more places for rent
						</Link>
						<div className="flex gap-6 mt-4 flex-wrap justify-center md:justify-start">
							{rentlistings.map((listing) => (
								<div
									className="xl:w-[calc(33%-20px)] md:w-[calc(45%-20px)] max-w-[450px] w-full"
									key={listing._id}>
									<ListingItem listing={listing} />
								</div>
							))}
						</div>
					</div>
				)}

				{/* Sale */}
				{salelistings.length > 0 && (
					<div className="my-3">
						<h2 className="text-2xl font-semibold text-slate-600">
							Recent places for sale
						</h2>
						<Link
							to={"/search?sale=true"}
							className="text-sm text-blue-700 hover:underline">
							Show more places for sale
						</Link>
						<div className="flex gap-6 mt-4 flex-wrap justify-center md:justify-start">
							{salelistings.map((listing) => (
								<div
									className="xl:w-[calc(33%-20px)] md:w-[calc(45%-20px)] max-w-[450px] w-full"
									key={listing._id}>
									<ListingItem listing={listing} />
								</div>
							))}
						</div>
					</div>
				)}
			</div>
		</div>
	);
};

export default Home;

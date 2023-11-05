import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore from "swiper";
import { Navigation } from "swiper/modules";
import "swiper/css/bundle";
const Listing = () => {
	const params = useParams();

	const [listing, setListing] = useState(null);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(false);

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
					<h1>{listing.name}</h1>

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
				</>
			)}
		</main>
	);
};

export default Listing;

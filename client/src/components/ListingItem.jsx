/* eslint-disable react/prop-types */
import { Link } from "react-router-dom";
import { MdLocationOn } from "react-icons/md";

const ListingItem = ({ listing }) => {
	return (
		<div className="bg-white show-md hover:shadow-lg transition-shadow overflow-hidden rounded-lg sm:w-full xl:w-[calc(50%-10px)] 2xl:w-[calc(33%-10px)]">
			<Link to={"/listing/" + listing._id}>
				<img
					src={
						listing.imageUrls[0] ||
						"https://www.cio.com/wp-content/uploads/2023/07/shutterstock_676661263.jpg?quality=50&strip=all&w=1024"
					}
					alt="listing cover"
					className="h-[320px] w-full sm:h-[220px] object-cover hover:scale-105 transition-scale duration-300"
				/>
				<div className="p-3 flex flex-col gap-2 w-full">
					<p className="text-lg font-semibold text-slate-700 truncate">
						{listing.name}
					</p>
					<div className="flex items-center gap-2">
						<MdLocationOn className="text-green-700 h-4 w-4" />
						<p className="text-sm text-gray-600 truncate">{listing.address}</p>
					</div>
					<p className="text-sm text-slate-700 line-clamp-2">
						{listing.address}
					</p>
					<p className="text-slate-700 font-semibold">
						${" "}
						{listing.offer
							? listing.discountPrice.toLocaleString("en-Us")
							: listing.regularPrice.toLocaleString("en-Us")}{" "}
						{listing.type === "rent" ? " / month" : ""}
					</p>
					<div className="flex items-center gap-4 text-slate-700">
						<div className="font-bold text-sm">
							{listing.bedrooms > 1
								? `${listing.bedrooms} beds`
								: `${listing.bedrooms} bed`}
						</div>
						<div className="font-bold text-sm">
							{listing.bathrooms > 1
								? `${listing.bathrooms} beds`
								: `${listing.bathrooms} bed`}
						</div>
					</div>
				</div>
			</Link>
		</div>
	);
};

export default ListingItem;

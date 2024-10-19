import { useParams } from 'react-router-dom';
import React from 'react';
import { trendingCoupons } from '../constants/constants'; // Import the dummy data
import './deals.css'

export const TrendingCoupons = () => {
    const { location } = useParams();
    console.log(location)

    const coupons = trendingCoupons[location.toLowerCase()] || [];
    console.log(coupons)
    return (
        <div className="dealsPage">
            <h1>Trending coupons in {location}</h1>
            <div className="deals-list">
                {coupons.length > 0 ? (
                    coupons.map((coupon, index) => (
                        <div key={index} className="deal-card">
                            <img src={coupon.picture} alt={coupon.name} className="deal-image" />
                            <h3>{coupon.name}</h3>
                            <p>Price: {coupon.price}</p>
                            <p>Rating: {coupon.rating} ★</p>
                        </div>
                    ))
                ) : (
                    <p>No coupons available for this location.</p>
                )}
            </div>
        </div>
    )
}
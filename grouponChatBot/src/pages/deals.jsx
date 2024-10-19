import React from 'react';
import { useParams } from 'react-router-dom';
import { dealsData } from '../constants/constants'; // Import the dummy data
import '../assets/css/deals.css';

export const DealsPage = () => {
    const { category, location } = useParams(); // Get the category and location from the URL
    console.log(category, location)
    // Fetch the relevant deals based on the category and location
    const deals = dealsData[location.toLowerCase()]?.[category.charAt(0).toUpperCase() + category.slice(1)] || [];
    console.log(deals)

    return (
        <div className="dealsPage">
            <h1>Deals for {category} in {location}</h1>

            {/* Render the deals as cards */}
            <div className="deals-list">
                {deals.length > 0 ? (
                    deals.map((deal, index) => (
                        <div key={index} className="deal-card">
                            <img src={deal.picture} alt={deal.name} className="deal-image" />
                            <h3>{deal.name}</h3>
                            <p>Price: {deal.price}</p>
                            <p>Rating: {deal.rating} ★</p>
                        </div>
                    ))
                ) : (
                    <p>No deals available for this category and location.</p>
                )}
            </div>
        </div>
    );
};

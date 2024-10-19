
import spa1 from '../assets/images/spa1.png';
import spa2 from '../assets/images/spa2.png';
import spa3 from '../assets/images/spa3.png';
import things1 from '../assets/images/things1.png';
import things2 from '../assets/images/things2.png';
import things3 from '../assets/images/things3.png';
import gifts1 from '../assets/images/gifts1.png';
import gifts2 from '../assets/images/gifts2.png';
import gifts3 from '../assets/images/gifts3.png';
import auto1 from '../assets/images/auto1.png';
import auto2 from '../assets/images/auto2.png';
import auto3 from '../assets/images/auto3.png';
import food1 from '../assets/images/food1.png';
import food2 from '../assets/images/food2.png';
import food3 from '../assets/images/food3.png';
import travel1 from '../assets/images/travel1.png';
import travel2 from '../assets/images/travel2.png';
import travel3 from '../assets/images/travel3.png';


export const dealsData = {
    pittsburgh: {
        "Beauty & Spa": [
            {
                picture: spa1,
                name: 'Relaxation Spa Package',
                price: '$120',
                rating: 4.5
            },
            {
                picture: spa2,
                name: 'Luxury Facial Treatment',
                price: '$95',
                rating: 4.7
            },
            {
                picture: spa3,
                name: 'Massage & Sauna',
                price: '$75',
                rating: 4.3
            }
        ],
        "Things To Do": [
            {
                picture: things1,
                name: 'Escape Room Challenge',
                price: '$30',
                rating: 4.8
            },
            {
                picture: things2,
                name: 'Outdoor Adventure Tour',
                price: '$65',
                rating: 4.6
            },
            {
                picture: things3,
                name: 'City Bike Tour',
                price: '$45',
                rating: 4.4
            }
        ],
    },
    'new york': {
        "Gifts": [
            {
                picture: gifts1,
                name: 'Helicoptor Ride',
                price: '$50',
                rating: 4.9
            },
            {
                picture: gifts2,
                name: 'Botox Treatment',
                price: '$40',
                rating: 4.7
            },
            {
                picture: gifts3,
                name: 'Empire State Building Passes',
                price: '$70',
                rating: 4.8
            }
        ],
        "Auto & Home": [
            {
                picture: auto1,
                name: 'Car Driving Lessons',
                price: '$150',
                rating: 4.6
            },
            {
                picture: auto2,
                name: 'Car Cleaning Service',
                price: '$200',
                rating: 4.8
            },
            {
                picture: auto3,
                name: 'Motorcycling Riding Sessions',
                price: '$180',
                rating: 4.5
            }
        ],
    },
    austin: {
        "Food & Drink": [
            {
                picture: food1,
                name: 'BBQ Feast for Two',
                price: '$45',
                rating: 4.7
            },
            {
                picture: food2,
                name: 'Fine Dining Experience',
                price: '$150',
                rating: 4.9
            },
            {
                picture: food3,
                name: 'Craft Brewery Tour',
                price: '$60',
                rating: 4.6
            }
        ],
        "Travel": [
            {
                picture: travel1,
                name: 'Weekend Getaway',
                price: '$400',
                rating: 4.8
            },
            {
                picture: travel2,
                name: 'City Hotel Stay',
                price: '$250',
                rating: 4.5
            },
            {
                picture: travel3,
                name: 'Guided Hiking Trip',
                price: '$100',
                rating: 4.7
            }
        ],
    }
};


export const trendingCoupons = {
    pittsburgh: [
        {
            picture: spa1,
            name: 'Relaxation Spa Package',
            price: '$120',
            rating: 4.5
        },
        {
            picture: spa2,
            name: 'Luxury Facial Treatment',
            price: '$95',
            rating: 4.7
        },
        {
            picture: things2,
            name: 'Outdoor Adventure Tour',
            price: '$65',
            rating: 4.6
        }
    ],
    'new york': [
        {
            picture: gifts2,
            name: 'Botox Treatment',
            price: '$40',
            rating: 4.7
        },
        {
            picture: gifts3,
            name: 'Empire State Building Passes',
            price: '$70',
            rating: 4.8
        },
        {
            picture: auto3,
            name: 'Motorcycling Riding Sessions',
            price: '$180',
            rating: 4.5
        }
    ],
    austin: [
        {
            picture: food1,
            name: 'BBQ Feast for Two',
            price: '$45',
            rating: 4.7
        },
        {
            picture: food2,
            name: 'Fine Dining Experience',
            price: '$150',
            rating: 4.9
        },
        {
            picture: travel3,
            name: 'Guided Hiking Trip',
            price: '$100',
            rating: 4.7
        }

    ],

}
import React, { useState } from 'react';
import { QrCode, ChevronLeft, ChevronRight } from 'lucide-react';

interface GiftCard {
  id: string;
  title: string;
  price: number;
  image: string;
  brand: string;
}

export function DigitalGiftingPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const cardsPerPage = 8;

  const giftCards: GiftCard[] = [
    {
      id: '1',
      title: 'Flower Chimp Gift Card',
      price: 50.00,
      image: 'https://images.unsplash.com/photo-1561181286-d3fee7d55364?auto=format&fit=crop&q=80&w=600',
      brand: 'Flower Chimp'
    },
    {
      id: '2',
      title: 'CakeRush Gift Card',
      price: 50.00,
      image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&q=80&w=600',
      brand: 'CakeRush'
    },
    {
      id: '3',
      title: 'LVLY Gift Card',
      price: 50.00,
      image: 'https://images.unsplash.com/photo-1519378058457-4c29a0a2efac?auto=format&fit=crop&q=80&w=600',
      brand: 'LVLY'
    },
    {
      id: '4',
      title: 'Zalora Gift Card',
      price: 50.00,
      image: 'https://images.unsplash.com/photo-1607083206869-4c7672e72a8a?auto=format&fit=crop&q=80&w=600',
      brand: 'Zalora'
    },
    {
      id: '5',
      title: 'Uniqlo Gift Card',
      price: 50.00,
      image: 'https://images.unsplash.com/photo-1607083206869-4c7672e72a8a?auto=format&fit=crop&q=80&w=600',
      brand: 'Uniqlo'
    },
    {
      id: '6',
      title: 'Mimone Gift Card',
      price: 50.00,
      image: 'https://images.unsplash.com/photo-1607083206869-4c7672e72a8a?auto=format&fit=crop&q=80&w=600',
      brand: 'Mimone'
    },
    {
      id: '7',
      title: 'Kurin Gift Card',
      price: 50.00,
      image: 'https://images.unsplash.com/photo-1607083206869-4c7672e72a8a?auto=format&fit=crop&q=80&w=600',
      brand: 'Kurin'
    },
    {
      id: '8',
      title: 'Grab Gift Card',
      price: 50.00,
      image: 'https://images.unsplash.com/photo-1607083206869-4c7672e72a8a?auto=format&fit=crop&q=80&w=600',
      brand: 'Grab'
    },
    // Additional cards for pagination demo
    {
      id: '9',
      title: 'Starbucks Gift Card',
      price: 50.00,
      image: 'https://images.unsplash.com/photo-1607083206869-4c7672e72a8a?auto=format&fit=crop&q=80&w=600',
      brand: 'Starbucks'
    },
    {
      id: '10',
      title: 'Sephora Gift Card',
      price: 50.00,
      image: 'https://images.unsplash.com/photo-1607083206869-4c7672e72a8a?auto=format&fit=crop&q=80&w=600',
      brand: 'Sephora'
    }
  ];

  // Get current cards
  const indexOfLastCard = currentPage * cardsPerPage;
  const indexOfFirstCard = indexOfLastCard - cardsPerPage;
  const currentCards = giftCards.slice(indexOfFirstCard, indexOfLastCard);
  const totalPages = Math.ceil(giftCards.length / cardsPerPage);

  // Change page
  const paginate = (pageNumber: number) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const nextPage = () => {
    if (currentPage < totalPages) {
      paginate(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      paginate(currentPage - 1);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center">
            <div className="p-3 bg-amber-50 rounded-full mr-4">
              <QrCode className="h-6 w-6 text-amber-500" />
            </div>
            <h1 className="text-2xl font-bold text-amber-500">Digital Gifts</h1>
          </div>
        </div>

        {/* Gift Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-8">
          {currentCards.map((card) => (
            <div key={card.id} className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
              <div className="relative aspect-[4/3]">
                <img
                  src={card.image}
                  alt={card.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 left-4 px-3 py-1 bg-white/90 rounded-full text-sm font-medium">
                  {card.brand}
                </div>
                <div className="absolute top-4 right-4 px-3 py-1 bg-black/80 text-white rounded-full text-sm font-medium">
                  RM{card.price.toFixed(2)}
                </div>
              </div>
              <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  {card.title}
                </h3>
                <button className="w-full flex items-center justify-center px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-lg text-sm font-medium transition-colors">
                  <QrCode className="h-4 w-4 mr-2" />
                  View
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2">
            <button
              onClick={prevPage}
              disabled={currentPage === 1}
              className="p-2 rounded-lg text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((number) => (
              <button
                key={number}
                onClick={() => paginate(number)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  currentPage === number
                    ? 'bg-amber-500 text-white'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                {number}
              </button>
            ))}

            <button
              onClick={nextPage}
              disabled={currentPage === totalPages}
              className="p-2 rounded-lg text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
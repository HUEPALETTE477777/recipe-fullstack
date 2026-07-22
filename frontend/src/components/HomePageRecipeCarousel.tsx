import React, { useState } from 'react'

const HomePageRecipeCarousel = ({ urls }: { urls?: string[] }) => {
    const [currentIndex, setCurrentIndex] = useState(0);

    const urlsRef = urls || [];
    if (urlsRef.length === 0) {
        return (
            <div className="w-full h-48 bg-gray-200 mb-2 flex items-center justify-center text-gray-400">
                <span className="text-sm font-medium">No Preview Image Available</span>
            </div>
        );
    }

    const prevSlide = (evt: React.MouseEvent) => {
        evt.preventDefault();
        setCurrentIndex((idx) => (idx === 0 ? urlsRef.length - 1 : idx - 1));
    }

    const nextSlide = (evt: React.MouseEvent) => {
        evt.preventDefault();
        setCurrentIndex((idx) => (idx === urlsRef.length - 1 ? 0 : idx + 1));
    }

    return (
        <div className="relative w-full overflow-hidden group bg-gray-50">
            <img
                src={urlsRef[currentIndex]}
                className="w-full h-full object-cover select-none"
            />

            {urlsRef.length > 1 && (
                <>
                    <button
                        onClick={prevSlide}
                        className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/80 text-white w-7 h-7 rounded-full flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer z-10"
                    >
                        ❮
                    </button>
                    <button
                        onClick={nextSlide}
                        className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/80 text-white w-7 h-7 rounded-full flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer z-10"
                    >
                        ❯
                    </button>

                    <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
                        {urlsRef.map((_, idx) => (
                            <div
                                key={idx}
                                className={`w-1.5 h-1.5 rounded-full transition-all ${
                                    idx === currentIndex ? "bg-white scale-125 border-black border" : "bg-white/50"
                                }`}
                            />
                        ))}
                    </div>
                </>
            )}
        </div>
    )
}

export default HomePageRecipeCarousel;
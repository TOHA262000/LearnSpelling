import React, { useState } from "react";
import WordData from "../../data/WordData";
import formatCategoryName from "../../components/formatCategoryName";
export default function WordManagement() {
    const categories = Object.keys(WordData); // e.g. ['daysOfWeek', 'monthsOfYear', ...]

    const [selectedCategory, setSelectedCategory] = useState(categories[0]);
    const [sortOrder, setSortOrder] = useState("asc"); // "asc" or "desc"

    // Get words from selected category
    const words = WordData[selectedCategory] || [];

    // Sort words alphabetically based on sortOrder
    const sortedWords = [...words].sort((a, b) => {
        if (sortOrder === "asc") return a.localeCompare(b);
        else return b.localeCompare(a);
    });

    return (
        <div className="max-w-4xl mx-auto p-6 bg-white rounded shadow">
            <h1 className="text-2xl font-bold mb-4">Word Management</h1>

            {/* Category selection */}
            <div className="mb-4">
                <label className="mr-2 font-semibold">Select Category:</label>
                <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="border border-gray-300 rounded px-2 py-1"
                >
                    {categories.map((cat) => (
                        <option key={cat} value={cat}>
                            {formatCategoryName(cat)}
                        </option>
                    ))}

                </select>
            </div>

            {/* Sort order toggle */}
            <div className="mb-4">
                <label className="mr-2 font-semibold">Sort Order:</label>
                <button
                    onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
                    className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
                >
                    {sortOrder === "asc" ? "Ascending ▲" : "Descending ▼"}
                </button>
            </div>

            {/* Word list */}
            <ul className="border border-gray-300 rounded max-h-96 overflow-y-auto p-2">
                {sortedWords.length > 0 ? (
                    sortedWords.map((word, i) => (
                        <li key={i} className="py-1 border-b last:border-b-0">
                            {word}
                        </li>
                    ))
                ) : (
                    <li>No words available.</li>
                )}
            </ul>
        </div>
    );
}

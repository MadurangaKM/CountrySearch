/* eslint-disable @next/next/no-img-element */
'use client' //
import React, { useState, useEffect } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faTimes } from "@fortawesome/free-solid-svg-icons";
import Image from "next/image";
import SelectedCountryDisplay from "./SelectedCountry";

const CountrySearch: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState<string>("");
    const [countries, setCountries] = useState<any[]>([]);
    const [selectedCountry, setSelectedCountry] = useState<any | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [noData, setNoData] = useState<boolean>(false);
    const [searchError, setSearchError] = useState<string | null>(null);

    const isSearchTermValid = searchTerm.length >= 3;
    const selectedOptionClass = "border-2 border-blue-500";

    useEffect(() => {
        const fetchData = async () => {
            if (!isSearchTermValid) {
                return;
            }

            setLoading(true);
            setNoData(false);
            setSearchError(null);

            try {
                const response = await axios.get(
                    `https://restcountries.com/v3/name/${searchTerm}`
                );
                setCountries(response.data);
                setNoData(response.data.length === 0);
            } catch (err) {
                setNoData(true);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [searchTerm, isSearchTermValid]);

    const handleSelectCountry = (country: any) => {
        setSelectedCountry(country);
    };

    const clearSearch = () => {
        setSearchTerm("");
        setSelectedCountry(null);
        setSearchError(null);
        setNoData(false);
    };

    return (
        <div className="container mx-auto p-4 text-center  md:w-1/2 md:mt-15">
            <h1 className="text-2xl font-semibold mb-4 tracking-tight">Country Search</h1>
            <div className="relative w-full mb-4 ">
                <input
                    type="text"
                    placeholder="Search for a country..."
                    value={searchTerm}
                    onChange={(e) => {
                        const term = e.target.value;
                        setSearchTerm(term);
                        if (term.length < 3 && term.length !== 0) {
                            setSearchError("Search term must be at least 3 characters.");
                            setNoData(false);
                            setSelectedCountry(null);
                        } else {
                            setSearchError(null);
                            setNoData(false);
                        }
                    }}
                    className="w-full px-10 py-5 border rounded-lg shadow-lg focus:outline-none   focus:border-blue-500 pl-12 "
                />
                {searchTerm && (
                    <span
                        className="absolute right-10 top-6 text-gray-400 cursor-pointer"
                        onClick={clearSearch}
                    >
                        <FontAwesomeIcon icon={faTimes} />
                    </span>
                )}
                <span className="absolute left-5 top-6 text-gray-400">
                    <FontAwesomeIcon icon={faSearch} />
                </span>
            </div>
            {searchError && <p className="my-4 text-red-500 text-left">{searchError}</p>}
            {loading && <p className="my-4 text-gray-500">Loading...</p>}
            {noData && <p className="my-4 text-gray-500">No countries found for the search term.</p>}
            {isSearchTermValid && !loading && !noData && (
                <div className="mt-4 mb-10">
                    <ul className="w-full h-60 overflow-y-auto border rounded-lg shadow-lg mt-4">
                        {countries.map((country) => (
                            <li
                                key={country.name.common}
                                onClick={() => handleSelectCountry(country)}
                                className={`cursor-pointer bg-white rounded-lg p-4 m-2 transition-all hover:shadow-md flex items-center ${selectedCountry === country ? selectedOptionClass : ""
                                    }`}
                            >
                                <Image
                                    src={country.flags[0]}
                                    alt="Flag"
                                    className="w-10 h-10 object-cover rounded-full mr-4"
                                    width={100}
                                    height={40}
                                />
                                <span>{country.name.common}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
            {selectedCountry && searchTerm.length >= 3 && !loading && !noData && (
                <SelectedCountryDisplay country={selectedCountry} />
            )}

        </div>
    );
};

export default CountrySearch;

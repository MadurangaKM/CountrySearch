/* eslint-disable @next/next/no-img-element */
'use client' //
import React, { useState, useEffect } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faTimes } from "@fortawesome/free-solid-svg-icons";
import Image from "next/image";

const CountrySearch: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState<string>("");
    const [countries, setCountries] = useState<any[]>([]);
    const [selectedCountry, setSelectedCountry] = useState<any | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [noData, setNoData] = useState<boolean>(false);
    const [searchError, setSearchError] = useState<string | null>(null);

    const isSearchTermValid = searchTerm.length >= 3;

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
        <div className="container mx-auto p-4 text-center">
            <h1 className="text-2xl font-bold mb-4">Country Information App</h1>
            <div className="relative w-full mb-4">
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
                        } else {
                            setSearchError(null);
                            setNoData(false);
                        }
                    }}
                    className="w-full px-4 py-2 border rounded shadow-md focus:outline-none focus:ring focus:border-blue-300 pl-12"
                />
                {searchTerm && (
                    <span
                        className="absolute right-4 top-3 text-gray-400 cursor-pointer"
                        onClick={clearSearch}
                    >
                        <FontAwesomeIcon icon={faTimes} />
                    </span>
                )}
                <span className="absolute left-3 top-3 text-gray-400">
                    <FontAwesomeIcon icon={faSearch} />
                </span>
            </div>
            {searchError && <p className="my-4 text-red-500">{searchError}</p>}
            {loading && <p className="my-4 text-gray-500">Loading...</p>}
            {noData && <p className="my-4 text-gray-500">No data found.</p>}
            {isSearchTermValid && !loading && !noData && (
                <div className="mt-4">
                    <ul>
                        {countries.map((country) => (
                            <li
                                key={country.name.common}
                                onClick={() => handleSelectCountry(country)}
                                className="cursor-pointer bg-white rounded-lg p-4 m-2 transition-all hover:shadow-md flex items-center"
                            >
                                <Image
                                    src={country.flags[0]}
                                    alt="Flag"
                                    className="w-10 h-10 object-cover rounded-full mr-4"
                                    width={40}
                                    height={40}
                                />
                                <span>{country.name.common}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
            {selectedCountry && isSearchTermValid && !loading && !noData && (
                <div className="mt-4">
                    <h2 className="text-2xl font-bold">
                        {selectedCountry.name.official}
                    </h2>
                    {selectedCountry.currencies && (
                        <>
                            <ul>
                                {Object.entries(selectedCountry.currencies).map(
                                    ([code, currency]) => {
                                        const currencyInfo: { name: string; symbol: string } =
                                            currency as any;
                                        return (
                                            <li key={code}>
                                                <p>Currency: {currencyInfo.name}</p>
                                                <p>Symbol: {currencyInfo.symbol}</p>
                                            </li>
                                        );
                                    }
                                )}
                            </ul>
                        </>
                    )}
                    {selectedCountry.flags && (
                        <Image
                            src={selectedCountry.flags[0]}
                            alt="Flag"
                            className="my-4 max-w-xs"
                            width={120}
                            height={30}
                        />
                    )}
                    {selectedCountry.car && (
                        <p>Drive on the {selectedCountry.car.side} side of the road</p>
                    )}
                </div>
            )}
        </div>
    );
};

export default CountrySearch;

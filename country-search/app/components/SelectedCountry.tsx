import Image from "next/image";
const SelectedCountryDisplay: React.FC<{ country: any }> = ({ country }) => {
    return (
        <div className="bg-white rounded-lg shadow-lg p-4">
            <div className="flex flex-col md:flex-row md:items-center">
                <div className="object-cover w-full h-48 md:w-48">
                    <Image
                        src={country.flags[0]}
                        alt="Flag"
                        width={0}
                        height={0}
                        style={{ width: '100%', height: '100%' }}
                        className="object-cover rounded-lg"
                    />
                </div>
                <div className="flex flex-col justify-between md:ml-4 mt-4 md:mt-0 text-left">
                    <h5 className="text-2xl font-bold text-gray-900">{country.name.common}</h5>
                    <div className="mb-2">
                        <p className="text-gray-600">
                            <strong>Currency:</strong> {country.currencies[Object.keys(country.currencies)[0]].name}
                        </p>
                        <p className="text-gray-600">
                            <strong>Symbol:</strong> {country.currencies[Object.keys(country.currencies)[0]].symbol}
                        </p>
                    </div>
                    <p className="text-gray-500">
                        <strong>Drive on the:</strong> {country.car.side} side of the road
                    </p>
                </div>
            </div>
        </div>
    );
};
export default SelectedCountryDisplay;

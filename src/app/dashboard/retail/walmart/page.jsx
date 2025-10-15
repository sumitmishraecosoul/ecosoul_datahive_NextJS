"use client";
import FilterSelector from "../../../../Components/FilterSelector";
import MetricCard from "../../../../Components/MetricCard";
import { FaShoppingCart } from "react-icons/fa";
import MetricTable from "../../../../Components/MetricTable";

export default function WalmartPage() {
    const filterConfig = [
        { key: 'sku', label: 'SKU', placeholder: 'e.g. 1234567890' },
        { key: 'poNumber', label: 'PO Number', placeholder: 'e.g. 1234567890' },
    ];
    const handleFilterChange = (newFilters) => {
        console.log(newFilters);
    };
    const handleClear = () => {
        console.log('clear');
    };
    return (
        <>
        <div>
            <FilterSelector
                title="Filters"
                config={filterConfig}
                options={{}}
                onChange={handleFilterChange}
                onClear={handleClear}
            />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 my-8">
            <MetricCard title="Total PO Count" value="540" icon={<FaShoppingCart />} />
            <MetricCard title="PO Amount" value="1163" icon={<FaShoppingCart />} />
            <MetricCard title="Invoice Quantity" value="83K" icon={<FaShoppingCart />} />
            <MetricCard title="PO Quantity Cases" value="96K" icon={<FaShoppingCart />} />
        </div>

        <div className="flex flex-row gap-4">
            <MetricTable
                title="Sales"
                rows={[]}
                columns={[]}
            />
            <MetricTable
                title="Weekly PO Trends"
                rows={[]}
                columns={[]}
            />
        </div>

        <div className="flex flex-col gap-4 my-8">
            <MetricTable
                title="Detailed View"
                rows={[]}
                columns={[]}
            />
        </div>
    </>
    )
}

'use client';
import React, { useState, useEffect } from 'react';
import FilterSelector from '../../../Components/FilterSelector';
import MetricCard from '../../../Components/MetricCard';
import MetricTable from '../../../Components/MetricTable';
import { FaShoppingCart, FaWarehouse, FaTruckMoving, FaMoneyBillWave, FaChartLine } from 'react-icons/fa';
import { getEcommerceOverviewMetricCardData, getEcommerceOverviewDIByGeography, getEcommerceOverviewData } from '../../../api/ecommerce';
import { Us, De, Gb, Ca } from 'react-flags-select';


export default function RetailPage() {
    return (
        <div>
            <h1>Retail</h1>
        </div>
    )
}
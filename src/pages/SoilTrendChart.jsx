import React from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const SoilTrendChart = ({ historyData }) => {
    if (!historyData || historyData.length === 0) return null;

    const reversedData = [...historyData].reverse();
    const labels = reversedData.map(item => new Date(item.createdAt).toLocaleDateString());

    const data = {
        labels,
        datasets: [
            {
                label: 'Nitrogen (N)',
                data: reversedData.map(item => item.nutrients?.nitrogen || 0),
                borderColor: '#2ecc71',
                backgroundColor: '#2ecc71',
                tension: 0.3,
            },
            {
                label: 'Phosphorus (P)',
                data: reversedData.map(item => item.nutrients?.phosphorus || 0),
                borderColor: '#3498db',
                backgroundColor: '#3498db',
                tension: 0.3,
            },
            {
                label: 'Potassium (K)',
                data: reversedData.map(item => item.nutrients?.potassium || 0),
                borderColor: '#f1c40f',
                backgroundColor: '#f1c40f',
                tension: 0.3,
            },
            {
                label: 'Carbon (%)',
                data: reversedData.map(item => item.nutrients?.carbon || 0),
                borderColor: '#e67e22',
                backgroundColor: '#e67e22',
                tension: 0.3,
                yAxisID: 'y1',
            }
        ]
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        color: '#888',
        plugins: {
            legend: { position: 'top', labels: { color: '#888' } },
        },
        scales: {
            x: { ticks: { color: '#888' }, grid: { color: 'rgba(136, 136, 136, 0.1)' } },
            y: { type: 'linear', position: 'left', title: { display: true, text: 'mg/kg', color: '#888' }, ticks: { color: '#888' }, grid: { color: 'rgba(136, 136, 136, 0.1)' } },
            y1: { type: 'linear', position: 'right', title: { display: true, text: 'Carbon %', color: '#888' }, ticks: { color: '#888' }, grid: { drawOnChartArea: false } }
        }
    };

    return (
        <div className="sr-chart-wrapper" style={{ position: 'relative', height: '350px', width: '100%', marginBottom: '30px' }}>
            <Line data={data} options={options} />
        </div>
    );
};

export default SoilTrendChart;
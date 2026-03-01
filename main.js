import Chart from 'chart.js/auto';
import { calculateTax, getAvailableCountries } from './src/engine/taxEngine';
import { jsPDF } from 'jspdf';

// State
let currentCalculation = null;
let chart = null;

// DOM Elements
const countrySelect = document.getElementById('country');
const salaryInput = document.getElementById('salary');
const deductionsList = document.getElementById('deductionsList');
const addDeductionBtn = document.getElementById('addDeduction');
const exportPdfBtn = document.getElementById('exportPdf');
const currencyPrefix = document.getElementById('currencyPrefix');
const customTaxSection = document.getElementById('customTaxSection');
const customTaxRate = document.getElementById('customTaxRate');
const customCurrency = document.getElementById('customCurrency');
const customCountryName = document.getElementById('customCountryName');

const netSalaryLabel = document.getElementById('netSalary');
const totalTaxLabel = document.getElementById('totalTax');
const effectiveRateLabel = document.getElementById('effectiveRate');
const ctx = document.getElementById('taxChart').getContext('2d');

// Initialize
const init = () => {
    // Populate countries
    getAvailableCountries().forEach(country => {
        const option = document.createElement('option');
        option.value = country;
        option.textContent = country;
        countrySelect.appendChild(option);
    });

    countrySelect.addEventListener('change', () => {
        toggleCustomSection();
        update();
    });
    salaryInput.addEventListener('input', update);
    addDeductionBtn.addEventListener('click', addDeductionField);
    exportPdfBtn.addEventListener('click', generatePDF);
    customTaxRate.addEventListener('input', update);
    customCurrency.addEventListener('change', update);
    customCountryName.addEventListener('input', update);

    update();
};

const toggleCustomSection = () => {
    if (countrySelect.value === 'Custom') {
        customTaxSection.style.display = 'block';
    } else {
        customTaxSection.style.display = 'none';
    }
};

const addDeductionField = () => {
    const div = document.createElement('div');
    div.className = 'deduction-item';
    div.innerHTML = `
        <input type="text" placeholder="Name" class="d-name">
        <input type="number" placeholder="Amount" class="d-amount">
        <button class="btn btn-secondary remove-d">×</button>
    `;
    div.querySelector('.remove-d').addEventListener('click', () => {
        div.remove();
        update();
    });
    div.querySelectorAll('input').forEach(i => i.addEventListener('input', update));
    deductionsList.appendChild(div);
};

const update = () => {
    const country = countrySelect.value;
    const salary = parseFloat(salaryInput.value) || 0;

    let totalDeductions = 0;
    document.querySelectorAll('.d-amount').forEach(input => {
        totalDeductions += parseFloat(input.value) || 0;
    });

    let customSettings = null;
    if (country === 'Custom') {
        customSettings = {
            taxRate: parseFloat(customTaxRate.value) || 0,
            currency: customCurrency.value,
            countryName: customCountryName.value || 'Custom'
        };
    }

    try {
        currentCalculation = calculateTax(country, salary, totalDeductions, customSettings);
        renderResults(currentCalculation);
        renderChart(currentCalculation);
    } catch (e) {
        console.error(e);
    }
};

const renderResults = (data) => {
    const { currency, net, tax, gross } = data;
    const currencyMap = {
        '$': 'USD',
        '€': 'EUR',
        '£': 'GBP',
        '₹': 'INR',
        'CA$': 'CAD',
        'A$': 'AUD',
        '¥': 'JPY',
        'R$': 'BRL'
    };
    const formatter = new Intl.NumberFormat(undefined, {
        style: 'currency',
        currency: currencyMap[currency] || 'USD',
        maximumFractionDigits: 0
    });

    netSalaryLabel.textContent = formatter.format(net);
    totalTaxLabel.textContent = formatter.format(tax);
    currencyPrefix.textContent = currency;

    const rate = gross > 0 ? (tax / gross) * 100 : 0;
    effectiveRateLabel.textContent = `${rate.toFixed(1)}%`;
};

const renderChart = (data) => {
    const { net, tax } = data;

    if (chart) chart.destroy();

    chart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Net Salary', 'Total Tax'],
            datasets: [{
                data: [net, tax],
                backgroundColor: ['#818cf8', '#f43f5e'],
                borderColor: 'transparent',
                hoverOffset: 4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: { color: '#94a3b8' }
                }
            }
        }
    });
};

const generatePDF = () => {
    const doc = new jsPDF();
    const { gross, tax, net, currency, breakdown } = currentCalculation;

    // Currency code mapping for PDF safety
    const codeMap = { '₹': 'INR', '£': 'GBP', 'CA$': 'CAD', '$': 'USD' };
    const curCode = codeMap[currency] || currency;

    // Title
    doc.setFont("helvetica", "bold");
    doc.setFontSize(24);
    doc.setTextColor(99, 102, 241); // Primary color
    doc.text("Salary Tax Report", 20, 30);

    // Summary Section
    doc.setFontSize(12);
    doc.setTextColor(100, 100, 100);
    doc.setFont("helvetica", "normal");
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 20, 40);

    doc.setDrawColor(200, 200, 200);
    doc.line(20, 45, 190, 45);

    doc.setFontSize(16);
    doc.setTextColor(0, 0, 0);
    doc.setFont("helvetica", "bold");
    doc.text("Financial Summary", 20, 60);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(12);
    doc.text(`Annual Gross Salary:`, 20, 75);
    doc.text(`${curCode} ${gross.toLocaleString()}`, 100, 75);

    doc.text(`Total Income Tax:`, 20, 85);
    doc.text(`${curCode} ${tax.toLocaleString()}`, 100, 85);

    doc.setFont("helvetica", "bold");
    doc.text(`Annual Net Salary (Take-Home):`, 20, 100);
    doc.text(`${curCode} ${net.toLocaleString()}`, 100, 100);

    doc.setFontSize(14);
    doc.text("Tax Breakdown", 20, 120);
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text("Band / Category", 20, 128);
    doc.text("Income in Band", 120, 128, { align: 'right' });
    doc.text("Tax", 180, 128, { align: 'right' });
    doc.line(20, 130, 190, 130);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(0, 0, 0);
    let y = 138;
    breakdown.forEach(item => {
        if (item.amount > 0 || item.tax !== 0) {
            const label = item.label;
            const baseAmount = item.amount.toLocaleString();
            const taxAmount = Math.abs(item.tax).toLocaleString();

            doc.text(label, 20, y);
            doc.text(`${curCode} ${baseAmount}`, 120, y, { align: 'right' });
            doc.text(`${curCode} ${taxAmount}`, 180, y, { align: 'right' });

            y += 7;
            if (y > 270) { // Page break if needed
                doc.addPage();
                y = 20;
            }
        }
    });

    doc.save(`Salary_Report_${curCode}.pdf`);
};

init();

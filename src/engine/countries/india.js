/**
 * India Tax Engine FY 2025-26 (New Regime Default)
 */

export const calculateIndiaTax = (salary, deductions = 0) => {
    const standardDeduction = 75000;
    let taxableIncome = Math.max(0, salary - deductions - standardDeduction);

    // Section 87A Rebate: No tax if income <= 12L (including standard deduction)
    // However, we calculate tax and then apply rebate logic for simplicity in visualization.

    const bands = [
        { limit: 400000, rate: 0.00, label: '0-4L (0%)' },
        { limit: 800000, rate: 0.05, label: '4-8L (5%)' },
        { limit: 1200000, rate: 0.10, label: '8-12L (10%)' },
        { limit: 1600000, rate: 0.15, label: '12-16L (15%)' },
        { limit: 2000000, rate: 0.20, label: '16-20L (20%)' },
        { limit: 2400000, rate: 0.25, label: '20-24L (25%)' },
        { limit: Infinity, rate: 0.30, label: 'Above 24L (30%)' }
    ];

    let tax = 0;
    const breakdown = [
        { label: 'Standard Deduction', amount: standardDeduction, tax: 0 }
    ];

    let remainingIncome = taxableIncome;
    let previousLimit = 0;

    for (const band of bands) {
        let bandSize = band.limit - previousLimit;
        let taxableInThisBand = Math.min(remainingIncome, bandSize);

        if (taxableInThisBand > 0) {
            let bandTax = taxableInThisBand * band.rate;
            tax += bandTax;
            breakdown.push({
                label: band.label,
                amount: taxableInThisBand,
                tax: bandTax
            });
            remainingIncome -= taxableInThisBand;
        }
        previousLimit = band.limit;
        if (remainingIncome <= 0) break;
    }

    // Apply Section 87A rebate
    if (salary - deductions <= 1275000) { // 12L + 75k SD
        tax = 0;
        // Adjust breakdown tax values to 0 if rebate applies
        breakdown.forEach(b => b.tax = 0);
    } else {
        // Add Health & Education Cess (4%)
        const cess = tax * 0.04;
        tax += cess;
        breakdown.push({ label: 'Health & Education Cess (4%)', amount: 0, tax: cess });
    }

    return {
        gross: salary,
        taxable: taxableIncome,
        tax,
        net: salary - tax - deductions,
        breakdown,
        currency: '₹'
    };
};

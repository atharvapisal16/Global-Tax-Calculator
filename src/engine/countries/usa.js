/**
 * USA Federal Tax Engine 2025 (Single Filer)
 */

export const calculateUSATax = (salary, deductions = 0) => {
    // Standard deduction for 2025 (approximate)
    const standardDeduction = 15000;
    let taxableIncome = Math.max(0, salary - deductions - standardDeduction);

    const bands = [
        { limit: 11925, rate: 0.10, label: '10% Band' },
        { limit: 48475, rate: 0.12, label: '12% Band' },
        { limit: 103350, rate: 0.22, label: '22% Band' },
        { limit: 197300, rate: 0.24, label: '24% Band' },
        { limit: 250525, rate: 0.32, label: '32% Band' },
        { limit: 626350, rate: 0.35, label: '35% Band' },
        { limit: Infinity, rate: 0.37, label: '37% Band' }
    ];

    let tax = 0;
    const breakdown = [
        { label: 'Standard Deduction (Tax-Free)', amount: standardDeduction, tax: 0 }
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

    return {
        gross: salary,
        taxable: taxableIncome,
        tax,
        net: salary - tax - deductions,
        breakdown,
        currency: '$'
    };
};

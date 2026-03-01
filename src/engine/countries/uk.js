/**
 * UK Tax Engine 2024-2025
 */

export const calculateUKTax = (salary, deductions = 0) => {
    let taxableIncome = Math.max(0, salary - deductions);
    let personalAllowance = 12570;

    // Personal Allowance reduction for high earners (£1 for every £2 over £100,000)
    if (taxableIncome > 100000) {
        let reduction = (taxableIncome - 100000) / 2;
        personalAllowance = Math.max(0, personalAllowance - reduction);
    }

    let incomeAboveAllowance = Math.max(0, taxableIncome - personalAllowance);
    let tax = 0;
    const breakdown = [
        { label: 'Personal Allowance (Tax-Free)', amount: Math.min(taxableIncome, personalAllowance), tax: 0 }
    ];

    const bands = [
        { limit: 37700, rate: 0.20, label: 'Basic Rate (20%)' },
        { limit: 125140, rate: 0.40, label: 'Higher Rate (40%)' },
        { limit: Infinity, rate: 0.45, label: 'Additional Rate (45%)' }
    ];

    let remainingIncome = incomeAboveAllowance;
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
        currency: '£'
    };
};

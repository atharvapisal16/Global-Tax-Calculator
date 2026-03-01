/**
 * Canada Tax Engine 2025 (Federal + Ontario)
 */

export const calculateCanadaTax = (salary, deductions = 0) => {
    const basicPersonalAmount = 16129;
    let taxableIncome = Math.max(0, salary - deductions);

    // Federal Bands
    const fedBands = [
        { limit: 57375, rate: 0.15, label: 'Federal: 15%' },
        { limit: 114750, rate: 0.205, label: 'Federal: 20.5%' },
        { limit: 177882, rate: 0.26, label: 'Federal: 26%' },
        { limit: 253414, rate: 0.29, label: 'Federal: 29%' },
        { limit: Infinity, rate: 0.33, label: 'Federal: 33%' }
    ];

    // Ontario Bands
    const ontBands = [
        { limit: 52886, rate: 0.0505, label: 'Ontario: 5.05%' },
        { limit: 105775, rate: 0.0915, label: 'Ontario: 9.15%' },
        { limit: 150000, rate: 0.1116, label: 'Ontario: 11.16%' },
        { limit: 220000, rate: 0.1216, label: 'Ontario: 12.16%' },
        { limit: Infinity, rate: 0.1316, label: 'Ontario: 13.16%' }
    ];

    let fedTax = 0;
    let ontTax = 0;
    const breakdown = [];

    // Federal Tax Calculation
    let remainingFed = taxableIncome;
    let prevFedLimit = 0;
    for (const band of fedBands) {
        let bandSize = band.limit - prevFedLimit;
        let taxableInBand = Math.min(remainingFed, bandSize);
        if (taxableInBand > 0) {
            let tax = taxableInBand * band.rate;
            fedTax += tax;
            breakdown.push({ label: band.label, amount: taxableInBand, tax: tax });
            remainingFed -= taxableInBand;
        }
        prevFedLimit = band.limit;
    }

    // Ontario Tax Calculation
    let remainingOnt = taxableIncome;
    let prevOntLimit = 0;
    for (const band of ontBands) {
        let bandSize = band.limit - prevOntLimit;
        let taxableInBand = Math.min(remainingOnt, bandSize);
        if (taxableInBand > 0) {
            let tax = taxableInBand * band.rate;
            ontTax += tax;
            breakdown.push({ label: band.label, amount: taxableInBand, tax: tax });
            remainingOnt -= taxableInBand;
        }
        prevOntLimit = band.limit;
    }

    // Subtract credits (simplified: just BPA)
    const fedCredit = basicPersonalAmount * 0.15;
    fedTax = Math.max(0, fedTax - fedCredit);
    breakdown.push({ label: 'Basic Personal Amount Credit', amount: 0, tax: -fedCredit });

    const totalTax = fedTax + ontTax;

    return {
        gross: salary,
        taxable: taxableIncome,
        tax: totalTax,
        net: salary - totalTax - deductions,
        breakdown,
        currency: 'CA$'
    };
};

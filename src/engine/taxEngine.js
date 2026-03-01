import { calculateUKTax } from './countries/uk';
import { calculateUSATax } from './countries/usa';
import { calculateIndiaTax } from './countries/india';
import { calculateCanadaTax } from './countries/canada';

const countryEngines = {
    UK: calculateUKTax,
    USA: calculateUSATax,
    India: calculateIndiaTax,
    Canada: calculateCanadaTax
};

export const calculateTax = (country, salary, deductions = 0, customSettings = null) => {
    if (country === 'Custom' && customSettings) {
        return calculateCustomTax(salary, deductions, customSettings);
    }
    
    const engine = countryEngines[country];
    if (!engine) {
        throw new Error(`Tax engine not found for country: ${country}`);
    }
    return engine(salary, deductions);
};

export const calculateCustomTax = (salary, deductions = 0, { taxRate, currency, countryName }) => {
    const taxableIncome = Math.max(0, salary - deductions);
    const rate = taxRate / 100;
    const tax = taxableIncome * rate;
    
    return {
        gross: salary,
        taxable: taxableIncome,
        tax,
        net: salary - tax - deductions,
        breakdown: [
            { label: 'Taxable Income', amount: taxableIncome, tax: 0 },
            { label: `${countryName} Tax @ ${taxRate}%`, amount: taxableIncome, tax: tax }
        ],
        currency,
        countryName
    };
};

export const getAvailableCountries = () => [...Object.keys(countryEngines), 'Custom'];

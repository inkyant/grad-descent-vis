const coefficients = [0.00091096, 0.0000022854, -0.0402169, 0, 0.47182, 0.22782, 0.5];
const derivCoefficients = [0.00091096*6, 0.0000022854*5, -0.0402169*4, 0, 0.47182*2, 0.22782];

export const calcY = (x: number) => {
    return coefficients.reduce((sum, coeff, power) => {
      return sum + coeff * Math.pow(x, coefficients.length - 1 - power);
    }, 0);
}

export const calcSlope = (x: number) => {
    return derivCoefficients.reduce((sum, coeff, power) => {
      return sum + coeff * Math.pow(x, coefficients.length - 1 - power);
    }, 0);
}

// Generate points for the polynomial
export const generatePoints = () => {
    const points = [];
    for (let x = -6; x <= 6; x += 0.1) {
        const y = calcY(x)
        points.push({ x, y });
    }
    return points;
};
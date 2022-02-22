export const fromSVGString = (svgString: string) => {
  const matrix = svgString.split(/[\s\t]/).map(Number);
  console.log({ matrix });
  return matrix;
};

export const BLACK_AND_WHITE = [
  0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 1, 0,
];

export const MILK = [
  0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0.6, 1, 0, 0, 0, 0, 0, 1, 0,
];

export const SEPIA = fromSVGString(`1.3 -0.3 1.1 0 0
0 1.3 0.2 0 0
0 0 0.8 0.2 0
0 0 0 1 0`);

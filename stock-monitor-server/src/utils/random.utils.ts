const stringGenerator: (lengthOfSecretKey: number) => string = (
  lengthOfSecretKey,
) => {
  let result = '';
  const characters: string =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz-._~()'!*:@,;0123456789";
  const charactersLength = characters.length;
  for (let i = 0; i < lengthOfSecretKey; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
};

const numberGenerator: (minMax: [number, number]) => number = ([min, max]) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.trunc(Math.random() * (max - min) + min);
};

const random = {
  stringGenerator,
  numberGenerator,
};

export default random;

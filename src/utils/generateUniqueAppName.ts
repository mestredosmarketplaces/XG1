import { AvailableCombinationModel } from '../schemas/avaliable-combinations-schema';

const shuffleArray = (array: any[]) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
};

export const generateUniqueAppName = async (): Promise<string> => {
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const digits = '0123456789';

  // Verificar se existem combinações disponíveis no banco de dados
  let availableCombinations: { combination: string; used: boolean; }[] = await AvailableCombinationModel.find({ used: false });

  if (availableCombinations.length === 0) {
    // Se não houver combinações disponíveis, gerar todas as combinações possíveis e salvá-las no banco de dados
    const allCombinations: string[] = [];

    for (let i = 0; i < alphabet.length; i++) {
      for (let j = 0; j < alphabet.length; j++) {
        for (let k = 0; k < digits.length; k++) {
          const combination = alphabet[i] + alphabet[j] + digits[k];
          allCombinations.push(combination);
        }
      }
    }

    await AvailableCombinationModel.insertMany(
      allCombinations.map((combination) => ({ combination, used: false }))
    );

    // Embaralhar a lista de combinações para escolher aleatoriamente
    shuffleArray(allCombinations);
    // Converter cada documento em um objeto simples antes de usar a função shuffleArray
    availableCombinations = allCombinations.map((combination) => ({ combination, used: false }));
  }

  // Escolher aleatoriamente uma combinação disponível
  const randomIndex = Math.floor(Math.random() * availableCombinations.length);
  const selectedCombination = availableCombinations[randomIndex];

  // Marcar a combinação como usada no banco de dados
  await AvailableCombinationModel.findOneAndUpdate(
    { combination: selectedCombination.combination },
    { used: true }
  );

  return selectedCombination.combination;
};
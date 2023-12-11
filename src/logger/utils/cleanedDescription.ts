export interface LogDetail {
  level: string;
  message: any;
  meta: any;
};

export const cleanDescription = (logDetail: any) => {
  const cleanedDescription: string = JSON.stringify(logDetail)
  .replace(/\\\\/g, '') // Remove as barras invertidas extras
  .replace(/\\([^"])/g, '$1') // Remove as barras invertidas antes de qualquer caractere, exceto aspas
  .replace(/\\\"/g, '"') // Remove as barras invertidas antes das aspas
  .replace(/\\:/g, ': ') // Adiciona um espaço após os dois pontos
  .replace(/^\{"/, '') // Remove o { inicial
  .replace(/"}$/, '') // Remove o } final
  .split("/").join("");

  return cleanedDescription
};


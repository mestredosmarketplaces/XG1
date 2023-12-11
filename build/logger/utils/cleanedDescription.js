"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cleanDescription = void 0;
;
const cleanDescription = (logDetail) => {
    const cleanedDescription = JSON.stringify(logDetail)
        .replace(/\\\\/g, '') // Remove as barras invertidas extras
        .replace(/\\([^"])/g, '$1') // Remove as barras invertidas antes de qualquer caractere, exceto aspas
        .replace(/\\\"/g, '"') // Remove as barras invertidas antes das aspas
        .replace(/\\:/g, ': ') // Adiciona um espaço após os dois pontos
        .replace(/^\{"/, '') // Remove o { inicial
        .replace(/"}$/, '') // Remove o } final
        .split("/").join("");
    return cleanedDescription;
};
exports.cleanDescription = cleanDescription;

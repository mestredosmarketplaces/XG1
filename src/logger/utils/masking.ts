import { Keyword } from "../schemas/keyword-schema";
import { KeywordDoc } from "../schemas/keyword-schema";
import { LogDetail } from "./cleanedDescription";
import logger from "../logger";

const maskDataObject = async (data: Record<string, any>, registeredAttributes: KeywordDoc[]) => {
  try {
    const keysToMask = Object.keys(data).filter((key) =>
    registeredAttributes.some((obj: KeywordDoc) => obj.keyword === key)
  );

  for (const key of keysToMask) {
    const keywordEntry = registeredAttributes.find((obj: KeywordDoc) => obj.keyword === key);

    if (keywordEntry) {
      data[key] =
        data[key].length > 8
          ? data[key].substring(0, 3) + '*'.repeat(data[key].length - 5) + data[key].slice(-2)
          : data[key][0] + '*'.repeat(data[key].length - 1);
    }
  }
  } catch(err) {
    logger.error(`It is not possible to parse maskDataObject: ${err}`);
  }

};

const getRegisteredAttributes = async (data: Record<string, any>): Promise<KeywordDoc[]> => {
  const keywordList = Object.keys(data);
  const registeredAttributes = await Keyword.find({ keyword: { $in: keywordList } });
  return registeredAttributes;
};

const modifyData = async (data: Record<string, any>, processedObjects: Set<any> = new Set()) => {
  try {
    if (processedObjects.has(data)) {
      return data;
    }
  
    processedObjects.add(data);
  
    if(typeof(data) === 'string') {
      return data;
    }
  
    if ('_doc' in data) {
      const modifiedData = { ...data._doc };
      const registeredAttributes = await getRegisteredAttributes(modifiedData);
      await maskDataObject(modifiedData, registeredAttributes);
      return modifiedData;
    } else if ('data' in data) {
      const modifiedData = { ...data };
      if (Array.isArray(modifiedData.data)) {
        for (let i = 0; i < modifiedData.data.length; i++) {
          modifiedData.data[i] = await modifyData(modifiedData.data[i], processedObjects);
        }
      }
      const registeredAttributes = await getRegisteredAttributes(modifiedData);
      await maskDataObject(modifiedData, registeredAttributes);
      return modifiedData;
    } else {
      const modifiedData = { ...data };
      const registeredAttributes = await getRegisteredAttributes(modifiedData);
      await maskDataObject(modifiedData, registeredAttributes);
      return modifiedData;
    }
  } catch(err) {
    logger.error(`It is not possible to modify data do maske it: ${err}`);
  }
  

};

const maskedLogging = async (data: Record<string, any> | LogDetail) => {

  try {

    if (!data) {
      return;
    }
  
    const { level, message } = data;
  
    if (!data.meta) {
      const modifiedData = await modifyData(data, new Set());
      return modifiedData;
    }
  
    if (data.meta) {
      const metaJsonOriginal = typeof data.meta === 'string' ? JSON.parse(data.meta) : data.meta;
  
      if (metaJsonOriginal.requestBody) {
        const requestBody = await modifyData(metaJsonOriginal.requestBody, new Set());
        const metaJson = JSON.stringify({ ...metaJsonOriginal, requestBody });
        return { level, message, metaJson };
      }
  
      if (metaJsonOriginal.requestResponse) {
        const requestResponse = await modifyData(metaJsonOriginal.requestResponse, new Set());
        const metaJson = JSON.stringify({ ...metaJsonOriginal, requestResponse });
        return { level, message, metaJson };
      }
  
      if (metaJsonOriginal.requestBody && metaJsonOriginal.requestResponse) {
        const requestResponse = await modifyData(metaJsonOriginal.requestResponse, new Set());
        const requestBody = await modifyData(metaJsonOriginal.requestBody, new Set());
        const metaJson = JSON.stringify({ ...metaJsonOriginal, requestResponse, requestBody });
        return { level, message, metaJson };
      }
  
      return data;
    }

  } catch (err) {
    logger.error(`It is not possible to mask log: ${err}`);
  }


};

export { maskedLogging };
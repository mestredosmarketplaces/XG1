import mongoose from "mongoose";
import { updateIfCurrentPlugin } from 'mongoose-update-if-current';
import { v4 as uuidv4 } from 'uuid';
import { updateDates } from "../utils/updateDates";

interface CipherKeysAttrs {
  app_name: string;
  encryption_key: string;
  effective_date: number;
  expiry_date: number;
}

interface CipherKeysDoc extends mongoose.Document {
  app_name: string;
  encryption_key: string;
  effective_date: number;
  expiry_date: number;
  version: number;
  createdAt: Date;
  lastUpdatedAt: Date;
}

interface CipherKeysModel extends mongoose.Model<CipherKeysDoc> {
  build(attrs: CipherKeysAttrs): Promise<CipherKeysDoc>;
}

const CipherKeysSchema = new mongoose.Schema(
  {
    _id: { type: String, default: uuidv4 },
    app_name: {
      type: String,
      required: true
    },
    encryption_key: {
      type: String,
      required: true
    },
    effective_date: {
      type: Number,
      required: true
    },
    expiry_date: {
      type: Number,
      required: true
    },
    createdAt: { 
      type: Date 
    },
    lastUpdatedAt: { 
      type: Date 
    }
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
      }
    }
  }
);

CipherKeysSchema.set('versionKey', 'version');
CipherKeysSchema.plugin(updateIfCurrentPlugin);

//index
CipherKeysSchema.index({ app_name: 1 });
CipherKeysSchema.index({ encryption_key: 1 });
CipherKeysSchema.index({ app_name: 1, effective_date: 1 });
CipherKeysSchema.index({ app_name: 1, expiry_date: 1 });
CipherKeysSchema.index({ app_name: 1, effective_date: 1, expiry_date: 1 });

CipherKeysSchema.statics.build = async (attrs: CipherKeysAttrs) => {

  const cipherKey = new CipherKeys({
    _id: uuidv4(),
    app_name: attrs.app_name,
    encryption_key: attrs.encryption_key,
    effective_date: attrs.effective_date,
    expiry_date: attrs.expiry_date
  });

  await cipherKey.save();

  return cipherKey;
};

CipherKeysSchema.pre<CipherKeysDoc>('save', updateDates);

CipherKeysSchema.pre<CipherKeysDoc>('findOneAndUpdate', updateDates);

const CipherKeys = mongoose.model<CipherKeysDoc, CipherKeysModel>('CipherKeys', CipherKeysSchema);

export { CipherKeys };
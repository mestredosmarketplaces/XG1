import mongoose from "mongoose";
import { updateIfCurrentPlugin } from 'mongoose-update-if-current';
import { v4 as uuidv4 } from 'uuid';
import { updateDates } from "../utils/updateDates";

interface CipherManagerAttrs {
  app_name: string;
  encryption_key: string;
  effective_date: number;
  expiry_date: number;
}

interface CipherManagerDoc extends mongoose.Document {
  app_name: string;
  encryption_key: string;
  effective_date: number;
  expiry_date: number;
  version: number;
  createdAt: Date;
  lastUpdatedAt: Date;
}

interface CipherManagerModel extends mongoose.Model<CipherManagerDoc> {
  build(attrs: CipherManagerAttrs): Promise<CipherManagerDoc>;
}

const CipherManagerSchema = new mongoose.Schema(
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

CipherManagerSchema.set('versionKey', 'version');
CipherManagerSchema.plugin(updateIfCurrentPlugin);

//index
CipherManagerSchema.index({ app_name: 1 });
CipherManagerSchema.index({ encryption_key: 1 });
CipherManagerSchema.index({ app_name: 1, effective_date: 1 });
CipherManagerSchema.index({ app_name: 1, expiry_date: 1 });
CipherManagerSchema.index({ app_name: 1, effective_date: 1, expiry_date: 1 });

CipherManagerSchema.statics.build = async (attrs: CipherManagerAttrs) => {

  const cipherManager = new CipherManager({
    _id: uuidv4(),
    app_name: attrs.app_name,
    encryption_key: attrs.encryption_key,
    effective_date: attrs.effective_date,
    expiry_date: attrs.expiry_date
  });

  await cipherManager.save();

  return cipherManager;
};

CipherManagerSchema.pre<CipherManagerDoc>('save', updateDates);

CipherManagerSchema.pre<CipherManagerDoc>('findOneAndUpdate', updateDates);

const CipherManager = mongoose.model<CipherManagerDoc, CipherManagerModel>('CipherManager', CipherManagerSchema);

export { CipherManager };
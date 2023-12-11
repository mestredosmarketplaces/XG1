import mongoose from "mongoose";
import { updateIfCurrentPlugin } from 'mongoose-update-if-current';
import { v4 as uuidv4 } from 'uuid';
import { updateDates } from "../utils/updateDates";
import { generateUniqueAppName } from "../utils/generateUniqueAppName";

interface AppManagerAttrs {
  description: string;
  account_id: string;
}

interface AppManagerDoc extends mongoose.Document {
  app_name: string;
  description: string;
  account_id: string;
  version: number;
  createdAt: Date;
  lastUpdatedAt: Date;
}

interface AppManagerModel extends mongoose.Model<AppManagerDoc> {
  build(attrs: AppManagerAttrs): Promise<AppManagerDoc>;
}

const AppManagerSchema = new mongoose.Schema(
  {
    _id: { type: String, default: uuidv4 },
    app_name: {
      type: String,
      required: true,
      unique: true
    },
    description: {
      type: String,
      required: true,
    },
    account_id: {
      type: String,
      required: true
    },
    git_url: {
      type: String
    },
    git_html_url : {
      type: String
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

AppManagerSchema.set('versionKey', 'version');
AppManagerSchema.plugin(updateIfCurrentPlugin);

AppManagerSchema.statics.build = async (attrs: AppManagerAttrs) => {
  const generatedAppName = await generateUniqueAppName();

  const appManager = new AppManager({
    _id: uuidv4(),
    app_name: generatedAppName,
    description: attrs.description,
    account_id: attrs.account_id
  });

  await appManager.save();

  return appManager;
};

AppManagerSchema.pre<AppManagerDoc>('save', updateDates);

AppManagerSchema.pre<AppManagerDoc>('findOneAndUpdate', updateDates);

const AppManager = mongoose.model<AppManagerDoc, AppManagerModel>('AppManager', AppManagerSchema);

export { AppManager };
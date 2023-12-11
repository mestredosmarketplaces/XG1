import mongoose, { Document, Model, Schema } from "mongoose";
import { updateIfCurrentPlugin } from "mongoose-update-if-current";
import { v4 as uuidv4 } from 'uuid';

interface KeywordAttrs {
  keyword: string;
};

export interface KeywordDoc extends Document {
  keyword: string;
  createdAt: Date;
  lastUpdatedAt: Date;
  version: number;
};

interface KeywordModel extends Model<KeywordDoc> {
  build(attrs: KeywordAttrs): Promise<KeywordDoc>;
};

const KeywordSchema = new Schema<KeywordDoc, KeywordModel>({
  _id: { type: String, default: uuidv4 },
  keyword: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  createdAt: { 
    type: Date 
  },
  lastUpdatedAt: { 
    type: Date 
  }
}, {
  toJSON: {
    transform(doc, ret) {
      ret.id = ret._id;
      delete ret._id;
      delete ret.__v;
    }
  }
});

KeywordSchema.set('versionKey', 'version');

KeywordSchema.statics.build = async (attrs: KeywordAttrs) => {
  const keyword = new Keyword({
    ...attrs
  });

  await keyword.save();

  return keyword;
};

if(!process.env.MONGO_URI_LOGGER_MANAGER || !process.env.APP_SCENARIO_ENVIRONMENT) {
  throw new Error('You should define the environment variables: MONGO_URI_LOGGER_MANAGER and APP_SCENARIO_ENVIRONMENT');
}

const newMongoDBUrl = `${process.env.MONGO_URI_LOGGER_MANAGER}/${process.env.APP_SCENARIO_ENVIRONMENT}?retryWrites=true&w=majority`;
const newMongoose = mongoose.createConnection(newMongoDBUrl);

const Keyword = newMongoose.model<KeywordDoc, KeywordModel>('Keyword', KeywordSchema);

Keyword.schema.plugin(updateIfCurrentPlugin);

// Use the schema.plugin() function to add the updateIfCurrentPlugin


export { Keyword };



import { Schema, model, Document } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

interface AvailableCombinationDoc extends Document {
  combination: string;
  used: boolean;
}

const AvailableCombinationSchema = new Schema<AvailableCombinationDoc>({
  _id: { 
    type: String, 
    default: uuidv4 
  },
  combination: { 
    type: String, 
    required: true, 
    unique: true 
  },
  used: { 
    type: Boolean, 
    default: false 
  },
});

const AvailableCombinationModel = model<AvailableCombinationDoc>(
  'AvailableCombination',
  AvailableCombinationSchema
);

export { AvailableCombinationModel };
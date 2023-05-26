import { ModelDefinition, Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type KeysDocument = HydratedDocument<Keys>;

@Schema()
export class Keys {
  @Prop({ required: true })
  userId: string;

  @Prop({ required: false })
  keyId: string | null;

  @Prop({ required: true })
  challenge: string;

  @Prop({ required: true })
  type: string;

  @Prop({ required: false })
  expireAt: Date;
}

export const KeysSchema = SchemaFactory.createForClass(Keys);

KeysSchema.index(
  {
    challenge: 1,
    type: 1,
  },
  {
    unique: true,
  },
);

KeysSchema.index(
  {
    userId: 1,
    keyId: 1,
  },
  {
    unique: true,
    sparse: true,
  },
);

KeysSchema.index(
  {
    expireAt: 1,
  },
  {
    sparse: true,
    expireAfterSeconds: 0,
  },
);

export const KeysDefinition: ModelDefinition = {
  name: Keys.name,
  schema: KeysSchema,
};

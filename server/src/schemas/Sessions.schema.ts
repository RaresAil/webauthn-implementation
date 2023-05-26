import { ModelDefinition, Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type SessionsDocument = HydratedDocument<Sessions>;

@Schema()
export class Sessions {
  @Prop({ required: true })
  challenge: string;

  @Prop({ required: false })
  expireAt: Date;
}

export const SessionsSchema = SchemaFactory.createForClass(Sessions);

SessionsSchema.index(
  {
    challenge: 1,
  },
  {
    sparse: true,
  },
);

SessionsSchema.index(
  {
    expireAt: 1,
  },
  {
    sparse: true,
    expireAfterSeconds: 0,
  },
);

export const SessionsDefinition: ModelDefinition = {
  name: Sessions.name,
  schema: SessionsSchema,
};

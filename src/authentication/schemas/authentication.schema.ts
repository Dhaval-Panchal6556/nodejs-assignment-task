import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type AdminDocument = HydratedDocument<Admin>;

@Schema({ collection: 'admin', timestamps: true, versionKey: false })
export class Admin {
  @Prop({ required: true })
  firstName: string;

  @Prop({ required: true })
  lastName: string;

  @Prop({ required: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: true })
  role: string;

  @Prop({ default: '' })
  resetToken: string;

  @Prop({ required: true, default: true })
  isActive: boolean;

  @Prop()
  createdDate: Date;

  @Prop()
  updatedDate: Date;
}

export const AdminSchema = SchemaFactory.createForClass(Admin);

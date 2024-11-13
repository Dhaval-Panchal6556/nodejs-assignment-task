import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";
import { TABLE_NAMES } from "../../common/constants/table-name.constant";

export type UsersDocument = Users & Document;

@Schema({ collection: TABLE_NAMES.USER, timestamps: true, versionKey: false })
export class Users {
  @Prop({ required: true })
  firstName: string;

  @Prop({ required: true })
  lastName: string;

  @Prop({ required: true })
  email: string;

  @Prop({ required: false })
  countryCode: string;

  @Prop({ required: false })
  phoneNumber: string;

  @Prop({ required: false })
  address: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: true})
  role: string;

  @Prop({ required: false})
  resetToken: string;

  @Prop({ required: true, default: true })
  isActive: boolean;

  @Prop({ required: true, default: false })
  isDeleted: boolean;
}

export const UsersSchema = SchemaFactory.createForClass(Users);

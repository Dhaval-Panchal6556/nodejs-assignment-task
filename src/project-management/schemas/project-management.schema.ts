import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { Document } from "mongoose";
import { TABLE_NAMES } from "../../common/constants/table-name.constant";
import { Users } from "src/users/schemas/user.schema";

export type ProjectDocument = Projects & Document;

@Schema({
  collection: TABLE_NAMES.PROJECT,
  timestamps: true,
  versionKey: false,
})
export class Projects {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  startDate: Date;

  @Prop({ required: true })
  endDate: Date;

  @Prop({
    required: true,
    type: mongoose.Schema.Types.ObjectId,
    ref: Users.name,
  })
  userId: mongoose.Types.ObjectId;

  @Prop({ required: true })
  status: string;

  @Prop({ required: true, default: true })
  isActive: boolean;
}

export const ProjectsSchema = SchemaFactory.createForClass(Projects);

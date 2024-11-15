import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";
import { TABLE_NAMES } from "../../common/constants/table-name.constant";
import { Users } from "src/users/schemas/user.schema";
import { Projects } from "src/project-management/schemas/project-management.schema";

export type TasksDocument = Tasks & Document;

@Schema({ collection: TABLE_NAMES.TASK, timestamps: true })
export class Tasks {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true, default: "todo" })
  status: string;

  @Prop({ type: Types.ObjectId, ref: Users.name })
  assignedTo: Users;

  @Prop({ type: Types.ObjectId, ref: Projects.name })
  projectId: Users;

  @Prop({ type: Types.ObjectId, ref: Users.name })
  developerId: Users;

  @Prop()
  createdDate: Date;

  @Prop()
  updatedDate: Date;

  @Prop()
  inProgressDate: Date;
}

export const TasksSchema = SchemaFactory.createForClass(Tasks);

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'

import { CollectionsNames } from '../shared/enums/collections-names.enum'
import { TaskStatus } from '../shared/enums/task-status.enum'

@Schema({ collection: CollectionsNames.TASKS })
export class Task {
  @Prop({ type: String, required: true })
  title: string

  @Prop({ type: String })
  description?: string

  @Prop({ enum: TaskStatus, required: true, default: TaskStatus.PENDING })
  status: TaskStatus

  @Prop({ type: Date })
  due_date: Date
}

export const TaskSchema = SchemaFactory.createForClass(Task)

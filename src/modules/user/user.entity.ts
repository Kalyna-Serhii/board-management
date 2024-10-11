import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'

import type { Document } from 'mongoose'

import { CollectionsNames } from '../shared/enums/collections-names.enum'

@Schema({ collection: CollectionsNames.USERS })
export class User {
  @Prop({ type: String, required: true, unique: true })
  email: string

  @Prop({ type: String, required: true })
  password: string
}

export const UserSchema = SchemaFactory.createForClass(User)

export type UserDocument = User & Document

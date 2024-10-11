import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Types } from 'mongoose'

import { CollectionsNames } from '../shared/enums/collections-names.enum'

@Schema({ collection: CollectionsNames.TOKENS })
export class Token {
  @Prop({ required: true, ref: CollectionsNames.USERS })
  userId: Types.ObjectId

  @Prop({ required: true })
  refreshToken: string
}

export const TokenSchema = SchemaFactory.createForClass(Token)

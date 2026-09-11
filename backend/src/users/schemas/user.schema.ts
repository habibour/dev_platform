import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import type { HydratedDocument } from 'mongoose';

export type UserRole = 'admin' | 'user';

@Schema({ timestamps: true })
export class User {
  @Prop({ type: String, required: true, trim: true })
  name!: string;

  @Prop({ type: String, required: true, unique: true, lowercase: true, trim: true })
  email!: string;

  @Prop({ type: String, required: true })
  passwordHash!: string;

  @Prop({ type: String, enum: ['admin', 'user'], default: 'user' })
  role!: UserRole;
}

export type UserDocument = HydratedDocument<User>;

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.set('toJSON', {
  transform: (_doc, ret) => {
    const { passwordHash: _passwordHash, __v: _version, ...safe } =
      ret as unknown as Record<string, unknown>;
    return safe;
  },
});

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import type { HydratedDocument } from 'mongoose';

export type UserRole = 'admin' | 'user';

/**
 * @deprecated Superseded by `PortfolioProject`/`portfolioProjects` (Day 5, doc/specs/week-1/day-5/spec.md).
 * Kept functional for backward compatibility — do not add new fields or features here.
 */
@Schema({ _id: true })
export class Experience {
  @Prop({ type: String, required: true, trim: true })
  title!: string;

  @Prop({ type: String, required: true, trim: true })
  company!: string;

  @Prop({ type: Date, required: true })
  from!: Date;

  @Prop({ type: Date })
  to?: Date;

  @Prop({ type: String, trim: true })
  description?: string;
}

export const ExperienceSchema = SchemaFactory.createForClass(Experience);

ExperienceSchema.set('toJSON', {
  transform: (_doc, ret) => {
    const { _id, __v: _version, ...safe } = ret as unknown as Record<string, unknown>;
    return { id: String(_id), ...safe };
  },
});

@Schema({ _id: true })
export class PortfolioProject {
  @Prop({ type: String, required: true, trim: true, maxlength: 120 })
  title!: string;

  @Prop({ type: String, trim: true, maxlength: 2000 })
  description?: string;

  @Prop({ type: [String], default: [] })
  urls!: string[];

  @Prop({ type: [String], default: [] })
  technologies!: string[];

  @Prop({ type: Date, required: true })
  startDate!: Date;

  @Prop({ type: Date })
  endDate?: Date;

  @Prop({ type: Boolean, default: false })
  isCurrent!: boolean;
}

export const PortfolioProjectSchema = SchemaFactory.createForClass(PortfolioProject);

PortfolioProjectSchema.set('toJSON', {
  transform: (_doc, ret) => {
    const { _id, __v: _version, ...safe } = ret as unknown as Record<string, unknown>;
    return { id: String(_id), ...safe };
  },
});

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

  @Prop({ type: [String], default: [] })
  skills!: string[];

  @Prop({ type: String, trim: true, maxlength: 120 })
  headline?: string;

  @Prop({ type: String, trim: true, maxlength: 2000 })
  bio?: string;

  @Prop({ type: [PortfolioProjectSchema], default: [] })
  portfolioProjects!: PortfolioProject[];

  /** @deprecated See `Experience` class doc. */
  @Prop({ type: [ExperienceSchema], default: [] })
  experiences!: Experience[];
}

export type UserDocument = HydratedDocument<User>;

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.set('toJSON', {
  transform: (_doc, ret) => {
    const { passwordHash: _passwordHash, __v: _version, _id, ...safe } =
      ret as unknown as Record<string, unknown>;
    return { id: String(_id), ...safe };
  },
});

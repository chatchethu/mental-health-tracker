import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type UserDocument = User & Document;

@Schema({ timestamps: true })
export class User {
  // Mongoose automatically adds this, but we declare it for TypeScript
  _id?: Types.ObjectId;

  // Timestamps automatically added by { timestamps: true }
  createdAt?: Date;
  updatedAt?: Date;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  password: string;

  @Prop({ default: null })
  avatar?: string;

  @Prop({ default: null })
  refreshToken?: string;

  @Prop({ default: true })
  isActive: boolean;

  @Prop({ type: Object, default: {} })
  preferences: {
    theme?: string;
    language?: string;
    notifications?: boolean;
    privacy?: {
      shareData?: boolean;
      anonymizeData?: boolean;
    };
  };

  @Prop({ type: Object, default: {} })
  settings: {
    dailyReminders?: boolean;
    reminderTime?: string;
    weeklyReports?: boolean;
    moodAlerts?: boolean;
  };
}

export const UserSchema = SchemaFactory.createForClass(User);

// Remove password and refresh token from JSON output
UserSchema.methods.toJSON = function () {
  const user = this.toObject();
  delete user.password;
  delete user.refreshToken; 
  return user;
};

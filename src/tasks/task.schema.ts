import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Task extends Document {
  @Prop({ required: true })
  title: string;

  @Prop()
  description: string;

  @Prop({ required: true, enum: ['pending', 'in-progress', 'completed'] })
  status: string;

  @Prop({ required: true, enum: ['low', 'medium', 'high'] })
  priority: string;

  @Prop({ required: true })
  userId: string;

  @Prop({ default: false })
  isDeleted: boolean;

  @Prop({ required: true, default: 0 })
  position: number;
}

export const TaskSchema = SchemaFactory.createForClass(Task);

// Create indexes for faster filtering and search
TaskSchema.index({ userId: 1, isDeleted: 1 }); // Base lookup
TaskSchema.index({ userId: 1, status: 1, isDeleted: 1 }); // Filter by status
TaskSchema.index({ userId: 1, priority: 1, isDeleted: 1 }); // Filter by priority
TaskSchema.index({ userId: 1, status: 1, priority: 1, isDeleted: 1 }); // Filter by both
TaskSchema.index({ userId: 1, position: 1 }); // Position ordering
TaskSchema.index({ title: 'text', description: 'text' }); // Text search

import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength, IsOptional } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({
    description: 'User email address',
    example: 'user@example.com',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'User name',
    example: 'John Doe',
  })
  @IsString()
  name: string;

  @ApiProperty({
    description: 'User password',
    example: 'password123',
    minLength: 6,
  })
  @IsString()
  @MinLength(6)
  password: string;

  @ApiProperty({
    description: 'User avatar URL',
    example: 'https://example.com/avatar.jpg',
    required: false,
  })
  @IsOptional()
  @IsString()
  avatar?: string;

  @ApiProperty({
    description: 'User preferences',
    example: {
      theme: 'dark',
      language: 'en',
      notifications: true,
    },
    required: false,
  })
  @IsOptional()
  preferences?: {
    theme?: string;
    language?: string;
    notifications?: boolean;
    privacy?: {
      shareData?: boolean;
      anonymizeData?: boolean;
    };
  };

  @ApiProperty({
    description: 'User settings',
    example: {
      dailyReminders: true,
      reminderTime: '09:00',
      weeklyReports: true,
      moodAlerts: false,
    },
    required: false,
  })
  @IsOptional()
  settings?: {
    dailyReminders?: boolean;
    reminderTime?: string;
    weeklyReports?: boolean;
    moodAlerts?: boolean;
  };
}
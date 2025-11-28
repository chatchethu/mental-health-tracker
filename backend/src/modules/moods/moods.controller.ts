import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { MoodsService, MoodStats, MoodTrend } from './moods.service';
import { CreateMoodDto } from './dto/create-mood.dto';
import { UpdateMoodDto } from './dto/update-mood.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('moods')
@Controller('moods')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class MoodsController {
  constructor(private readonly moodsService: MoodsService) {}

  /* 🔹 Create mood */
  @Post()
  @ApiOperation({ summary: 'Create a new mood record' })
  @ApiResponse({ status: 201, description: 'Mood successfully created.' })
  async create(@Body() createMoodDto: CreateMoodDto) {
    return this.moodsService.create(createMoodDto);
  }

  /* 🔹 Get all moods */
  @Get()
  @ApiOperation({ summary: 'Retrieve all moods for the authenticated user' })
  async findAll(@Request() req) {
    return this.moodsService.findAll(req.user.userId);
  }

  /* 🔹 Get single mood by ID */
  @Get(':id')
  @ApiOperation({ summary: 'Get mood by ID' })
  async findOne(@Param('id') id: string) {
    return this.moodsService.findById(id);
  }

  /* 🔹 Update mood */
  @Patch(':id')
  @ApiOperation({ summary: 'Update mood by ID' })
  async update(@Param('id') id: string, @Body() dto: UpdateMoodDto) {
    return this.moodsService.update(id, dto);
  }

  /* 🔹 Delete mood */
  @Delete(':id')
  @ApiOperation({ summary: 'Delete mood by ID' })
  async remove(@Param('id') id: string) {
    return this.moodsService.remove(id);
  }

  /* 🔹 Mood Statistics */
  @Get('stats')
  @ApiOperation({ summary: 'Get mood statistics (frequency, stability, etc.)' })
  async getStats(
    @Request() req,
    @Query('days') days?: number,
  ): Promise<MoodStats> {
    return this.moodsService.getMoodStats(req.user.userId, days);
  }

  /* 🔹 Mood Trends */
  @Get('trends')
  @ApiOperation({ summary: 'Get mood trends for a given period' })
  async getTrends(
    @Request() req,
    @Query('days') days?: number,
  ): Promise<MoodTrend[]> {
    return this.moodsService.getMoodTrends(req.user.userId, days);
  }
}

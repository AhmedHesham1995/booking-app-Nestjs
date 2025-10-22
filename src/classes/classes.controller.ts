import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { ClassesService } from './classes.service';
import { CreateClassDto } from './dto/create-class.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Class } from '../schemas/class.schema';

@ApiTags('classes')
@Controller('classes')
export class ClassesController {
  constructor(private classesService: ClassesService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new class' })
  @ApiResponse({ status: 201, description: 'Class successfully created' })
  async create(@Body() createClassDto: CreateClassDto): Promise<Class> {
    return this.classesService.create(createClassDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all classes' })
  @ApiResponse({ status: 200, description: 'Return all classes' })
  async findAll(): Promise<Class[]> {
    return this.classesService.findAll();
  }
}

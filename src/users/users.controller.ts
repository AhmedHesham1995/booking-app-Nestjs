import {
  Controller,
  Post,
  Body,
  UseGuards,
  Request,
  Get,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UsersService } from './users.service';
import { AddCreditsDto } from './dto/add-credits.dto';

@ApiTags('users')
@Controller('users')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Post('add-credits')
  @ApiOperation({ summary: 'Add credits to user' })
  @ApiResponse({ status: 200, description: 'Credits successfully added' })
  async addCredits(@Request() req, @Body() addCreditsDto: AddCreditsDto) {
    return this.usersService.addCredits(req.user._id, addCreditsDto.amount);
  }

  @Get('profile')
  @ApiOperation({ summary: 'Get user profile' })
  @ApiResponse({ status: 200, description: 'Return user profile' })
  async getProfile(@Request() req) {
    return this.usersService.getProfile(req.user._id);
  }
}

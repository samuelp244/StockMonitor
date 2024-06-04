import { Body, Controller, Get, Patch, Req, UseGuards } from '@nestjs/common';
// import { Request } from 'express';
import { JwtAuthGuard } from 'src/auth/guard';
import { AdminService } from './admin.service';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { disableUserDto, enableUserDto } from './dto';

@UseGuards(JwtAuthGuard)
@Controller('admin')
export class AdminController {
  constructor(
    private adminService: AdminService,
    private readonly jwtService: JwtService,
  ) {}

  @Get('users/list')
  usersList(@Req() request: Request) {
    const decoded = this.jwtService.decode(
      request?.headers?.authorization?.split(' ')[1],
    );
    return this.adminService.usersList({ role: decoded.role });
  }

  @Patch('users/disable')
  disableUser(@Req() request: Request, @Body() dto: disableUserDto) {
    const decoded = this.jwtService.decode(
      request.headers?.authorization?.split(' ')[1],
    );
    return this.adminService.disableUser({
      role: decoded.role,
      userToDisable: dto.userToDisable,
    });
  }

  @Patch('users/enable')
  enableUser(@Req() request: Request, @Body() dto: enableUserDto) {
    const decoded = this.jwtService.decode(
      request.headers?.authorization?.split(' ')[1],
    );
    return this.adminService.enableUser({
      role: decoded.role,
      userToEnable: dto.userToEnable,
    });
  }
}

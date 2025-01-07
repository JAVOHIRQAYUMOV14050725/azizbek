import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { AdminChatService } from './admin_chat.service';
import { CreateAdminChatDto } from './dto/create-admin_chat.dto';
import { UpdateAdminChatDto } from './dto/update-admin_chat.dto';

@Controller('admin-chat')
export class AdminChatController {
  constructor(private readonly adminChatService: AdminChatService) {}

  @Post()
  create(@Body() createAdminChatDto: CreateAdminChatDto) {
    return this.adminChatService.create(createAdminChatDto);
  }

  @Get()
  findAll() {
    return this.adminChatService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.adminChatService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAdminChatDto: UpdateAdminChatDto) {
    return this.adminChatService.update(+id, updateAdminChatDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.adminChatService.remove(+id);
  }
}

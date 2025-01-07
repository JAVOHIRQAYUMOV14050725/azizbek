import { Injectable } from '@nestjs/common';
import { CreateAdminChatDto } from './dto/create-admin_chat.dto';
import { UpdateAdminChatDto } from './dto/update-admin_chat.dto';

@Injectable()
export class AdminChatService {
  create(createAdminChatDto: CreateAdminChatDto) {
    return 'This action adds a new adminChat';
  }

  findAll() {
    return `This action returns all adminChat`;
  }

  findOne(id: number) {
    return `This action returns a #${id} adminChat`;
  }

  update(id: number, updateAdminChatDto: UpdateAdminChatDto) {
    return `This action updates a #${id} adminChat`;
  }

  remove(id: number) {
    return `This action removes a #${id} adminChat`;
  }
}

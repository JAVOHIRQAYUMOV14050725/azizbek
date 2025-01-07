import { PartialType } from '@nestjs/mapped-types';
import { CreateAdminChatDto } from './create-admin_chat.dto';

export class UpdateAdminChatDto extends PartialType(CreateAdminChatDto) {}

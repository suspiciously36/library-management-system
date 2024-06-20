import { PartialType } from '@nestjs/mapped-types';
import { CreateFineDto } from './create-fine.dto';

export class UpdateFineDto extends PartialType(CreateFineDto) {}

import { IsArray, IsString } from 'class-validator';

export class ChangeTodoPriorityDto {
  @IsArray()
  @IsString({ each: true })
  todoIds: string[];
}

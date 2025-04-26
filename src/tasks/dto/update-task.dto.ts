import { ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { CreateTaskDto } from './create-task.dto';
import { IsBoolean, IsOptional } from 'class-validator';

export class UpdateTaskDto extends PartialType(CreateTaskDto) {
  @ApiPropertyOptional({
    example: true,
    description: 'Status de conclusão da tarefa',
  })
  @IsOptional()
  @IsBoolean()
  completed?: boolean;
}

import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateTaskDto {
    @ApiProperty({ example: 'Estudar NestJS', description: 'Título da tarefa' })
    @IsNotEmpty()
    @IsString()
    title: string;

    @ApiPropertyOptional({ example: 'Ler a documentação oficial', description: 'Descrição da tarefa' })
    @IsOptional()
    @IsString()
    description?: string;
}

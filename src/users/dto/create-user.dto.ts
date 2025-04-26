import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({
    example: 'Renato Software Engineer',
    description: 'Nome completo do usuário',
  })
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    example: 'teste@email.com',
    description: 'Endereço de e-mail válido do usuário',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    example: 'strongpassword123',
    description: 'Senha do usuário (mínimo 6 caracteres)',
    minLength: 6,
  })
  @MinLength(6)
  password: string;
}

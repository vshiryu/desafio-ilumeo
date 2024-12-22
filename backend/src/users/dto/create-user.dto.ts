import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsEmail, IsBoolean, IsOptional } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @ApiProperty({
    description: 'Nome do usuário',
    example: 'Vinicius',
  })
  name: string;

  @IsEmail()
  @ApiProperty({
    description: 'Email do usuário',
    example: 'teste@teste.com',
  })
  email: string;

  @IsString()
  @ApiProperty({
    description: 'Senha do usuário',
    example: 'password123',
  })
  password: string;

  @IsBoolean()
  @IsOptional()
  @ApiPropertyOptional({
    description: 'Usuário ativo',
    example: true,
    pattern: 'true'
  })
  is_active: boolean;
}

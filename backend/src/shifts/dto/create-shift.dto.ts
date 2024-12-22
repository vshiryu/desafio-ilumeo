import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional } from 'class-validator';

export class CreateShiftDto {
  @IsOptional()
  @ApiPropertyOptional({
    description: 'Tipo de turno',
    examples: ['regular', 'hora extra'],
  })
  type?: string;

  @IsNotEmpty()
  @ApiProperty({
    description: 'ID do usuário',
    example: 1,
  })
  user_id: number;
}

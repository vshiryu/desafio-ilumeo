import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ShiftsService } from './shifts.service';
import { CreateShiftDto } from './dto/create-shift.dto';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

@Controller('shifts')
export class ShiftsController {
  constructor(private readonly shiftsService: ShiftsService) {}

  @Post()
  @ApiOperation({ summary: 'Criação de turno' })
  @ApiResponse({ status: 201, description: 'Turno iniciado com sucesso.' })
  @ApiResponse({ status: 400, description: 'Usuário já possui um turno iniciado.' })
  @ApiResponse({ status: 404, description: 'Usuário não encontrado.' })
  create(@Body() createShiftDto: CreateShiftDto) {
    return this.shiftsService.create(createShiftDto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar todos os turnos' })
  findAll() {
    return this.shiftsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Listar um turno' })
  @ApiResponse({ status: 201, description: 'Turno listado com sucesso.' })
  @ApiResponse({ status: 404, description: 'Turno não encontrado.' })
  findOne(@Param('id') id: string) {
    return this.shiftsService.findOne(+id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Deletar um turno' })
  remove(@Param('id') id: string) {
    return this.shiftsService.remove(+id);
  }

  @Patch('end-shift/:userId')
  @ApiOperation({ summary: 'Atualizar fim do último turno iniciado' })
  @ApiResponse({ status: 200, description: 'Turno finalizado com sucesso.' })
  @ApiResponse({ status: 400, description: 'O usuário não possui um turno iniciado.' })
  async endShift(@Param('userId') userId: number) {
    return this.shiftsService.updateLastShiftEndTime(userId);
  }
  
  

  @Get('user/:userId')
  @ApiOperation({ summary: 'Lista turnos de um usuário' })
  @ApiResponse({ status: 200, description: 'Turnos do usuário listado com sucesso.' })
  async findAllByUser(@Param('userId') userId: number) {

    return this.shiftsService.findAllByUser(userId);
  }
}

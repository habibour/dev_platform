import { ApiProperty } from '@nestjs/swagger';

export class ErrorResponseDto {
  @ApiProperty({ example: false })
  success!: false;

  @ApiProperty({ example: 400 })
  statusCode!: number;

  @ApiProperty({ example: 'Human-readable error' })
  message!: string;

  @ApiProperty({ type: [Object], example: [] })
  errors!: unknown[];
}

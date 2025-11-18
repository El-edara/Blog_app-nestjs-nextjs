import { IsInt, IsString, MinLength } from 'class-validator';

export class CreateCommentDto {
  @IsString()
  @MinLength(1)
  description: string;

  @IsInt()
  postId: number;
}

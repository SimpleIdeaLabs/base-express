import { IsNotEmpty } from "class-validator";

export class IPaginationParams {

  @IsNotEmpty()
  page: number;

  @IsNotEmpty()
  limit: number;

}

export interface IPaginationResponse {
  currentPage?: number;
  total?: number;
}

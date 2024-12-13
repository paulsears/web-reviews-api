import { ApiExtraModels } from "@nestjs/swagger";
import { Empty } from "./empty.entity";
import { Response } from "./response.entity";

@ApiExtraModels(Response)
@ApiExtraModels(Empty)
export class BasicResponse extends Response<Empty> {}

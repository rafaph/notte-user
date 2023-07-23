import { createParamDecorator, ExecutionContext } from "@nestjs/common";

export const UserId = createParamDecorator(
  (_: unknown, ctx: ExecutionContext) => {
    const { userId } = ctx.switchToHttp().getRequest<{ userId: string }>();
    return userId;
  },
);

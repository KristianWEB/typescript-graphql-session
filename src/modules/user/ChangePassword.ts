import { Resolver, Mutation, Arg, Ctx } from "type-graphql";
import { hash } from "bcryptjs";
import { User } from "../../entity/User";
import { redis } from "../../redis";
import { forgotPasswordPrefix } from "../constants/redisPrefixes";
import { ChangePasswordInput } from "./changePassword/ChangePasswordInput";
import { MyContext } from "../../types/MyContext";

// 7c83ecac-cadc-4dbe-b8f6-7b739d9389d7
@Resolver()
export class ChangePasswordResolver {
  @Mutation(() => User, { nullable: true })
  async changePassword(
    @Arg("data") { token, password }: ChangePasswordInput,
    @Ctx() ctx: MyContext
  ): Promise<User | null> {
    const userId = await redis.get(forgotPasswordPrefix + token);

    if (!userId) {
      return null;
    }
    const user = await User.findOne(userId);
    if (!user) {
      return null;
    }
    await redis.del(forgotPasswordPrefix + token);

    user.password = await hash(password, 12);

    await user.save();

    ctx.req.session!.userId = user.id;
    return user;
  }
}

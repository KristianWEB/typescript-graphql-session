import { Resolver, Query, Mutation, Arg, UseMiddleware } from "type-graphql";
import { hash } from "bcryptjs";
import { User } from "../../entity/User";
import { RegisterInput } from "./register/RegisterInput";
import { isAuth } from "../middleware/isAuth";
import { logger } from "../middleware/logger";

@Resolver()
export class RegisterResolver {
  @Query(() => String)
  @UseMiddleware(isAuth, logger)
  async hello() {
    return "hello world";
  }

  @Mutation(() => User)
  async register(
    @Arg("data") { email, firstName, lastName, password }: RegisterInput
  ): Promise<User> {
    const hashedPassword = await hash(password, 12);

    const user = await User.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
    }).save();

    return user;
  }
}

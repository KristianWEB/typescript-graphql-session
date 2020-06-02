import { testConn } from "../../../test-utils/testConn";
import { Connection } from "typeorm";
import { gCall } from "../../../test-utils/gCall";

let conn: Connection;
beforeAll(async () => {
  conn = await testConn();
});

afterAll(async () => {
  await conn.close();
});

const registerMutation = `
mutation Register($data: RegisterInput!) {
  register(
    data: $data
  ) {
    id
    firstName
    lastName
    email
    name
  }
}
`;

describe("Register", () => {
  it("create user", async () => {
    const response = await gCall({
      source: registerMutation,
      variableValues: {
        data: {
          firstName: "bob",
          lastName: "bob2",
          email: "bob@bob.com",
          password: "sadfasdf",
        },
      },
    });
    console.log(response);
  });
});

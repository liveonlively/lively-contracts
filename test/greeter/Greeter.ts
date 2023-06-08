import { shouldBehaveLikeGreeter } from "./Greeter.behavior";
import { createFixtureLoader, deployGreeterFixture } from "./Greeter.fixture";

describe("Unit tests", function () {
  before(async function () {
    await createFixtureLoader(this);
  });

  describe("Greeter", function () {
    beforeEach(async function () {
      const { greeter } = await this.loadFixture(deployGreeterFixture);
      this.greeter = greeter;
    });

    shouldBehaveLikeGreeter();
  });
});

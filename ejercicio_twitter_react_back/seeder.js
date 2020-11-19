const { Tweet, User } = require("./models");
const faker = require("faker");

module.exports = async () => {
  for (let i = 0; i < 20; i++) {
    const user = new User({
      firstName: faker.name.firstName(),
      lastName: faker.name.lastName(),
      userName: faker.internet.userName(),
      email: faker.internet.email(),
      description: faker.lorem.words(10),
      image: faker.internet.avatar(),
      password: "root",
    });

    for (let j = 0; j < 3; j++) {
      const tweet = new Tweet({
        author: user,
        content: faker.lorem.text(10),
        date: faker.date.recent(),
      });
      await tweet.save();
      user.tweets.push(tweet);
    }
    await user.save();
  }
};

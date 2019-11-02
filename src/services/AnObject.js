const AnObject = {
  prop1: "a string",
  prop2: 1234,
  concatAnObjectProps() {
    return `${this.prop1} ||| ${this.prop2}`;
  },

  simpleObject: {
    name: "John",
    age: 25,
    ageString: "25",
    roles: ["ADMIN", "GUEST"],
    files: [
      { id: 1, name: "selfy", tags: ["photo", "me"] },
      { id: 2, name: "passport" },
      { id: 3, name: "Driver License" }
    ]
  }
};

export default AnObject;

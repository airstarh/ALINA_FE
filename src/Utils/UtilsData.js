export default class UtilsData {
  static isset(ObjectPropertyOrArrayKey) {
    return (
      typeof ObjectPropertyOrArrayKey !== "undefined" &&
      ObjectPropertyOrArrayKey !== null
    );
  }

  static empty(value) {
    return (
      value == null ||
      value == undefined ||
      value === 0 ||
      value === "" ||
      //|| value === '0' //ToDo: Doubtful.
      JSON.stringify(value) === JSON.stringify({}) ||
      JSON.stringify(value) === JSON.stringify([])
    );
  }

  static isArray(something) {
    //ToDo: Look here later: https://juhukinners.wordpress.com/2009/01/11/typeof-considered-useless-or-how-to-write-robust-type-checks/
    // return UtilsData.isset(something.length)
    // 	&& typeof something !== 'string'
    // 	;

    // Also possible:
    // return Object.prototype.toString.call(something) === '[object Array]';

    // https://stackoverflow.com/a/12469043/3142281
    return (
      something !== null &&
      typeof something === "object" &&
      typeof something.length !== "undefined"
      //&& something.__proto__ === Array.prototype
    );
  }

  /**
	 * https://stackoverflow.com/a/175787/3142281

	 isNaN(num)         // returns true if the variable does NOT contain a valid number
	 Examples
	 isNaN(123)         // false
	 isNaN('123')       // false
	 isNaN('1e10000')   // false (This translates to Infinity, which is a number)
	 isNaN('foo')       // true
	 isNaN('10px')      // true

	 * */
  static isNumber(v) {
    if (v === "") {
      return false;
    }
    return !isNaN(v);
  }
}

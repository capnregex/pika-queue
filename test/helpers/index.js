"use strict";

var should = require('should');

module.exports = {
  it_can_have_number: function (Model, field, value) {
    var params = {}, string_param = {};
    params[field] = value;
    string_param[field] = 'some string';

    it('can have ' + field, function () {
      var instance = new Model(params);
      should.exist(instance);
      should.exist(instance[field]);
      (0 + instance[field]).should.eql(value);
    });

    it('should not accept a string value for ' + field, 
      function () {
        var instance = new Model(string_param);
        should.exist(instance);
        should.not.exist(instance[field]);
      });
  }
};


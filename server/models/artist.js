'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class artist extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      artist.hasMany(models.music, {
        as: 'artist',
        foreignKey: {
          name: 'artistId'
        }
      })
    }
  };
  artist.init({
    name: DataTypes.STRING,
    old: DataTypes.STRING,
    type: DataTypes.STRING,
    startCareer: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'artist',
  });
  return artist;
};
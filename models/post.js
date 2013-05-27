
// Definicion del modelo Post:

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('Post',
            { authorId: {
                 type: DataTypes.INTEGER,
                 allowNull: false,
                 validate: {
                     notEmpty: {msg: "El campo autor no puede estar vacio"}
                 }
              },
              title: {
                 type: DataTypes.STRING,
                 allowNull: false,
                 validate: {
                     notEmpty: {msg: "El campo del titulo no puede estar vacio"}
                 }
              },
              body: {
                 type: DataTypes.TEXT,
                 allowNull: false,
                 validate: {
                     notEmpty: {msg: "El cuerpo del post no puede estar vacio"}
                 }
              }
            });
}

// Definicion del modelo de Quiz

module.exports = function(sequelize, DataTypes) {
  return sequelize.define(
    'Quiz',
    { pregunta: {
        type: DataTypes.STRING,
        validate: { notEmpty: {msg: '-> Falta Pregunta'},unique: true}
      },
      respuesta: {
        type: DataTypes.STRING,
        validate: { notEmpty: {msg: '-> Falta Respuesta'}}
      }
    }
  );
}

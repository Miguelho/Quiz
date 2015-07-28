var models= require('../models/models.js');
var numID=null;
// Autoload :id
exports.load = function(req, res, next, quizId) {
  models.Quiz.find({
           where: {
               id: Number(quizId)
           },
           include: [{
               model: models.Comment
           }]
       }).then(function(quiz) {
      if (quiz) {
        req.quiz = quiz;
        next();
      } else{next(new Error('No existe quizId=' + quizId))}
    }
  ).catch(function(error){next(error)});
};
//Funcion para obtener una fila al azar de la base de datos
function getRandomInt(min, max) {
  return parseInt(Math.floor(Math.random() * (max - min + 1)) + min);
}

// GET /quizes
exports.index = function(req, res, next) {
  var porciento = '%';
  if (req.query.search && req.query.search !== '') {
    var keys= porciento+ req.query.search.replace(' ', porciento) + porciento;
    models.Quiz.findAll({where:['pregunta like ?', keys], order: 'pregunta ASC'}).then(function(quizes) {
      res.render('quizes/index.ejs', {quizes: quizes, errors: []});
      console.log("CONSOLA LOG"+ quizes.length);

    }).catch(function(error){next(error)});
}else {
  models.Quiz.findAll().then(function(quizes) {
    res.render('quizes/index.ejs', {quizes: quizes, errors: []})
    numID = getRandomInt(1,quizes.length);
  }

  )};
};


// GET /quizes aleatorio
exports.random = function(req,res,next) {
  console.log ("CONSOLE LOG numID " + numID);
  models.Quiz.findOne({ where: {id: numID} }).then(function(quiz) {
    if (quiz){
      res.render('quizes/random', {quiz:quiz, errors: []});
    }else{
      models.Quiz.findAll().then(function(quizes) {
        res.render('quizes/index.ejs', {quizes: quizes, errors: []})
    })
  }}
  ).catch(function(error){next(error)});
}


// GET /quizes/:id
exports.show = function(req, res) {
  res.render('quizes/show', { quiz: req.quiz, errors: []});
};            // req.quiz: instancia de quiz cargada con autoload

// GET /quizes/:id/answer
exports.answer = function(req, res) {
  var resultado = 'Incorrecto';
  if (req.query.respuesta === req.quiz.respuesta) {
    resultado = 'Correcto';
  }
  res.render('quizes/answer',{
    quiz: req.quiz,
    respuesta: resultado,
    errors: []
  }
);
}


exports.author = function(req, res) {
  res.render('author',{title:'Créditos', errors: []});
};

// GET /quizes/new
exports.new = function(req, res) {
  var quiz = models.Quiz.build( // crea objeto quiz
    {pregunta: "Pregunta", respuesta: "Respuesta", tematica:"tematica"}
  );
  res.render('quizes/new', {quiz: quiz, errors: []});
};

// POST /quizes/create
exports.create = function(req, res) {
  var quiz = models.Quiz.build( req.body.quiz );
  quiz.validate().then(function(err){
    if (err) {
      res.render('quizes/new', {quiz: quiz, errors: err.errors});
    } else {
      quiz // save: guarda en DB campos pregunta y respuesta de quiz
      .save(
        {fields: ["pregunta", "respuesta","tematica"]}
      ).then(
        function(){ res.redirect('/quizes')
      });
    }      // res.redirect: Redirección HTTP a lista de preguntas
  }
);
};

// GET /quizes/:id/edit
exports.edit = function(req, res) {
  var quiz = req.quiz;  // req.quiz: autoload de instancia de quiz

  res.render('quizes/edit', {quiz: quiz, errors: []});
};

// PUT /quizes/:id
exports.update = function(req, res) {
  req.quiz.pregunta  = req.body.quiz.pregunta;
  req.quiz.respuesta = req.body.quiz.respuesta;
  req.quiz.tematica = req.body.quiz.tematica;
  req.quiz
  .validate()
  .then(
    function(err){
      if (err) {
        res.render('quizes/edit', {quiz: req.quiz, errors: err.errors});
      } else {
        req.quiz     // save: guarda campos pregunta y respuesta en DB
        .save( {fields: ["pregunta", "respuesta", "tematica"]})
        .then( function(){ res.redirect('/quizes');});
      }     // Redirección HTTP a lista de preguntas (URL relativo)
    }
  );
};

exports.destroy= function (req,res){
  req.quiz.destroy().then( function(){
    res.redirect('/quizes');
  }).catch(function(error){next(error)});
}

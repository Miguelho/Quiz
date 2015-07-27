var models= require('../models/models.js');

// Autoload :id
exports.load = function(req, res, next, quizId) {
  models.Quiz.find(quizId).then(
    function(quiz){
      if (quiz) {
        req.quiz = quiz;
        next();
      } else{next(new Error('No existe quizId=' + quizId))}
    }
  ).catch(function(error){next(error)});
};

// GET /quizes
exports.index = function(req, res, next) {
  var porciento = '%';
  if (req.query.search && req.query.search !== '') {
    var keys= porciento+ req.query.search.replace(' ', porciento) + porciento;
    models.Quiz.findAll({where:['pregunta like ?', keys],order: 'pregunta ASC'}).then(function(quizes) {
      res.render('quizes/index.ejs', {quizes: quizes, errors: []});
      console.log("CONSOLA LOG"+ quizes .length);
    }).catch(function(error){next(error)});
}else {
  models.Quiz.findAll().then(function(quizes) {
    res.render('quizes/index.ejs', {quizes: quizes, errors: []})}
  )};
};


function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// GET /quizes aleatorio
exports.random = function(req,res,next) {
  models.Quiz.findAll(
    {where:['id = ?', getRandomInt(1,4)]}
  ).then(function(quizes) {
    res.render('quizes/random', {quizes: quizes, errors: []});
    console.log("CONSOLA LOG"+ quizes.length);
  }
).catch(function(error){next(error)});
};


// GET /quizes/:id
exports.show = function(req, res) {
  res.render('quizes/show', { quiz: req.quiz, errors: []});
};

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
    {pregunta: "Pregunta", respuesta: "Respuesta"}
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
        {fields: ["pregunta", "respuesta"]}
      ).then(
        function(){ res.redirect('/quizes')
      });
    }      // res.redirect: Redirección HTTP a lista de preguntas
  }
);
};

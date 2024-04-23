//RELICA ancienne version du projet

const mysql = require('mysql');

const connection = mysql.createConnection({
  host: 'localhost', 
  user: 'root', // changer à la fin
  password: '', // changer à la fin
  database: 'consoelec' 
});

connection.connect((err) => {
  if (err) {
    console.error('Erreur de connexion :', err);
    return;
  }
  console.log('Connecté à la base de données');
  

  connection.query('SELECT * FROM table', (error, results, fields) => {
    if (error) {
      console.error('Erreur lors de exécution de la requête :', error);
      return;
    }
    console.log('Résultats de la requête :', results);
  });
});


connection.end();

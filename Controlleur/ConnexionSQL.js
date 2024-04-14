const mysql = require('mysql');

const connection = mysql.createConnection({
  host: 'localhost', 
  user: 'root', // changer à la fin
  password: '', // changer à la fin
  database: 'consoelec' 
});

// Connexion à la base de données
connection.connect((err) => {
  if (err) {
    console.error('Erreur de connexion :', err);
    return;
  }
  console.log('Connecté à la base de données');
  
  // Exemple de requête
  connection.query('SELECT * FROM table', (error, results, fields) => {
    if (error) {
      console.error('Erreur lors de l\'exécution de la requête :', error);
      return;
    }
    console.log('Résultats de la requête :', results);
  });
});

// Fermeture de la connexion à la base de données après l'exécution des requêtes
connection.end();

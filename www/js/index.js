var global_database;

document.addEventListener('deviceready', onDeviceReady, false);

function onDeviceReady() {

  console.log('Running cordova-' + cordova.platformId + '@' + cordova.version);


  // Abrir la base de datos SQLite
  global_database = window.sqlitePlugin.openDatabase(
    {
      name: "my-db.db",
      location: 'default',
      androidDatabaseProvider: 'system',
      androidLockWorkaround: 1
    },
    function (db) {
      console.log("SQLite Database >> abierta correctamente", db);
    },
    function (err) {
      console.log("Error al abrir base de datos >>", err);
    });
  // Crear una tabla, si no existe
  global_database.transaction(function (tx) {
    tx.executeSql('CREATE TABLE IF NOT EXISTS user (id integer primary key, nombre text, email text, username text, password text, telefono text)');
  }, function (err) {
    console.error('Transaction ERROR: ' + err.message);
  }, function (data) {
    console.log('Base de datos y tabla creada con éxito', data);
  });

  /*
  global_database.transaction(function (tx) {
      tx.executeSql('SELECT * FROM user', [], function (tx, rs) {

        console.log("Objeto resultSet >> ", rs);

        for (var i = 0; i < rs.rows.length; i++) {
          listUsers.innerHTML += `
            <ons-list-item tappable>${i}</ons-list-item>
            `
          console.log('Nombre: ' + rs.rows.item(i).nombre);
        }

      }, function (tx, error) {
        console.log('SELECT error: ' + error.message);
      });
    });
    */

  /*
  // Actualizar
  global_database.transaction(function(tx) {
    tx.executeSql('UPDATE demo_table SET name=?, score=? WHERE id=?', ['Bob', 202, 1]);
  }, function(error) {
    console.log('UPDATE >> Error de transacción: ' + error.message);
  }, function(data) {
    console.log('Dato actualizado >> ', data);
  });

  // Eliminar
  global_database.transaction(function(tx) {
    tx.executeSql('DELETE FROM demo_table WHERE id=?', [1]);
  }, function(error) {
    console.log('DELETE >> Error de transacción: ' + error.message);
  }, function(data) {
    console.log('Dato eliminado >> ', data);
  });
  */

  /*
  global_database.close(function(response) {
    console.log('Database is closed now.', response);
  }, function(error) {
    console.log('Error closing database: ' + error.message);
  });
  */

  /*
  </SQLITE>
  */
}

document.addEventListener('init', function (event) {
  var page = event.target;
  if (page.id === 'page1') {
    page.querySelector('#submit').onclick = function () {
      let name = page.querySelector('#name').value;
      let email = page.querySelector('#email').value;
      let username = page.querySelector('#username').value;
      let password = page.querySelector('#password').value;
      let phone = page.querySelector('#phone').value;
      const User = {
        name,
        email,
        username,
        password,
        phone
      }
      global_database.transaction(function (tx) {
        tx.executeSql('INSERT INTO user (nombre,email,username,password,telefono) VALUES (?,?,?,?,?)', [User.name, User.email, User.username, User.password, User.phone]);
      }, function (error) {
        console.log('Error de transacción: ' + error.message);
      }, function (data) {
        console.log('Datos insertados >> ', data);
      });
    }
    page.querySelector('#push-button').onclick = function () {
      document.querySelector('#myNavigator').pushPage('page2.html',
        { data: { title: 'Page 2', myData: JSON.stringify({ "first": "primer dato" }) } });
    };
  }
  else if (page.id === 'page2') {
    let createAlertDialog = function (user) {
      let dialog = document.getElementById('my-alert-dialog');   
      if (dialog) {
        let container = document.querySelector('.alert-dialog-content');
        container.innerHTML = `
                <p> Id: ${user.id} </p>
                <p> Nombre: ${user.nombre} </p>
                <p> Email: ${user.email} </p>
                <p> Username: ${user.username} </p>
                <p> Telefono: ${user.telefono} </p>
                `;
        dialog.show();
      } else {
        ons.createElement('alert-dialog.html', { append: true })
          .then(function (dialog) {
            let container = document.querySelector('.alert-dialog-content');
            container.innerHTML = `
                <p> Id: ${user.id} </p>
                <p> Nombre: ${user.nombre} </p>
                <p> Email: ${user.email} </p>
                <p> Username: ${user.username} </p>
                <p> Telefono: ${user.telefono} </p>
                `;
            let edit = dialog.querySelector('.edit');
            let ok = dialog.querySelector('.ok');
            edit.addEventListener('click', () => {
              document
                .getElementById('my-alert-dialog')
                .hide();
            })
            ok.addEventListener('click', () => {
              document
                .getElementById('my-alert-dialog')
                .hide();
            })
            dialog.show();
          });
      }
    };

    page.querySelector('ons-toolbar .center').innerHTML = page.data.title;
    let listUsers = page.querySelector('.list-users');
    global_database.transaction(function (tx) {
      tx.executeSql('SELECT * FROM user', [], function (tx, rs) {
        for (var i = 0; i < rs.rows.length; i++) {
          listUsers.innerHTML += `
            <ons-list-item tappable>${rs.rows.item(i).id} ${rs.rows.item(i).nombre}</ons-list-item>
            `
        };

      }, function (tx, error) {
        console.log('SELECT error: ' + error.message);
      });
    });
    page.querySelector('ons-list').onclick = function (evento) {
      let id = evento.target.textContent.split(' ')[0];
      console.log("ID seleccionado: ", id);
      global_database.transaction(function (tx) {
        tx.executeSql('SELECT * FROM user WHERE id = ?', [id], function (tx, rs) {
          let user = rs.rows.item(0);
          createAlertDialog(user);
        }, function (tx, error) {
          console.log('SELECT error: ' + error.message);
        });
      });

    }
  }
  else if (page.id === 'page3') {
    page.querySelector('ons-toolbar .center').innerHTML = page.data.title;
  }



});

// Develop
// Consultas a la base de datos sqlite
function sqltx(sql) {

  global_database.transaction(function (tx) {
    tx.executeSql("" + sql + "", [], function (tx, resultSet) {
      console.log(resultSet);
      for (var i = 0; i < resultSet.rows.length; i++) {
        console.log(resultSet.rows.item(i));
      }
    });
  }, function (error) {
    console.log(error);
  });
}
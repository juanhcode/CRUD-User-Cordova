var global_database;

document.addEventListener('deviceready', onDeviceReady, false);

function onDeviceReady() {
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
  // Actualizar
  global_database.transaction(function(tx) {
    tx.executeSql('UPDATE demo_table SET name=?, score=? WHERE id=?', ['Bob', 202, 1]);
  }, function(error) {
    console.log('UPDATE >> Error de transacción: ' + error.message);
  }, function(data) {
    console.log('Dato actualizado >> ', data);
  });

  /*
  global_database.close(function(response) {
    console.log('Database is closed now.', response);
  }, function(error) {
    console.log('Error closing database: ' + error.message);
  });
  */
}


document.addEventListener('init', function (event) {
  var page = event.target;

  if (page.id === 'page1') {
    page.querySelector('#submit').disabled = false;
    if (page.data.usuario) {
      const { nombre, email, username, password, telefono } = page.data.usuario;
      page.querySelector('#name').value = nombre;
      page.querySelector('#email').value = email;
      page.querySelector('#username').value = username;
      page.querySelector('#password').value = password;
      page.querySelector('#phone').value = telefono;
      page.querySelector('#edit').disabled = false;
      page.querySelector('#submit').disabled = true;
      page.querySelector('#edit').addEventListener('click', () => {
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
          tx.executeSql('UPDATE user SET nombre=?,email=?,username=?,password=?,telefono=? WHERE id=?', [User.name, User.email, User.username, User.password, User.phone, page.data.usuario.id]);
        }, function (error) {
          console.log('Error de transacción: ' + error.message);
        }, function (data) {
          page.querySelector('#name').value = '';
          page.querySelector('#email').value = '';
          page.querySelector('#username').value = '';
          page.querySelector('#password').value = '';
          page.querySelector('#phone').value = '';
          ons.notification.toast('Usuario Actualizado', { timeout: 2000 })
        });
        page.querySelector('#edit').disabled = true;
        page.querySelector('#submit').disabled = false;
      });
    }
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
        page.querySelector('#name').value = '';
        page.querySelector('#email').value = '';
        page.querySelector('#username').value = '';
        page.querySelector('#password').value = '';
        page.querySelector('#phone').value = '';
        ons.notification.toast('Usuario Creado', { timeout: 2000 });
      });
    }
    page.querySelector('#push-button').onclick = function () {
      document.querySelector('#myNavigator').pushPage('page2.html',
        { data: { title: 'Page 2', myData: JSON.stringify({ "first": "primer dato" }) } });
    };
    page.querySelector('#push-button3').onclick = function () {
      document.querySelector('#myNavigator').pushPage('page3.html',
        { data: { title: 'Buscar Usuario', myData: JSON.stringify({ "first": "primer dato" }) } });
    };
  }
  else if (page.id === 'page2') {
    let createAlertDialog = function (user) {
      let dialog = document.getElementById('my-alert-dialog');
      if (dialog) {
        console.log("hola perra");
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
        console.log("Perra");
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
            let deleteUser = dialog.querySelector('.delete');
            edit.addEventListener('click', () => {
              document.querySelector('#myNavigator').pushPage('page1.html',
                { data: { usuario: user } });
              document
                .getElementById('my-alert-dialog')
                .hide();
            })
            ok.addEventListener('click', () => {
              document
                .getElementById('my-alert-dialog')
                .hide();
                dialog.remove();
            })
            deleteUser.addEventListener('click', () => {
              ons.notification.confirm("Deseas eliminar este usuario?", {
                title: "Eliminar Usuario",
                buttonLabels: ["Cancelar", "Eliminar"],
                callback: function (index) {
                  if (index === 1) {
                    console.log(user);
                    fDeleteUser(user.id);
                  }
                }
              })
            })
            dialog.show();
          });
      }
    };

    const fDeleteUser = function (id) {
      console.log("ID del usuario a eliminar >> ", id);
      global_database.transaction(function (tx) {
        tx.executeSql('DELETE FROM user WHERE id = ?', [id]);
      }, function (error) {
        console.log('DELETE >> Error de transacción: ' + error.message);
        ons.notification.toast('Error', { timeout: 2000 });
      }, function (data) {
        ons.notification.toast('Usuario eliminado', { timeout: 2000 });
        console.log('Dato eliminado >> ', data);
      });
    }

    page.querySelector('ons-toolbar .center').innerHTML = page.data.title;


    const users = function () {
      let listUsers = page.querySelector('.list-users');
      global_database.transaction(function (tx) {
        tx.executeSql('SELECT * FROM user', [], function (tx, rs) {
          for (var i = 0; i < rs.rows.length; i++) {
            listUsers.innerHTML += `
            <ons-list-item tappable>${i+1} | Id: ${rs.rows.item(i).id} Nombre: ${rs.rows.item(i).nombre} Username:${rs.rows.item(i).username}</ons-list-item>
            `
          };

        }, function (tx, error) {
          console.log('SELECT error: ' + error.message);
        });
      });
    }
    users();


    page.querySelector('ons-list').onclick = function (evento) {
      console.log(evento.target.textContent.split(' '));
      let id = evento.target.textContent.split(' ')[3];
      console.log(id);
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
    page.querySelector('.search').onchange = function () {
      let email = this.value;
      global_database.transaction(function (tx) {
        tx.executeSql('SELECT * FROM user WHERE email = ?', [email], function (tx, rs) {
          let user = rs.rows.item(0);
          if (user) {
            ons.notification.confirm(
              'Usuario'
              + "<br>" + "Nombre: " + user.nombre
              + "<br>" + "Email: " + user.email
              + "<br>" + "Username: " + user.username
              + "<br>" + "Telefono: " + user.telefono);
          } else {
            ons.notification.toast('Usuario no encontrado', { timeout: 2000 });
          }
        }, function (tx, error) {
          console.log('SELECT error: ' + error.message);
          ons.notification.alert('Searched for: ' + error.message);
        });
      });
    };
  }
});
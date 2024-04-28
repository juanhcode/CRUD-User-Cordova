
const getUserByEmmail = (email) => {
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
}

module.exports = getUserByEmmail;
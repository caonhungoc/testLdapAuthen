const ldap = require('ldapjs');

const client = ldap.createClient({
  url: ['ldap://localhost:389']
});

client.on('error', (err) => {
  // handle connection error
  if(err) console.log(err);
})

/*use this to create connection*/
function authenticateDN(username, password) {

    /*bind use for authentication*/
    client.bind(username, password, function (err) {
        if (err) {
            console.log("Error in new connetion " + err)
        } else {
            /*if connection is success then go for any operation*/
            console.log("Success");
            // searchUser();
            addUser();
            //deleteUser();
            //addUserToGroup('cn=Administrators,ou=groups,ou=system');
            //deleteUserFromGroup('cn=Administrators,ou=groups,ou=system');
            //updateUser('cn=test,ou=users,ou=system');
            //compare('cn=test,ou=users,ou=system');
            // modifyDN('cn=bar,ou=users,ou=system');

        }
    });
}

/*use this to add user*/
function addUser() { // need admin authentication
    var entry = {
        sn: 'bar',
        objectclass: 'inetOrgPerson'
    };
    client.add('cn=foo12,ou=People,dc=maxcrc,dc=com', entry, function (err) {
        if (err) {
            console.log("err in new user " + err);
        } else {
            console.log("added user")
        }
    });
}

/*create authentication*/
// authenticateDN("cn=ngoc,ou=People,dc=maxcrc,dc=com", "pwd")
authenticateDN("cn=manager,dc=maxcrc,dc=com", "secret")

/*use this to search user, add your condition inside filter*/
function searchUser() {
    var opts = {
        //  filter: '(objectClass=*)',  //simple search
         filter: '(&(cn=John)(sn=john))',// and search
        // filter: '((cn=ngoc))', // or search
        scope: 'sub',
        attributes: ['sn']
    };

    client.search('ou=People,dc=maxcrc,dc=com', opts, function (err, res) {
        if (err) {
            console.log("Error in search " + err)
        } else {
            res.on('searchEntry', function (entry) {
                console.log('entry: ' + JSON.stringify(entry.object));
            });
            res.on('searchReference', function (referral) {
                console.log('referral: ' + referral.uris.join());
            });
            res.on('error', function (err) {
                console.error('error: ' + err.message);
            });
            res.on('end', function (result) {
                console.log('status: ' + result.status);
            });
        }
    });
}
// searchUser(); // can search without authenticating
// authen
// client.bind('cn=ngoc,ou=People,dc=maxcrc,dc=com', 'pwd', (err) => {
//     if(err) console.log(err);
//     else {
//         console.log("success for ngoc, and add user")
//         const entry = {
//             sn: 'cao',
//             objectclass: 'inetOrgPerson'
//           };
//           client.add('cn=ngan,ou=People,dc=maxcrc,dc=com', entry, (err) => {
//             if(err) console.log(err);
//             else {
//                 console.log("success")
//             }
//           });

//     }
// });
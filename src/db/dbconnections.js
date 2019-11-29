const Errors = require('../constants/errors');
const uuidv1 = require('uuid/v1');
class DBConnections {
    constructor(firestore) {
        this.firestore = firestore;
    }

    collection() {
        return this.firestore.collection("connections");
    }

    async getConnectionsForUser(username) {
        let snapshot = await this.collection().where("usernames", "array-contains", username).get();

        let connections = [];
        snapshot.forEach((doc) => {
            let connection = doc.data();

            let otherUsername = connection.usernames[0];
            if(otherUsername == username) {
                otherUsername = connection.usernames[1];
            }

            connections.push(otherUsername);
        });                

        return connections;
    }

    /**
     * 
     * @param {*} username 
     * @returns {Array.<any>} returns an array of connections sorted in date time
     */
    async getRecentConnectionsForUser(username) { 
        let snapshot = await this.collection().where("usernames", "array-contains", username).get();

        let connections = [];
        snapshot.forEach((doc) => {
            let connection = doc.data();

            let otherUsername = connection.usernames[0];
            if(otherUsername == username) {
                otherUsername = connection.usernames[1];
            }

            connections.push({
                username: otherUsername,
                time: connection.time
            });
        });                

        connections.sort((a,b) => {
            if (a.time < b.time) {
                return -1;
            } else if (a.time > b.time) {
                return 1;
            }
            else {
                return 0;
            }
        });

        return connections;
    }

     /**
     * 
     * @param {Array.<String>} usernames 
     * @returns {Promise<{usernames: String[], connection_id}[]>}
     */
    async connectUsers(usernames, image_id)
    {
        
        let connections = [];

        for(let i=0; i<usernames.length;i++)
        {   
            let username = usernames[i];
            //image is not taken 
            if(username == "UNKNOWN")        
            {
                continue;
            }            
            
            let userDoc = this.firestore.collection("users").doc(username);
            let user = await userDoc.get();        
            
            if(!user.exists)
            {
                throw Errors.USERS.ERROR_USER_DOESNT_EXIST;
            }

            
            
            for (let j = i + 1; j < usernames.length; j++) {
                // connections.push([usernames[i], usernames[j]]);
                let connection = [usernames[i], usernames[j]];    
                
                //ensure consistency for duplicate checking

                connection.sort();
                //check if connection already exists
                let checkDuplicateSnapshot = await this.collection().where("usernames", "==", connection).get();
                if(checkDuplicateSnapshot.size != 0) {
                    console.log(`${Errors.CONNECTION.ERROR_ALREADY_CONNECTED.message}: ${connection[0]} and ${connection[1]}`);
                    continue;
                }

                let id = uuidv1().toString();
                await this.collection().doc(id).set({
                    usernames: connection,
                    time: Date.now().toString(),
                    image_id 
                });

                console.log(`"${usernames[i]}" has connected to "${usernames[j]}"`);

                connections.push({connection_id: id, usernames: connection});
            }
        }     
        
        return connections;
    }

    async deleteConnection(connection_id) {
        if(connection_id) {
            let docRef = this.collection().doc(connection_id);
            let doc = await docRef.get();
            let data = doc.data();
            
            if(doc.exists) {                
                console.log(`disconnecting users "${data.usernames[0]}" and "${data.usernames[1]}"`);
                await docRef.delete();
            }
            else {
                console.log(`connection does not exist: ${connection_id}`);
            }
        }
        else{
            
        }
    }

    async getMutualConnectionsForUsers(usernameA, usernameB) {
        let connectionsA = await this.getConnectionsForUser(usernameA);
        let connectionsB = await this.getConnectionsForUser(usernameB);

        let mutualConnections = [];
        for(let username of connectionsA) {
            if(connectionsB.indexOf(username) != -1) {
                mutualConnections.push(username);
            }   
        }

        return mutualConnections;
    }
}

module.exports = DBConnections;
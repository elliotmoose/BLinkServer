const Errors = require('../constants/errors');
const uuid = require('uuid');
class DBRegistrations {
    constructor(firestore) {
        this.firestore = firestore;
    }

    collection() {
        return this.firestore.collection("registrations");
    }
    

    /**
     * @returns {Promise<{event : String[]}>}
     */
    async getRegistrationUsernames(){
        let event_registrations_snapshot = await this.collection().get();

        let eventRegistrationUsernames = {};
        //for each event
        event_registrations_snapshot.forEach((eventregistrationDoc) => {
            let event_id = eventregistrationDoc.id;
            //get registration data
            let registrationData = eventregistrationDoc.data();
            //map all usernames to event arrays                        
            //if no registrations yet
            if(eventRegistrationUsernames[registrationData.event_id] == undefined) {
                eventRegistrationUsernames[registrationData.event_id] = [registrationData.username];//set registration
            }
            else {
                eventRegistrationUsernames[registrationData.event_id].push(registrationData.username);
            }       
        })
        
        // console.log(eventRegistrationUsernames);
        return eventRegistrationUsernames;
    }

    async registerUserForEvent(username, event_id) {
        console.log(`registering "${username}" for event with id: "${event_id}"`);
        let event_registrations = await this.collection().where("event_id","==",event_id).get();

        let registeredAlready = false;

        event_registrations.forEach((registrationDoc) => {
            if(registrationDoc.data().username == username) {
                registeredAlready = true;
            }
        })
        
        if (registeredAlready) {
            console.log(`"${username}" has has already registered for event with id "${event_id}"`);
        }
        else
        {
            let event_registration_data = {
                username: username,
                event_id: event_id,
                attended: false,
                dateRegistered: Date.now().toString(),
                dateAttended: 0                    
            };

            let registration_id = uuid.v1().toString();
            await this.collection().doc(registration_id).set(event_registration_data);
        }

    }

    /**
     * 
     * @param {*} username 
     * @param {*} event_id 
     * @returns {Promise<boolean>} Needs to notify
     */
    async markUserAttendanceForEvent(username, event_id) {
        let snapshot = await this.collection().where("username", "==", username).where("event_id","==",event_id).get();        
        
        if(snapshot.size == 0) {
            throw Errors.EVENTS.ERROR_USER_NOT_REGISTERED;                      
        }

        var needsNotification = true;
        snapshot.forEach(async (registerDoc)=> {
            let event_registration_data = registerDoc.data();     
            if(event_registration_data.attended == true) {
                needsNotification = false;
            }

            event_registration_data = {
                ...event_registration_data,
                attended: true,
                dateAttended: Date.now().toString(),
            }
            await this.collection().doc(registerDoc.id).set(event_registration_data);            
        });

        return needsNotification; //needs to notify
    }

    async registrationsForEvent(event_id) {
        let snapshot = await this.collection().get();        
        
        //hashmap byb username
        let registrations = {};
        snapshot.forEach((event_registration) => {
            let regData = event_registration.data();            
            if(regData.event_id == event_id) {
                registrations[regData.username] = regData                
            }
        });        

        return registrations;
    }    

    async getUserRegisteredEventIds(username) { 
        let output = {            
            attended_event_ids: [],
            unattended_event_ids: [],            
        }

        let snapshot = await this.collection().where("username", "==", username).get();
        snapshot.forEach(function(doc) {            
            let record = doc.data();

            if(record.attended == false){
                output.unattended_event_ids.push(record.event_id);
            }
            else {                
                output.attended_event_ids.push(record.event_id);
            }
        });
        
        return output;
    }

    async userEventRelationship(username, event_id) {
        let event_registrations = await this.collection().doc(event_id).get();

        if (event_registrations.exists) {
            let event_registration_data = event_registrations.data();
            let isRegisteredData = event_registration_data[username];

            if(isRegisteredData === undefined) {
                return 0; //not registered
            }
            else if (isRegisteredData[status] == false) {
                return 1; //registered but not attended yet
            }
            else {
                return 2;
            }
        }
        else
        {
            throw Errors.EVENTS.ERROR_EVENT_DOESNT_EXIST;
        }
    }   
}

module.exports = DBRegistrations;
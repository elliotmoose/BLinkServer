const uuid = require('uuid');
const bcrypt = require('bcrypt');
const config = require('../constants/config');

 /**
 * Hashes and salts password
 * @param {string} password 
 */
const hashedpassword = (password) =>
{
    return new Promise((resolve,reject)=>{
        bcrypt.hash(password, config.SALT_ROUNDS, (error,hash)=>{
            if (error)
            {
                reject(error);
            }

            resolve(hash);
        });
    })
}
/* Prepare different collections and documents, there'll be 4 collections 
 #1 Users 
 #2 Event
 #3 Event Users 
 #4 Registration
 #5 Connections */
class DBInit {
    constructor(firestore) {
        this.firestore = firestore;
    }

    initializeDB()
    {
        this.initUsers();
        this.initConnections();
        this.initEvents();
        this.initOrganisers();
        this.initRegistration();
    }

    async initUsers() {
        console.log("Initializing Users...");
        let password = await hashedpassword('12345');
        //Setting up Collection 1: Users, Document: Usernames, Field: User/Userid/Email/password/Events attended
        let colRef_users = this.firestore.collection('users');
        let users_list = [{
            username : "seanmlim",
            password: password,
            displayname: "Sean Michael Lim",            
            email:'seanmlim@gmail.com',                                
            face_encoding: '[-0.11792778968811035,0.07318182289600372,0.020110590383410454,-0.03121764212846756,-0.13493411242961884,-0.0659957304596901,-0.00267232209444046,-0.10644872486591339,0.10645516216754913,-0.0821387842297554,0.2745312750339508,-0.15053145587444305,-0.24624839425086975,-0.10773435980081558,-0.044669777154922485,0.17723657190799713,-0.15023784339427948,-0.12532861530780792,-0.05778916925191879,0.009857624769210815,0.17650650441646576,-0.04046183079481125,-0.02218369022011757,0.07376310229301453,-0.11740465462207794,-0.3291471600532532,-0.07060748338699341,-0.08853442966938019,0.07056523859500885,-0.0862133800983429,-0.02218368835747242,0.0134081169962883,-0.2129095494747162,-0.11147241294384003,0.04443079233169556,0.06150909140706062,-0.017252132296562195,-0.0300842747092247,0.1758001148700714,-0.06383715569972992,-0.2989942133426666,0.01436285674571991,0.0790422260761261,0.1820785105228424,0.16827064752578735,0.108494333922863,0.012892762199044228,-0.1859942525625229,0.1463172286748886,-0.177787184715271,0.030321301892399788,0.15174250304698944,0.11048175394535065,0.032459087669849396,0.005916528403759003,-0.1269347220659256,0.0111311674118042,0.1595916748046875,-0.20215719938278198,0.03565956652164459,0.1001090556383133,-0.09345657378435135,-0.02514815144240856,-0.10184802114963531,0.18574948608875275,-0.00025040749460458755,-0.13172847032546997,-0.17137686908245087,0.15217310190200806,-0.17488546669483185,-0.06131735071539879,0.1342562735080719,-0.10722343623638153,-0.19585758447647095,-0.3277813792228699,0.006887853145599365,0.4497934877872467,0.061594776809215546,-0.1672329604625702,0.054077260196208954,-0.03630424290895462,-0.010461196303367615,0.12631800770759583,0.1555948257446289,0.02887492999434471,-0.023931756615638733,-0.08383939415216446,-0.019004032015800476,0.2117013782262802,-0.10779514163732529,0.03348506987094879,0.2084951400756836,-0.02062493935227394,0.08004971593618393,-0.004930215887725353,0.05580291152000427,-0.11739896237850189,0.03709422051906586,-0.05307374149560928,-0.021434590220451355,0.022601142525672913,-0.029661577194929123,0.007186368107795715,0.06831042468547821,-0.14271020889282227,0.10904260724782944,-0.030969373881816864,0.04802827909588814,0.0002692416310310364,-0.05369512736797333,-0.05247566103935242,-0.05972616374492645,0.09889903664588928,-0.24902456998825073,0.2252177596092224,0.16828420758247375,0.03433623164892197,0.08452202379703522,0.11712408810853958,0.0646207258105278,0.04085851460695267,-0.030604034662246704,-0.23464658856391907,-0.02959207072854042,0.12210500985383987,-0.09695294499397278,0.07997284829616547,-0.06251262873411179]',
            bio : `Hello! My name is Sean. I have Designed multiples posters and videos despite no prior training in Adobe applications. Was a key member in SUTD Bands publicity pushes which includes SUTD’s own “Intervarsity Jam 2019” and “Rockafall 2019”, where I made a name for myself as the dude who got wasted before the event started. Publicity was seen as a success due to the large turnouts and club-profits raised for the aforementioned events.`,
            position : 'CEO',
            company : 'Veggie Wraps Inc.',
            facebook : `facebook.com/seanmlim`,
            instagram : `bgourd`,
            linkedin : `linkedin.com/in/seanmlim`,
            status : 'ACTIVE',
            token :''
        }, {
            username : "mooselliot",
            password: password,
            displayname: "Elliot Koh",            
            email: 'kyzelliot@gmail.com',                                
            face_encoding: '[-0.008882850408554077,0.0933077335357666,0.01269204169511795,0.01287589780986309,-0.11476379632949829,-0.027350880205631256,-0.062337785959243774,-0.11015482246875763,0.1404397338628769,-0.08646339923143387,0.2474975883960724,0.0032592089846730232,-0.26138824224472046,-0.12953263521194458,-0.03420443832874298,0.1730911135673523,-0.08765440434217453,-0.14640603959560394,0.004600482527166605,0.04279037564992905,0.14900940656661987,-0.01994497701525688,0.022788580507040024,0.019177399575710297,-0.07803072035312653,-0.36915674805641174,-0.1316213756799698,-0.030017536133527756,0.014001617208123207,-0.05660560727119446,-0.04129385948181152,0.029935263097286224,-0.18268516659736633,-0.04396526515483856,0.03197380155324936,0.02250726893544197,-0.028775781393051147,-0.031834132969379425,0.171569362282753,0.004122346639633179,-0.25901392102241516,-0.010094627737998962,-0.00531468540430069,0.19036000967025757,0.10823830962181091,0.058123696595430374,0.07391628623008728,-0.1735539585351944,0.03280738741159439,-0.1766689419746399,0.10410130769014359,0.16828744113445282,0.11017055064439774,0.03260107338428497,0.005418568849563599,-0.12367952615022659,0.0031651556491851807,0.09769433736801147,-0.14975854754447937,0.05069134384393692,0.10393010079860687,-0.07748785614967346,-0.05993114784359932,-0.10480895638465881,0.20361045002937317,0.06502220034599304,-0.1125577837228775,-0.1909024715423584,0.12978330254554749,-0.1758495718240738,-0.09293806552886963,0.066366046667099,-0.10852108895778656,-0.21125078201293945,-0.3372606039047241,0.024621695280075073,0.3890981674194336,0.13538376986980438,-0.23558717966079712,0.025874802842736244,-0.05595563352108002,0.02848226949572563,0.129331573843956,0.1129351258277893,-0.01143830269575119,0.025944918394088745,-0.143152117729187,-0.013285666704177856,0.21408791840076447,-0.10209516435861588,-0.02205844037234783,0.2543931007385254,-0.0018203780055046082,0.1359511911869049,0.025213206186890602,0.06700746715068817,-0.023254133760929108,0.02977111004292965,-0.08650269359350204,0.0003030449151992798,0.05444813519716263,-0.05651737004518509,-0.004146486520767212,0.11100956797599792,-0.11456813663244247,0.10633113980293274,-0.02158854901790619,0.04361329600214958,0.05547504127025604,0.0184289813041687,-0.14976327121257782,-0.13785260915756226,0.11543875932693481,-0.21373137831687927,0.21905256807804108,0.15411430597305298,0.048126038163900375,0.08913314342498779,0.12515737116336823,0.1504698246717453,-0.023617833852767944,-0.12298017740249634,-0.21553075313568115,-0.016463030129671097,0.08575034141540527,-0.05409619212150574,0.03293798863887787,-0.005381673574447632]',
            bio : `Hello! My name is Elliot. I love to code and I love to build apps. I think I'm a fun guy but really I'm just a nerd who loves software development. Hey, no shame in the game am I right? Anyhoo, I see you've connected with me. Feel free to contact me thorugh any of the available platforms listed below! I'm particularly active on Linkedin where I'm recieving more than 100 job offers in a day! Nonetheless, I've always wanted to be part of a start-up, hence, do feel free to message me if you have an idea that you're willing to share. XOXO`,
            position : 'Software Developer',
            company : 'MooseDev',
            facebook : `facebook.com/mooselliot`,
            instagram : `mooselliot`,
            linkedin : `linkedin.com/in/mooselliot`,
            status : 'ACTIVE',
            token : ''
        }];

        for (let user of users_list) {
            let docRef_users = colRef_users.doc(user.username);
            docRef_users.set(user);
        }
    }

    initEvents() {
        console.log("Initializing Events...");

        //Setting up Collection 2 : Events, Document : UUIDs, Field: Event Name, Date, Organiser UUID, Price
        let colRef_events = this.firestore.collection('events');
        let events_list = [{
            event_id: "event_a",
            event_name: 'Industry Night 2019',
            date: '25/12/19', //in DDMMYY
            org_username: 'SUTD',
            description: 'A biannual event that provides networking opportunities for both companies, and students to mingle and get to know each other better. We also host an Industry Night twice a year, generally in September and October. The Industry Night in September takes place after the Learning Celebration Carnival and gives our students the opportunity to present the projects they were working on during the summer internship. Both the Industry Nights in September and October are provide networking opportunities for both companies, and students to mingle and get to know each other better. Whilst it serves primarily as a networking event, it is not uncommon for companies to present jobs and scout for potential interns/employees during Industry Night. ',
            address: '8 Somapah Road',
            time: '7pm - 10pm',
            price: 'FREE',
            tags: ["Jobs", "Tech", "Business"]
        }, {
            event_id: "event_b",
            event_name: 'Interview Workshop',
            date: '23/12/19', //in DDMMYY
            org_username: 'Google',
            description: 'Join Googlers for an interactive workshop featuring technical interview best practices, tips & tricks, and sample questions for software engineering and associate product manager full-time and intern roles.',
            address: '1 Expo Drive, Singapore 486150',
            time: '6pm - 9pm',
            price: 'FREE',
            tags: ["Jobs", "Tech", "Business"]
        }, {
            event_id: "event_c",
            event_name: 'Recruitment Talk',
            date: '07/01/20', //in DDMMYY
            org_username: 'MasterCard',
            description:"What if you can join a company where you can make an impact? You can. Join us at Mastercard. Code means something more to us. It doesn't just refer to a complex set of numerical values but a set of moral values, too. Every day we build technology that makes the world a safer, smarter place for all of us. ",
            address: '8 Somapah Road',
            time: '10am - 2pm',
            price: 'FREE',
            tags: ["Jobs", "Tech", "Business"]
        }, {
            event_id: "event_d",
            event_name: 'Information Session',
            date: '28/12/19', //in DDMMYY
            org_username: 'Facebook',
            description: "Facebook Real-Time Communication Overview of Facebook's real-time communication infrastructure and the product experiences it enables for our billions of users. We will go into details on how a new video calling product is developed from start to finish at Facebook. Starting from a basic product idea and market research, going through design explorations and iterations, user research, engineering iterations, internal and public testing, and eventually launching to the general public. We will also talk about some of the key pieces of technologies and architectures that we employ to build a scalable and efficient system to enable the best user experience. You will also get a glimpse of what it means to be an engineer at Facebook and what the day-to-day life is like as an engineer at work.",
            address: '89 Straits View Marina One, 018937',
            time: '2pm - 3pm',
            price: 'FREE',
            tags: ["Jobs", "Tech", "Business"]
        }, {
            event_id: "event_e",
            event_name: 'Interview Workshop (UPOP)',
            date: '21/01/20', //in DDMMYY
            org_username: 'SUTD',
            description: 'The Undergraduate Practice Opportunities Program (UPOP) is a programme that aims to develop our undergraduates to be career-ready. Through the practical and experiential sessions conducted by the career advisors and professional consultants, students will acquire relevant career skills to help them navigate the graduate employment market.',
            address: '8 Somapah Road',
            time: '7pm - 10pm',
            price: 'FREE',
            tags: ["Jobs", "Tech", "Business"]
        }];


        for (let event of events_list) {
            let docRef_events = colRef_events.doc(event.event_id);
            docRef_events.set(event);
        }   
    }

    initOrganisers() {
        console.log("Initializing Organisers...");

        //Setting up collection 3: organisers, Document: UUIDs, Field : USer/User ID/Email/PAssword/ORganisation/Events organised
        let colRef_organisers = this.firestore.collection('organisers');
        let organisers_list = ["ustd"];
        for (let i of organisers_list) {
            let docRef_organisers = colRef_organisers.doc(i);
            let set_organisers = docRef_organisers.set({
                org_username: i,
                first_name: '',
                last_name: '',
                email: '',
                password: '',
                organisation_name: '',
                events_organised: []
            })
        }
    }

    initRegistration() {
        console.log("Initializing Registration...");

        //Setting up collection 4: registation, Document: event UUIDs, Field : USername : { status : , date: } ID/Email/PAssword/ORganisation/Events organised
        let colRef_registration = this.firestore.collection('registrations');
        
        let registration_list = [{
            attended : false,
            dateAttended : "0",
            dateRegistered : Date.now().toString(),
            username: "seanmlim",
            event_id: "event_a"
        }, {
            attended : false,
            dateAttended : "0",
            dateRegistered : Date.now().toString(),
            username: "mooselliot",
            event_id: "event_b"
        }, {
            attended : true,
            dateAttended : "0",
            dateRegistered : Date.now().toString(),
            username: "mooselliot",
            event_id: "event_c"
        },{
            attended : false,
            dateAttended : "0",
            dateRegistered : Date.now().toString(),
            username: "seanmlim",
            event_id: "event_d"
        }];

        for (let registration of registration_list) {
            let registration_id = uuid.v1().toString();
            let docRef_registration = colRef_registration.doc(registration_id);
            docRef_registration.set(registration);
        }
    }

    initConnections() {
        console.log("Initializing Connections...");

        //Setting up collection 5: Connection. Document: Random number. Field: User A: USer B
        let colRef_connections = this.firestore.collection('connections');
        let connections = [{
            connection_id: "e3bf7a70-0fb7-11ea-b8c1-831b43a9a941",
            usernames: ["seanmlim", "mooselliot"],                
            time: Date.now().toString(),
            image_id: ""
        }];        

        for(let connection of connections) {
            // let connection_id = uuid.v1().toString();
            // console.log(connection_id);
            let docRef_connections = colRef_connections.doc(connection.connection_id);        
            docRef_connections.set(connection);
        }
    }
}

module.exports = DBInit
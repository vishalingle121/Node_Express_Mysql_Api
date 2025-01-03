const mysql=require('mysql2');

const pool=mysql.createConnection({
    host:'localhost',
    user:'root',
    password:'veera@05',
    database:'student',
});

pool.connect((err)=>{
    if(err){
        console.error(err,'Error connectiong the database');
        return;
    }
    console.log('connected to the database!');

});

module.exports=pool;
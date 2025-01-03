const express=require('express')
const app=express();
const pool=require('./db');
const bodyParser=require('body-parser');
const port=5000;
const {body,validationResult}=require('express-validator')

app.use(bodyParser.json());

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*'); // Change '*' to specific origins if needed
    res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type,Authorization');
    // Handle preflight requests
    if (req.method === 'OPTIONS') {
      return res.sendStatus(204); // Send a 204 No Content response
    }
    next();
});


app.get('/',(req,res)=>{
    res.send("<center><h1>Welcome to express JS</h1></center>")
})
app.get('/emp',(req,res)=>{
    try{
        const result=pool.query('select * from emp',(err,results)=>{
            res.json({status:200,studlst:results});
            /*if(err){
                console.error(err.message);
                res.status(500).send('server error',err);
            }*/
        });
    }
    catch(err){
        console.error(err.message);
        res.status(500).send('server error');
    }
})
app.get('/std',(req,res)=>{
    pool.query('select * from stud',(err,results)=>{
        if(err){
            console.error('Error occured',err);
            return res.status(500).send('Database Error');
        }
        res.json({status:"200",stdlst:results});
    });
});
app.post('/stdadd',[
        body('id').notEmpty().withMessage('id is required'),
        body('age').notEmpty().withMessage('age is required'),
        body('city').notEmpty().withMessage('city is required'),
        body('name').notEmpty().withMessage('name is required')
]
    ,(req,res)=>{
        
        const errors=validationResult(req);
        if(!errors.isEmpty()){
            return res.status(400).json({errors:errors.array()});
        }
        else{
    const {id,name,city,age}=req.body;
       // const sql='insert into stud(id,name,city,age)values(?,?,?,?)';
       // const values=[id,name,city,age];
      //  pool.query('insert into stud(id,name,city,age)values($1,$2,$3,$4)',[id,name,city,age],(err,results)=>
        pool.query('insert into stud(id,name,city,age)values(?,?,?,?)',[id,name,city,age],(err,results)=>{
        if(err){
            console.error('Error occured',err);
            return res.status(500).send('Database Error');
        }
        res.json({status:"200",message:"Insert success"});
    });
}
});
app.put('/stdupdate',(req,res)=>{
    try{
    const {name,city,age,id}=req.body;
        pool.query('update stud set name=?,city=?,age=? where id=?',[name,city,age,id]);
        res.json({status:"200",message:"Update success"});
}
catch(err){
   
        console.error('Error occured',err);
        return res.status(500).send('Database Error');
    
}
});

app.delete('/stddelete',(req,res)=>{
    const {id}=req.body;
       pool.query('delete from stud where id=?',[id],(err,results)=>{
        if(err){
            console.error('Error occured',err);
            return res.status(500).send('Database Error');
        }
        res.json({status:"200",message:"delete success"});
    });
});
app.listen(port,'localhost',()=>{
    console.log('server running on http://localhost:5000');
})
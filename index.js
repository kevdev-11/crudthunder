const http = require('http');
const path = require('path');
const fs = require('fs/promises');

const app = http.createServer(async (request, response)=>{
const method = request.method;
const url = request.url;
console.log(url, method);
const jsonPath = path.resolve('./json/users.json')
if(url === '/users'){

    if (method==='GET'){
      const jsonFile = await fs.readFile(jsonPath, 'utf-8');
      response.setHeader('Context-Type', 'application/json');
      response.write(jsonFile)
    };
    
    const jsonFile= await fs.readFile(jsonPath, 'utf-8');
    const userArray = JSON.parse(jsonFile);
    
    if (method==='POST'){
        
        request.on('data', (data)=>{
            const user = JSON.parse(data);
            userArray.push(user);
            const createJson = JSON.stringify(userArray);
            fs.writeFile(jsonPath, createJson);
        });
    }

    if (method === 'PUT'){
        request.on('data', (data)=>{
            const refreshData = JSON.parse(data);
            // userArray.push(refreshData);
            for(let i=0; i<userArray.lenght; i++){
                // console.log(i);
                if(refreshData.name === userArray[i].name){
                    // console.log(refreshData, userArray[i].name);
                    userArray.splice(i,1,refreshData);
                    const refreshJson = JSON.stringify(userArray);
                    fs.writeFile(jsonPath,refreshJson);
                }
            }
        });
    }
    if (method === 'DELETE'){
        request.on('data', (data)=>{
            const deleteData = JSON.parse(data);
            for(let i=0; i<userArray.lenght; i++){
                // console.log(i);
                if(deleteData.name === userArray[i].name){
                    userArray.splice(i,1);
                    const deleteJson = JSON.stringify(userArray);
                    fs.writeFile(jsonPath,deleteJson);
                }
            }
        });
    }
}else{
    response.write('recurso no disponible')
}

response.end();

});

// console.log(app);

const PORT = 5000;
app.listen(PORT);
console.log(`sucediendo en ${PORT}`);
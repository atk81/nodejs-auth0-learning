const app = require('./app');

const { PORT } = process.env;

app.listen(PORT || 4000,()=>{
    console.log(`Server is running on port ${PORT}`);
});
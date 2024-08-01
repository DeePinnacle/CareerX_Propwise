 const generateAccountNumber = (len) =>{
    let ranNum =''
    for(let i = 0; i < len; i++){
        ranNum += Math.floor(Math.random() * 10)
    }
    return ranNum;
}

module.exports = { generateAccountNumber };
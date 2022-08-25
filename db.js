import mongoose from 'mongoose'
import {cred} from './credentials.js'

const password = encodeURIComponent(cred.password)
const url = `mongodb+srv://admin-blue:${password}@cluster0.il2bjzs.mongodb.net/todolistDB`

try{
    mongoose.connect(
    url,
    { useNewUrlParser: true, useUnifiedTopology: true},
    ()=>console.log('Successfully connected'))
}catch(e){
    console.log('failed');
}

const itemsSchema = {
    name : {
        type : String,
        required : true
    }
}

const listSchema = {
    name : {
        type : String,
        required : true
    },
    items : [itemsSchema]
}

export const Item = mongoose.model('Item', itemsSchema)
export const List = mongoose.model('List', listSchema)


const item1 = new Item({
    name : 'Welcome to your todolist'  
})
const item2 = new Item({
    name : 'Hit the + button to add a new item.'
})
const item3 = new Item({
    name : '<-- Hit this to delete an item.'
})

export const defaultItems = [item1, item2, item3]

import express from "express"
import bodyParser from "body-parser"
import _ from "lodash"
import path from "path"
import { fileURLToPath } from "url"
import * as date from "./date.js"
import * as db from "./db.js"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const exp = express()
const port = 3000

exp.use(bodyParser.urlencoded({extended : true}))
exp.use(express.static("public"))
exp.set("view engine", "ejs")

exp.get("/", (req, res)=>{
    
    const day = date.getDay()
    db.Item.find({}, (err, items)=>{
        if(!err && items.length == 0){
            db.Item.insertMany(db.defaultItems, (err)=>{
                if(!err){
                    console.log('Successfully Inserted');
                }else{
                    console.log(err);
                }
            })
            res.redirect('/')
        }else{
            res.render("list", {listTitle : day, tasks : items})
           
        }
    })
})

exp.get("/about", (req, res)=>{
    res.render("about")
})

exp.get("/:customListName", (req, res)=>{
    const customListName = _.capitalize(_.lowerCase(req.params.customListName))

    db.List.findOne({name : customListName}, (err, foundList)=>{
        if(!err && foundList){
            res.render("list", {listTitle : foundList.name, tasks : foundList.items})
        }else{
            const list = new db.List({
                name : customListName,
                items : db.defaultItems
            })
            list.save()
            res.redirect(`/${customListName}`)
        }
    })
    
})
exp.post("/", (req, res)=>{
    const task = req.body.task
    const listTitle = req.body.listTitle
    const day = date.getDay()
   
    const item = new db.Item({
        name : task
    })

    if(listTitle === day){
        item.save()
        res.redirect('/')
    }else{
        db.List.findOne({name : listTitle}, (err, foundList)=>{
            if(!err && foundList){
                foundList.items.push(item)
                foundList.save()
                res.redirect(`/${listTitle}`)
            }else{
                console.log(err);
            }
        })
    }
})

exp.post("/delete", (req, res)=>{
    const itemRv = req.body.checkbox.split(',')
    const itemRvId = itemRv[0]
    const listTitle = itemRv[1]
    const day = date.getDay()
   
    if(listTitle === day){
    db.Item.deleteOne({_id : itemRvId}, (err)=>{
        if(!err){
            console.log('Successfully Removed');
            res.redirect('/')
        }else{
            console.log(err);
        }
    })
    }
    else{
        db.List.findOneAndUpdate({name : listTitle}, {$pull : {items : {_id : itemRvId}}}, (err, foundList)=>{
            if(!err){
                res.redirect(`/${listTitle}`)
            }
        })
    }
    
})

exp.listen(port || process.env.PORT, ()=>{
    console.log("Server has started successfully");
})